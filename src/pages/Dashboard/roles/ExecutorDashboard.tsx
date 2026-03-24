import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, Star, Zap, CheckCircle } from 'lucide-react';

import KanbanBoard from '../../../components/dashboard/KanbanBoard';

export default function ExecutorDashboard() {
  const stats = [
    { label: 'Active Jobs', value: '3', icon: Briefcase, color: 'text-primary' },
    { label: 'Revenue', value: '$4,250', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Rating', value: '4.9', icon: Star, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">Pro <span className="text-primary-hover">Workspace</span></h1>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Manage your production pipeline</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className="p-8 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">{s.label}</p>
              <p className="text-3xl font-black text-white mt-1">{s.value}</p>
            </div>
            <s.icon className={`${s.color} opacity-20`} size={32} />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Production Board</h2>
        <KanbanBoard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5">
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-8">Recent Payments</h2>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Zap size={16} /></div>
                  <span className="text-[10px] font-bold text-white/60 uppercase">Milestone Released</span>
                </div>
                <span className="text-xs font-black text-emerald-400">+$800.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
