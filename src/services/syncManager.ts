import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlatform } from '../context/PlatformContext';
import { academyService } from './academyService';
import { studioService } from './studioService';
import { notificationService } from './notificationService';
import { dashboardService } from './dashboardService';

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

    const fetchData = async () => {
      try {
        const [enrollments, notifications] = await Promise.all([
          academyService.getUserEnrollments(uid),
          notificationService.getNotifications(uid)
        ]);

        // Studio data needs role
        // For simplicity, we fetch all projects and contracts related to user
        const projects = await dashboardService.getProjects(uid, 'client'); // client side
        const executorProjects = await dashboardService.getProjects(uid, 'executor'); // executor side
        const allProjects = [...projects, ...executorProjects];
        
        // Remove duplicates if any
        const uniqueProjects = Array.from(new Map(allProjects.map(p => [p.id, p])).values());

        setData(prev => ({ 
          ...prev, 
          enrollments, 
          notifications,
          projects: uniqueProjects
        }));
      } catch (err) {
        console.error("Sync Error:", err);
      }
    };

    fetchData();
    
    // Set up polling for notifications every 30 seconds as a simple "real-time" alternative
    const interval = setInterval(async () => {
      const notifications = await notificationService.getNotifications(uid);
      setData(prev => ({ ...prev, notifications }));
    }, 30000);

    // Offline State Handler
    const handleOffline = () => setData(prev => ({ ...prev, isOffline: !navigator.onLine }));
    window.addEventListener('online', handleOffline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOffline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [profile, setData]);
}
