import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Plus, BarChart3, Users, Play, ChevronRight, 
  Settings, EyeOff, Eye, LayoutDashboard, Database, 
  TrendingUp, Activity, Search
} from 'lucide-react';
import { academyService } from '../../../services/academyService';
import Preloader from '../../../components/Preloader';
import NoDataPlaceholder from '../components/NoDataPlaceholder';

interface LecturerDashboardProps {
  view: string;
  accent?: string;
  user?: any;
  lang?: string | undefined;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ view, accent, user, lang }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLocalLoading(true);
      const res = await academyService.getCourses();
      const filtered = res.filter((c: any) => c.lecturerId === user.id);
      setCourses(filtered);
    } catch (e) { console.error(e); } finally { setLocalLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const setView = (v: string) => {
    setSearchParams(prev => {
        prev.set('view', v);
        return prev;
    });
  };

  const handleToggleStatus = async (courseId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await academyService.updateCourseStatus(courseId, nextStatus);
      fetchData();
    } catch (e) {
      alert('Failed to update course status.');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (view === 'workshops') {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Curriculum <span className="text-primary">Matrix</span></h2>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] font-mono">Registry: WORKSHOP-SYNC-ACTIVE</p>
                </div>
                <button onClick={() => setView('overview')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Overview Hub</button>
            </header>
            
            <div className="glass-industrial p-12 rounded-[3.5rem] border border-white/5 space-y-10 matrix-grid-bg relative overflow-hidden group">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="relative flex-1 w-full lg:max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                        <input type="text" placeholder="Filter Workshop Slug..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all text-white" />
                    </div>
                    <Link to={`/aca/${lang}/create`} className="px-8 py-4 bg-primary text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                        <Plus size={18} /> Deploy New Workshop
                    </Link>
               </div>

               <div className="grid gap-6 relative z-10">
                    {localLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)
                    ) : courses.map((course) => (
                        <div key={course.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between group/tx hover:bg-white/[0.04] transition-all duration-500 border-l-4 border-l-primary/40 card-glow gap-8">
                             <div className="flex items-center gap-8">
                                <div className="size-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group-hover/tx:border-primary/40 transition-all shadow-xl shrink-0">
                                    <img src={course.thumbnail} className="w-full h-full object-cover grayscale group-hover/tx:grayscale-0 transition-all duration-700" alt="" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover/tx:text-primary transition-colors leading-[0.9]">{course.title}</h4>
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/40 mt-2">
                                        <span className={`px-2 py-0.5 rounded-md border ${course.status === 'published' ? 'border-emerald-500/20 text-emerald-500' : 'border-amber-500/20 text-amber-500'}`}>{course.status}</span>
                                        <span className="size-1 rounded-full bg-white/20" />
                                        <span>LOD {course.level || '000'}</span>
                                        <span className="size-1 rounded-full bg-white/20" />
                                        <span>Enrollments: {course.studentsCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button 
                                    onClick={() => handleToggleStatus(course.id, course.status)}
                                    className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-bg-dark transition-all flex items-center gap-2 justify-center"
                                >
                                    {course.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />} Lifecycle Switch
                                </button>
                                <Link to={`/aca/${lang}/course/${course.slug}/edit`} className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:bg-primary hover:text-bg-dark transition-all">
                                    <Settings size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
               </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 🚀 HUB CONTROLS (Level 2 Nav) */}
      <div className="flex gap-4">
          <button onClick={() => setView('overview')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'overview' ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <LayoutDashboard size={14} /> Overview
          </button>
          <button onClick={() => setView('workshops')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'workshops' ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <Database size={14} /> Workshop Registry
          </button>
      </div>

      {/* 🎬 WORKSHOP MANAGEMENT PREVIEW */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000">
          <Video size={240} />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Workshop Control</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono italic">Curriculum Node Synchronization Active</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setView('workshops')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2">
                <Database size={14} /> Registry Hub
             </button>
             <Link to={`/aca/${lang}/create`} className="flex items-center gap-3 px-6 py-3 bg-primary text-bg-dark rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                <Plus size={16} /> New Node
             </Link>
          </div>
        </div>

        {localLoading ? <Preloader message="Fetching Telemetry..." size="sm" /> : courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {courses.slice(0, 4).map((course) => (
              <div key={course.id} className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] flex flex-col justify-between gap-8 group/w hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-500 card-glow">
                <div className="flex items-start gap-8">
                  <div className="size-28 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shrink-0 relative group-hover/w:scale-105 transition-transform duration-700">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover/w:opacity-60 transition-opacity duration-700 grayscale group-hover/w:grayscale-0" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/w:opacity-100 transition-opacity duration-700">
                      <Play size={40} className="text-white fill-current drop-shadow-xl" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="text-2xl font-black uppercase text-white tracking-tighter leading-[0.9] italic group-hover/w:text-primary transition-colors">{course.title}</div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`px-4 py-1.5 glass-premium rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors ${
                        course.status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {course.status}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest italic pt-1">
                        <Users size={14} className="text-primary" /> Sync: {course.studentsCount || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => handleToggleStatus(course.id, course.status)}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 border ${
                      course.status === 'published' 
                        ? 'bg-white/5 text-white/40 border-white/10 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20' 
                        : 'bg-primary text-bg-dark border-primary/20 hover:scale-[1.02]'
                    }`}
                  >
                    {course.status === 'published' ? <><EyeOff size={16} /> Take Offline</> : <><Eye size={16} /> Deploy Workshop</>}
                  </button>
                  <Link 
                    to={`/aca/${lang}/course/${course.slug}/edit`}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border border-white/10 text-white/60 active:scale-95"
                  >
                    <Settings size={16} /> Config
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Video} message="Telemetry node offline: No workshops detected." link={`/aca/${lang}/create`} linkText="Initialize Curriculum" />}
      </motion.div>

      {/* 📊 REVENUE PERFORMANCE TELEMETRY */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000 grayscale group-hover:grayscale-0">
          <BarChart3 size={240} className="text-primary" />
        </div>
        
        <div className="relative z-10 space-y-1">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">Industrial Revenue Metrics</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono italic">Real-time Payout & Engagement Synchronization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { label: 'Platform Yield', value: '$4,120.00', sub: '↑ 12% vs Phase 19', accent: '#00f5d4', icon: TrendingUp },
            { label: 'Escrow Lock', value: '$840.00', sub: 'Verification Pending', accent: '#fbbf24', icon: Activity },
            { label: 'Ecosystem Nodes', value: '428', sub: 'Growth Index: 1.4', accent: '#00d2ff', icon: Users }
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] space-y-4 group/stat hover:bg-white/[0.06] transition-all duration-500 card-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <stat.icon size={64} style={{ color: stat.accent }} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover/stat:text-white/40 transition-colors">{stat.label}</div>
              <div className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</div>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest italic" style={{ color: stat.accent }}>
                <div className="size-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: stat.accent }} /> {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LecturerDashboard;
