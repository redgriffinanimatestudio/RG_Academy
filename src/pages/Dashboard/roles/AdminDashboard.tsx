import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Box, Zap, Activity } from 'lucide-react';

interface AdminDashboardProps {
  stats?: any;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Active Projects', value: stats?.activeProjects || 0, icon: Box, color: 'text-emerald-400' },
    { label: 'Platform Revenue', value: `$${stats?.revenue || 0}`, icon: Zap, color: 'text-amber-400' },
    { label: 'System Load', value: '0.42%', icon: Activity, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">Master Control <span className="text-red-500">Engine</span></h1>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Full access to Red Griffin Creative Ecosystem</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`${card.color} opacity-40 group-hover:opacity-100 transition-opacity`} size={20} />
              <div className="text-[9px] sm:text-[10px] font-black uppercase text-white/20 tracking-widest">{card.label}</div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{card.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] bg-white/[0.02] border border-white/5">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mb-6 sm:mb-8">System Activity</h2>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="size-8 sm:size-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary italic font-black text-xs sm:text-base">RG</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-bold text-white uppercase truncate">User Sync initiated</p>
                  <p className="text-[9px] sm:text-[10px] text-white/20 uppercase font-black mt-0.5 sm:mt-1">2 minutes ago • Service: Auth</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] bg-red-500/5 border border-red-500/10">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-red-500 mb-6 sm:mb-8">Security Alerts</h2>
          <div className="p-4 sm:p-6 bg-red-500/10 rounded-xl sm:rounded-2xl border border-red-500/20 text-red-200">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest">No threats detected</p>
            <p className="text-[9px] sm:text-[10px] mt-2 opacity-60">System status: Shield Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}
