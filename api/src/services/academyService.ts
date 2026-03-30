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
}

const API_V1 = '/v1/academy';

export const academyService = {
  // 1. Получение курсов с поддержкой пагинации и фильтрации
  async getCourses(filters?: { status?: string, category?: string, level?: string, search?: string, page?: number, limit?: number }): Promise<Course[]> {
    const fetchFromPostgres = async () => {
      const { data } = await apiClient.get(`${API_V1}/courses`, { params: filters });
      return data.success ? data.data : [];
    };

    const fetchFromLegacy = async () => {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`/api/v1/academy/courses?${params.toString()}`);
      const result = await response.json();
      return result.success ? result.data : [];
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_READ) {
      try {
        return await fetchFromPostgres();
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
    const fetchFromPostgres = async () => {
      const { data } = await apiClient.get(`${API_V1}/courses/${slug}`);
      return data.success ? data.data : null;
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_READ) {
      try {
        return await fetchFromPostgres();
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
      const response = await fetch(`/api/v1/academy/courses/${courseIdOrSlug}`);
      const result = await response.json();
      return result.success ? (result.data.lessons || []) : [];
    }
  },

  // 4. Запись на курс (Write Operation)
  async enrollInCourse(courseId: string): Promise<void> {
    if (MIGRATION_CONFIG.USE_POSTGRES_WRITE) {
      try {
        await apiClient.post(`${API_V1}/enroll`, { courseId });
        if (!MIGRATION_CONFIG.DUAL_WRITE) return;
      } catch (err) {
        console.error('[Migration] Postgres Enroll failed:', err);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

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
  }
};
