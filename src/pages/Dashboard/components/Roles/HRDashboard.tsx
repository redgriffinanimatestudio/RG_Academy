import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Users, TrendingUp, Target, Shield, Box, Zap, ChevronRight, Search, Filter } from 'lucide-react';
import { dashboardService } from '../../../../services/dashboardService';
import Preloader from '../../../../components/Preloader';
import NoDataPlaceholder from '../NoDataPlaceholder';

interface HRDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ view, accent, user, lang }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
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
              <stat.icon size={80} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{stat.label}</div>
            <div className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</div>
            <div className="text-[9px] font-bold text-white/10 uppercase tracking-widest">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* 🎯 TALENT MATRIX HUB */}
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
            <div className="relative group/search">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover/search:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search Talent Node..." 
                className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-[11px] font-black tracking-widest uppercase text-white outline-none focus:border-primary/40 focus:bg-white/10 transition-all w-full lg:w-72" 
              />
            </div>
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:bg-white/10 hover:text-white transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {localLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {candidates.map((c, i) => (
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
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Skill Proficiency (LOD)</div>
                    <div className="text-[14px] font-black text-primary font-mono drop-shadow-[0_0_10px_rgba(0,255,157,0.4)]">LOD {c.lod}</div>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (c.lod/600)*100)}%` }} className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full shadow-[0_0_20px_rgba(0,255,157,0.3)]" />
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
