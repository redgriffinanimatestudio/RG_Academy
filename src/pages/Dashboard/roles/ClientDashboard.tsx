import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, DollarSign, Rocket, Shield, Activity, ChevronRight, Briefcase, Zap, Plus, Settings } from 'lucide-react';
import { studioService } from '../../../services/studioService';
import Preloader from '../../../components/Preloader';
import NoDataPlaceholder from '../components/NoDataPlaceholder';

const ClientDashboard: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLocalLoading(true);
      const [pRes, cRes] = await Promise.all([
        studioService.getProjects(),
        studioService.getContracts('', 'client')
      ]);
      setProjects(Array.isArray(pRes) ? pRes : []);
      setContracts(Array.isArray(cRes) ? cRes : []);
    } catch (e) {
      console.error(e);
      setProjects([]);
      setContracts([]);
    } finally { setLocalLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReleaseMilestone = async (contractId: string, index: number) => {
    try {
      await studioService.releaseMilestone(contractId, index);
      fetchData();
    } catch (e) {
      alert('Milestone release failed.');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 🚀 PRODUCTION PIPELINE HUB */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-6">
          <Rocket size={280} className="text-primary" />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <h3 className="text-4xl font-black uppercase tracking-tight text-white italic text-glow">Project Control Hub</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 font-mono">Live Sync: Industrial-Pipeline-v4</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg shadow-primary/5">
                Uptime: 99.98%
             </div>
             <button onClick={fetchData} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-primary hover:bg-white/10 transition-all transition-colors active:scale-95">
                <Activity size={20} />
             </button>
          </div>
        </div>

        {localLoading ? <Preloader message="Fetching production state..." size="sm" /> : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {projects.map((p) => (
              <div key={p.id} className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-8 group/p hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-700 card-glow relative overflow-hidden">
                 <div className="flex justify-between items-start">
                    <div className="space-y-3">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Nexus ID: {p.id?.slice(-8)}</span>
                       <h4 className="text-2xl font-black text-white uppercase tracking-tight italic group-hover/p:text-primary transition-colors">{p.title}</h4>
                    </div>
                    <div className="size-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover/p:scale-110 transition-transform duration-500 shadow-xl border border-white/10">
                       <Rocket size={20} className="text-primary drop-shadow-[0_0_10px_#00ff9d]" />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Sync Status</div>
                       <div className="text-[14px] font-black text-primary font-mono drop-shadow-[0_0_10px_rgba(0,255,157,0.4)]">85% LIVE</div>
                    </div>
                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                       <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full shadow-[0_0_20px_rgba(0,255,157,0.3)]" transition={{ duration: 1.5 }} />
                    </div>
                 </div>

                 <div className="flex items-center gap-3 pt-2">
                    <button className="flex-1 py-4 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2">
                       <Settings size={16} /> Configure Node
                    </button>
                    <button className="px-5 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/5">
                       <ChevronRight size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Box} message="No active project nodes found." link="/create" linkText="Deploy Project" />}
      </motion.div>

      {/* 💰 ESCROW VAULT HUB */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000 grayscale group-hover:grayscale-0">
          <DollarSign size={240} className="text-primary" />
        </div>
        
        <div className="relative z-10 space-y-1">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">Escrow Vault</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Milestone-based Liquidity Control</p>
        </div>

        <div className="space-y-6 relative z-10">
          {contracts.length > 0 ? contracts.map((c, i) => (
             <div key={i} className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-8 group/v hover:bg-white/[0.06] transition-all duration-500 card-glow">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-8">
                      <div className="size-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 group-hover/v:bg-primary group-hover/v:text-bg-dark transition-all border border-white/5">
                         <Zap size={32} />
                      </div>
                      <div className="space-y-1">
                         <div className="text-2xl font-black text-white uppercase tracking-tight italic group-hover/v:text-primary transition-colors">{c.title}</div>
                         <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Vault Balance: <span className="text-white">${c.budget || 0}</span></div>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      {c.milestones?.map((m: any, idx: number) => (
                         <div key={idx} className="flex flex-col items-center gap-3">
                            <div className={`size-12 rounded-xl flex items-center justify-center border transition-all ${
                               m.status === 'released' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-white/20'
                            }`}>
                               {m.status === 'released' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{m.status}</span>
                         </div>
                      ))}
                   </div>
                </div>
                
                <button className="w-full py-5 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3">
                   <Shield size={18} /> Release Liquidity Node
                </button>
             </div>
          )) : (
            <div className="py-20 text-center opacity-10">
              <Shield size={64} className="mx-auto mb-6" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">No Valid Escrow Vaults <br/> Found in Sync</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ClientDashboard;
