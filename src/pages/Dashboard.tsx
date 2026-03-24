import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

// Import Full Original Dashboards for fallback/specific views
import AdminDashboard, { AdminDashboardContent } from './AdminDashboard';
import ChiefManagerDashboard, { ChiefManagerDashboardContent } from './ChiefManagerDashboard';
import ManagerDashboard, { ManagerDashboardContent } from './ManagerDashboard';
import StaffDashboard, { StaffDashboardContent } from './StaffDashboard';
import { ModeratorDashboardContent } from './ModeratorDashboard';

// Lucide Icons
import { 
  BookOpen, Clock, Award, TrendingUp, Play, ChevronRight, Zap, 
  Users, DollarSign, Briefcase, Plus, MessageSquare, Box, Video, Shield, 
  LayoutDashboard, CreditCard, Crosshair, ShieldCheck, AlertCircle, 
  Rocket, Bell, User, GraduationCap, Sparkles, Layers, Star,
  Calendar, Search, Filter, LogOut, CheckCircle2, XCircle, PieChart,
  Target, Mail, MapPin, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Preloader from '../components/Preloader';

// Services
import { academyService } from '../services/academyService';
import { studioService } from '../services/studioService';
import { adminService } from '../services/adminService';
import { networkingService } from '../services/networkingService';

// --- MAIN DASHBOARD HUB ---

export default function Dashboard() {
  const { activeRole, setActiveRole, user, profile, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  
  // ROBUST ROLE SYNC LOGIC
  useEffect(() => {
    if (!profile || !profile.roles) return;

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

    if (!targetRole || !roles.includes(targetRole)) {
      const priorities = ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'lecturer', 'client', 'executor', 'student'];
      targetRole = priorities.find(r => roles.includes(r)) || roles[0];
    }

    if (targetRole && activeRole !== targetRole) {
      setActiveRole(targetRole as any);
    }
  }, [location.pathname, profile, activeRole, setActiveRole]);

  const currentView = searchParams.get('view') || 'overview';

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
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/5 text-white/40 hover:text-white transition-all relative">
              <Bell size={24} />
              <div className="absolute top-3 right-3 lg:top-4 lg:right-4 size-2 rounded-full border-2 border-[#0a0a0a]" style={{ background: theme.accent }} />
            </button>
            <Link 
              to={`/aca/${lang}`}
              className="flex-1 lg:flex-none px-6 lg:px-8 py-3 lg:py-4 bg-primary text-bg-dark rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 lg:gap-3"
            >
              <Rocket size={18} /> <span className="whitespace-nowrap">Explore Workshops</span>
            </Link>
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {currentView === 'overview' ? (
            <UnifiedDashboard roles={profile?.roles || []} user={user} lang={lang} theme={theme} />
          ) : (
            <AnimatePresence mode="wait">
              <div key={activeRole + currentView}>
                {activeRole === 'admin' && <AdminDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} user={user} />}
                {activeRole === 'chief_manager' && <ChiefManagerDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} />}
                {activeRole === 'manager' && <ManagerDashboardContent activeModule={currentView} theme={{ ...theme, bg: '#0a0a0a', border: '#2a2a2a' }} />}
                {activeRole === 'moderator' && <ModeratorDashboardContent activeModule={currentView} accentColor={theme.accent} />}
                {['hr', 'finance', 'support'].includes(activeRole || '') && <StaffDashboardContent activeRole={activeRole} activeModule={currentView} accentColor={theme.accent} />}
                {['student', 'lecturer', 'client', 'executor'].includes(activeRole || '') && <CoreDashboardView activeRole={activeRole} currentView={currentView} accent={theme.accent} user={user} lang={lang} />}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </main>
    </div>
  );
}

// --- NEW UNIFIED HUB COMPONENT ---

