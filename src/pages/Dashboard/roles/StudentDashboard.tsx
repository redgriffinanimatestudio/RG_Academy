import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, GraduationCap, PlayCircle } from 'lucide-react';

interface StudentDashboardProps {
  data?: any;
}

export default function StudentDashboard({ data }: StudentDashboardProps) {
  const stats = [
    { label: 'Workshops', value: data?.stats?.courses || 0, icon: GraduationCap },
    { label: 'Hours', value: '14h', icon: Clock },
    { label: 'Certificates', value: '2', icon: Award },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">Learning <span className="text-primary">Hub</span></h1>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Continue your creative journey</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-white/20 tracking-widest">{s.label}</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{s.value}</p>
            </div>
            <s.icon className="text-primary opacity-20" size={28} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">Current Progress</h2>
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="size-12 sm:size-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><BookOpen size={20} /></div>
                <div className="min-w-0">
                  <h3 className="font-black text-white uppercase text-xs sm:text-sm truncate">UE5.4: Advanced Dynamics</h3>
                  <p className="text-[9px] sm:text-[10px] text-white/40 uppercase font-bold mt-1">Next: Lesson 14 — Fluid Simulations</p>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-primary italic">84%</div>
            </div>
            <div className="h-1.5 sm:h-2 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
              <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-primary" />
            </div>
            <button className="mt-6 sm:mt-8 w-full py-3 sm:py-4 bg-primary text-bg-dark rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Resume Learning</button>
          </div>
        </div>

        <div className="p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] bg-white/[0.02] border border-white/5">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mb-6 sm:mb-8">Schedule</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="p-4 rounded-xl sm:rounded-2xl bg-white/5 border-l-4 border-primary">
              <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase">Today • 18:00</p>
              <p className="text-xs font-bold text-white mt-1 uppercase">Live Q&A with Senior TD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
