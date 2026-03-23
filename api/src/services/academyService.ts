import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, serverTimestamp, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export interface Course {
  id: string;
  title: string;
  description: string;
  lecturerId: string;
  lecturerName: string;
  price: number;
  thumbnail: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: any;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl: string;
  order: number;
  createdAt: any;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: any;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: any[];
  passingScore: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  uuid: string;
  issuedAt: any;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export const academyService = {
  async getCourses(status: 'published' | 'draft' | 'archived' = 'published'): Promise<Course[]> {
    const q = query(collection(db, 'courses'), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  },

  async getCourse(courseId: string): Promise<Course | null> {
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return null;
  },

  async getLessons(courseId: string): Promise<Lesson[]> {
    const q = query(collection(db, `courses/${courseId}/lessons`));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
  },

  async enrollInCourse(userId: string, courseId: string): Promise<void> {
    const enrollment: Enrollment = {
      id: `${userId}_${courseId}`,
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      enrolledAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'enrollments', enrollment.id), enrollment);
  },

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    const docRef = doc(db, 'enrollments', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Enrollment;
    }
    return null;
  },

  async getQuizzes(courseId: string, lessonId: string): Promise<Quiz[]> {
    const q = query(collection(db, `courses/${courseId}/lessons/${lessonId}/quizzes`));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
  },

  async getReviews(courseId: string): Promise<Review[]> {
    const q = query(collection(db, 'reviews'), where('courseId', '==', courseId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
};
