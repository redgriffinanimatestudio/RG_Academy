import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Plus, Rocket, ChevronRight, DollarSign, Shield, Zap, Box as BoxIcon } from 'lucide-react';
import { studioService } from '../../../../services/studioService';
import Preloader from '../../../../components/Preloader';
import NoDataPlaceholder from '../NoDataPlaceholder';

interface ClientDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ view, accent, user, lang }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLocalLoading(true);
      const [pRes, cRes] = await Promise.all([
        studioService.getProjects(),
        studioService.getContracts(user.id, 'client')
      ]);
      setProjects(pRes.filter((p: any) => p.clientId === user.id));
      setContracts(cRes);
    } catch (e) { console.error(e); } finally { setLocalLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleRelease = async (contractId: string, index: number) => {
    if (!confirm('Are you sure you want to release this payment? This action is irreversible.')) return;
    try {
      await studioService.releaseMilestone(contractId, index);
      fetchData();
    } catch (e) {
      alert('Failed to release payment. Check console.');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 🚀 STUDIO PRODUCTION HUB */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000">
          <Rocket size={240} />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tight text-white italic">Studio Projects</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Active Production Pipelines</p>
          </div>
          <Link to={`/studio/${lang}/post`} className="flex items-center gap-3 px-8 py-4 bg-primary text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
            <Plus size={18} /> New Production Node
          </Link>
        </div>

        {localLoading ? <Preloader message="Loading Projects..." size="sm" /> : projects.length > 0 ? (
          <div className="grid gap-6 relative z-10">
            {projects.map((p, i) => (
              <div key={p.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between group/p hover:bg-white/[0.06] hover:border-sky-500/20 transition-all duration-500 card-glow">
                <div className="flex items-center gap-8">
                  <div className="size-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-white/20 group-hover/p:text-primary transition-colors">
                    P{i+1}
                  </div>
                  <div className="space-y-2">
                    <div className="text-xl font-black uppercase tracking-tight text-white italic">{p.title}</div>
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 glass-premium rounded-lg text-[9px] font-black text-primary border border-primary/20 uppercase tracking-widest">
                        Budget: ${p.budget.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest italic leading-none pt-0.5">Status: {p.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 mt-6 lg:mt-0 w-full lg:w-auto">
                  <div className="flex justify-between w-full lg:w-64 px-1">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Execution Nodes</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">65% Sync</span>
                  </div>
                  <div className="w-full lg:w-64 h-2 bg-white/5 rounded-full overflow-hidden p-[2px]">
                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-gradient-to-r from-primary via-sky-400 to-primary rounded-full shadow-[0_0_15px_rgba(0,255,157,0.3)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={BoxIcon} message="No projects found." link={`/studio/${lang}/post`} linkText="Post Project" />}
      </motion.div>

      {/* 🛡️ ACTIVE CONTRACTS & ESCROW */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 transition-transform duration-1000 grayscale group-hover:grayscale-0">
          <Shield size={240} className="text-emerald-500/20" />
        </div>
        
        <div className="relative z-10 space-y-1">
          <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-white italic">
            <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Active Production Ledger
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Escrow Vault: Liquidity Synchronization Active</p>
        </div>

        {localLoading ? <Preloader message="Syncing Contracts..." size="sm" /> : contracts.length > 0 ? (
          <div className="grid gap-8 relative z-10">
            {contracts.map((c) => {
              const milestones = JSON.parse(c.milestones || '[]');
              return (
                <div key={c.id} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-10 group/c card-glow transition-all duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-2xl font-black uppercase text-white italic tracking-tighter group-hover/c:text-emerald-500 transition-colors">{c.project?.title || 'Studio Expansion Node'}</h4>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-4">
                        Vault ID: {c.id.slice(0, 8)} <span className="size-1 rounded-full bg-white/10" /> Executor: {c.executor.displayName.split(' ')[0]}
                      </p>
                    </div>
                    <div className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase rounded-xl tracking-widest shadow-xl shadow-emerald-500/5 flex items-center gap-3">
                      <Zap size={14} className="animate-pulse" /> Asset Secured
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {milestones.map((m: any, idx: number) => (
                      <div key={idx} className="p-8 bg-black/40 border border-white/5 rounded-[2rem] flex flex-col justify-between gap-6 group/m hover:border-emerald-500/30 transition-all duration-500 card-glow">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{m.title}</div>
                            <div className="px-2 py-0.5 glass-premium rounded-md text-[8px] font-black text-white/20 uppercase">Node-0{idx+1}</div>
                          </div>
                          <div className="text-3xl font-black text-white tracking-tighter italic group-hover/m:translate-x-2 transition-transform duration-500">${m.amount.toLocaleString()}</div>
                        </div>
                        {m.status === 'released' ? (
                          <div className="flex items-center gap-3 text-emerald-500 text-[10px] font-black uppercase py-4 bg-emerald-500/5 rounded-2xl justify-center border border-emerald-500/10 shadow-inner">
                            <CheckCircle2 size={16} /> Asset Released
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleRelease(c.id, idx)}
                            className="w-full py-5 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group/btn"
                          >
                            <DollarSign size={16} /> Release Liquidity
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <NoDataPlaceholder icon={BoxIcon} message="No active contracts found." link={`/studio/${lang}`} linkText="Explore Studio" />}
      </motion.div>
    </div>
  );
};

const CheckCircle2 = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default ClientDashboard;
