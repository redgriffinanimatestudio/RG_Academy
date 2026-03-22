import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import Full Original Dashboards
import AdminDashboard, { AdminDashboardContent } from './AdminDashboard';
import ChiefManagerDashboard, { ChiefManagerDashboardContent } from './ChiefManagerDashboard';
import ManagerDashboard, { ManagerDashboardContent } from './ManagerDashboard';
import StaffDashboard, { StaffDashboardContent } from './StaffDashboard';

// Import Generic Modules for Core Roles
import { 
  BookOpen, Clock, Award, TrendingUp, Play, ChevronRight, Calendar, Star, Zap, CheckCircle, 
  Search, Filter, Users, DollarSign, Briefcase, Plus, Layout as LayoutIcon, ArrowUpRight, ArrowDownRight, 
  MessageSquare, Layers, Box, Video, Shield, Cpu, MoreVertical, LayoutDashboard, FileText, 
  CreditCard, History, Target, UserCheck, LifeBuoy, Settings, Mail, Heart, ExternalLink, 
  ShieldCheck, CheckCircle2, AlertCircle, CalendarDays, FileSearch, ClipboardList, Wallet, 
  Globe, Rocket, SearchCode, Bell, Eye 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { activeRole, setActiveRole, user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { lang } = useParams();
  
  // Sync activeRole with URL path
  React.useEffect(() => {
    const path = location.pathname.split('/')[1]; // e.g., 'admin' from '/admin/eng'
    const roleMap: Record<string, string> = {
      'admin': 'admin',
      'chief-manager': 'chief_manager',
      'manager': 'manager',
      'moderator': 'moderator',
      'hr': 'hr',
      'finance': 'finance',
      'support': 'support'
    };
    
    const targetRole = roleMap[path];
    if (targetRole && activeRole !== targetRole) {
      // Only set if user actually has this role
      if (profile?.roles.includes(targetRole as any)) {
        setActiveRole(targetRole as any);
      }
    }
  }, [location.pathname, profile, activeRole, setActiveRole]);

  const currentView = searchParams.get('view') || (['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support'].includes(activeRole || '') ? 'dashboard' : 'overview');

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

  const theme = roleThemes[activeRole || 'student'] || { accent: '#00f5d4', label: 'Member' };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto py-4">
      {/* HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10" style={{ color: theme.accent }}>
              {theme.label} Hub
            </div>
            <span className="text-white/10">/</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-white/40">{currentView.replace(/_/g, ' ')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mt-4 uppercase leading-none">
            {currentView === 'overview' || currentView === 'dashboard' ? `Welcome, ${user?.displayName?.split(' ')[0] || 'User'}` : currentView.replace(/_/g, ' ')}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white/5 rounded-2xl border border-white/5 text-white/40 hover:text-white transition-all relative">
            <Bell size={20} />
            <div className="absolute top-3 right-3 size-2 rounded-full border-2 border-[#0a0a0a]" style={{ background: theme.accent }} />
          </button>
        </div>
      </section>

      {/* CONTENT DISPATCHER */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="min-h-[600px]">
        {activeRole === 'admin' && <AdminDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} user={user} />}
        {activeRole === 'chief_manager' && <ChiefManagerDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} />}
        {activeRole === 'manager' && <ManagerDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} />}
        {['moderator', 'hr', 'finance', 'support'].includes(activeRole || '') && <StaffDashboardContent activeRole={activeRole} activeModule={currentView} accentColor={theme.accent} />}
        
        {['student', 'lecturer', 'client', 'executor'].includes(activeRole || '') && <CoreDashboardView activeRole={activeRole} currentView={currentView} accent={theme.accent} />}
        
        {!activeRole && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20 text-center">
            <LayoutDashboard size={80} className="mb-8" />
            <h2 className="text-2xl font-black uppercase tracking-[0.5em]">Module Initializing...</h2>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function CoreDashboardView({ activeRole, currentView, accent }: any) {
  return (
    <>
      {activeRole === 'student' && <StudentDashboard view={currentView} accent={accent} />}
      {activeRole === 'lecturer' && <LecturerDashboard view={currentView} accent={accent} />}
      {activeRole === 'client' && <ClientDashboard view={currentView} accent={accent} />}
      {activeRole === 'executor' && <ExecutorDashboard view={currentView} accent={accent} />}
    </>
  );
}

function StudentDashboard({ view, accent }: any) {
  if (view === 'overview' || view === 'my_progress') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Current Courses" value="3" sub="2 nearing completion" icon={BookOpen} accent={accent} />
          <StatCard label="Mastery Points" value="12,450" sub="Top 12% globally" icon={Zap} accent={accent} />
          <StatCard label="Certificates" value="7" sub="Latest: Unreal Lighting" icon={Award} accent={accent} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between"><h3 className="text-xl font-black uppercase tracking-tight">Active Learning Pipeline</h3></div>
            <div className="grid gap-4">
              {[1, 2].map(i => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="size-16 rounded-2xl overflow-hidden"><img src={`https://picsum.photos/seed/edu${i}/200`} className="w-full h-full object-cover" /></div>
                    <div><h4 className="text-sm font-black text-white uppercase tracking-tight">CGI Production Vol.{i}</h4><div className="flex items-center gap-4 mt-2"><div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: i === 1 ? '68%' : '34%' }} /></div></div></div>
                  </div>
                  <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-primary hover:text-bg-dark transition-all">Resume</button>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 rounded-[2rem] bg-primary text-bg-dark relative overflow-hidden group shadow-2xl shadow-primary/10 flex flex-col justify-between">
            <Rocket size={40} className="mb-4 relative z-10" />
            <h3 className="text-xl font-black uppercase tracking-tighter leading-tight relative z-10">Get RG <br /> Certification</h3>
            <button className="w-full mt-6 py-3 bg-bg-dark text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all relative z-10">Start Exam</button>
          </div>
        </div>
      </div>
    );
  }
  return <div className="p-20 text-center opacity-20 uppercase font-black tracking-widest">{view} module is coming soon</div>;
}

