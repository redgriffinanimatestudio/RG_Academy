import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Plus, BarChart3, Users, Play, ChevronRight, Settings, EyeOff, Eye } from 'lucide-react';
import { academyService } from '../../../../services/academyService';
import Preloader from '../../../../components/Preloader';
import NoDataPlaceholder from '../NoDataPlaceholder';

interface LecturerDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ view, accent, user, lang }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 🎬 WORKSHOP MANAGEMENT HUB */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000">
          <Video size={240} />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tight text-white italic">Workshop Control</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Curriculum Node Management</p>
          </div>
          <Link to={`/aca/${lang}/create`} className="flex items-center gap-3 px-8 py-4 bg-primary text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
            <Plus size={18} /> Deploy New Workshop
          </Link>
        </div>

        {localLoading ? <Preloader message="Fetching workshops..." size="sm" /> : courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {courses.map((course) => (
              <div key={course.id} className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] flex flex-col justify-between gap-8 group/w hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-500 card-glow">
                <div className="flex items-start gap-8">
                  <div className="size-28 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shrink-0 relative group-hover/w:scale-105 transition-transform duration-700">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover/w:opacity-60 transition-opacity duration-700" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/w:opacity-100 transition-opacity duration-700">
                      <Play size={40} className="text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="text-2xl font-black uppercase text-white tracking-tighter leading-[1.1] italic group-hover/w:text-primary transition-colors">{course.title}</div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 glass-premium rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors ${
                        course.status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {course.status}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                        <Users size={14} className="text-primary" /> Students: {course.studentsCount || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => handleToggleStatus(course.id, course.status)}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 border ${
                      course.status === 'published' 
                        ? 'bg-white/5 text-white/40 border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20' 
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
        ) : <NoDataPlaceholder icon={Video} message="You haven't created any workshops yet." link={`/aca/${lang}/create`} linkText="Start Teaching" />}
      </motion.div>

      {/* 📊 REVENUE PERFORMANCE NODE */}
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
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Real-time Payout Synchronization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { label: 'Total Earnings', value: '$4,120.00', sub: '↑ 12% vs Phase 19', accent: '#00f5d4' },
            { label: 'Pending Payout', value: '$840.00', sub: 'Escrow Lock active', accent: '#eff542' },
            { label: 'Active Students', value: '428', sub: 'Ecosystem growth active', accent: '#378add' }
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] space-y-4 group/stat hover:bg-white/[0.06] transition-all duration-500 card-glow">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover/stat:text-white/40 transition-colors">{stat.label}</div>
              <div className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</div>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest" style={{ color: stat.accent }}>
                <div className="size-1 rounded-full animate-pulse" style={{ backgroundColor: stat.accent }} /> {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LecturerDashboard;
