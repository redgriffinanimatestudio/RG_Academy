import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Rocket, ChevronRight, DollarSign, 
  Shield, Zap, Box as BoxIcon, LayoutDashboard, Database,
  CheckCircle
} from 'lucide-react';
import { studioService } from '../../../services/studioService';
import Preloader from '../../../components/Preloader';
import NoDataPlaceholder from '../components/NoDataPlaceholder';

interface ClientDashboardProps {
  view: string;
  accent?: string;
  user?: any;
  lang?: string | undefined;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ view, accent, user, lang }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [, setSearchParams] = useSearchParams();

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

  const setView = (v: string) => {
    setSearchParams(prev => {
        prev.set('view', v);
        return prev;
    });
  };

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

  if (view === 'projects') {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Production <span className="text-primary">Registry</span></h2>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] font-mono">Transmission: CLIENT-STUDIO-SYNC</p>
                </div>
                <button onClick={() => setView('overview')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Overview Hub</button>
            </header>
            
            <div className="glass-industrial p-12 rounded-[3.5rem] border border-white/5 space-y-10 matrix-grid-bg relative overflow-hidden group">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="relative flex-1 w-full lg:max-w-md group">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                        <input type="text" placeholder="Identify Project ID..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all text-white" />
                    </div>
                    <Link to={`/studio/${lang}/post`} className="px-8 py-4 bg-primary text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                        <Plus size={18} /> New Production Node
                    </Link>
               </div>

               <div className="grid gap-6 relative z-10">
                    {localLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)
                    ) : projects.map((p, i) => (
                        <div key={p.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between group/tx hover:bg-white/[0.04] transition-all duration-500 border-l-4 border-l-primary/40 card-glow gap-6">
                             <div className="flex items-center gap-8">
                                <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/tx:border-primary/40 transition-all shadow-xl font-black text-white/20 text-xl group-hover/tx:text-primary italic">
                                    P{i+1}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover/tx:text-primary transition-colors">{p.title}</h4>
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/40">
                                        <span className="text-primary italic">Budget: ${p.budget.toLocaleString()}</span>
                                        <span className="size-1 rounded-full bg-white/20" />
                                        <span>Status: {p.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                <div className="flex justify-between w-full md:w-64 px-1">
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic group-hover/tx:text-white/60 transition-colors">Integration Progress</span>
                                    <span className="text-[12px] font-black text-primary uppercase font-mono drop-shadow-[0_0_8px_#00ff9d]">65%</span>
                                </div>
                                <div className="w-full md:w-64 h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-gradient-to-r from-primary via-sky-400 to-primary rounded-full shadow-[0_0_15px_rgba(0,255,157,0.3)]" />
                                </div>
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
          <button onClick={() => setView('projects')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'projects' ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <Database size={14} /> Production Matrix
          </button>
      </div>

      {/* 🚀 STUDIO PRODUCTION HUB PREVIEW */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000">
          <Rocket size={240} />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Studio Projects</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono italic">Production Ecosystem Status v1.0</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setView('projects')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2">
                <Database size={14} /> Full Registry
             </button>
             <Link to={`/studio/${lang}/post`} className="flex items-center gap-3 px-6 py-3 bg-primary text-bg-dark rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                <Plus size={16} /> New Node
             </Link>
          </div>
        </div>

        {localLoading ? <Preloader message="Syncing Nodes..." size="sm" /> : projects.length > 0 ? (
          <div className="grid gap-6 relative z-10">
            {projects.slice(0, 3).map((p, i) => (
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
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest italic leading-none pt-0.5">Sync: {p.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 mt-6 lg:mt-0 w-full lg:w-auto">
                  <div className="flex justify-between w-full lg:w-64 px-1">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Pipeline Load</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest drop-shadow-sm">65% Progress</span>
                  </div>
                  <div className="w-full lg:w-64 h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full shadow-[0_0_15px_rgba(0,255,157,0.3)]" />
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
        
        <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
                <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-white italic">
                    <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" /> Active Production Ledger
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono italic">Escrow Vault: Real-time Liquidity Synchronization Active</p>
            </div>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Audit Ledger</button>
        </div>

        {localLoading ? <Preloader message="Syncing Contracts..." size="sm" /> : contracts.length > 0 ? (
          <div className="grid gap-8 relative z-10">
            {contracts.map((c) => {
              const milestones = JSON.parse(c.milestones || '[]');
              return (
                <div key={c.id} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] space-y-10 group/c card-glow transition-all duration-500 hover:border-emerald-500/20 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-3xl font-black uppercase text-white italic tracking-tighter group-hover/c:text-emerald-500 transition-colors leading-[0.9]">{c.project?.title || 'Studio Expansion Node'}</h4>
                      <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">Vault ID: {c.id.substring(c.id.length-8)}</span>
                        <span className="size-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic drop-shadow-sm">Executor: {c.executor.displayName.split(' ')[0]}</span>
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase rounded-2xl tracking-widest shadow-xl shadow-emerald-500/10 flex items-center gap-3 italic">
                      <Zap size={14} className="animate-pulse" /> Asset Secured Hub
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {milestones.map((m: any, idx: number) => (
                      <div key={idx} className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col justify-between gap-6 group/m hover:border-emerald-500/40 transition-all duration-500 card-glow hover:bg-emerald-500/[0.02]">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">{m.title}</div>
                            <div className="px-3 py-1 glass-premium rounded-lg text-[9px] font-black text-white/20 uppercase border border-white/5 shadow-inner">0{idx+1}</div>
                          </div>
                          <div className="text-4xl font-black text-white tracking-tighter italic group-hover/m:translate-x-2 transition-transform duration-500">${m.amount.toLocaleString()}</div>
                        </div>
                        {m.status === 'released' ? (
                          <div className="flex items-center gap-3 text-emerald-500 text-[11px] font-black uppercase py-5 bg-emerald-500/5 rounded-3xl justify-center border border-emerald-500/10 shadow-2xl italic">
                            <CheckCircle size={16} /> Asset Released
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleRelease(c.id, idx)}
                            className="w-full py-5 bg-white text-bg-dark rounded-3xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3 group/btn italic"
                          >
                            <DollarSign size={16} className="group-hover/btn:rotate-12 transition-transform" /> Release Liquidity Node
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

const SearchIcon = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

export default ClientDashboard;