function LecturerDashboard({ view, accent }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Live Workshops" value="4" sub="1,420 total students" icon={Video} accent={accent} />
        <StatCard label="Monthly Revenue" value="$12,450" sub="↑ 18% vs last month" icon={DollarSign} accent={accent} />
        <StatCard label="Average Rating" value="4.95" sub="Based on 342 reviews" icon={Star} accent={accent} />
      </div>
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 text-center opacity-20">
        <TrendingUp size={64} className="mx-auto mb-6" />
        <div className="text-xl font-black uppercase tracking-[0.5em]">Instructor Analytics Initializing...</div>
      </div>
    </div>
  );
}

function ClientDashboard({ view, accent }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Projects" value="3" sub="2 in final stage" icon={Box} accent={accent} />
        <StatCard label="Talent Pipeline" value="14" sub="5 new applicants" icon={Users} accent={accent} />
        <StatCard label="Quarterly Spend" value="$12,400" sub="Within budget" icon={CreditCard} accent={accent} />
      </div>
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 text-center opacity-20">
        <Briefcase size={64} className="mx-auto mb-6" />
        <div className="text-xl font-black uppercase tracking-[0.5em]">Studio Workspace Initializing...</div>
      </div>
    </div>
  );
}

function ExecutorDashboard({ view, accent }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Contracts Active" value="2" sub="+$1,400 pending" icon={Briefcase} accent={accent} />
        <StatCard label="Invitation Rate" value="12%" sub="High profile studios" icon={Mail} accent={accent} />
        <StatCard label="Network Rank" value="Elite" sub="Top 5% Expert" icon={Award} accent={accent} />
      </div>
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 text-center opacity-20">
        <Zap size={64} className="mx-auto mb-6" />
        <div className="text-xl font-black uppercase tracking-[0.5em]">Expert Portal Initializing...</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2rem] p-6 space-y-4 hover:border-white/10 transition-all shadow-xl group">
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{label}</div>
        <Icon size={18} style={{ color: accent }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{sub}</div>
    </div>
  );
}