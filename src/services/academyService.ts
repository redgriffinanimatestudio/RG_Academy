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

const API_URL = '/api/v1/academy';

export const academyService = {
  async getCourses(filters?: { status?: string, category?: string, level?: string, search?: string, page?: number, limit?: number }): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await fetch(`${API_URL}/courses?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch courses');

    const result = await response.json();
    return result.success ? result.data : [];
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    const response = await fetch(`${API_URL}/courses/${slug}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  },

  async getLessons(courseIdOrSlug: string): Promise<Lesson[]> {
    const response = await fetch(`${API_URL}/courses/${courseIdOrSlug}`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.success ? (result.data.lessons || []) : [];
  },

  async enrollInCourse(courseId: string): Promise<void> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/enroll`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ courseId })
    });
    if (!response.ok) throw new Error('Failed to enroll');
  },

  async getCategories(): Promise<any[]> {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');

    const result = await response.json();
    return result.success ? result.data : [];
  },

  async getUserEnrollments(userId: string): Promise<any[]> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/users/${userId}/enrollments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch enrollments');
    const result = await response.json();
    return result.success ? result.data : [];
  }
};
