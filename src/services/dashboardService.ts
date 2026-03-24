import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface DashboardStats {
  totalUsers?: number;
  activeProjects?: number;
  revenue?: number;
  myCourses?: number;
  progress?: number;
}

export const dashboardService = {
  // Listen to user-specific dashboard data
  subscribeToUserData: (userId: string, callback: (data: any) => void) => {
    const userDoc = doc(db, 'users', userId);
    return onSnapshot(userDoc, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    });
  },

  // Listen to active projects (for Client/Executor)
  subscribeToProjects: (userId: string, role: string, callback: (projects: any[]) => void) => {
    const field = role === 'client' ? 'clientId' : 'executorId';
    const q = query(
      collection(db, 'projects'),
      where(field, '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(10)
    );

    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(projects);
    });
  },

  // Admin: Listen to system-wide stats
  subscribeToSystemStats: (callback: (stats: DashboardStats) => void) => {
    const statsDoc = doc(db, 'system', 'stats');
    return onSnapshot(statsDoc, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as DashboardStats);
      }
    });
  },

  // Update user role (switch identity)
  async updateActiveRole(userId: string, role: string) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { activeRole: role });
  }
};
