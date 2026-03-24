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
    <div className="space-y-12">
      {/* Lecturer Synergy Block */}
      {isLecturer && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-1 border border-indigo-500/20 bg-indigo-500/5 rounded-[2.5rem] backdrop-blur-xl mb-12 overflow-hidden"
        >
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="size-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <Video size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">Creator Hub</h3>
                  {hasSynergySL && <span className="px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-lg shadow-indigo-500/20">Synergy Active</span>}
                </div>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                  {hasSynergySL ? 'Видит студентов — и сам является студентом' : 'Manage your workshops, students and revenue stream'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                <Plus size={14} /> New Workshop
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                <BarChart3 size={14} /> Analytics
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20">
                My Creations
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Student Progress Synergy Block */}
      {isStudent && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-8 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white italic">Keep Learning.</h3>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">Your last active workshop session</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-black text-2xl tracking-tighter">
                84<span className="text-[10px] uppercase text-white/20 ml-1 mt-2 tracking-widest">% done</span>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10"><BookOpen size={24} /></div>
                <div className="flex-1">
                  <div className="text-xs font-black text-white uppercase tracking-tight">UE5.4: Advanced Niagara Dynamics</div>
                  <div className="text-[9px] text-white/40 uppercase font-bold mt-1">Lesson 14: Fluid Particle Manipulation</div>
                </div>
                <button className="px-6 py-2.5 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Resume</button>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 size-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors" />
          </div>

          <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Learning Stats</h4>
            <div className="space-y-4">
              {[
                { l: 'Workshops', v: '12', i: GraduationCap },
                { l: 'Hours Studied', v: '148h', i: Clock },
                { l: 'Certificates', v: '4', i: TrendingUp }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/40"><stat.i size={14} /><span className="text-[9px] font-black uppercase tracking-widest">{stat.l}</span></div>
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
