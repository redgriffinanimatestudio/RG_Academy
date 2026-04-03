import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Preloader from '../../components/Preloader';
import { dashboardService } from '../../services/dashboardService';

// Role Views
import AdminDashboard from './roles/AdminDashboard';
import StudentDashboard from './roles/StudentDashboard';
import ManagerDashboard from './roles/ManagerDashboard';
import ExecutorDashboard from './roles/ExecutorDashboard';
import ClientDashboard from './roles/ClientDashboard';
import HRDashboard from './roles/HRDashboard';
import FinanceDashboard from './roles/FinanceDashboard';
import SupportDashboard from './roles/SupportDashboard';
import AgencyDashboard from './roles/AgencyDashboard';
import ModeratorDashboard from './roles/ModeratorDashboard';
import LecturerDashboard from './roles/LecturerDashboard';
import RoleGuard from './components/RoleGuard';
import PerspectiveBar from './components/PerspectiveBar';

export default function DashboardController() {
  const { profile, activeRole, setActiveRole, loading } = useAuth();
  const { lang } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const perspective = searchParams.get('perspective');
  const activeView = searchParams.get('view') || 'overview';
  
  const [userData, setUserData] = useState<any>(null);

  // Phase 18: URL Perspective Synchronization
  useEffect(() => {
    if (!profile || !perspective) return;
    
    // Industrial Oversight: Admins can force any perspective
    const effectiveRoles = profile.isAdmin 
      ? [...new Set([...profile.roles, 'agency', 'hr', 'finance', 'support', 'manager', 'moderator', 'chief_manager'])]
      : profile.roles;

    if (perspective !== activeRole && effectiveRoles.includes(perspective)) {
      console.log(`[Dashboard] Syncing state to URL perspective: ${perspective}`);
      setActiveRole(perspective as any);
    }
  }, [perspective, profile, activeRole]);

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      try {
        if (activeRole === 'admin') {
          const stats = await dashboardService.getSystemStats();
          setUserData({ stats });
        } else if (activeRole === 'student') {
          const data = await dashboardService.getStudentSummary();
          setUserData(data);
        } else {
          const data = await dashboardService.getUserData(profile.id);
          setUserData(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s instead of 10s for better performance
    
    return () => clearInterval(interval);
  }, [profile, activeRole]);

  const DashboardView = useMemo(() => {
    if (!profile || !activeRole) return null;

    const commonProps = {
      view: activeView,
      user: profile,
      lang: lang,
      accent: 'primary'
    };

    switch (activeRole) {
      case 'admin': 
        return <RoleGuard allowedRoles={['admin']}><AdminDashboard stats={userData?.stats} activeRole={activeRole} setActiveRole={setActiveRole} /></RoleGuard>;
      case 'student': 
        return <RoleGuard allowedRoles={['student']}><StudentDashboard data={userData} {...commonProps} /></RoleGuard>;
      case 'lecturer': 
        return <RoleGuard allowedRoles={['lecturer']}><LecturerDashboard {...commonProps} /></RoleGuard>;
      case 'manager':
      case 'chief_manager': 
        return <RoleGuard allowedRoles={['manager', 'chief_manager']}><ManagerDashboard {...commonProps} /></RoleGuard>;
      case 'executor': 
        return <RoleGuard allowedRoles={['executor']}><ExecutorDashboard {...commonProps} /></RoleGuard>;
      case 'client': 
        return <RoleGuard allowedRoles={['client']}><ClientDashboard {...commonProps} /></RoleGuard>;
      case 'hr': 
        return <RoleGuard allowedRoles={['hr']}><HRDashboard {...commonProps} /></RoleGuard>;
      case 'finance': 
        return <RoleGuard allowedRoles={['finance']}><FinanceDashboard {...commonProps} /></RoleGuard>;
      case 'support': 
        return <RoleGuard allowedRoles={['support']}><SupportDashboard {...commonProps} /></RoleGuard>;
      case 'agency': 
        return <RoleGuard allowedRoles={['agency']}><AgencyDashboard {...commonProps} /></RoleGuard>;
      case 'moderator':
        return <RoleGuard allowedRoles={['moderator']}><ModeratorDashboard {...commonProps} /></RoleGuard>;
      default: 
        return <StudentDashboard data={userData} {...commonProps} />;
    }
  }, [profile, activeRole, userData, activeView, lang]);

  // Phase 22: Safe Auth Guard & Redirect (Anti-Crash Logout)
  useEffect(() => {
    if (!loading && !profile) {
      console.log(`[Dashboard] No session detected. Redirecting to login...`);
      navigate(`/${lang || 'eng'}/login`);
    }
  }, [profile, loading, lang, navigate]);

  if (loading || !profile) {
    return <Preloader message="Syncing with Red Griffin Ecosystem..." />;
  }

  return (
    <div className="min-h-screen bg-[#050505] transition-all duration-700 relative overflow-x-hidden">
      {/* 🔮 Global Neural Grid & Radial Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/10 via-transparent to-emerald-900/10" />
        <div className="absolute top-0 right-0 size-[800px] bg-cyan-500/5 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full" />
        <div className="absolute bottom-0 left-0 size-[800px] bg-primary/5 blur-[120px] translate-y-1/2 -translate-x-1/2 rounded-full" />
      </div>

      {/* Dynamic Content Wrapper: fluid padding and scaling */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 lg:py-12 relative z-10">
        
        {/* Identity Switcher - Horizontal Scroll on Mobile */}
        <div className="mb-6 sm:mb-10 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
          <PerspectiveBar 
            roles={profile.isAdmin 
              ? ['admin', 'student', 'executor', 'hr', 'finance', 'support', 'agency', 'manager', 'chief_manager', 'moderator']
              : profile.roles
            } 
            activeRole={activeRole} 
            onSwitch={(role) => {
              setActiveRole(role as any);
              // Update URL to sync perspective
              const params = new URLSearchParams(window.location.search);
              params.set('perspective', role);
              navigate(`${window.location.pathname}?${params.toString()}`, { replace: true });
            }} 
          />
        </div>

        {/* Responsive Dashboard View */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000">
          {DashboardView}
        </div>
      </div>
    </div>
  );
}
