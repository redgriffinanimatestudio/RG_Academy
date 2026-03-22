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
  async getCourses(filters?: { status?: string, category?: string, level?: string }): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.level) params.append('level', filters.level);
    
    const response = await fetch(`${API_URL}/courses?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
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
    const response = await fetch(`${API_URL}/courses`);
    const courses = await response.json();
    const course = courses.find((c: any) => c.id === courseId);
    return course?.lessons || [];
  },

  async enrollInCourse(userId: string, courseId: string): Promise<void> {
    console.log(`Enrolling user ${userId} in course ${courseId}`);
  },

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    return null;
  },

  async updateLessonProgress(userId: string, courseId: string, lessonId: string, isCompleted: boolean): Promise<void> {
    console.log(`Updating progress for ${lessonId}`);
  },

  async getReviews(courseId: string): Promise<Review[]> {
    const response = await fetch(`${API_URL}/courses`);
    const courses = await response.json();
    const course = courses.find((c: any) => c.id === courseId);
    return course?.reviews || [];
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>): Promise<string> {
    return "new_review_id";
  },

  async getCategories(): Promise<any[]> {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
};
