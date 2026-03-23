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

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  status: 'active' | 'completed' | 'cancelled';
  completedLessons: string[];
  enrolledAt: string;
  completedAt?: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

const API_URL = 'http://localhost:3000/api';

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
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
  },

  async getCourse(courseId: string): Promise<Course | null> {
    const response = await fetch(`${API_URL}/courses`);
    const courses: Course[] = await response.json();
    return courses.find(c => c.id === courseId) || null;
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    const response = await fetch(`${API_URL}/courses/${slug}`);
    if (!response.ok) return null;
    return response.json();
  },

  async getLessons(courseId: string): Promise<Lesson[]> {
    // We can use getCourseBySlug if we have the slug, or just fetch course detail
    // For now, let's assume we need to fetch by ID if possible, but our API uses slug
    // If courseId is actually a slug in some contexts, this works:
    const response = await fetch(`${API_URL}/courses/${courseId}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.lessons || [];
  },

  async enrollInCourse(userId: string, courseId: string): Promise<void> {
    const response = await fetch(`${API_URL}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId })
    });
    if (!response.ok) throw new Error('Failed to enroll');
  },

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    const response = await fetch(`${API_URL}/users/${userId}/enrollments`);
    if (!response.ok) return null;
    const enrollments: Enrollment[] = await response.json();
    return enrollments.find(e => e.courseId === courseId) || null;
  },

  async updateLessonProgress(userId: string, courseId: string, lessonId: string, isCompleted: boolean): Promise<void> {
    // This would need a PUT /api/enrollments/:id or similar
    console.log(`Updating progress for ${lessonId} (stub)`);
  },

  async getReviews(courseId: string): Promise<Review[]> {
    const response = await fetch(`${API_URL}/courses/${courseId}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.reviews || [];
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>): Promise<string> {
    // Need POST /api/reviews
    return "new_review_id_stub";
  },

  async getCategories(): Promise<any[]> {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');

    const result = await response.json();
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
  },

  async getUserEnrollments(userId: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/users/${userId}/enrollments`);
    if (!response.ok) throw new Error('Failed to fetch enrollments');
    return response.json();
  }
};
