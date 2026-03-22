import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Layout, 
  Shield, 
  Settings, 
  Plus,
  FileText,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Cpu,
  Zap,
  Briefcase,
  Box,
  Video,
  ChevronRight,
  LogOut,
  Globe,
  Star,
  Clock,
  UserCheck,
  MessageSquare,
  Send,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckCircle,
  Eye,
  FileEdit,
  Archive,
  Mail,
  Phone,
  Calendar,
  Lock,
  ThumbsDown,
  Flag,
  LayoutDashboard,
  ClipboardCheck,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function ManagerDashboardContent({ activeModule, theme }: any) {
  return (
    <AnimatePresence mode="wait">
      {activeModule === 'overview' && <ManagerOverview theme={theme} />}
      {activeModule === 'courses_review' && <CoursesReview theme={theme} />}
      {activeModule !== 'overview' && activeModule !== 'courses_review' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center">
          <Box size={64} className="mb-6" />
          <div className="text-xl font-black uppercase tracking-[0.5em]">{activeModule} Module</div>
          <div className="text-sm mt-2">Section content coming soon...</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ManagerDashboard() {
  const { lang } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'overview';

  const theme = {
    bg: '#0a0a0a',
    bg2: '#111',
    bg3: '#181818',
    bg4: '#222',
    accent: '#1d9e75', // Manager Success Green
    border: '#2a2a2a',
    text: '#e8e6df',
    text2: '#888',
    text3: '#555'
  };

  useEffect(() => {
    if (user) {
      userService.getProfile(user.uid).then(setUserProfile);
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d9e75]" /></div>;
  
  const isManager = userProfile?.roles.includes('manager') || userProfile?.roles.includes('admin') || userProfile?.roles.includes('chief_manager');
  if (!user || (userProfile && !isManager)) return <Navigate to={`/${lang || 'eng'}`} />;

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, color: theme.accent },
    { type: 'section', label: 'Academy Ops' },
    { id: 'courses_review', label: 'Courses Review', icon: ClipboardCheck, color: '#378add', badge: '7' },
    { id: 'student_feedback', label: 'Feedback', icon: MessageSquare, color: '#ef9f27' },
    { type: 'section', label: 'Studio Ops' },
    { id: 'project_board', label: 'Project Board', icon: Box, color: '#7f77dd' },
    { id: 'contract_status', label: 'Contracts', icon: Briefcase, color: '#00f5d4' },
    { id: 'escrow_alerts', label: 'Escrow Alerts', icon: AlertTriangle, color: '#e24b4a', badge: '2' },
    { type: 'section', label: 'Users' },
    { id: 'user_list', label: 'Directory', icon: Users, color: '#888' },
    { id: 'role_requests', label: 'Role Requests', icon: ShieldCheck, color: '#378add', badge: '5' },
  ];

  const handleModuleChange = (id: string) => {
    setSearchParams({ view: id });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e8e6df] font-sans selection:bg-[#1d9e75]/30 overflow-hidden h-screen">
      {/* SIDEBAR */}
      <aside className="w-[200px] bg-[#111] border-r border-[#2a2a2a] flex flex-col h-full shrink-0 z-50">
        <div className="p-6 border-b border-[#2a2a2a] mb-2">
          <div className="text-[15px] font-bold tracking-tight">Red Griffin</div>
          <div className="text-[11px] font-medium text-[#1d9e75] mt-0.5 uppercase tracking-widest">Operations</div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item, idx) => {
            if (item.type === 'section') return <div key={idx} className="px-4 pt-4 pb-1 text-[11px] font-black text-[#555] uppercase tracking-wider">{item.label}</div>;
            const Icon = item.icon as any;
            const isActive = activeModule === item.id;
            return (
              <button key={item.id} onClick={() => handleModuleChange(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 text-[13px] transition-all relative group ${isActive ? 'text-white bg-[#181818] font-medium border-l-2 border-[#1d9e75]' : 'text-[#888] hover:text-white hover:bg-[#181818]'}`}>
                <Icon size={14} className={isActive ? 'text-[#1d9e75]' : 'text-[#555] group-hover:text-[#888]'} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a] bg-black/20">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-[#1d9e75]/10 flex items-center justify-center text-[10px] font-black text-[#1d9e75] shrink-0">MG</div>
            <div className="min-w-0"><div className="text-[12px] font-bold truncate">Ops Manager</div><div className="text-[10px] text-[#555] truncate font-medium">{user?.email}</div></div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-14 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-6 shrink-0">
          <div className="text-[15px] font-medium">{activeModule.replace(/_/g, ' ')}</div>
          <div className="flex items-center gap-4"><span className="text-[12px] text-[#888]">Manager · LIVE Control</span></div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            {activeModule === 'overview' && <ManagerOverview theme={theme} />}
            {activeModule === 'courses_review' && <CoursesReview theme={theme} />}
            {activeModule !== 'overview' && activeModule !== 'courses_review' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center">
                <Box size={64} className="mb-6" />
                <div className="text-xl font-black uppercase tracking-[0.5em]">{activeModule} Module</div>
                <div className="text-sm mt-2">Section content coming soon...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ManagerOverview({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{l:'To Publish',v:'7',s:'courses waiting',c:'#ef9f27'},{l:'Open Projects',v:'87',s:'↑ +12 this week',c:theme.accent},{l:'Active Contracts',v:'34',s:'$148k total',c:'#378add'},{l:'Review Reports',v:'3',s:'require action',c:'#e24b4a'}].map((m, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-lg p-4 space-y-2 shadow-xl">
            <div className="text-[11px] text-[#888] font-medium uppercase tracking-wider">{m.l}</div>
            <div className="text-2xl font-semibold text-white">{m.v}</div>
            <div className="text-[11px] font-medium" style={{ color: m.c }}>{m.s}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
          <div className="text-[13px] font-medium mb-6 text-white">Pending Course Publications</div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] text-[#555] uppercase border-b border-[#2a2a2a]"><th className="pb-3">Title</th><th className="pb-3">Author</th><th className="pb-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {[1,2,3].map(i => (
                <tr key={i} className="hover:bg-white/[0.01]">
                  <td className="py-4 text-xs font-bold text-[#e8e6df]">Mastering Houdini FX Vol.{i}</td>
                  <td className="py-4 text-xs text-[#888]">S. Chen</td>
                  <td className="py-4 text-right"><button className="px-3 py-1.5 bg-[#1d9e75] text-white rounded text-[10px] font-black uppercase">Publish</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 text-center flex flex-col items-center justify-center opacity-40">
          <PieChart size={48} className="mb-4 text-[#1d9e75]" />
          <div className="text-sm font-bold uppercase tracking-widest">Analytics Pulse Coming Soon</div>
        </div>
      </div>
    </div>
  );
}

function CoursesReview({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2a2a2a] bg-black/20 flex items-center justify-between">
          <div className="text-[11px] font-black uppercase tracking-widest">Course Verification Queue</div>
          <span className="text-[10px] font-bold text-white/40">7 courses awaiting review</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/20 text-[9px] font-black text-[#555] uppercase tracking-widest"><th className="px-8 py-4">Course Title</th><th className="px-8 py-4">Lecturer</th><th className="px-8 py-4">Category</th><th className="px-8 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="hover:bg-white/[0.01]">
                <td className="px-8 py-5 text-xs font-bold text-white">Advanced Character Rigging Course {i}</td>
                <td className="px-8 py-5 text-xs text-[#888]">Alex Rivera</td>
                <td className="px-8 py-5"><span className="px-2 py-0.5 bg-white/5 text-white/40 text-[9px] font-black uppercase rounded-full">3D Animation</span></td>
                <td className="px-8 py-5 text-right flex justify-end gap-2"><button className="size-8 rounded-lg bg-[#1d9e75]/10 text-[#1d9e75] flex items-center justify-center"><CheckCircle size={14} /></button><button className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><XCircle size={14} /></button><button className="size-8 rounded-lg bg-white/5 text-white/40 flex items-center justify-center"><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
