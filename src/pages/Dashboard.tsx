import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import Full Original Dashboards
import AdminDashboard, { AdminDashboardContent } from './AdminDashboard';
import ChiefManagerDashboard, { ChiefManagerDashboardContent } from './ChiefManagerDashboard';
import ManagerDashboard, { ManagerDashboardContent } from './ManagerDashboard';
import StaffDashboard, { StaffDashboardContent } from './StaffDashboard';
import { ModeratorDashboardContent } from './ModeratorDashboard';

// Import Generic Modules for Core Roles
import { 
  BookOpen, Clock, Award, TrendingUp, Play, ChevronRight, ChevronLeft, Calendar, Star, Zap, CheckCircle, 
  Search, Filter, Users, DollarSign, Briefcase, Plus, Layout as LayoutIcon, ArrowUpRight, ArrowDownRight, 
  MessageSquare, Layers, Box, Video, Shield, Cpu, MoreVertical, LayoutDashboard, FileText, 
  CreditCard, History, Target, UserCheck, LifeBuoy, Settings, Mail, Heart, ExternalLink, 
  ShieldCheck, CheckCircle2, AlertCircle, CalendarDays, FileSearch, ClipboardList, Wallet, 
  Globe, Rocket, SearchCode, Bell, Eye, User, GraduationCap, UserPlus, LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Preloader from '../components/Preloader';

export default function Dashboard() {
  const { activeRole, setActiveRole, user, profile, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  
  // Sync activeRole with URL path or profile
  React.useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get('role');
    
    const roleMap: Record<string, string> = {
      'admin': 'admin',
      'chief-manager': 'chief_manager',
      'manager': 'manager',
      'moderator': 'moderator',
      'hr': 'hr',
      'finance': 'finance',
      'support': 'support',
      'student': 'student',
      'lecturer': 'lecturer',
      'executor': 'executor',
      'client': 'client'
    };
    
    // Check all segments for a role name
    let roleFromPath = null;
    for (const segment of segments) {
      if (roleMap[segment]) {
        roleFromPath = roleMap[segment];
        break;
      }
    }

    const targetRole = roleParam || roleFromPath;
    
    if (targetRole) {
      if (profile?.roles.includes(targetRole as any) && activeRole !== targetRole) {
        setActiveRole(targetRole as any);
      }
    } else if (location.pathname.includes('/dashboard') && profile && profile.roles.length > 0) {
      // On general dashboard, ensure a role is selected if none is active.
      const priorities: string[] = ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'lecturer', 'executor', 'client', 'student'];
      const bestRole = priorities.find(r => profile.roles.includes(r as any));
      
      if (bestRole && !activeRole) {
        setActiveRole(bestRole as any);
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
    <div className="flex flex-col min-h-screen">
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 space-y-8 lg:space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 lg:space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[9px] lg:text-[10px]">
              <LayoutDashboard size={14} />
              Dashboard Hub
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white leading-tight uppercase">
              {currentView === 'overview' ? `Welcome,` : currentView.replace(/_/g, ' ')} <br className="hidden lg:block" />
              <span className="text-primary italic">{currentView === 'overview' ? user?.displayName?.split(' ')[0] : 'HUB'}.</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/5 text-white/40 hover:text-white transition-all relative">
              <Bell size={24} />
              <div className="absolute top-3 right-3 lg:top-4 lg:right-4 size-2 rounded-full border-2 border-[#0a0a0a]" style={{ background: theme.accent }} />
            </button>
            <Link 
              to={`/aca/${lang || 'eng'}`}
              className="flex-1 lg:flex-none px-6 lg:px-8 py-3 lg:py-4 bg-primary text-bg-dark rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 lg:gap-3"
            >
              <Rocket size={18} /> <span className="whitespace-nowrap">Explore Workshops</span>
            </Link>
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {activeRole === 'admin' && <AdminDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} user={user} />}
          {activeRole === 'chief_manager' && <ChiefManagerDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} />}
          {activeRole === 'manager' && <ManagerDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} />}
          {activeRole === 'moderator' && <ModeratorDashboardContent activeModule={currentView} accentColor={theme.accent} />}
          {['hr', 'finance', 'support'].includes(activeRole || '') && <StaffDashboardContent activeRole={activeRole} activeModule={currentView} accentColor={theme.accent} />}
          
          {['student', 'lecturer', 'client', 'executor'].includes(activeRole || '') && <CoreDashboardView activeRole={activeRole} currentView={currentView} accent={theme.accent} user={user} lang={lang} />}
        </motion.div>
      </main>
    </div>
  );
}

