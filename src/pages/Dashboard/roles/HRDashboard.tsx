import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, Users, TrendingUp, Target, Shield, 
  Box, Zap, ChevronRight, Search, Filter,
  LayoutDashboard, UserPlus, Database
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { dashboardService } from '../../../services/dashboardService';
import Preloader from '../../../components/Preloader';
import NoDataPlaceholder from '../components/NoDataPlaceholder';

interface HRDashboardProps {
  view: string;
  accent?: string;
  user?: any;
  lang?: string | undefined;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ view, accent, user, lang }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    try {
      setLocalLoading(true);
      const [cRes, sRes] = await Promise.all([
        dashboardService.getCandidates(),
        dashboardService.getHRSummary()
      ]);
      setCandidates(cRes);
      setSummary(sRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setView = (v: string) => {
    setSearchParams(prev => {
        prev.set('view', v);
        return prev;
    });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (view === 'applicants') {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Applicant <span className="text-primary">Matrix</span></h2>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] font-mono">Registry: TALENT-SYNC-Active</p>
                </div>
                <button onClick={() => setView('overview')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Overview Hub</button>
            </header>
            
            <div className="glass-industrial p-12 rounded-[3.5rem] border border-white/5 space-y-10 matrix-grid-bg relative overflow-hidden group">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="relative flex-1 w-full lg:max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                        <input type="text" placeholder="Filter Candidates..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all text-white" />
                    </div>
                    <button className="px-8 py-4 bg-primary text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">Sync Registry</button>
               </div>

               <div className="grid gap-6 relative z-10">
                   {candidates.map((c, i) => (
                       <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between group/c hover:bg-white/[0.04] transition-all duration-500 border-l-4 border-l-primary/40 card-glow">
                           <div className="flex items-center gap-8">
                               <div className="size-16 rounded-2xl overflow-hidden border border-white/10 group-hover/c:border-primary/40 transition-all shadow-xl">
                                   <img src={c.avatar} alt="" className="w-full h-full object-cover grayscale group-hover/c:grayscale-0 transition-all duration-700" />
                               </div>
                               <div className="space-y-1">
                                   <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover/c:text-primary transition-colors">{c.displayName}</h4>
                                   <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/40">
                                       <span className="text-primary italic">LOD {c.lod}</span>
                                       <span className="size-1 rounded-full bg-white/20" />
                                       <span>GPA: {c.gpa}</span>
                                       <span className="size-1 rounded-full bg-white/20" />
                                       <span>{c.status}</span>
                                   </div>
                               </div>
                           </div>
                           <div className="flex items-center gap-4 mt-6 md:mt-0">
                               <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-bg-dark transition-all flex items-center gap-2 group-hover/c:border-primary/20">
                                   <UserCheck size={14} /> Profile Intel
                               </button>
                               <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-white hover:text-bg-dark transition-all">
                                   <ChevronRight size={18} />
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 🚀 HUB CONTROLS (Level 2 Nav) */}
      <div className="flex gap-4">
          <button onClick={() => setView('overview')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'overview' ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <LayoutDashboard size={14} /> Overview
          </button>
          <button onClick={() => setView('applicants')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'applicants' ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <Users size={14} /> Talent Matrix
          </button>
      </div>

      {/* 📊 HR TELEMETRY Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Syncs', value: summary?.activeApplications || '0', sub: 'Talent Node Pipeline', icon: Users, color: '#378add' },
          { label: 'Hiring Velocity', value: summary?.hiringVelocity || '0', sub: 'Eco-Sync Speed', icon: Zap, color: '#00f5d4' },
          { label: 'Talent Gap', value: summary?.talentGap || 'Loading...', sub: 'Priority Skills', icon: Target, color: '#ef4444' },
          { label: 'Nodes Verified', value: summary?.verifiedNodes || '0', sub: 'Ecosystem Growth', icon: Shield, color: '#7f77dd' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass-industrial border border-white/5 rounded-[2.5rem] space-y-4 group/stat hover:border-white/20 transition-all duration-500 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <stat.icon size={80} style={{ color: stat.color }} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{stat.label}</div>
            <div className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</div>
            <div className="text-[9px] font-bold text-white/10 uppercase tracking-widest">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* 🎯 TALENT MATRIX PREVIEW */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-1000">
          <UserCheck size={240} />
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-4xl font-black uppercase tracking-tight text-white italic text-glow">Talent Matrix Hub</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 font-mono italic">Academy-to-Studio Integration Layer v7.1</p>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setView('applicants')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2">
                <Database size={14} /> Full Registry
             </button>
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all"><Filter size={20} /></button>
          </div>
        </div>

        {localLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {candidates.slice(0, 3).map((c, i) => (
              <div 
                key={i} 
                className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-8 group/card hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-700 card-glow relative overflow-hidden"
              >
                <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover/card:scale-110 transition-all duration-1000 grayscale group-hover/card:grayscale-0">
                  <TrendingUp size={120} />
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-white group-hover/card:text-primary transition-colors relative shadow-2xl">
                    <img src={c.avatar} alt="" className="w-full h-full object-cover rounded-[1.5rem] opacity-60 group-hover/card:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-2 -right-2 size-6 rounded-full bg-primary border-4 border-bg-dark flex items-center justify-center">
                      <Zap size={10} className="text-bg-dark fill-current" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter italic leading-[0.9]">{c.displayName}</h4>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] text-primary font-black uppercase tracking-widest">{c.status}</span>
                       <span className="size-1 bg-white/10 rounded-full" />
                       <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">GPA: {c.gpa}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Skill LOD</div>
                    <div className="text-[14px] font-black text-primary font-mono drop-shadow-[0_0_10px_rgba(0,255,157,0.4)]">LOD {c.lod}</div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (c.lod/600)*100)}%` }} className="h-full bg-primary shadow-[0_0_20px_rgba(0,255,157,0.3)]" />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button className="flex-1 py-4 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2">
                    <UserCheck size={16} /> Recruit Node
                  </button>
                  <button className="px-5 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/5">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Users} message="No applicant nodes in sync." link={`/dashboard`} linkText="Establish Sync" />}
      </motion.div>
    </div>
  );
};

export default HRDashboard;
