import React from 'react';
import { Briefcase, Clock, CheckCircle, Zap } from 'lucide-react';

interface StudioStatsProps {
  isExecutor: boolean;
}

export default function StudioStats({ isExecutor }: StudioStatsProps) {
  if (!isExecutor) return null;

  const stats = [
    { l: 'Open Requests', v: '124', i: Briefcase, c: 'text-primary' },
    { l: 'Your Active Bids', v: '3', i: Clock, c: 'text-sky-400' },
    { l: 'Success Rate', v: '98%', i: CheckCircle, c: 'text-emerald-400' },
    { l: 'Revenue Share', v: '$4.2k', i: Zap, c: 'text-amber-400' }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{s.l}</p>
            <p className="text-xl font-black text-white">{s.v}</p>
          </div>
          <s.i size={20} className={`${s.c} opacity-20 group-hover:opacity-100 transition-opacity`} />
        </div>
      ))}
    </section>
  );
}
