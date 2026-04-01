import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Cpu, 
  BarChart3, 
  AlertTriangle, 
  Target, 
  Zap, 
  Globe, 
  TrendingUp, 
  PieChart, 
  ShieldCheck,
  Rocket,
  Diamond,
  Activity
} from 'lucide-react';
import { StatCard, SectionHeader, GlassCard } from '../../../components/dashboard/shared/DashboardUI';
import { adminService } from '../../../services/adminService';
import { moderationService, Report } from '../../../services/moderationService';
import Preloader from '../../../components/Preloader';
import NoDataPlaceholder from '../components/NoDataPlaceholder';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function ManagerDashboard({ view: activeView = 'overview' }: { view?: string }) {
  const { activeRole } = useAuth();
  const [, setSearchParams] = useSearchParams();

  const setView = (v: string) => {
    setSearchParams(prev => {
        prev.set('view', v);
        return prev;
    });
  };
  const [reports, setReports] = useState<Report[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [chiefStats, setChiefStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isChief = activeRole === 'chief_manager' || activeRole === 'admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const promises: Promise<any>[] = [
        moderationService.getReports(),
        adminService.getStats()
      ];

      if (isChief) {
        promises.push(adminService.getChiefSummary());
      }

      const [rRes, sRes, cRes] = await Promise.all(promises);
      
      setReports(Array.isArray(rRes) ? rRes : []);
      setAdminStats(sRes);
      if (isChief) setChiefStats(cRes);
    } catch (err) {
      console.error('[Manager Hub] Sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeRole]);

  const stats = [
    { label: 'Platform Load', value: '32%', icon: Cpu, color: 'primary', sub: 'Normative' },
    { label: 'Active Nodes', value: adminStats?.totalUsers?.toLocaleString() || '---', icon: Users, color: 'sky-400', sub: 'Global Pulse' },
    { label: 'Operational Rev', value: `$${(adminStats?.totalRevenue || 0).toLocaleString()}`, icon: BarChart3, color: 'emerald-400', sub: 'Platform Gross' },
    { label: 'System Alerts', value: reports.length.toString(), icon: AlertTriangle, color: 'rose-400', sub: 'Action required' },
  ];

  if (loading) return (
    <div className="py-40 flex flex-col items-center justify-center">
      <Preloader message="Synchronizing Command Chain..." size="lg" />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">
            {isChief ? 'Chief' : 'Strategic'} <span className="text-primary">Ops Hub</span>
          </h1>
          <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-primary animate-ping" />
            Industrial Node: COMMAND-CHAIN-v2.5 • Auth: {activeRole?.toUpperCase()}
          </div>
        </div>
        
        <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl shrink-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'reviews', label: 'Pipeline' },
            ...(isChief ? [{ id: 'strategy', label: 'Strategy' }] : [])
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeView === tab.id ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 📡 GLOBAL TELEMETRY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} color={card.color.split('-')[0]} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {activeView === 'overview' && (
            <>
              {/* 📋 MAIN OPERATIONAL ZONE */}
              <div className="lg:col-span-8 space-y-8">
                <SectionHeader title="Operational Pipeline" subtitle="Queue of items requiring manual manager intervention" />
                <div className="space-y-4">
                  {reports.length > 0 ? reports.map((item) => (
                    <GlassCard key={item.id} className="group hover:bg-white/[0.04] transition-all relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-full" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-6">
                          <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-primary/20 transition-all">
                            <Zap size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-black text-white uppercase tracking-tight">{item.reason || 'Incident Report'}</span>
                              <span className="text-[8px] font-black text-white/20 font-mono italic whitespace-nowrap uppercase">REF: {item.id.slice(-8)}</span>
                            </div>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1 italic">
                              Node Type: {item.targetType} • Signal: <span className="text-white/60">{item.reporter?.displayName || 'Unknown Entity'}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/60 hover:bg-primary hover:text-bg-dark transition-all shadow-sm active:scale-95">
                            Resolve Node
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  )) : (
                    <NoDataPlaceholder icon={Target} message="Operational pipeline at zero load." link="/dashboard" linkText="Re-Scan Network" />
                  )}
                </div>
              </div>

              {/* 🛡️ STRATEGIC INTELLIGENCE */}
              <div className="lg:col-span-4 space-y-8">
                <SectionHeader title="System Insights" />
                <div className="space-y-6">
                  <GlassCard className="relative overflow-hidden group border-white/5 bg-white/[0.01]">
                    <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 -translate-y-4">
                      <Globe size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Regional Distribution</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Europe / CIS', p: 48 },
                          { label: 'Americas', p: 32 },
                          { label: 'Asia / MENA', p: 20 }
                        ].map((reg, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/60">
                              <span>{reg.label}</span>
                              <span className="text-primary italic">{reg.p}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${reg.p}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="bg-primary/[0.02] border-primary/20 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <ShieldCheck size={40} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-primary shadow-[0_0_12px_#00f5d4] animate-pulse" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Industrial Oversight Action</h4>
                    </div>
                    <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-widest italic">
                      Macro-economic sync required. Platform throughput has exceeded safety margins. Authorize treasury rebalance.
                    </p>
                    <button className="w-full py-4 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 active:scale-95">
                      Authorize Rebalance
                    </button>
                  </GlassCard>
                </div>
              </div>
            </>
          )}

          {activeView === 'reviews' && (
            <div className="lg:col-span-12">
               <SectionHeader title="Master Review Matrix" subtitle="Comprehensive content and user audit pipeline" />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {reports.map((report) => (
                    <GlassCard key={report.id} className="p-8 space-y-6 border-white/5 hover:border-primary/20 transition-all group">
                      <div className="flex justify-between items-start">
                        <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                          <Activity size={20} />
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${report.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white">{report.targetType} Audit Node</h4>
                        <p className="text-[10px] text-white/40 font-bold leading-relaxed line-clamp-3 italic">"{report.reason}"</p>
                      </div>
                      <button className="w-full py-3 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all">Inspect Node</button>
                    </GlassCard>
                  ))}
               </div>
            </div>
          )}

          {activeView === 'strategy' && isChief && (
            <div className="lg:col-span-12 space-y-12">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <GlassCard className="p-10 space-y-8 !bg-primary/[0.02] border-primary/20 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 text-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-y-4">
                        <TrendingUp size={100} />
                     </div>
                     <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                        <div className="space-y-2">
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Financial Vector</span>
                           <h3 className="text-4xl font-black italic tracking-tighter text-white">
                              ${chiefStats?.quarterlyRevenue?.toLocaleString() || '72,440'}
                           </h3>
                           <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">↑ +18% VS LAST QUARTER</p>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                              <span>Quarter Progress</span>
                              <span>91%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '91%' }} className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]" />
                           </div>
                        </div>
                     </div>
                  </GlassCard>

                  <GlassCard className="lg:col-span-2 p-10 space-y-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PieChart size={100} />
                     </div>
                     <div className="relative z-10 space-y-8">
                        <div className="flex justify-between items-center">
                           <SectionHeader title="Department KPI Sync" subtitle="Vertical performance tracking across enterprise nodes" />
                           <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                              <ShieldCheck className="text-primary size-5" />
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {[
                              { label: 'Academy — Units Published', val: chiefStats?.academyKpi || '312', trend: '↑ +18', color: 'text-primary' },
                              { label: 'Studio — Projects Closed', val: chiefStats?.studioKpi || '143', trend: '↑ +22', color: 'text-sky-400' },
                              { label: 'Support — SLA Accuracy', val: chiefStats?.supportKpi || '91%', trend: '↑ +3%', color: 'text-amber-400' },
                              { label: 'Finance — Sync Latency', val: chiefStats?.financeKpi || '0.4s', trend: '↓ −0.2s', color: 'text-emerald-400' }
                           ].map((kpi, i) => (
                              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/10 transition-all">
                                 <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 italic">{kpi.label}</div>
                                 <div className="flex items-center justify-between">
                                    <div className="text-3xl font-black text-white italic tracking-tighter">{kpi.val}</div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${kpi.color}`}>{kpi.trend}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </GlassCard>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-8">
                    <GlassCard className="!p-12 space-y-10 relative overflow-hidden">
                       <div className="absolute bottom-0 right-0 p-16 opacity-5 rotate-12">
                          <Rocket size={300} className="text-primary" />
                       </div>
                       <div className="relative z-10 space-y-8">
                          <div>
                             <h3 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">Macro Intelligence <br/><span className="text-primary">Forecast.</span></h3>
                             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-4">Predictive Analytics Hub Node V2.0</p>
                          </div>
                          <p className="text-sm font-medium text-white/40 leading-relaxed max-w-2xl italic">
                             Sentinel intelligence suggests a <span className="text-white">12% throughput acceleration</span> in the Academy sector following the Niagara Dynamics workshop launch. Enterprise revenue forecast adjusted to <span className="text-primary">$84.2K</span> for the subsequent rotation.
                          </p>
                          <div className="flex flex-wrap gap-4 pt-4">
                             <button className="px-10 py-4 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-white/5">Generate Report</button>
                             <button className="px-10 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all">Sync Ledger</button>
                          </div>
                       </div>
                    </GlassCard>
                 </div>
                 <div className="lg:col-span-4 grid grid-cols-1 gap-8">
                    <div className="p-10 rounded-[3rem] bg-indigo-500/10 border border-indigo-500/20 flex flex-col justify-between group cursor-pointer hover:bg-indigo-500/20 transition-all">
                       <div className="flex justify-between items-start">
                          <Diamond className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-black uppercase text-indigo-400/60 tracking-widest italic">Tier: Executive</span>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Authorized Access</p>
                          <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Staff Registry</h4>
                       </div>
                    </div>
                    <div className="p-10 rounded-[3rem] bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between group cursor-pointer hover:bg-emerald-500/20 transition-all">
                       <div className="flex justify-between items-start">
                          <ShieldCheck className="text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-black uppercase text-emerald-400/60 tracking-widest italic">Tier: Industrial</span>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Authorized Access</p>
                          <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Contract Vault</h4>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
