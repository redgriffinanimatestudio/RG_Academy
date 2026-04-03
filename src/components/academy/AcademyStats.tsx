import React from 'react';
import { motion } from 'framer-motion';
import { Video, Plus, BarChart3, BookOpen, Clock, GraduationCap, TrendingUp, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

interface AcademyStatsProps {
  isLecturer: boolean;
  isStudent: boolean;
  hasSynergySL: boolean;
}

export default function AcademyStats({ isLecturer, isStudent, hasSynergySL }: AcademyStatsProps) {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <div className="space-y-12 sm:space-y-16 mx-2 sm:mx-0">
      {/* 🛠️ Lecturer Synergy Block: THE WORKSHOP */}
      {isLecturer && (
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-1 border border-primary/20 bg-primary/5 rounded-[2.5rem] sm:rounded-[3.5rem] backdrop-blur-3xl mb-12 sm:mb-16 overflow-hidden relative"
        >
          {/* Background Matrix Pulse */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="p-6 sm:p-12 flex flex-col xl:flex-row items-center justify-between gap-8 sm:gap-12 text-center sm:text-left relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <div className="size-16 sm:size-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] group transition-all hover:scale-110">
                <Video size={36} className="sm:size-48 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white italic">Academy Workshop.</h3>
                  {hasSynergySL && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-[0.2em] rounded-md shadow-xl shadow-primary/20">
                      <Zap size={10} fill="currentColor" />
                      Synergy_Active
                    </div>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-white/30 font-black uppercase tracking-[0.3em] leading-relaxed">
                  {hasSynergySL ? 'Dual-Node Authorization: Lecturer & Student' : 'Industrial control for workshops, student metrics, and financial yield.'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full xl:w-auto">
              <Link to={`/aca/${lang || 'eng'}/workshop`} className="flex-1 sm:flex-none">
                <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-bg-dark transition-all text-white group">
                  <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Initialize New Workshop
                </button>
              </Link>
              <Link to={`/aca/${lang || 'eng'}/workshop`} className="flex-1 sm:flex-none">
                <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                  <BarChart3 size={14} /> Global Analytics
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🧬 Student Progress Block: THE NEXUS */}
      {isStudent && (
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10">
          <div className="lg:col-span-3 p-8 sm:p-14 rounded-[3rem] sm:rounded-[4.5rem] bg-[#050505] border border-white/5 space-y-8 sm:space-y-12 relative overflow-hidden group shadow-2xl">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -left-24 size-96 bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-colors pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between relative z-10 gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white italic leading-none">Neural Persistence.</h3>
                <p className="text-[10px] sm:text-xs text-white/20 font-black uppercase tracking-[0.4em]">Active Node Session Tracking</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2 text-primary font-black text-4xl sm:text-6xl tracking-tighter drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                  84<span className="text-xs sm:text-sm uppercase text-white/30 ml-1 tracking-[0.2em] italic">%_Sync</span>
                </div>
                <div className="w-32 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-primary" />
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-6 p-6 sm:p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 backdrop-blur-md group/lesson hover:border-primary/20 transition-all">
                <div className="size-16 sm:size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 group-hover/lesson:scale-110 transition-transform">
                  <BookOpen size={28} className="sm:size-40" />
                </div>
                <div className="flex-1 text-center lg:text-left space-y-2">
                  <div className="text-[12px] sm:text-sm font-black text-white uppercase tracking-tight italic">UE5.4: Advanced Niagara Dynamics</div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-2">
                      <div className="size-1 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Lesson 14: Fluid Manipulation</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => {}} className="w-full lg:w-auto px-10 py-4 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">Resume Session</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 p-8 sm:p-14 rounded-[3rem] sm:rounded-[4.5rem] bg-white/[0.02] border border-white/5 space-y-10 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Biometric_Stats</h4>
              <div className="h-px bg-white/5 w-12" />
            </div>
            <div className="space-y-8">
              {[
                { l: 'Workshops', v: '12', i: GraduationCap, c: 'text-primary' },
                { l: 'Synapse Hours', v: '148h', i: Clock, c: 'text-white/40' },
                { l: 'Certificates', v: '04', i: TrendingUp, c: 'text-white/40' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between group/stat">
                  <div className="flex items-center gap-4 text-white/40 group-hover/stat:text-white transition-colors">
                    <stat.i size={16} className={stat.c} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.l}</span>
                  </div>
                  <span className="text-sm font-black text-white uppercase tabular-nums">{stat.v}</span>
                </div>
              ))}
            </div>
            <div className="pt-6">
               <div className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em] text-center">System_Nominal</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
