import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  Trophy, 
  Target,
  ChevronRight,
  Star,
  BookOpen
} from 'lucide-react';

interface ProgressData {
  enrollments: any[];
  stats: {
    total: number;
    completed: number;
    avgProgress: number;
    gpa: number;
  };
}

const STU_LearningProgress: React.FC = () => {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/v1/academy/progress');
        const result = await response.json();
        if (result.success) setData(result.data);
      } catch (e) {
        console.error('Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-white/5 rounded-3xl border border-white/10" />
        ))}
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* ACADEMIC STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Overall GPA', value: data?.stats.gpa.toFixed(1), icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Active Courses', value: data?.stats.total, icon: PlayCircle, color: 'text-sky-400', bg: 'bg-sky-400/10' },
          { label: 'Completed', value: data?.stats.completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Avg. Progress', value: `${data?.stats.avgProgress}%`, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-400/10' }
        ].map((stat, i) => (
          <motion.div key={i} variants={item} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={48} />
            </div>
            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
              <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ENROLLED COURSES SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white">Current Curriculum</h2>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Status: Identity Sync Node Active</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">View All History</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data?.enrollments.map((enrollment, idx) => (
            <motion.div 
              key={enrollment.id}
              variants={item}
              className="group relative p-6 rounded-3xl border border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent hover:border-primary/20 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="size-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                  <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">{enrollment.course.category.name}</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter flex items-center gap-1"><Clock size={10} /> {enrollment.course.duration}</span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-primary transition-colors">{enrollment.course.title}</h3>
                </div>

                <div className="w-full md:w-64 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/40">Progress</span>
                    <span className="text-primary">{enrollment.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${enrollment.progress}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full" 
                    />
                  </div>
                </div>

                <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 group-hover:bg-primary group-hover:text-bg-dark group-hover:border-primary transition-all">
                  <PlayCircle size={24} />
                </button>
              </div>
            </motion.div>
          ))}
          
          {(!data?.enrollments || data.enrollments.length === 0) && (
            <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-dashed border-white/10">
                <BookOpen size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase text-white/40">No active courses</h3>
                <p className="text-xs text-white/20 uppercase font-medium max-w-xs">Your academic journey is empty. Visit the academy to enroll in professional tracks.</p>
              </div>
              <button className="px-8 py-3 rounded-xl bg-primary text-bg-dark font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-transform">Explore Academy</button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default STU_LearningProgress;