function CoreDashboardView({ activeRole, currentView, accent, user, lang }: any) {
  return (
    <>
      {activeRole === 'student' && <StudentDashboard view={currentView} accent={accent} user={user} lang={lang} />}
      {activeRole === 'lecturer' && <LecturerDashboard view={currentView} accent={accent} />}
      {activeRole === 'client' && <ClientDashboard view={currentView} accent={accent} />}
      {activeRole === 'executor' && <ExecutorDashboard view={currentView} accent={accent} />}
    </>
  );
}

function StudentDashboard({ view, accent, user, lang }: any) {
  const [enrollments, setEnrollments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchEnrollments() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const { academyService } = await import('../services/academyService');
        const data = await academyService.getUserEnrollments(user.uid);
        setEnrollments(data);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, [user?.uid]);

  if (view === 'overview' || view === 'my_progress') {
    return (
      <div className="space-y-12">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="My Workshops" value={enrollments.length} sub={`${enrollments.filter(e => e.progress > 90).length} completed`} icon={BookOpen} accent={accent} />
          <StatCard label="Mastery Points" value="12,450" sub="Top 12% globally" icon={Zap} accent={accent} />
          <StatCard label="Certificates" value="7" sub="Latest: Unreal Lighting" icon={Award} accent={accent} />
          <StatCard label="Study Time" value="142h" sub="+12h this week" icon={Clock} accent={accent} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-12">
            {/* Active Pipeline */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 text-white">
                  <Play size={24} style={{ color: accent }} /> {view === 'overview' ? 'Active Pipeline' : 'All My Workshops'}
                </h3>
              </div>
              
              {loading ? (
                <Preloader message="Loading Enrollments..." size="md" />
              ) : (
                <div className="grid gap-6">
                  {enrollments.length > 0 ? enrollments.map((enr, i) => (
                    <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-white/10 transition-all">
                      <div className="flex items-center gap-8">
                        <div className="size-24 rounded-3xl overflow-hidden border-2 border-white/5 group-hover:border-primary/20 transition-all shadow-2xl">
                          <img src={enr.course.thumbnail} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{enr.course.title}</h4>
                          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Instructor: {enr.course.lecturerName}</p>
                          <div className="flex items-center gap-6 mt-4">
                            <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${enr.progress}%` }} 
                                transition={{ duration: 1, delay: i * 0.2 }}
                                className="h-full" 
                                style={{ background: accent }} 
                              />
                            </div>
                            <span className="text-xs font-black" style={{ color: accent }}>{enr.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/learn/${lang}/${enr.course.slug}`}
                        className="px-10 py-4 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all text-center"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] space-y-6">
                      <BookOpen size={48} className="mx-auto text-white/10" />
                      <p className="text-white/20 font-black uppercase tracking-widest text-xs">No active workshops found</p>
                      <Link to={`/aca/${lang}`} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Browse Catalog</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-8">
            {/* Certification Widget */}
            <div className="p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl flex flex-col justify-between aspect-square" style={{ background: accent }}>
              <div className="relative z-10 text-bg-dark space-y-4">
                <Rocket size={56} className="mb-4" />
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Elite <br /> CG Pro <br /> Exam</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Validate your industry skills</p>
              </div>
              <button className="w-full py-5 bg-bg-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all relative z-10 shadow-xl">Apply for Exam</button>
              <div className="absolute -bottom-20 -right-20 size-80 bg-white/20 blur-[100px] rounded-full group-hover:scale-110 transition-transform" />
            </div>

            {/* Daily Challenge */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-primary/20"><Target size={40} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Daily Challenge</h3>
              <p className="text-lg font-black text-white uppercase leading-tight">Sculpt a human ear <br /> in under 20 mins.</p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => <div key={i} className="size-8 rounded-xl border-2 border-[#0a0a0a] bg-white/10 overflow-hidden"><img src={`https://picsum.photos/seed/${i+10}/50`} /></div>)}
                </div>
                <span className="text-[9px] font-black text-white/20 uppercase">+42 others joined</span>
              </div>
              <button className="w-full py-4 border-2 border-white/5 rounded-2xl text-[10px] font-black uppercase text-white/40 hover:text-white hover:border-white/10 transition-all">Accept Challenge</button>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // Handle other views
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-20 text-center space-y-8">
      <div className="flex justify-center"><Target size={64} className="text-white/10 animate-pulse" /></div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{view.replace(/_/g, ' ')} Module</h2>
        <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Section initializing with real-time data streaming...</p>
      </div>
      <button onClick={() => navigate('?view=overview')} className="px-8 py-4 bg-white/5 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all border border-white/5">Back to Overview</button>
    </div>
  );
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