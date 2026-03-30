import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Import Full Original Dashboards for fallback/specific views
import { AdminDashboardContent } from './AdminDashboard';
import { ChiefManagerDashboardContent } from './ChiefManagerDashboard';
import { ManagerDashboardContent } from './ManagerDashboard';
import { StaffDashboardContent } from './StaffDashboard';
import { ModeratorDashboardContent } from './ModeratorDashboard';

// Lucide Icons
import { 
  Bell, LayoutDashboard, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import Preloader from '../components/Preloader';

// Internal Dashboard Components
import UnifiedDashboard from './Dashboard/components/UnifiedDashboard';
import StudentDashboard from './Dashboard/components/Roles/StudentDashboard';
import LecturerDashboard from './Dashboard/components/Roles/LecturerDashboard';
import ClientDashboard from './Dashboard/components/Roles/ClientDashboard';
import ExecutorDashboard from './Dashboard/components/Roles/ExecutorDashboard';

// Custom Perspective Switcher
import PerspectiveSwitcher from './Dashboard/components/PerspectiveSwitcher';
import { OnboardingOverlay } from '../components/OnboardingOverlay';
import TrajectoryPage from './Trajectory';

// --- MAIN DASHBOARD HUB ---

export default function Dashboard() {
  const { activeRole, setActiveRole, user, profile, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { lang } = useParams();
  
  // ROBUST ROLE SYNC LOGIC
  useEffect(() => {
    if (!profile || !profile.roles || authLoading) return;

    const path = location.pathname;
    const roles = profile.roles as string[];
    
    let targetRole: string | null = null;

    if (path.includes('/dev/')) targetRole = 'admin';
    else if (path.includes('/chief-manager/')) targetRole = 'chief_manager';
    else if (path.includes('/manager/')) targetRole = 'manager';
    else if (path.includes('/moderator/')) targetRole = 'moderator';
    else if (path.includes('/aca/')) {
      targetRole = roles.includes('lecturer') ? 'lecturer' : 'student';
    } else if (path.includes('/studio/')) {
      targetRole = roles.includes('client') ? 'client' : 'executor';
    } else if (path.includes('/staff/')) {
      targetRole = roles.find(r => ['hr', 'finance', 'support'].includes(r)) || null;
    }

    if (targetRole && activeRole !== targetRole && roles.includes(targetRole)) {
      console.log(`[DASHBOARD] URL-based role switch detected: ${activeRole} -> ${targetRole}`);
      setActiveRole(targetRole as any);
    }
  }, [location.pathname, profile, activeRole, authLoading, setActiveRole]);

  const currentView = searchParams.get('view') || 'overview';
  const urlPerspective = searchParams.get('perspective');
  const displayRole = (profile?.isAdmin && urlPerspective) ? urlPerspective : activeRole;

  const roleThemes: Record<string, any> = {
    admin: { accent: '#ef4444', label: 'Administrator' },
    chief_manager: { accent: '#7f77dd', label: 'Chief Manager' },
    manager: { accent: '#1d9e75', label: 'Operations Manager' },
    moderator: { accent: '#ef9f27', label: 'Moderator' },
    hr: { accent: '#378add', label: 'HR Lead' },
    finance: { accent: '#1d9e75', label: 'Finance' },
    support: { accent: '#7f77dd', label: 'Support' },
    student: { accent: '#378add', label: 'Student' },
    lecturer: { accent: '#1d9e75', label: 'Instructor' },
    client: { accent: '#ef9f27', label: 'Client' },
    executor: { accent: '#e24b4a', label: 'Executor' }
  };

  const theme = roleThemes[displayRole || 'student'] || { accent: '#00f5d4', label: 'Member' };

  if (authLoading) return <Preloader message="Syncing Identity..." size="lg" className="min-h-screen bg-[#050505]" />;

  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingOverlay />
      <main className="flex-1 space-y-8 lg:space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 lg:space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[9px] lg:text-[10px]">
              <LayoutDashboard size={14} />
              {activeRole ? `${activeRole.replace('_', ' ')} Hub` : 'Ecosystem Hub'}
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white leading-tight uppercase">
              {currentView === 'overview' ? `Welcome,` : currentView.replace(/_/g, ' ')} <br className="hidden lg:block" />
              <span className="text-primary italic">{currentView === 'overview' ? user?.displayName?.split(' ')[0] : 'HUB'}.</span>
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {profile?.isAdmin && activeRole === 'admin' && (
              <PerspectiveSwitcher currentPerspective={urlPerspective} activeRole={activeRole} />
            )}
            <div className="flex items-center gap-3 lg:gap-4">
              <button className="p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/5 text-white/40 hover:text-white transition-all relative">
                <Bell size={24} />
                <div className="absolute top-3 right-3 lg:top-4 lg:right-4 size-2 rounded-full border-2 border-[#0a0a0a]" style={{ background: theme.accent }} />
              </button>
              <Link 
                to={`/aca/${lang}`}
                className="flex-1 lg:flex-none px-6 lg:px-8 py-3 lg:py-4 bg-primary text-bg-dark rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 lg:gap-3"
                style={{ backgroundColor: theme.accent }}
              >
                <Rocket size={18} /> <span className="whitespace-nowrap">Explore Workshops</span>
              </Link>
            </div>
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {currentView === 'overview' ? (
            <UnifiedDashboard roles={profile?.roles || []} activeRole={activeRole} user={user} lang={lang} theme={theme} />
          ) : (
            <AnimatePresence mode="wait">
              <div key={displayRole + currentView}>
                {displayRole === 'admin' && <AdminDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} user={user} />}
                {displayRole === 'chief_manager' && <ChiefManagerDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} />}
                {displayRole === 'manager' && <ManagerDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} />}
                {displayRole === 'moderator' && <ModeratorDashboardContent activeModule={currentView} accentColor={theme.accent} />}
                {['hr', 'finance', 'support'].includes(displayRole || '') && <StaffDashboardContent activeRole={displayRole} activeModule={currentView} accentColor={theme.accent} />}
                {['student', 'lecturer', 'client', 'executor'].includes(displayRole || '') && <CoreDashboardView activeRole={displayRole} currentView={currentView} accent={theme.accent} user={user} lang={lang} />}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </main>
    </div>
  );
}

// --- CORE DASHBOARD VIEWS DISPATCHER ---

function CoreDashboardView({ activeRole, currentView, accent, user, lang }: any) {
  if (currentView === 'my_trajectory') return <TrajectoryPage />;
  if (activeRole === 'student') return <StudentDashboard view={currentView} accent={accent} user={user} lang={lang} />;
  if (activeRole === 'lecturer') return <LecturerDashboard view={currentView} accent={accent} user={user} lang={lang} />;
  if (activeRole === 'client') return <ClientDashboard view={currentView} accent={accent} user={user} lang={lang} />;
  if (activeRole === 'executor') return <ExecutorDashboard view={currentView} accent={accent} user={user} lang={lang} />;
  return null;
}
