import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertCircle, CheckCircle, XCircle, Trash2, 
  Ban, ShieldAlert, Eye, Search, Filter, MoreVertical, 
  TrendingUp, Activity, UserCheck, ShieldCheck, Mail, 
  MessageSquare, Settings, Lock, Clock, Globe, Zap, Layers
} from 'lucide-react';
import { moderationService, Report } from '../../../services/moderationService';
import { adminService } from '../../../services/adminService';
import { StatCard, SectionHeader, GlassCard } from '../../../components/dashboard/shared/DashboardUI';
import Preloader from '../../../components/Preloader';

import { useSearchParams } from 'react-router-dom';

export default function ModeratorDashboard({ view: activeModule = 'dashboard', accentColor }: { view?: string, accentColor?: string }) {
  const [stats, setStats] = useState<any>(null);
  const [, setSearchParams] = useSearchParams();
  const [systemStats, setSystemStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const setView = (v: string) => {
    setSearchParams(prev => {
        prev.set('view', v);
        return prev;
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [platformStats, securityStats] = await Promise.all([
        adminService.getStats(),
        moderationService.getSystemStats()
      ]);
      setStats(platformStats);
      setSystemStats(securityStats);
    } catch (err) {
      console.error('[Moderator Hub] Telemetry sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  if (loading) return (
    <div className="py-40 flex flex-col items-center justify-center">
      <Preloader message="Synchronizing Safety Engine..." size="lg" />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">
             Safety <span style={{ color: accentColor || '#ef4444' }}>Oversight Hub</span>
           </h1>
           <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
             <div className="size-1.5 rounded-full animate-ping" style={{ backgroundColor: accentColor || '#ef4444' }} />
             Industrial Node: MODERATOR-MASTER-SYNC • Identity: SYSTEM_NODE_01
           </div>
        </div>
        
        <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl">
          {['dashboard', 'complaints', 'verification', 'analytics'].map(m => (
            <button
              key={m}
              onClick={() => setView(m)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeModule === m ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-white/40 hover:text-white'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeModule === 'dashboard' && <ModeratorOverview stats={stats} systemStats={systemStats} />}
          {activeModule === 'complaints' && <ModeratorComplaints />}
          {activeModule === 'verification' && <ModeratorVerification />}
          {activeModule === 'analytics' && <ModeratorAnalytics systemStats={systemStats} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ModeratorOverview({ stats, systemStats }: any) {
  const [recentReports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    moderationService.getReports('pending').then(data => setReports(data.slice(0, 3)));
  }, []);

  const overviewStats = [
    { label: 'Pending Reports', value: recentReports.length, icon: AlertCircle, color: 'red-500' },
    { label: 'Total Projects', value: stats?.projects || 0, icon: Layers, color: 'blue-500' },
    { label: 'Total Users', value: stats?.users || 0, icon: UserCheck, color: 'emerald-500' },
    { label: 'Response Time', value: '1.2h', icon: Clock, color: 'amber-500' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((s) => (
          <StatCard key={s.label} {...s} color={s.color.split('-')[0]} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <SectionHeader title="Urgent Safety Queue" subtitle="Prioritized incident reports requiring immediate resolution" />
           <div className="space-y-5">
            {recentReports.length > 0 ? recentReports.map((report) => (
              <div key={report.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 group hover:border-red-500/20 transition-all relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1 bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-full" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-red-500 font-black text-lg border border-white/5">
                      {report.reporter?.displayName?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-md font-black text-white uppercase tracking-tight italic group-hover:text-red-500 transition-colors">{report.reporter?.displayName}</h4>
                      <p className="text-[10px] text-white/20 font-bold uppercase mt-1 tracking-widest">
                        UID: {report.reporterId.slice(0, 8)} • Node: {report.targetType}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => moderationService.resolveReport(report.id, 'resolved')} className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all">Resolve</button>
                    <button onClick={() => moderationService.resolveReport(report.id, 'dismissed')} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-white/40 hover:text-white transition-all">Dismiss</button>
                  </div>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border-l-[3px] border-red-500/40 italic text-xs text-white/60 leading-relaxed">
                  "{report.reason}"
                </div>
              </div>
            )) : (
              <div className="py-24 text-center opacity-10">
                <ShieldCheck size={64} className="mx-auto mb-6" />
                <p className="text-[12px] font-black uppercase tracking-[0.4em] leading-relaxed italic">Safety Queue <br/> Currently Synchronized</p>
              </div>
            )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <SectionHeader title="Security Logic" subtitle="AI detection & audit nodes" />
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/20 italic">Audit Node History</h3>
            <div className="space-y-6">
              {[
                { time: '14:32', action: 'User Banned', detail: 'spam_user_042', color: 'text-red-500' },
                { time: '13:55', action: 'Review Deleted', detail: 'Houdini FX Vol.2', color: 'text-amber-500' },
                { time: '12:18', action: 'Course Approved', detail: 'Maya Rigging', color: 'text-emerald-500' }
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-[10px] font-black text-white/20 pt-1 font-mono">{log.time}</div>
                  <div className="space-y-1">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${log.color}`}>{log.action}</div>
                    <div className="text-[11px] font-bold text-white/40 group-hover:text-white/60 transition-colors">{log.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Safety Matrix: Online</span>
              </div>
              <p className="text-[9px] text-white/20 leading-relaxed font-black uppercase italic tracking-tighter">
                AI detection active. Monitoring {stats?.enrollments || 0} active learning trajectories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeratorComplaints() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moderationService.getReports().then(data => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Preloader message="Fetching Report Matrix..." size="sm" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/[0.01] p-8 rounded-[2.5rem] border border-white/5">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:border-red-500/40 outline-none transition-all" placeholder="Search report vector..." />
          </div>
          <button className="p-4 bg-[#111] border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"><Filter size={20} /></button>
        </div>
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button className="px-6 py-2.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">All ({reports.length})</button>
          <button className="px-6 py-2.5 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white">Pending</button>
        </div>
      </div>

      <div className="grid gap-6">
        {reports.length > 0 ? reports.map(report => (
          <div key={report.id} className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 group hover:border-red-500/20 transition-all shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
               <ShieldAlert size={120} />
             </div>
            <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-[2rem] bg-red-500/10 flex items-center justify-center font-black text-red-500 text-2xl border border-red-500/20">
                    {report.targetType.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight italic">Report Matrix #{report.id.slice(-4)}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/10">{report.targetType}</span>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">
                        {new Date(report.createdAt).toLocaleDateString()} BY {report.reporter?.displayName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 italic text-sm text-white/60 leading-relaxed">
                  "{report.reason}"
                </div>
              </div>
              <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                <button onClick={() => moderationService.resolveReport(report.id, 'resolved')} className="w-full py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-500/20">Authorize Resolution</button>
                <button onClick={() => moderationService.resolveReport(report.id, 'dismissed')} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all italic">Dismiss Node</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-40 text-center opacity-10">
            <CheckCircle size={80} className="mx-auto mb-8" />
            <h4 className="text-2xl font-black uppercase tracking-[0.4em] italic leading-tight">Security Matrix <br/> Fully Stabilized</h4>
          </div>
        )}
      </div>
    </div>
  );
}

function ModeratorVerification() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
      <div className="p-10 border-b border-white/5 bg-black/20 flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-widest italic flex items-center gap-4">
          <ShieldCheck size={26} className="text-red-500" /> Identity Matrix Queue
        </h3>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full border border-white/5">4 Pending Nodes Synchronized</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/20 text-[10px] font-black text-[#555] uppercase tracking-[0.3em]">
              <th className="px-10 py-6 italic">Identity Candidate</th>
              <th className="px-10 py-6 italic">Vector Type</th>
              <th className="px-10 py-6 italic">Artifacts</th>
              <th className="px-10 py-6 text-right italic">Action Node</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              { name: 'Satoshi K.', role: 'Lecturer', type: 'ID Verification', doc: 'PASSPORT_SYNC.PDF' },
              { name: 'Alice B.', role: 'Expert', type: 'Portfolio Audit', doc: 'ARTSTATION_VECTOR' }
            ].map((item, i) => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-10 py-8">
                  <div className="text-sm font-black text-white uppercase tracking-tight italic group-hover:text-red-500 transition-colors">{item.name}</div>
                  <div className="text-[10px] text-[#555] font-black uppercase mt-1.5 tracking-widest group-hover:text-[#888] transition-colors">{item.role}</div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-xl border border-amber-500/10 italic">
                    {item.type}
                  </span>
                </td>
                <td className="px-10 py-8 text-[11px] font-black text-red-500 hover:underline cursor-pointer uppercase tracking-widest italic">{item.doc}</td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-3">
                    <button className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">Authorize</button>
                    <button className="px-6 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModeratorAnalytics({ systemStats }: any) {
  const analyticsStats = [
    { label: 'Intrusion Attempts', value: systemStats?.security?.intrusions || 0, icon: Lock, color: 'emerald-500' },
    { label: 'Spam Density', value: `${systemStats?.security?.spamDensity || 0}%`, icon: Activity, color: 'amber-500' },
    { label: 'Trusted Vector', value: '94%', icon: UserCheck, color: 'blue-500' },
    { label: 'AI Detection', value: '99.2%', icon: Zap, color: 'purple-500' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((s) => (
          <StatCard key={s.label} {...s} color={s.color.split('-')[0]} />
        ))}
      </div>
      
      <GlassCard className="!p-12 space-y-10 group bg-white/[0.01]">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight italic">Security Incident Map (24h)</h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-2">Industrial Signal Monitoring: Active</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-blue-500" /><span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Routine Audit</span></div>
            <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-red-500 anime-pulse shadow-[0_0_10px_#ef4444]" /><span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Blocked Vector</span></div>
          </div>
        </div>
        
        <div className="h-80 flex items-end gap-6 relative z-10">
          {[20, 35, 15, 80, 45, 10, 25, 60, 30, 70, 40, 50, 20, 35, 15, 80].map((h, i) => (
            <motion.div 
              key={i} 
              initial={{ height: 0 }} 
              animate={{ height: `${h}%` }} 
              className={`flex-1 rounded-t-[1.5rem] group/bar relative transition-all duration-700 ${h > 75 ? 'bg-red-500/40 border-t-2 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:bg-red-500' : 'bg-blue-500/20 border-t-2 border-blue-500/40 hover:bg-blue-500/40'}`}
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-bg-dark text-[9px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none uppercase tracking-widest shadow-2xl">
                {h} Nodes
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-between text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic pt-4">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>SYNC_DONE</span>
        </div>
      </GlassCard>
    </div>
  );
}
