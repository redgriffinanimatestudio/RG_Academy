import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Award, 
  Activity, 
  Globe, 
  ShieldCheck, 
  DollarSign,
  Zap,
  ChevronRight
} from 'lucide-react';
import { StatCard, SectionHeader, GlassCard } from '../../../components/dashboard/shared/DashboardUI';
import { agencyService, AgencySummary } from '../../../services/agencyService';
import Preloader from '../../../components/Preloader';

const AgencyDashboard: React.FC<{ view?: string }> = ({ view = 'overview' }) => {
  const [data, setData] = useState<AgencySummary | null>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [summary, rosterData] = await Promise.all([
          agencyService.getSummary(),
          agencyService.getRoster()
        ]);
        setData(summary);
        setRoster(rosterData);
      } catch (err) {
        console.error('[Agency Hub] Telemetry sync failed:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="py-40 flex flex-col items-center justify-center">
      <Preloader message="Synchronizing Agency Vector..." size="lg" />
    </div>
  );

  const stats = [
    { label: 'Ecosystem Earnings', value: `$${(data?.stats?.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: 'primary' },
    { label: 'Active Contracts', value: data?.stats?.activeContracts || 0, icon: Briefcase, color: 'sky-400' },
    { label: 'Talent Vector', value: data?.stats?.totalTalent || 0, icon: Users, color: 'emerald-400' },
    { label: 'Network Efficiency', value: `${data?.stats?.performanceIndex || 0}%`, icon: Activity, color: 'amber-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">
             Agency <span className="text-primary">Management Hub</span>
           </h1>
           <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
             <div className="size-1.5 rounded-full bg-primary animate-ping" />
             Industrial Node: AGENCY-MASTER-SYNC • Identity: {data?.agent?.name || 'MSITARZEWSKI'}
           </p>
        </div>
      </header>

      {/* 📡 CORE TELEMETRY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} color={card.color.split('-')[0]} />
        ))}
      </div>

      <div className="space-y-8">
        {/* 👑 1. MASTER AGENT IDENTITY */}
        <GlassCard 
          className="!p-12 relative overflow-hidden group border-primary/20 bg-primary/[0.01]"
        >
          <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 -translate-y-12">
            <Globe size={280} className="text-primary" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
              <div className="size-44 rounded-[3rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_60px_rgba(var(--primary-rgb),0.1)] relative">
                <Award size={64} />
                <div className="absolute -bottom-2 -right-2 bg-primary text-bg-dark rounded-full size-12 flex items-center justify-center border-4 border-bg-dark">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary animate-pulse italic">Master Identity Node</span>
                  <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none text-white">{data?.agent?.name || 'MSITARZEWSKI'}</h2>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <span className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest text-primary italic">Industrial Agent</span>
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 italic">{data?.agent?.specialization}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-white/40 leading-relaxed max-w-lg italic">
                  Ecosystem performance synchronized. Current throughput at <span className="text-white">{data?.stats?.totalTalent || 0} talent units</span> with a <span className="text-primary">{data?.stats?.performanceIndex || 0}% efficiency matrix</span>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0">
               <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:border-primary/20 transition-all">
                  <p className="text-2xl font-black text-white italic tracking-tighter">${((data?.stats?.totalEarnings || 0) * 0.15).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Agency Commission</p>
               </div>
               <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:border-primary/20 transition-all">
                  <p className="text-2xl font-black text-white italic tracking-tighter">{data?.stats?.performanceIndex || 0}%</p>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Consistency</p>
               </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 🚀 2. TALENT ROSTER MATRIX (8 units) */}
          <div className="lg:col-span-8 space-y-8">
            <SectionHeader title="Talent Matrix" subtitle="Ecosystem-represented roster and performance tracking" />

            <div className="space-y-5">
              {roster.length > 0 ? roster.map((talent, idx) => (
                <div key={idx} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/[0.05] hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden">
                   <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-full" />
                   
                   <div className="flex items-center gap-8 relative z-10">
                    <div className="size-20 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-primary/40 transition-all shadow-xl">
                      <img src={talent.photoURL || 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png'} className="size-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight italic group-hover:text-primary transition-colors">{talent.displayName}</h4>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-2 italic">
                        Vector: <span className="text-white/60">{talent.isExecutor ? 'Master Executor' : 'Industrial Student'}</span>
                      </p>
                    </div>
                   </div>
                  
                   <div className="flex items-center gap-12 relative z-10">
                    <div className="hidden lg:block text-right">
                      <div className="text-[11px] font-black text-white uppercase tracking-widest italic">${talent.balance?.toLocaleString()}</div>
                      <div className="text-[8px] font-black text-white/20 uppercase tracking-tighter mt-1 italic">Ledger Balance</div>
                    </div>
                    <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:bg-primary group-hover:text-bg-dark transition-all hover:scale-105 shadow-sm active:scale-95">View Bio</button>
                   </div>
                </div>
              )) : (
                <div className="py-24 text-center opacity-10">
                  <Users size={64} className="mx-auto mb-6" />
                  <p className="text-[12px] font-black uppercase tracking-[0.4em] leading-relaxed italic">Roster Matrix <br/> Currently Unpopulated</p>
                </div>
              )}
            </div>
          </div>

          {/* 🧬 3. COMMISSION ANALYTICS (4 units) */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-4 glass-industrial p-12 rounded-[3.5rem] border border-white/5 flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-4 italic">
                  <TrendingUp size={26} className="text-primary" /> Vector Stats
                </h3>
                <span className="text-[10px] font-black font-mono text-white/20 tracking-tighter italic">NODE_v2.0</span>
              </div>

              <div className="space-y-8">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 group hover:border-primary/20 transition-all">
                  <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 italic">Brokerage Performance</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-white uppercase italic tracking-widest">
                      <span>Target Match Rate</span>
                      <span className="text-primary">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '94%' }} 
                        transition={{ delay: 1, duration: 1.5 }}
                        className="h-full bg-primary" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-white uppercase italic tracking-widest">
                      <span>Talent Retention</span>
                      <span className="text-primary">100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '100%' }} 
                        transition={{ delay: 1.2, duration: 1.5 }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 group hover:border-primary/20 transition-all">
                  <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 italic">Financial Forecast</div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-black text-white tracking-tighter italic">${((data?.stats?.totalEarnings || 0) * 1.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      <p className="text-[9px] font-bold text-primary uppercase mt-2 italic shadow-sm">+18.2% Est. Growth</p>
                    </div>
                    <Activity size={32} className="text-primary/40 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-5 bg-white/5 border border-white/10 rounded-[2rem] mt-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 hover:border-primary/20 transition-all active:scale-95 italic">Open Full Ledger</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;