function UnifiedDashboard({ roles, user, lang, theme }: any) {
  const isL = roles.includes('lecturer') || roles.includes('admin');
  const isE = roles.includes('executor') || roles.includes('admin');
  const isC = roles.includes('client') || roles.includes('admin');
  const isS = roles.includes('student');
  const isStaff = roles.some((r: string) => ['manager', 'chief_manager', 'moderator', 'hr', 'finance', 'support'].includes(r));

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isStaff && <StatCard label="Action Queue" value="12" sub="Pending tasks" icon={Shield} accent="#ef4444" />}
        {isC && <StatCard label="Studio Budget" value="$24.8k" sub="Escrow held" icon={DollarSign} accent="#ef9f27" />}
        {isE && <StatCard label="Active Contracts" value="3" sub="+$4,200 pending" icon={Briefcase} accent="#e24b4a" />}
        {isS && <StatCard label="Workshop Progress" value="84%" sub="UE5 Niagara" icon={GraduationCap} accent="#378add" />}
        {!isStaff && isL && <StatCard label="Monthly Payout" value="$4,120" sub="↑ 12% vs last mo" icon={Zap} accent="#1d9e75" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {(isC || isE) && (
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                    <Box size={20} className="text-primary" /> Studio Production Hub
                  </h3>
                  <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mt-1">Management of active studio pipelines</p>
                </div>
                {isC && isE && <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase rounded-lg tracking-widest">Subcontracting Active</span>}
              </div>

              <div className="grid gap-4 relative z-10">
                {[
                  { name: "Nebula CGI Sequence", role: "Client", status: "Reviewing", p: 85, c: '#ef9f27' },
                  { name: "Character Rigging Pack", role: "Executor", status: "In Production", p: 42, c: '#e24b4a' }
                ].map((p, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                        <Rocket size={20} style={{ color: p.c }} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight">{p.name}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] font-black uppercase" style={{ color: p.c }}>{p.role}</span>
                          <span className="size-1 rounded-full bg-white/10" />
                          <span className="text-[9px] text-white/40 font-bold uppercase">{p.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.p}%` }} className="h-full" style={{ background: p.c }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20" />
            </div>

            {isC && isE && (
              <div className="p-8 bg-sky-500/5 border border-sky-500/20 rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="size-14 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400"><Sparkles size={28} /></div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Production Synergy Active</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase mt-1 italic leading-relaxed max-w-md">"Может нанимать других и сам браться за работу — идеальный баланс субподряда"</p>
                  </div>
                </div>
                <Link to={`/studio/${lang}/manage`} className="px-6 py-3 bg-sky-500 text-bg-dark rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all relative z-10">Open Manager</Link>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          {isS && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <GraduationCap size={14} className="text-primary" /> Learning Pipeline
              </h3>
              <div className="space-y-4">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="text-[10px] font-black text-white uppercase tracking-tight">Next Lesson</div>
                    <span className="text-[8px] font-black px-2 py-0.5 bg-primary/20 text-primary rounded-md uppercase">UE5 Niagara</span>
                  </div>
                  <div className="text-xs font-bold text-white/80 leading-tight">Advanced Particle Simulation for Environment VFX</div>
                  <Link to={`/learn/${lang}/ue5-niagara`} className="block w-full py-3 bg-primary text-bg-dark rounded-xl text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all text-center">Resume Learning</Link>
                </div>
              </div>
            </div>
          )}

          {isL && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Video size={14} className="text-indigo-400" /> Instructor Hub
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-white/20">Course Rating</span>
                  <div className="flex gap-0.5 text-primary"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-white/20">New Students</span>
                  <span className="text-white">+12 this wk</span>
                </div>
                <Link to="?view=content_mgmt" className="block w-full py-3 border border-white/5 text-white/20 hover:text-white hover:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-all">Manage Workshops</Link>
              </div>
            </div>
          )}

          <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
              <Users size={14} /> Ecosystem Feed
            </h3>
            <div className="space-y-4">
              {[
                { u: "Sarah C.", a: "published a new reel", t: "2h ago" },
                { u: "Alex R.", a: "won Nebula Studio project", t: "5h ago" }
              ].map((feed, i) => (
                <div key={i} className="flex gap-3">
                  <div className="size-8 rounded-lg bg-white/5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-white/60 truncate leading-tight"><span className="text-white">{feed.u}</span> {feed.a}</p>
                    <span className="text-[8px] font-black text-white/10 uppercase">{feed.t}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CORE DASHBOARD VIEWS (FOR SPECIFIC MODULES) ---

function CoreDashboardView({ activeRole, currentView, accent, user, lang }: any) {
  if (activeRole === 'student') return <StudentDashboard view={currentView} accent={accent} user={user} lang={lang} />;
  if (activeRole === 'lecturer') return <LecturerDashboard view={currentView} accent={accent} user={user} lang={lang} />;
  if (activeRole === 'client') return <ClientDashboard view={currentView} accent={accent} user={user} lang={lang} />;
  if (activeRole === 'executor') return <ExecutorDashboard view={currentView} accent={accent} user={user} lang={lang} />;
  return null;
}

function StudentDashboard({ view, accent, user, lang }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        if (view === 'my_progress' || view === 'overview') {
          const res = await academyService.getUserEnrollments(user.uid);
          setData(res);
        } else if (view === 'purchases') {
          // Mock or real API for purchases
          setData([]);
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    fetchData();
  }, [user?.uid, view]);

  if (view === 'my_progress' || view === 'overview') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="My Workshops" value={data.length} sub="Active learning" icon={BookOpen} accent={accent} />
          <StatCard label="Mastery" value="Elite" sub="Top 12%" icon={Zap} accent={accent} />
          <StatCard label="Certificates" value="4" sub="Verified" icon={Award} accent={accent} />
          <StatCard label="Time" value="148h" sub="This year" icon={Clock} accent={accent} />
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
          <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 text-white">
            <Play size={24} style={{ color: accent }} /> Active Learning Pipeline
          </h3>
          <div className="grid gap-6">
            {loading ? <Preloader message="Loading..." size="sm" /> : data.length > 0 ? data.map((enr, i) => (
              <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-8">
                  <div className="size-20 rounded-2xl overflow-hidden border border-white/5"><img src={enr.course.thumbnail} className="w-full h-full object-cover" /></div>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase">{enr.course.title}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full" style={{ width: `${enr.progress}%`, background: accent }} /></div>
                      <span className="text-[10px] font-black text-white/40">{enr.progress}%</span>
                    </div>
                  </div>
                </div>
                <Link to={`/learn/${lang}/${enr.course.slug}`} className="px-8 py-3 bg-white text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Continue</Link>
              </div>
            )) : <NoDataPlaceholder icon={BookOpen} message="No active workshops found." link={`/aca/${lang}`} linkText="Browse Workshops" />}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'academy_calendar') {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tight">Academic Calendar</h3>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(31)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[10px] font-black opacity-20">{i+1}</div>
          ))}
        </div>
        <p className="text-center text-[10px] font-black uppercase text-white/20 tracking-widest">No live sessions scheduled for this month</p>
      </div>
    );
  }

  return <NoDataPlaceholder icon={Layers} message={`Module ${view} has no active data flow.`} />;
}

function LecturerDashboard({ view, accent, user, lang }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const res = await academyService.getCourses();
        setData(res.filter((c: any) => c.lecturerId === user.uid));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchData();
  }, [user?.uid]);

  if (view === 'content_mgmt') {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
        <div className="flex justify-between items-center"><h3 className="text-2xl font-black uppercase tracking-tight">Workshop Management</h3><Link to={`/aca/${lang}/create`} className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase">+ Create New</Link></div>
        {loading ? <Preloader message="Loading..." size="sm" /> : data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((course) => (
              <div key={course.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg overflow-hidden"><img src={course.thumbnail} className="w-full h-full object-cover" /></div>
                  <div><div className="text-sm font-black uppercase">{course.title}</div><div className="text-[10px] text-white/40 font-bold uppercase mt-1">Status: Published</div></div>
                </div>
                <button className="px-4 py-2 bg-white/5 rounded-lg text-[9px] font-black uppercase hover:bg-white/10 transition-all">Edit</button>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Video} message="You haven't created any workshops yet." link={`/aca/${lang}/create`} linkText="Start Teaching" />}
      </div>
    );
  }

  if (view === 'financials') {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tight">Lecturer Revenue</h3>
        <div className="p-10 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] text-center">
          <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-2">Available for withdrawal</div>
          <div className="text-5xl font-black text-white tracking-tighter">$0.00</div>
        </div>
        <p className="text-center text-[10px] font-black uppercase text-white/20 tracking-widest">Payouts are processed every 15th of the month</p>
      </div>
    );
  }

  return <NoDataPlaceholder icon={Users} message={`Module ${view} has no active data flow.`} />;
}

function ClientDashboard({ view, accent, user, lang }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const res = await studioService.getProjects();
        setData(res.filter((p: any) => p.clientId === user.uid));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchData();
  }, [user?.uid]);

  if (view === 'project_mgmt') {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
        <div className="flex justify-between items-center"><h3 className="text-2xl font-black uppercase tracking-tight">Studio Projects</h3><Link to={`/studio/${lang}/post`} className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase">+ New Project</Link></div>
        {loading ? <Preloader message="Loading..." size="sm" /> : data.length > 0 ? (
          <div className="space-y-4">
            {data.map((p, i) => (
              <div key={p.id} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex justify-between items-center group hover:border-sky-500/20 transition-all">
                <div className="flex items-center gap-6"><div className="size-12 bg-white/5 rounded-xl flex items-center justify-center font-black">P{i+1}</div><div><div className="text-lg font-black uppercase tracking-tight text-white">{p.title}</div><div className="text-[10px] text-white/40 font-black uppercase mt-1">Budget: ${p.budget} · Status: {p.status}</div></div></div>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: '65%' }} /></div>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Box} message="No projects found." link={`/studio/${lang}/post`} linkText="Post Project" />}
      </div>
    );
  }

  return <NoDataPlaceholder icon={CreditCard} message={`Module ${view} has no active data flow.`} />;
}

function ExecutorDashboard({ view, accent, user, lang }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const res = await studioService.getContracts(user.uid, 'executor');
        setData(res);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchData();
  }, [user?.uid]);

  if (view === 'job_pipeline') {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tight">Task Pipeline</h3>
        {loading ? <Preloader message="Loading..." size="sm" /> : data.length > 0 ? (
          <div className="grid gap-4">
            {data.map((c) => (
              <div key={c.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-6"><div className="size-10 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center"><CheckCircle2 size={20} /></div><div><div className="text-sm font-black uppercase">Contract #{c.id.slice(0, 8)}</div><div className="text-[10px] text-white/40 font-bold uppercase mt-1">Status: {c.status} · ${c.amount}</div></div></div>
                <button className="px-6 py-2.5 bg-primary text-bg-dark rounded-xl text-[9px] font-black uppercase">Update</button>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Briefcase} message="No active contracts found." link={`/studio/${lang}`} linkText="Find Work" />}
      </div>
    );
  }

  if (view === 'pro_profile') {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl text-center">
        <h3 className="text-2xl font-black uppercase tracking-tight">Professional Profile</h3>
        <div className="size-32 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20"><User size={64} /></div>
        <div className="space-y-2"><p className="text-white font-black uppercase tracking-tight">{user?.displayName}</p><p className="text-[10px] text-white/40 font-bold uppercase">Expert Level Verified</p></div>
        <Link to={`/studio/${lang}/profile/${user?.uid}`} className="inline-block px-10 py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest">Public View</Link>
      </div>
    );
  }

  return <NoDataPlaceholder icon={Users} message={`Module ${view} has no active data flow.`} />;
}

// --- SHARED COMPONENTS ---

function NoDataPlaceholder({ icon: Icon, message, link, linkText }: any) {
  return (
    <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] space-y-6">
      <Icon size={48} className="mx-auto text-white/10" />
      <p className="text-white/20 font-black uppercase tracking-widest text-xs max-w-xs mx-auto">{message}</p>
      {link && <Link to={link} className="inline-block px-8 py-3 bg-white text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">{linkText}</Link>}
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
