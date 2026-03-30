import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Clock, 
  Star, 
  Zap, 
  Award, 
  Cpu, 
  TrendingUp, 
  Briefcase,
  CheckCircle2,
  Rocket,
  Shield,
  Box,
  ChevronRight
} from 'lucide-react';
import SkeletonNode from '../../../components/dashboard/SkeletonNode';

interface StudentDashboardProps {
  data?: any;
  user?: any;
  lang?: string;
  accent?: string;
  view?: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  data, 
  user, 
  lang = 'eng', 
  accent = 'primary', 
  view = 'overview' 
}) => {
  const stats = data?.stats;
  const techStack = data?.techStack || [];
  const activePipelines = data?.activePipelines || [];
  const certifications = data?.certifications || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!data) return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
      <SkeletonNode className="md:col-span-12 h-[300px] rounded-[3.5rem]" />
      <SkeletonNode className="md:col-span-8 h-[500px] rounded-[3.5rem]" />
      <SkeletonNode className="md:col-span-4 h-[500px] rounded-[3.5rem]" />
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-32"
    >
      {/* 🚀 1. MISSION CONTROL HERO (Bento: 12 units) */}
      <motion.div 
        variants={itemVariants}
        className="glass-industrial p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group shadow-2xl matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000 group-hover:scale-x-[-1.1] group-hover:rotate-12">
          <Rocket size={280} className="text-primary" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="size-40 rounded-[3rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_80px_rgba(0,255,157,0.15)] relative group-hover:scale-105 transition-transform duration-700">
               <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full animate-pulse" />
               <GraduationCap size={64} className="relative z-10" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.4em] border border-primary/20 shadow-lg shadow-primary/5">Neural Sync Activeinging</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-[0.85] text-white text-glow">Learning Nexus</h2>
              </div>
              <p className="text-lg font-bold text-white/30 leading-relaxed max-w-xl italic">
                Industrial Tier: <span className="text-primary">{stats?.rank || 'Initiate-01'}</span>. 
                Trajectory synchronization with <span className="text-white">RG Core-Node</span> is at <span className="text-primary">98.4% accuracy</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 shrink-0 w-full lg:w-72">
            {[
              { label: 'GPA SYNC', value: stats?.gpa || '5.0', accent: '#00f5d4' },
              { label: 'SKILL XP', value: stats?.xp || '250', accent: '#eff542' }
            ].map((s, i) => (
              <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center card-glow hover:bg-white/[0.06] transition-all group/s">
                <div className="text-5xl font-black text-white italic tracking-tighter group-hover/s:scale-110 transition-transform">{s.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: s.accent }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📊 2. SKILL ARCHITECTURE (Bento: 2 units) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 glass-industrial p-12 rounded-[3.5rem] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black uppercase tracking-tight flex items-center justify-center md:justify-start gap-4 text-white italic">
                <Cpu size={32} className="text-primary animate-pulse" /> Skill Architecture
              </h3>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 mt-2 font-mono">Level of Development: Multi-Vector Scaling</p>
            </div>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95">
              <TrendingUp size={16} /> Data Trajectory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techStack.map((skill: any, idx: number) => (
              <div key={idx} className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] space-y-6 group/skill hover:bg-white/[0.07] transition-all card-glow relative overflow-hidden">
                <div className="flex justify-between items-end relative z-10">
                  <div className="space-y-1">
                    <span className="text-[12px] font-black uppercase tracking-widest text-white/80">{skill.name}</span>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Node Ver. 4.02</p>
                  </div>
                  <div className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[11px] font-black text-primary uppercase shadow-lg shadow-primary/10">LOD {Math.round(skill.lod)}</div>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.min(100, (skill.lod / 500) * 100)}%` }}
                    className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full shadow-[0_0_15px_rgba(0,255,157,0.3)]" 
                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 📂 3. TRAJECTORY HUB (Bento: 1 unit) */}
        <motion.div 
          variants={itemVariants}
          className="glass-industrial p-12 rounded-[3.5rem] border border-white/5 flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-4 italic">
                <Award size={28} className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]" /> Vault
              </h3>
              <span className="text-[10px] font-black font-mono text-white/15 tracking-tighter uppercase px-3 py-1 border border-white/5 rounded-lg">Secured Node</span>
            </div>

            <div className="space-y-5">
              {certifications.length > 0 ? certifications.map((cert: any, i: number) => (
                <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-center gap-6 group/v hover:border-white/20 transition-all card-glow">
                  <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover/v:scale-110 transition-transform"><CheckCircle2 size={24} /></div>
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight leading-tight">{cert.title}</h4>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">Grade: <span className="text-primary">{cert.grade}%</span></p>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center opacity-10">
                  <Box size={64} className="mx-auto mb-6" />
                  <p className="text-[12px] font-black uppercase tracking-[0.3em] leading-relaxed">No Credentials <br/> Yet Partitioned</p>
                </div>
              )}
            </div>
          </div>

          <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-4 group/btn">
            Open Credential Vault <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
