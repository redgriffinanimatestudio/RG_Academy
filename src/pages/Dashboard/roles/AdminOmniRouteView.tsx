import React, { useState, useEffect } from 'react';
import { 
  Zap, Activity, Cpu, Box, Shield, 
  Terminal, Globe, Server, CheckCircle, 
  AlertCircle, RefreshCw, Layers, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../../components/dashboard/shared/DashboardUI';
import { adminService } from '../../../services/adminService';
import Preloader from '../../../components/Preloader';

export default function AdminOmniRouteView() {
  const [data, setData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [stats, auditLogs] = await Promise.all([
        adminService.getOmniStats(),
        adminService.getOmniLogs()
      ]);
      setData(stats);
      setLogs(auditLogs);
    } catch (err) {
      console.error('[OmniView] Sync failed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-sync every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
      <Preloader size="lg" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Synchronizing AI Core...</p>
    </div>
  );

  const statsCards = [
    { label: 'Active Providers', value: data?.stats?.activeProviders?.length || 0, sub: 'Global Matrix', icon: Globe, color: '#00f5d4' },
    { label: 'Total Models', value: data?.stats?.totalModels || 0, sub: 'Neural Density', icon: Cpu, color: '#378add' },
    { label: 'Core Latency', value: data?.stats?.latency || '0ms', sub: 'Signal Timing', icon: Activity, color: '#ef4444' },
    { label: 'Network Uptime', value: data?.stats?.uptime || '0%', sub: 'Zero Drift', icon: Shield, color: '#fbbf24' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
      {/* 🚀 HEADER: OMNICORE COMMAND */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">Gateway: {data?.gateway || 'Nominal'}</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white italic leading-none lg:text-7xl">
            Omni<span className="text-emerald-500">Route</span> <span className="text-white/20">Core</span>
          </h1>
          <div className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-3">
            <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
            AI Infrastructure Monitoring • {data?.url || 'http://localhost:4000'}
          </div>
        </div>
        <button 
          onClick={fetchData}
          disabled={refreshing}
          className="px-8 py-4 glass-industrial border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white active:text-bg-dark transition-all flex items-center gap-3"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Manual Pulse
        </button>
      </header>

      {/* 📊 TELEMETRY BENTO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, i) => (
          <GlassCard key={i} className="!p-10 border-white/5 group hover:border-emerald-500/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all duration-700">
               <card.icon size={100} style={{ color: card.color }} />
            </div>
            <div className="relative z-10 space-y-4">
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">{card.label}</span>
               <div className="text-5xl font-black text-white italic tracking-tighter">{card.value}</div>
               <div className="flex items-center gap-2 text-[8px] font-bold text-white/10 uppercase tracking-widest">
                  <div className="size-1 rounded-full bg-emerald-500" /> {card.sub}
               </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🧠 PROVIDER MATRIX */}
        <div className="lg:col-span-8 space-y-8">
          <GlassCard className="!p-12 space-y-10 border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 matrix-grid-bg opacity-5" />
            
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight text-white italic">Provider <span className="text-emerald-500/40">Matrix</span></h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {Object.entries(data?.stats?.providerCounts || {}).map(([p, count]: [string, any]) => (
                <div key={p} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group/p hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                       <Layers size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase italic tracking-tight">{p}</h4>
                      <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{count} Operational Nodes</p>
                    </div>
                  </div>
                  <CheckCircle size={18} className="text-emerald-500/40 group-hover/p:text-emerald-500 transition-colors" />
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="!p-10 border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic flex items-center gap-3">
                <Terminal size={14} className="text-emerald-500" /> Audit Ledger
              </h4>
              <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">Real-time Event Stream</span>
            </div>
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className={`size-2 rounded-full ${log.type === 'warning' ? 'bg-rose-500' : log.type === 'success' ? 'bg-emerald-500' : 'bg-sky-500'} animate-pulse`} />
                    <div>
                      <p className="text-[11px] font-black text-white uppercase italic tracking-tight">{log.action}</p>
                      <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">{log.node} • {log.timestamp}</p>
                    </div>
                  </div>
                  <Terminal size={12} className="text-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 🛠️ QUICK CONTROLS */}
        <aside className="lg:col-span-4 space-y-6">
           <GlassCard className="!p-10 space-y-8 bg-emerald-500/[0.03] border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <Cpu size={28} className="text-emerald-500" />
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Master Routing</div>
                  <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em]">Protocol v5.0</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-black uppercase tracking-tighter text-white italic leading-none">Core <br/> <span className="text-emerald-500">Override</span></h4>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] italic leading-relaxed">
                  Unified AI routing engine is functional. All requests proxied via RG-CORE-TX layer.
                </p>
              </div>
              <div className="pt-4 space-y-3">
                <button className="w-full py-5 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                  Test Connectivity
                </button>
                <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:bg-white/10 hover:text-white transition-all">
                  Clear Node Cache
                </button>
              </div>
           </GlassCard>

           <GlassCard className="!p-10 border-white/5 space-y-6 group">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Activity size={20} className="text-emerald-500 animate-pulse" />
                    <div>
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40">Model Flux</h5>
                       <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Load Balancing</p>
                    </div>
                 </div>
                 <span className="text-xl font-black text-emerald-500 italic">SYNC</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              </div>
              <p className="text-[8px] text-white/20 font-black uppercase tracking-widest italic text-center">Neural Traffic: Opt-In Optimized</p>
           </GlassCard>
        </aside>
      </div>
    </div>
  );
}
