import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Preloader from '../../components/Preloader';
import { dashboardService } from '../../services/dashboardService';

// Role Views
import AdminDashboard from './roles/AdminDashboard';
import StudentDashboard from './roles/StudentDashboard';
import ManagerDashboard from './roles/ManagerDashboard';
import ExecutorDashboard from './roles/ExecutorDashboard';
import ClientDashboard from './roles/ClientDashboard';

export default function DashboardController() {
  const { profile, activeRole, setActiveRole, loading } = useAuth();
  const { lang } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      const unsubscribe = dashboardService.subscribeToUserData(profile.uid, setUserData);
      return () => unsubscribe();
    }
  }, [profile]);

  const DashboardView = useMemo(() => {
    if (!profile || !activeRole) return null;

    switch (activeRole) {
      case 'admin': return <AdminDashboard stats={userData?.stats} />;
      case 'student': return <StudentDashboard data={userData} />;
      case 'manager':
      case 'chief_manager': return <ManagerDashboard />;
      case 'executor': return <ExecutorDashboard />;
      case 'client': return <ClientDashboard />;
      default: return <StudentDashboard data={userData} />;
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
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 lg:py-12">
        
        {/* Identity Switcher - Horizontal Scroll on Mobile */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-10 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
          <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl shrink-0">
            {profile.roles.map(role => (
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
