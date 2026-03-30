import React, { lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Loader2, 
  LayoutDashboard 
} from 'lucide-react';

// Lazy load the modules to optimize performance
const ADM_Governance = lazy(() => import('./modules/ADM_Governance'));
const HR_Recruiting = lazy(() => import('./modules/HR_Recruiting'));
const FIN_Operations = lazy(() => import('./modules/FIN_Operations'));
const STU_LearningProgress = lazy(() => import('./modules/STU_LearningProgress'));
const STU_Purchases = lazy(() => import('./modules/STU_Purchases'));
const STU_AcademyCalendar = lazy(() => import('./modules/STU_AcademyCalendar'));
const ADM_Insights = lazy(() => import('./modules/ADM_Insights'));
const SUP_HelpDesk = lazy(() => import('./modules/SUP_HelpDesk'));
const MGR_NexusOps = lazy(() => import('./modules/MGR_NexusOps'));

const ViewModuleController: React.FC = () => {
  const { activeRole } = useAuth();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';

  // Identification Logic
  const getModule = () => {
    // 1. Check for specific specialized views first
    if (view === 'rbac' || view === 'users') return <ADM_Governance />;
    if (view === 'job_openings' || view === 'applications' || view === 'interview_schedule') return <HR_Recruiting />;
    if (view === 'payment_queue' || view === 'revenue_share' || view === 'tax_compliance') return <FIN_Operations />;
    if (view === 'my_progress') return <STU_LearningProgress />;
    if (view === 'academy_calendar') return <STU_AcademyCalendar />;
    if (view === 'purchases') return <STU_Purchases />;
    if (view === 'reports' || view === 'insights') return <ADM_Insights />;
    if (view === 'open_tickets' || view === 'base_knowledge' || view === 'user_search') return <SUP_HelpDesk />;
    if (view === 'operational_health' || view === 'regional_sync' || view === 'audit_logs') return <MGR_NexusOps />;

    // 2. Default views based on Role Hub
    switch (activeRole) {
      case 'admin':
        return view === 'dashboard' ? null : <ADM_Governance />;
      case 'hr':
        return <HR_Recruiting />;
      case 'finance':
        return <FIN_Operations />;
      case 'student':
        return view === 'purchases' ? <STU_Purchases /> : (view === 'academy_calendar' ? <STU_AcademyCalendar /> : <STU_LearningProgress />);
      case 'support':
        return <SUP_HelpDesk />;
      case 'manager':
      case 'chief_manager':
        return <MGR_NexusOps />;
      default:
        return null; // Let the main Dashboard handle the base view
    }
  };

  const moduleToRender = getModule();

  if (!moduleToRender) return null;

  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="size-12 text-primary animate-spin opacity-20" />
          <ShieldCheck className="size-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 animate-pulse">Synchronizing Identity Node...</p>
      </div>
    }>
      <div className="py-6">
        {moduleToRender}
      </div>
    </Suspense>
  );
};

export default ViewModuleController;
