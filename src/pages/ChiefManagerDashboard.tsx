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
  Mail,
  Phone,
  Calendar,
  Lock,
  MessageSquare,
  Send,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  Database,
  Cloud,
  HardDrive,
  TrendingUp,
  PieChart,
  Target,
  Rocket,
  Scale
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ChiefManagerDashboard() {
  const { lang } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'dashboard';

  const theme = {
    bg: '#0a0a0a',
    bg2: '#111',
    bg3: '#181818',
    bg4: '#222',
    accent: '#7f77dd', // Purple
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f77dd]" /></div>;
  
  const isChief = userProfile?.roles.includes('chief_manager') || userProfile?.roles.includes('admin');
  if (!user || (userProfile && !isChief)) return <Navigate to={`/${lang || 'eng'}`} />;

  const sidebarItems = [
    { id: 'dashboard', label: 'Strategy', icon: Target, color: theme.accent },
    { type: 'section', label: 'Analysis' },
    { id: 'kpi_metrics', label: 'KPI Dashboard', icon: TrendingUp, color: '#00f5d4' },
    { id: 'growth', label: 'Market Growth', icon: Rocket, color: '#ef9f27' },
    { type: 'section', label: 'Team' },
    { id: 'staff_list', label: 'Directory', icon: Users, color: '#378add' },
    { id: 'performance', label: 'Performance', icon: Zap, color: '#7f77dd' },
    { type: 'section', label: 'Operations' },
    { id: 'all_contracts', label: 'Contracts', icon: Briefcase, color: '#ef9f27', badge: '4' },
    { id: 'legal', label: 'Legal & Risk', icon: Scale, color: '#e24b4a' },
  ];

  const handleModuleChange = (id: string) => {
    setSearchParams({ view: id });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e8e6df] font-sans selection:bg-[#7f77dd]/30 overflow-hidden h-screen">
      {/* SIDEBAR */}
      <aside className="w-[220px] bg-[#111] border-r border-[#2a2a2a] flex flex-col h-full shrink-0 z-50">
        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="size-8 bg-[#7f77dd] rounded-lg flex items-center justify-center font-bold text-white tracking-tighter shadow-lg shadow-[#7f77dd]/20">RG</div>
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight truncate">Red Griffin</div>
            <div className="text-[9px] font-black text-[#7f77dd] uppercase tracking-widest leading-none mt-1">Chief Manager</div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item, idx) => {
            if (item.type === 'section') return <div key={idx} className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">{item.label}</div>;
            const Icon = item.icon as any;
            const isActive = activeModule === item.id;
            return (
              <button key={item.id} onClick={() => handleModuleChange(item.id)} className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all relative group ${isActive ? 'text-[#7f77dd] bg-[#7f77dd]/5' : 'text-[#888] hover:text-[#e8e6df] hover:bg-white/5'}`}>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#7f77dd]" />}
                <div className="size-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="flex-1 text-left uppercase tracking-widest text-[10px] font-black truncate">{item.label}</span>
                {item.badge && <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a] bg-black/20 flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#7f77dd]/10 flex items-center justify-center text-[10px] font-black text-[#7f77dd] shrink-0">CM</div>
          <div className="min-w-0"><div className="text-xs font-bold truncate">Head of Ops</div><div className="text-[9px] text-[#555] truncate font-black uppercase tracking-widest">{user?.email}</div></div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <div className="text-sm font-bold uppercase tracking-tight">{activeModule.replace(/_/g, ' ')}</div>
            <div className="text-[9px] text-[#555] font-black uppercase tracking-widest">Global Operations / {activeModule === 'dashboard' ? 'Strategy' : activeModule}</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-8 px-4 bg-[#7f77dd] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">+ New Project</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            {activeModule === 'dashboard' && <StrategyView theme={theme} />}
            {activeModule === 'all_contracts' && <ContractsView theme={theme} />}
            {activeModule !== 'dashboard' && activeModule !== 'all_contracts' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center">
                <Target size={64} className="mb-6" />
                <div className="text-[12px] font-black uppercase tracking-[0.5em]">{activeModule} View Initializing...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StrategyView({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{l:'Quarterly Revenue',v:'$72,440',c:theme.accent},{l:'Platform NPS',v:'74',c:'#1d9e75'},{l:'User Retention',v:'68%',c:'#ef9f27'},{l:'Active Staff',v:'24',c:'#378add'}].map((m, i) => (
          <div key={i} className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
            <div className="text-[9px] font-black text-[#555] uppercase tracking-widest">{m.l}</div>
            <div className="text-3xl font-black text-white tracking-tighter">{m.v}</div>
            <div className="h-1 bg-[#222] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: m.c }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6">Department KPIs</div>
          <div className="space-y-4">
            {['Academy - Content Growth', 'Studio - Completion Rate', 'Support - SLA Score'].map(k => (
              <div key={k} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-xs font-bold text-[#888]">{k}</span>
                <span className="text-xs font-black text-white">92%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6">Revenue by Mode</div>
          <div className="space-y-6">
            {[{l:'Academy', p:64},{l:'Studio', p:36}].map(r => (
              <div key={r.l} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span>{r.l}</span><span>{r.p}%</span></div>
                <div className="h-1.5 bg-[#222] rounded-full overflow-hidden"><div className="h-full bg-[#7f77dd]" style={{ width: `${r.p}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContractsView({ theme }: any) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-[#2a2a2a] bg-black/20 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-widest">Global Contract Ledger</div>
        <button className="text-[9px] font-black text-[#7f77dd] uppercase tracking-widest hover:underline">Download Report</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-black/20 text-[9px] font-black text-[#555] uppercase tracking-widest"><th className="px-8 py-4">Client</th><th className="px-8 py-4">Project</th><th className="px-8 py-4">Value</th><th className="px-8 py-4">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {[1,2,3,4,5].map(i => (
            <tr key={i} className="hover:bg-white/[0.01]">
              <td className="px-8 py-5 text-xs font-bold text-white">Client Studio {i}</td>
              <td className="px-8 py-5 text-xs text-[#888]">CGI Production Phase {i}</td>
              <td className="px-8 py-5 text-xs font-black text-[#7f77dd]">$12,400</td>
              <td className="px-8 py-5"><span className="px-2 py-0.5 bg-[#7f77dd]/10 text-[#7f77dd] text-[9px] font-black uppercase rounded-full border border-[#7f77dd]/20">Active</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
