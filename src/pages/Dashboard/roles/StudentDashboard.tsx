import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, GraduationCap } from 'lucide-react';
import { StatCard, SectionHeader, GlassCard } from '../../../components/dashboard/shared/DashboardUI';

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
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">
          Learning <span className="text-primary">Hub</span>
        </h1>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">
          Continue your creative journey
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader title="Current Progress" />
          <GlassCard variant="dark" className="group relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-white uppercase text-sm truncate">UE5.4: Advanced Dynamics</h3>
                  <p className="text-[10px] text-white/40 uppercase font-black mt-1">Next: Lesson 14 — Fluid Simulations</p>
                </div>
              </div>
              <div className="text-2xl font-black text-primary italic">84%</div>
            </div>
            
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '84%' }} 
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
              />
            </div>
            
            <button className="mt-8 w-full py-4 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
              Resume Learning
            </button>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <SectionHeader title="Schedule" />
          <GlassCard className="space-y-4">
            {[
              { time: 'Today • 18:00', title: 'Live Q&A with Senior TD', color: 'primary' },
              { time: 'Tomorrow • 10:00', title: 'Portfolio Review', color: 'white/20' }
            ].map((event, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border-l-4 border-primary/50 hover:bg-white/[0.08] transition-colors cursor-pointer">
                <p className="text-[10px] font-black text-primary uppercase">{event.time}</p>
                <p className="text-xs font-bold text-white mt-1 uppercase tracking-tight">{event.title}</p>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
