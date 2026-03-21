import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, serverTimestamp, addDoc, orderBy, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  lecturerId: string;
  lecturerName: string;
  price: number;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: Timestamp;
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
  createdAt: Timestamp;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  status: 'active' | 'completed' | 'cancelled';
  completedLessons: string[];
  enrolledAt: Timestamp;
  completedAt?: Timestamp;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Timestamp;
}

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    slug: 'mastering-character-rigging-maya',
    title: 'Mastering Character Rigging in Maya',
    description: 'Learn the industry-standard techniques for creating robust, animator-friendly character rigs in Autodesk Maya.',
    lecturerId: 'l1',
    lecturerName: 'Alex Rivera',
    price: 89.99,
    thumbnail: 'https://picsum.photos/seed/rigging/800/600',
    category: 'Animation',
    level: 'advanced',
    tags: ['Maya', 'Rigging'],
    status: 'published',
    createdAt: Timestamp.now()
  },
  {
    id: '2',
    slug: 'cinematic-vfx-houdini-destruction',
    title: 'Cinematic VFX: Houdini Destruction',
    description: 'Master destruction and simulation in Houdini for high-end cinematic sequences.',
    lecturerId: 'l2',
    lecturerName: 'Sarah Chen',
    price: 129.99,
    thumbnail: 'https://picsum.photos/seed/houdini/800/600',
    category: 'VFX & Compositing',
    level: 'expert',
    tags: ['Houdini', 'VFX'],
    status: 'published',
    createdAt: Timestamp.now()
  },
  {
    id: '3',
    slug: 'environment-art-aaa-games',
    title: 'Environment Art for AAA Games',
    description: 'Create stunning, optimized environments for modern game engines.',
    lecturerId: 'l3',
    lecturerName: 'Marcus Thorne',
    price: 94.99,
    thumbnail: 'https://picsum.photos/seed/envart/800/600',
    category: '3D Modeling',
    level: 'intermediate',
    tags: ['Unreal Engine', 'Modeling'],
    status: 'published',
    createdAt: Timestamp.now()
  }
];

const MOCK_LESSONS: Record<string, Lesson[]> = {
  '1': [
    { id: 'l1-1', courseId: '1', title: 'Introduction to Rigging', content: '<p>Basics of rigging...</p>', videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', duration: '10:00', order: 1, isFree: true, createdAt: Timestamp.now() },
    { id: 'l1-2', courseId: '1', title: 'Skeleton Hierarchy', content: '<p>Advanced skeleton setups...</p>', videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', duration: '15:00', order: 2, isFree: false, createdAt: Timestamp.now() },
  ]
};

export const academyService = {
  async getCourses(filters?: { status?: string, category?: string, level?: string }): Promise<Course[]> {
    // For now, return mock data mixed with real data (if any)
    return MOCK_COURSES;
  },

  async getCourse(courseId: string): Promise<Course | null> {
    return MOCK_COURSES.find(c => c.id === courseId) || null;
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    return MOCK_COURSES.find(c => c.slug === slug) || null;
  },

  async getLessons(courseId: string): Promise<Lesson[]> {
    return MOCK_LESSONS[courseId] || [];
  },

  async enrollInCourse(userId: string, courseId: string): Promise<void> {
    console.log(`Enrolling user ${userId} in course ${courseId}`);
  },

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    // Mock active enrollment for testing
    return {
      id: `${userId}_${courseId}`,
      userId,
      courseId,
      progress: 45,
      status: 'active',
      completedLessons: ['l1-1'],
      enrolledAt: Timestamp.now()
    };
  },

  async updateLessonProgress(userId: string, courseId: string, lessonId: string, isCompleted: boolean): Promise<void> {
    console.log(`Updating progress for ${lessonId}`);
  },

  async getReviews(courseId: string): Promise<Review[]> {
    return [
      { id: 'r1', courseId, userId: 'u1', rating: 5, comment: "Amazing course!", isApproved: true, createdAt: Timestamp.now() }
    ];
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>): Promise<string> {
    return "new_review_id";
  }
};
