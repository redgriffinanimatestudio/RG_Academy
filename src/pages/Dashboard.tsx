import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import Full Original Dashboards
import AdminDashboard, { AdminDashboardContent } from './AdminDashboard';
import ChiefManagerDashboard, { ChiefManagerDashboardContent } from './ChiefManagerDashboard';
import ManagerDashboard, { ManagerDashboardContent } from './ManagerDashboard';
import StaffDashboard, { StaffDashboardContent } from './StaffDashboard';

// Import Generic Modules for Core Roles
import { 
  BookOpen, Clock, Award, TrendingUp, Play, ChevronRight, ChevronLeft, Calendar, Star, Zap, CheckCircle, 
  Search, Filter, Users, DollarSign, Briefcase, Plus, Layout as LayoutIcon, ArrowUpRight, ArrowDownRight, 
  MessageSquare, Layers, Box, Video, Shield, Cpu, MoreVertical, LayoutDashboard, FileText, 
  CreditCard, History, Target, UserCheck, LifeBuoy, Settings, Mail, Heart, ExternalLink, 
  ShieldCheck, CheckCircle2, AlertCircle, CalendarDays, FileSearch, ClipboardList, Wallet, 
  Globe, Rocket, SearchCode, Bell, Eye 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { activeRole, setActiveRole, user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { lang } = useParams();
  
  // Sync activeRole with URL path or profile
  React.useEffect(() => {
    const segments = location.pathname.split('/');
    const firstSegment = segments[1];
    
    const roleMap: Record<string, string> = {
      'admin': 'admin',
      'chief-manager': 'chief_manager',
      'manager': 'manager',
      'moderator': 'moderator',
      'hr': 'hr',
      'finance': 'finance',
      'support': 'support'
    };
    
    const targetRoleFromPath = roleMap[firstSegment];
    
    if (targetRoleFromPath) {
      if (profile?.roles.includes(targetRoleFromPath as any) && activeRole !== targetRoleFromPath) {
        setActiveRole(targetRoleFromPath as any);
      }
    } else if (location.pathname.includes('/dashboard') && profile && profile.roles.length > 0) {
      // On general dashboard, ensure a high-priority role is selected if available.
      // If current role is 'student' or null, and the user has better roles, upgrade them.
      const priorities: string[] = ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'lecturer', 'executor', 'client', 'student'];
      const bestRole = priorities.find(r => profile.roles.includes(r as any));
      
      if (bestRole && (!activeRole || activeRole === 'student')) {
        if (activeRole !== bestRole) {
          setActiveRole(bestRole as any);
        }
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
        <div className="flex flex-wrap items-center gap-4">
          {/* Quick Access for Admins/Managers */}
          {profile?.roles.includes('admin') && activeRole !== 'admin' && (
            <Link to={`/admin/${lang || 'eng'}`} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all">
              <Shield size={14} /> Full Admin
            </Link>
          )}
          {profile?.roles.includes('chief_manager') && activeRole !== 'chief_manager' && (
            <Link to={`/chief-manager/${lang || 'eng'}`} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-purple-500 hover:bg-purple-500/20 transition-all">
              <Target size={14} /> Strategy
            </Link>
          )}

          {/* Role Switcher */}
          {profile && profile.roles.length > 1 && (
            <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5 overflow-hidden">
              {['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'lecturer', 'executor', 'client', 'student']
                .filter(r => profile.roles.includes(r as any))
                .map(r => (
                  <button
                    key={r}
                    onClick={() => setActiveRole(r as any)}
                    className={`px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                      activeRole === r 
                      ? 'bg-white text-black shadow-lg scale-105' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {r.split('_')[0]}
                  </button>
                ))}
            </div>
          )}

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
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Current Courses" value="3" sub="2 nearing completion" icon={BookOpen} accent={accent} />
          <StatCard label="Mastery Points" value="12,450" sub="Top 12% globally" icon={Zap} accent={accent} />
          <StatCard label="Certificates" value="7" sub="Latest: Unreal Lighting" icon={Award} accent={accent} />
          <StatCard label="Study Time" value="142h" sub="+12h this week" icon={Clock} accent={accent} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-8">
            {/* Active Pipeline */}
            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Play size={20} style={{ color: accent }} /> Active Learning Pipeline
                </h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">View All</button>
              </div>
              <div className="grid gap-4">
                {[
                  { title: "CGI Production Vol.1", progress: 68, instructor: "Alex R.", img: "edu1" },
                  { title: "Mastering Houdini FX", progress: 34, instructor: "Sarah L.", img: "edu2" }
                ].map((course, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="size-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/20 transition-all">
                        <img src={`https://picsum.photos/seed/${course.img}/200`} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{course.title}</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Instructor: {course.instructor}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${course.progress}%` }} 
                              transition={{ duration: 1, delay: i * 0.2 }}
                              className="h-full" 
                              style={{ background: accent }} 
                            />
                          </div>
                          <span className="text-[10px] font-black" style={{ color: accent }}>{course.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Resume</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Lessons */}
            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Calendar size={20} style={{ color: accent }} /> Upcoming Sessions
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Advanced Rigging Q&A", date: "Today, 18:00", type: "Live Workshop" },
                  { title: "Portfolio Review", date: "Tomorrow, 14:00", type: "Group Critique" }
                ].map((session, i) => (
                  <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-1 bg-white/5 text-white/60 text-[8px] font-black uppercase rounded border border-white/10" style={{ color: accent, borderColor: `${accent}20` }}>{session.type}</span>
                      <Clock size={14} className="text-white/20" />
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{session.title}</h4>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{session.date}</div>
                    <button className="w-full py-2 bg-white/5 rounded-lg text-[9px] font-black uppercase hover:bg-white/10 transition-all">Join Waiting Room</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Certification Card */}
            <div className="p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl flex flex-col justify-between aspect-square" style={{ background: accent }}>
              <div className="relative z-10 text-bg-dark">
                <Rocket size={48} className="mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">Elite <br /> CG Certification</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-60">Validate your industry skills</p>
              </div>
              <button className="w-full py-4 bg-bg-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all relative z-10 shadow-xl">Apply for Exam</button>
              {/* Background Glow */}
              <div className="absolute -bottom-20 -right-20 size-64 bg-white/20 blur-[80px] rounded-full group-hover:scale-110 transition-transform" />
            </div>

            {/* Progress Summary */}
            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Weekly Goal</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-white tracking-tighter">85%</span>
                <span className="text-[10px] font-bold uppercase" style={{ color: accent }}>12/15 hours</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '85%' }} 
                  transition={{ duration: 1.5 }}
                  className="h-full" 
                  style={{ background: accent }} 
                />
              </div>
              <p className="text-[9px] text-white/20 font-black uppercase leading-relaxed tracking-widest">You're doing better than 82% of students this week. Keep it up!</p>
            </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Workshops" value="4" sub="1,420 total students" icon={Video} accent={accent} />
        <StatCard label="Monthly Revenue" value="$12,450" sub="↑ 18% vs last month" icon={DollarSign} accent={accent} />
        <StatCard label="Average Rating" value="4.95" sub="Based on 342 reviews" icon={Star} accent={accent} />
        <StatCard label="Content Assets" value="124" sub="8 pending review" icon={Layers} accent={accent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          {/* Workshop Management */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <LayoutDashboard size={20} style={{ color: accent }} /> Workshop Control
              </h3>
              <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">+ New Live Session</button>
            </div>
            <div className="space-y-4">
              {[
                { title: "Advanced Unreal Shaders", students: 450, status: "Live in 2h", trend: "up" },
                { title: "Character Design Masterclass", students: 890, status: "Recording", trend: "up" }
              ].map((ws, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                      <Video size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{ws.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] text-white/40 font-bold uppercase">{ws.students} Students Enrolled</span>
                        <span className="size-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-black uppercase" style={{ color: accent }}>{ws.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-xl hover:text-white transition-colors"><MessageSquare size={16} /></button>
                    <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Feedback */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tight">Recent Feedback</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { user: "Mark V.", comment: "The lighting module was a game changer for my portfolio.", rating: 5 },
                { user: "Elena S.", comment: "Detailed explanations, but would love more Houdini examples.", rating: 4 }
              ].map((f, i) => (
                <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white uppercase">{f.user}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => <Star key={j} size={10} fill={j < f.rating ? accent : "transparent"} stroke={j < f.rating ? accent : "white"} className="opacity-40" />)}
                    </div>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed italic">"{f.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Revenue Chart Widget */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Revenue Growth</h3>
              <TrendingUp size={16} style={{ color: accent }} />
            </div>
            <div className="h-32 flex items-end gap-2">
              {[40, 60, 45, 90, 65, 80, 50].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }} 
                  className="flex-1 bg-white/5 rounded-t-lg group-hover:bg-primary/20 transition-all" 
                  style={{ background: i === 6 ? accent : '' }}
                />
              ))}
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-white/20">Est. Payout</span>
              <span className="text-lg font-black text-white">$4,820.00</span>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Instructor Rank</h3>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full border-2 border-primary/20 flex items-center justify-center font-black text-primary">#12</div>
              <div>
                <div className="text-sm font-black text-white uppercase">Elite Creator</div>
                <div className="text-[9px] text-white/20 font-bold uppercase mt-1">Top 3% of Academy Experts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientDashboard({ view, accent }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value="3" sub="2 in final stage" icon={Box} accent={accent} />
        <StatCard label="Talent Pipeline" value="14" sub="5 new applicants" icon={Users} accent={accent} />
        <StatCard label="Quarterly Spend" value="$12,400" sub="Within budget" icon={CreditCard} accent={accent} />
        <StatCard label="Studio Rank" value="Gold" sub="Verified Partner" icon={ShieldCheck} accent={accent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          {/* Project Tracking */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight">Active Productions</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Project Hub</button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Project Phoenix - CGI Ad", progress: 85, budget: "$45k", team: 5 },
                { name: "Unreal Environment Pack", progress: 42, budget: "$12k", team: 2 }
              ].map((p, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 group hover:border-white/10 transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{p.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-[10px] text-white/40 font-bold uppercase">
                        <span>{p.team} Experts</span>
                        <span className="size-1 rounded-full bg-white/10" />
                        <span>Budget: {p.budget}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Review Milestones</button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-white/20"><span>Total Progress</span><span>{p.progress}%</span></div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1.5 }} className="h-full" style={{ background: accent }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Talent Hiring */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tight">Talent Acquisition</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Alex Rover", role: "VFX Supervisor", score: 98, status: "Interviewing" },
                { name: "Sarah Chen", role: "Senior Rigger", score: 94, status: "Offer Sent" }
              ].map((t, i) => (
                <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[10px]" style={{ color: accent }}>{t.score}%</div>
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-tight">{t.name}</div>
                      <div className="text-[9px] text-white/40 font-bold uppercase mt-0.5">{t.role}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase" style={{ color: accent }}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Studio Finances</h3>
            <div className="space-y-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Escrow Balance</div>
                <div className="text-3xl font-black text-white tracking-tighter">$24,800.00</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-white/40">Current Burn Rate</span>
                  <span className="text-white">$1,200/wk</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Add Funds</button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <div className="flex items-center gap-3"><LifeBuoy size={20} className="text-white/20" /><span className="text-[10px] font-black uppercase tracking-widest text-white/40">Studio Support</span></div>
            <p className="text-[10px] text-white/20 leading-relaxed font-black uppercase">Access your dedicated account manager for priority talent sourcing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutorDashboard({ view, accent }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Contracts Active" value="2" sub="+$1,400 pending" icon={Briefcase} accent={accent} />
        <StatCard label="Invitation Rate" value="12%" sub="High profile studios" icon={Mail} accent={accent} />
        <StatCard label="Network Rank" value="Elite" sub="Top 5% Expert" icon={Award} accent={accent} />
        <StatCard label="Earned Total" value="$42,100" sub="All-time verified" icon={DollarSign} accent={accent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          {/* Contract Pipeline */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight">Active Contracts</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest">In Progress (2)</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { studio: "Nebula Games", task: "Hero Character Rigging", due: "3 days", price: "$2,400", p: 75 },
                { studio: "CGI Labs", task: "Fluid Simulation FX", due: "8 days", price: "$1,800", p: 20 }
              ].map((c, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 group hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black" style={{ color: accent }}>{c.studio.charAt(0)}</div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{c.task}</h4>
                        <div className="text-[10px] text-white/40 font-bold uppercase mt-1">{c.studio}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-white">{c.price}</div>
                      <div className="text-[9px] font-black uppercase mt-1" style={{ color: accent }}>Due in {c.due}</div>
                    </div>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${c.p}%` }} transition={{ duration: 1.5 }} className="h-full" style={{ background: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Analytics */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tight">Profile Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Profile Views", val: "1,242", sub: "+12% this week" },
                { label: "Portfolio Likes", val: "482", sub: "Top 5% of month" },
                { label: "Job Invites", val: "8", sub: "3 new this morning" }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-2">
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-2xl font-black text-white tracking-tighter">{stat.val}</div>
                  <div className="text-[9px] font-bold uppercase" style={{ color: accent }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Wallet Widget */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Expert Wallet</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-white/20">Available for Payout</span>
                <span className="text-xl font-black text-white">$4,120.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-white/20">Pending (Escrow)</span>
                <span className="text-xl font-black text-white/40">$2,400.00</span>
              </div>
            </div>
            <button className="w-full py-4 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-white/10 hover:scale-[1.02] transition-all">Withdraw Funds</button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Verification Status</h3>
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} style={{ color: accent }} />
              <div className="text-[10px] font-black text-white uppercase tracking-widest">Expert Verified</div>
            </div>
            <p className="text-[10px] text-white/20 leading-relaxed font-black uppercase">Your profile is currently featured in the talent directory for top-tier studios.</p>
          </div>
        </div>
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