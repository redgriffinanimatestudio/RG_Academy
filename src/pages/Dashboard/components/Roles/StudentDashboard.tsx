import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Zap, 
  Play, 
  ChevronRight, 
  ExternalLink,
  Target,
  Layers,
  Cpu,
  Monitor,
  Clock,
  LayoutDashboard,
  TrendingUp,
  BrainCircuit,
  Box as BoxIcon
} from 'lucide-react';
import { academyService } from '../../../../services/academyService';
import { dashboardService, StudentSummary } from '../../../../services/dashboardService';
import SkeletonNode from '../../../../components/dashboard/SkeletonNode';
import NoDataPlaceholder from '../NoDataPlaceholder';
import RadialProgress from '../RadialProgress';

interface StudentDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ view, accent, user, lang }) => {
  const [data, setData] = useState<StudentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await dashboardService.getStudentSummary();
        setData(res);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    }
    fetchData();
  }, [user?.id]);

  const enrollments = data?.enrollments || [];
  const stats = data?.stats;
  const techStack = data?.techStack || [];
  const latestEnrollment = enrollments[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-32 pt-8">
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <SkeletonNode className="md:col-span-8 h-[300px] rounded-[3.5rem]" />
            <SkeletonNode className="md:col-span-4 h-[300px] rounded-[3.5rem]" />
            <SkeletonNode className="md:col-span-12 h-[350px] rounded-[3.5rem]" />
            <SkeletonNode className="md:col-span-6 h-[500px] rounded-[3.5rem]" />
            <SkeletonNode className="md:col-span-6 h-[500px] rounded-[3.5rem]" />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* 🛸 1. TRAJECTORY HUB (Bento: 8 units) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-8 glass-industrial p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group matrix-grid-bg shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                <BrainCircuit size={240} />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="relative">
                  <div className="size-36 rounded-[2.5rem] bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_60px_rgba(0,255,157,0.3)] group-hover:scale-110 transition-transform duration-700">
                    <Target size={56} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 glass-premium rounded-lg text-[8px] font-black uppercase text-primary border border-primary/20">
                    Active Sync
                  </div>
                </div>
                
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <div className="size-2 rounded-full bg-primary animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Neural Synchronization Active</span>
                    </div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-white lg:text-6xl">
                      Trajectory: <span className="text-primary">{stats?.rank || 'Initiate'}</span>
                    </h2>
                  </div>
                  <p className="text-sm lg:text-base font-bold text-white/40 leading-relaxed max-w-xl">
                    Dynamic Optimization Engine: <span className="text-white">Industrial Tier {stats?.xp && stats.xp > 1000 ? 3 : 1}</span>. 
                    Real-time synchronization with <Link to="/studio" className="text-primary hover:underline">Studio Production Pipelines</Link>.
                  </p>
                  <div className="flex flex-wrap gap-5 pt-4 justify-center md:justify-start">
                    <Link to={`/aca/${lang}/trajectory`} className="px-10 py-5 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">Expand Roadmap</Link>
                    <Link to={`/learn/${lang}/ai-mentor`} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 active:scale-95 transition-all flex items-center gap-3">
                      <Cpu size={16} /> AI Mentor Node
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 📊 2. MASTERY NODE (Bento: 4 units) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-4 glass-industrial p-10 rounded-[3.5rem] border border-white/5 flex flex-col justify-between group hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors border border-white/10">
                  <TrendingUp size={24} />
                </div>
                <div className="px-4 py-2 glass-premium border border-primary/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary shadow-lg shadow-primary/10">
                  Industrial GPA: {stats?.gpa || '0.0'}
                </div>
              </div>
              
              <div className="space-y-2 mt-8 relative z-10">
                <div className="text-7xl font-black text-white tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{stats?.xp || 0}</div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Skill Points (XP) Registered</p>
              </div>
 
              <div className="grid grid-cols-2 gap-6 pt-10 mt-6 border-t border-white/5 relative z-10">
                <div className="space-y-1">
                  <span className="block text-2xl font-black text-white">{stats?.completedEnrollments || 0}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Modules Finalized</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-2xl font-black text-white">{stats?.avgProgress || 0}%</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Platform Avg</span>
                </div>
              </div>
            </motion.div>

            {/* 🚀 3. MISSION CONTROL: RESUME (Bento: 12 units) */}
            {latestEnrollment && (
              <motion.div 
                variants={itemVariants}
                className="md:col-span-12 relative p-[1px] bg-gradient-to-r from-primary via-white/20 to-primary rounded-[4rem] shadow-2xl shadow-primary/10 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-bg-dark/90 backdrop-blur-3xl m-[1px] rounded-[3.95rem]" />
                <div className="relative p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="size-56 rounded-[3.5rem] overflow-hidden border border-white/10 relative group-hover:scale-105 transition-transform duration-700 shadow-2xl">
                      <img src={latestEnrollment.course.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" />
                      <div className="absolute inset-0 flex items-center justify-center bg-bg-dark/40 group-hover:bg-transparent transition-colors">
                        <Play size={64} className="text-white fill-current drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
                      </div>
                    </div>
                    
                    <div className="space-y-5 text-center lg:text-left">
                      <div className="flex items-center gap-3 text-primary justify-center lg:justify-start pr-4">
                        <Zap size={20} className="animate-pulse" />
                        <span className="text-[13px] font-black uppercase tracking-[0.4em]">Mission Control: Resume Hub</span>
                      </div>
                      <h3 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] max-w-2xl italic">{latestEnrollment.course.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 pt-3 justify-center lg:justify-start">
                        <div className="flex items-center gap-2 px-5 py-2.5 glass-premium rounded-xl border border-white/10">
                          <Clock size={16} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/80">LMS NODE: {latestEnrollment.course.level}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-l border-white/10 pl-4">Last sync: Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-8 min-w-[280px]">
                    <div className="space-y-4 text-center group/progress">
                      <RadialProgress progress={latestEnrollment.progress} size={130} strokeWidth={12} color="#00ff9d" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover/progress:text-primary transition-colors">Integration: {latestEnrollment.progress}%</p>
                    </div>
                    <Link to={`/learn/${lang}/${latestEnrollment.course.slug}`} className="w-full px-12 py-7 bg-white text-bg-dark rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] group/btn">
                      Resume Integration <ChevronRight className="inline-block ml-3 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 🍱 4. ACTIVE FLOWS (Bento: 6 units) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-6 glass-industrial rounded-[3.5rem] p-10 space-y-10 min-h-[500px] border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-white italic">
                    <Layers size={26} className="text-primary animate-pulse" /> Active Pipelines
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Mission Telemetry Link-V1</p>
                </div>
                <Link to={`/aca/${lang}`} className="px-6 py-2.5 glass-premium border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  Catalog Hub
                </Link>
              </div>
              
              <div className="space-y-5 max-h-[420px] overflow-y-auto pr-3 custom-scrollbar relative z-10">
                {enrollments.length > 0 ? enrollments.map((enr, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="p-6 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-between group/e hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 card-glow"
                  >
                    <div className="flex items-center gap-6">
                      <div className="size-20 rounded-[1.5rem] overflow-hidden border border-white/5 relative group-hover/e:scale-105 transition-transform duration-500 shadow-xl">
                        <img src={enr.course.thumbnail} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover/e:bg-transparent transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-white uppercase tracking-tight line-clamp-1 group-hover/e:text-primary transition-colors">{enr.course.title}</h4>
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-0.5 glass-premium rounded-md text-[9px] font-black uppercase tracking-widest text-primary border border-primary/20">{enr.course.level}</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">VFX TIER-03</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right space-y-1">
                        <span className="block text-sm font-black font-mono text-white/80 group-hover/e:text-white transition-colors">{enr.progress}%</span>
                        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${enr.progress}%` }} />
                        </div>
                      </div>
                      <Link to={`/learn/${lang}/${enr.course.slug}`} className="size-14 glass-premium rounded-2xl flex items-center justify-center text-white/20 group-hover/e:bg-primary group-hover/e:text-bg-dark transition-all duration-500 shadow-xl">
                        <ChevronRight size={24} className="group-hover/e:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )) : <NoDataPlaceholder icon={BookOpen} message="No active workshops found." link={`/aca/${lang}`} linkText="Explore Academy" />}
              </div>
            </motion.div>

            {/* 🏗️ 5. TECH STACK LOD: SKILL TREE (Bento: 6 units) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-6 glass-industrial rounded-[3.5rem] p-10 space-y-12 min-h-[500px] relative overflow-hidden border border-white/5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-white italic">
                    <Monitor size={26} className="text-primary animate-pulse" /> Skill Architecture
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Competency LOD Engine v2.0</p>
                </div>
                <button className="px-5 py-2 glass-premium border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-3 group/3d">
                  <BoxIcon size={14} className="group-hover/3d:rotate-90 transition-transform duration-500" /> View 3D Mesh
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-8 relative z-10">
                {techStack.length > 0 ? techStack.slice(0, 5).map((skill, idx) => (
                  <div key={idx} className="space-y-4 group/s">
                    <div className="flex justify-between items-end px-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_#00ff9d]" />
                          <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80 group-hover/s:text-white transition-colors">{skill.name}</span>
                        </div>
                        <p className="text-[8px] font-black text-white/10 uppercase tracking-widest ml-4 italic">Industrial Proficiency Layer</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-black font-mono text-primary drop-shadow-[0_0_8px_rgba(0,255,157,0.4)]">LOD {Math.round(skill.lod)}</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-white/[0.03] rounded-full overflow-hidden p-[3px] border border-white/5 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (skill.lod / 500) * 100)}%` }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 + idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-full shadow-[0_0_15px_rgba(0,255,157,0.4)]" 
                      />
                    </div>
                  </div>
                )) : ['3ds Max', 'UE5', 'Revit', 'Substance'].map((s, i) => (
                  <div key={i} className="opacity-10 flex justify-between text-[11px] font-black uppercase tracking-[0.4em]">
                    <span>{s} Telemetry Offline</span>
                    <span>LOD 000</span>
                  </div>
                ))}
              </div>
 
              {/* STUDIO SYNC HOOK */}
              <div className="pt-8">
                <div className="p-10 bg-primary rounded-[3rem] flex items-center justify-between group/hook overflow-hidden relative active:scale-95 transition-all cursor-pointer shadow-[0_20px_40px_rgba(0,255,157,0.2)]">
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover/hook:translate-x-0 transition-transform duration-700" />
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 bg-bg-dark rounded-full" />
                      <h4 className="text-2xl font-black text-bg-dark uppercase tracking-tighter italic">Recruitment Integration</h4>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-bg-dark/40 max-w-[240px] leading-tight">Push your skill architecture to the talent matrix for automated matching</p>
                  </div>
                  <div className="size-16 rounded-[1.5rem] bg-bg-dark text-white flex items-center justify-center shadow-2xl relative z-10 group-hover/hook:scale-110 transition-transform duration-500">
                    <Award size={28} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
