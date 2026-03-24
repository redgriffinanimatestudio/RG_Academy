import { useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  or,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { usePlatform } from '../context/PlatformContext';

export function useSyncManager() {
  const { profile } = useAuth();
  const { setData } = usePlatform();

  useEffect(() => {
    if (!profile) {
      // Clear data on logout
      setData(prev => ({
        ...prev,
        enrollments: [],
        contracts: [],
        projects: [],
        notifications: []
      }));
      return;
    }

    const uid = profile.uid;
    const unsubscribers: (() => void)[] = [];

    // 1. Enrollments Subscription
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('userId', '==', uid)
    );
    unsubscribers.push(onSnapshot(enrollmentsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(prev => ({ ...prev, enrollments: docs }));
    }, (error) => console.error("Sync Error [Enrollments]:", error)));

    // 2. Contracts Subscription (Client OR Executor)
    const contractsQuery = query(
      collection(db, 'contracts'),
      or(where('clientId', '==', uid), where('executorId', '==', uid))
    );
    unsubscribers.push(onSnapshot(contractsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(prev => ({ ...prev, contracts: docs }));
    }, (error) => console.error("Sync Error [Contracts]:", error)));

    // 3. Projects Subscription (Client OR Executor)
    const projectsQuery = query(
      collection(db, 'projects'),
      or(where('clientId', '==', uid), where('executorId', '==', uid))
    );
    unsubscribers.push(onSnapshot(projectsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(prev => ({ ...prev, projects: docs }));
    }, (error) => console.error("Sync Error [Projects]:", error)));

    // 4. Notifications Subscription
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    unsubscribers.push(onSnapshot(notificationsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(prev => ({ ...prev, notifications: docs }));
    }, (error) => console.error("Sync Error [Notifications]:", error)));

    // 5. Offline State Handler
    const handleOffline = () => setData(prev => ({ ...prev, isOffline: !navigator.onLine }));
    window.addEventListener('online', handleOffline);
    window.addEventListener('offline', handleOffline);

    // Cleanup ALL listeners
    return () => {
      unsubscribers.forEach(unsub => unsub());
      window.removeEventListener('online', handleOffline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [profile, setData]);
}
