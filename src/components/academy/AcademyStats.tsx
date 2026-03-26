import React from 'react';
import { motion } from 'framer-motion';
import { Video, Plus, BarChart3, BookOpen, Clock, GraduationCap, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AcademyStatsProps {
  isLecturer: boolean;
  isStudent: boolean;
  hasSynergySL: boolean;
}

export default function AcademyStats({ isLecturer, isStudent, hasSynergySL }: AcademyStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 sm:space-y-12 mx-2 sm:mx-0">
      {/* Lecturer Synergy Block */}
      {isLecturer && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-1 border border-indigo-500/20 bg-indigo-500/5 rounded-[2rem] sm:rounded-[2.5rem] backdrop-blur-xl mb-8 sm:mb-12 overflow-hidden"
        >
          <div className="p-4 sm:p-8 flex flex-col xl:flex-row items-center justify-between gap-6 sm:gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="size-12 sm:size-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <Video size={24} className="sm:size-32" />
              </div>
              <div>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">Creator Hub</h3>
                  {hasSynergySL && <span className="px-2 py-0.5 bg-indigo-500 text-white text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded shadow-lg shadow-indigo-500/20">Synergy Active</span>}
                </div>
                <p className="text-[8px] sm:text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                  {hasSynergySL ? 'Teacher & Student hybrid access' : 'Manage your workshops, students and revenue stream'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full xl:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                <Plus size={12} /> New Workshop
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                <BarChart3 size={12} /> Analytics
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Student Progress Synergy Block */}
      {isStudent && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-6 sm:space-y-8 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white italic">Keep Learning.</h3>
                <p className="text-[8px] sm:text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">Your last active workshop session</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-primary font-black text-xl sm:text-2xl tracking-tighter">
                84<span className="text-[8px] sm:text-[10px] uppercase text-white/20 ml-1 mt-1 sm:mt-2 tracking-widest">% done</span>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="size-12 sm:size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shrink-0"><BookOpen size={20} className="sm:size-24" /></div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs font-black text-white uppercase tracking-tight">UE5.4: Advanced Niagara Dynamics</div>
                  <div className="text-[8px] sm:text-[9px] text-white/40 uppercase font-bold mt-1">Lesson 14: Fluid Particle Manipulation</div>
                </div>
                <button className="w-full sm:w-auto px-6 py-2.5 bg-primary text-bg-dark rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Resume</button>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 size-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors" />
          </div>

          <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/20">Learning Stats</h4>
            <div className="space-y-4">
              {[
                { l: 'Workshops', v: '12', i: GraduationCap },
                { l: 'Hours Studied', v: '148h', i: Clock },
                { l: 'Certificates', v: '4', i: TrendingUp }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/40"><stat.i size={14} /><span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">{stat.l}</span></div>
                  <span className="text-xs font-black text-white uppercase">{stat.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
