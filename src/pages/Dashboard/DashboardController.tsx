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

export default function DashboardController() {
  const { profile, activeRole, setActiveRole, loading } = useAuth();
  const { lang } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const perspective = searchParams.get('perspective');
  
  const [userData, setUserData] = useState<any>(null);

  // Phase 18: URL Perspective Synchronization
  useEffect(() => {
    if (!profile || !perspective) return;
    
    // Industrial Oversight: Admins can force any perspective
    const effectiveRoles = profile.isAdmin 
      ? [...new Set([...profile.roles, 'agency', 'hr', 'finance', 'support'])]
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

    switch (activeRole) {
      case 'admin': return <AdminDashboard stats={userData?.stats} />;
      case 'student': return <StudentDashboard data={userData} user={profile} lang={lang} accent="primary" view="student" />;
      case 'manager':
      case 'chief_manager': return <ManagerDashboard />;
      case 'executor': return <ExecutorDashboard user={profile} />;
      case 'client': return <ClientDashboard />;
      case 'hr': return <HRDashboard />;
      case 'finance': return <FinanceDashboard />;
      case 'support': return <SupportDashboard />;
      case 'agency': return <AgencyDashboard />;
      default: return <StudentDashboard data={userData} user={profile} lang={lang} accent="primary" view="student" />;
    }
  }, [profile, activeRole, userData]);

  if (loading) return <Preloader message="Syncing with Red Griffin Ecosystem..." />;
  if (!profile) {
    navigate(`/${lang || 'eng'}/login`);
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent transition-all duration-300">
      {/* Dynamic Content Wrapper: fluid padding and scaling */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 lg:py-12">
        
        {/* Identity Switcher - Horizontal Scroll on Mobile */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-10 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
          <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl shrink-0">
            {(profile.isAdmin 
              ? [...new Set([...profile.roles, 'agency', 'hr', 'finance', 'support'])]
              : profile.roles
            ).map(role => (
              <button
                key={role}
                onClick={() => setActiveRole(role as any)}
                className={`px-4 sm:px-6 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeRole === role ? 'bg-primary text-bg-dark shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                {role.replace('_', ' ')}
              </button>
            ))}
          </div>
          
          {/* Status Indicator (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 ml-auto px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase text-emerald-500/60 tracking-widest">Ecosystem Sync: Active</span>
          </div>
        </div>

        {/* Responsive Dashboard View */}
        <div className="animate-in fade-in duration-700">
          {DashboardView}
        </div>
      </div>
    </div>
  );
}
