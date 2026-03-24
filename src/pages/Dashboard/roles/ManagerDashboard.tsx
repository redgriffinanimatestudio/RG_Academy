import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Shield, Clock, AlertTriangle } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">Ops <span className="text-primary">Control</span></h1>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Platform oversight & Operations</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending Reviews', value: '12', icon: Clock, color: 'text-amber-400' },
          { label: 'Platform Users', value: '4.2k', icon: Users, color: 'text-primary' },
          { label: 'Active Escrows', value: '$12.4k', icon: Shield, color: 'text-emerald-400' },
          { label: 'Reports', value: '2', icon: AlertTriangle, color: 'text-rose-400' },
        ].map((s, i) => (
          <div key={s.label} className="p-8 rounded-3xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <s.icon className={s.color} size={20} />
              <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Live</span>
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5">
        <h2 className="text-xl font-black uppercase tracking-tight text-white mb-8">Management Queue</h2>
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xs">!</div>
              <div>
                <p className="text-xs font-bold text-white uppercase">Course Approval Required</p>
                <p className="text-[10px] text-white/20 uppercase font-black mt-1 italic">From: Artist_X • Category: VFX</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}
