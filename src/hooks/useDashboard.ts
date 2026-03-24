import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlatform } from '../context/PlatformContext';
import { notificationService } from '../services/notificationService';

export type UserRole = 'student' | 'lecturer' | 'client' | 'executor' | 'moderator' | 'manager' | 'admin';

export function useRole() {
  const { profile, activeRole } = useAuth();
  
  const roles = (profile?.roles || []) as UserRole[];
  
  return useMemo(() => {
    const isStudent = roles.includes('student');
    const isLecturer = roles.includes('lecturer');
    const isClient = roles.includes('client');
    const isExecutor = roles.includes('executor');
    const isModerator = roles.includes('moderator');
    const isManager = roles.includes('manager');
    const isAdmin = roles.includes('admin') || profile?.email === 'redgriffinanimatestudio@gmail.com';

    const isAcademy = isStudent || isLecturer;
    const isStudio = isClient || isExecutor;
    const hasSynergy = isAcademy && isStudio;

    return {
      roles,
      activeRole,
      isStudent,
      isLecturer,
      isClient,
      isExecutor,
      isModerator,
      isManager,
      isAdmin,
      isAcademy,
      isStudio,
      primaryRole: activeRole || roles[0] || 'student',
      hasSynergy
    };
  }, [roles, activeRole, profile]);
}

export function useEnrollments() {
  const { data } = usePlatform();
  const all = data.enrollments || [];

  return useMemo(() => {
    const completed = all.filter(e => e.status === 'completed');
    const inProgress = all.filter(e => e.status === 'in_progress');
    const notStarted = all.filter(e => e.status === 'not_started');
    const completionRate = all.length > 0 ? (completed.length / all.length) * 100 : 0;

    return { all, completed, inProgress, notStarted, completionRate };
  }, [all]);
}

export function useContracts() {
  const { data } = usePlatform();
  const all = data.contracts || [];

  return useMemo(() => {
    const active = all.filter(c => c.status === 'active');
    const completed = all.filter(c => c.status === 'completed');
    const disputed = all.filter(c => c.status === 'disputed');
    const totalValue = all.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return { all, active, completed, disputed, totalValue };
  }, [all]);
}

export function useProjects() {
  const { profile } = useAuth();
  const { data } = usePlatform();
  const all = data.projects || [];

  return useMemo(() => {
    const open = all.filter(p => p.status === 'open');
    const inProgress = all.filter(p => p.status === 'in_progress');
    const completed = all.filter(p => p.status === 'completed');
    const asClient = all.filter(p => p.clientId === profile?.uid);
    const asExecutor = all.filter(p => p.executorId === profile?.uid);

    return { all, open, inProgress, completed, asClient, asExecutor };
  }, [all, profile]);
}

export function useStats() {
  const { data } = usePlatform();
  return data.stats || {};
}

export function useDashboardNotifications() {
  const { data } = usePlatform();
  const all = data.notifications || [];

  const unread = useMemo(() => all.filter(n => !n.read), [all]);

  const markRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
  };

  return { all, unread, markRead };
}
