import apiClient from './apiClient';
import { MIGRATION_CONFIG } from '../config/migration';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  lecturerId: string;
  lecturerName: string;
  lecturerAvatar: string;
  price: number;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lod?: number;
  softwareStack?: { name: string; version?: string }[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl: string;
  type: 'video' | 'text' | 'quiz';
  duration: string;
  order: number;
  isFree: boolean;
  createdAt: string;
  moduleId?: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

const API_V1 = '/v1/academy';

// Shadow Logging для верификации миграции
const shadowLog = (feature: string, prodData: any, legacyData: any) => {
  if (MIGRATION_CONFIG.LOG_DIFFS) {
    const isDifferent = JSON.stringify(prodData) !== JSON.stringify(legacyData);
    if (isDifferent) {
      console.warn(`[Migration Diff] ${feature} mismatch!`, { production: prodData, legacy: legacyData });
    }
  }
};

export const academyService = {
  // 1. Получение курсов с поддержкой пагинации и фильтрации
  async getCourses(filters?: { status?: string, category?: string, level?: string, search?: string, page?: number, limit?: number }): Promise<Course[]> {
    const fetchFromProductionDB = async () => {
      const { data } = await apiClient.get(`${API_V1}/courses`, { params: filters });
      return data.success ? data.data : [];
    };

    const fetchFromLegacy = async () => {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`/api/v1/academy/courses?${params.toString()}`);
      const result = await response.json();
      return result.success ? result.data : [];
    };

    if (MIGRATION_CONFIG.USE_PRODUCTION_READ) {
      try {
        const prodData = await fetchFromProductionDB();
        // В фоновом режиме проверяем Shadow Log (опционально для отладки)
        if (MIGRATION_CONFIG.LOG_DIFFS) fetchFromLegacy().then(legacy => shadowLog('getCourses', prodData, legacy));
        return prodData;
      } catch (err) {
        console.error('[Migration] Academy Read failed, falling back:', err);
        if (MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) return await fetchFromLegacy();
        throw err;
      }
    }

    return await fetchFromLegacy();
  },

  // 2. Получение курса по Slug
  async getCourseBySlug(slug: string): Promise<Course | null> {
    if (MIGRATION_CONFIG.USE_PRODUCTION_READ) {
      try {
        const { data } = await apiClient.get(`${API_V1}/courses/${slug}`);
        return data.success ? data.data : null;
      } catch (err) {
        if (MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) {
          const response = await fetch(`/api/v1/academy/courses/${slug}`);
          const result = await response.json();
          return result.success ? result.data : null;
        }
        throw err;
      }
    }

    const response = await fetch(`/api/v1/academy/courses/${slug}`);
    const result = await response.json();
    return result.success ? result.data : null;
  },

  // 3. Уроки
  async getLessons(courseIdOrSlug: string): Promise<Lesson[]> {
    try {
      const { data } = await apiClient.get(`${API_V1}/courses/${courseIdOrSlug}`);
      return data.success ? (data.data.lessons || []) : [];
    } catch (err) {
      // Старая логика в качестве запасного варианта
      const response = await fetch(`/api/v1/academy/courses/${courseIdOrSlug}`);
      const result = await response.json();
      return result.success ? (result.data.lessons || []) : [];
    }
  },

  // 4. Запись на курс (Write Operation)
  async enrollInCourse(courseId: string): Promise<void> {
    if (MIGRATION_CONFIG.USE_PRODUCTION_WRITE) {
      try {
        await apiClient.post(`${API_V1}/enroll`, { courseId });
        if (!MIGRATION_CONFIG.DUAL_WRITE) return;
      } catch (err) {
        console.error('[Migration] ProductionDB Enroll failed:', err);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    // Legacy Enroll (Dual-Write)
    const token = localStorage.getItem('auth_token');
    await fetch(`/api/v1/academy/enroll`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ courseId })
    });
  },

  async getCategories(): Promise<any[]> {
    const { data } = await apiClient.get(`${API_V1}/categories`);
    return data.success ? data.data : [];
  },

  async getUserEnrollments(userId: string): Promise<any[]> {
    const { data } = await apiClient.get(`/users/${userId}/enrollments`);
    return data.success ? data.data : [];
  },

  async updateCourseStatus(courseId: string, status: string): Promise<Course> {
    const { data } = await apiClient.patch(`${API_V1}/courses/${courseId}/status`, { status });
    return data.data;
  },

  async getStudentProgress(): Promise<any> {
    const { data } = await apiClient.get(`${API_V1}/progress`);
    return data.success ? data.data : null;
  },

  // 5. Lesson Progress & Analytics
  async updateLessonProgress(userId: string, courseId: string, lessonId: string, completed: boolean): Promise<any> {
    const { data } = await apiClient.post(`${API_V1}/courses/${courseId}/lessons/${lessonId}/progress`, { 
      userId, 
      completed 
    });
    return data.success ? data.data : null;
  },

  async savePlaybackPosition(enrollmentId: string, lessonId: string, seconds: number): Promise<void> {
    await apiClient.post(`/enrollments/${enrollmentId}/analytics/sync`, {
      lessonId,
      seconds: Math.floor(seconds)
    });
  },

  async getPlaybackPosition(enrollmentId: string, lessonId: string): Promise<number> {
    try {
      const { data } = await apiClient.get(`/enrollments/${enrollmentId}/analytics/${lessonId}`);
      return data.success ? data.data.watchTime : 0;
    } catch (err) {
      return 0;
    }
  },

  // 6. Hierarchical Fetch
  async getCourseCurriculum(courseSlug: string): Promise<Module[]> {
    const { data } = await apiClient.get(`${API_V1}/courses/${courseSlug}/curriculum`);
    return data.success ? data.data : [];
  },

  async getLecturerSummary(): Promise<any> {
    const { data } = await apiClient.get(`${API_V1}/lecturer/summary`);
    return data.success ? data.data : null;
  },

  async updateUserPath(chosenPathId: string): Promise<any> {
    const { data } = await apiClient.post('/auth/onboarding', { 
      role: 'student', 
      chosenPathId 
    });
    return data;
  }
};
