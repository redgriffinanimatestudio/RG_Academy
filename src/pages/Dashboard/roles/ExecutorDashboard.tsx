import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, CheckCircle2, Zap, Clock, ChevronRight, 
  Layout, Boxes, Target, LayoutDashboard, Database,
  Settings, Filter, Search
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { studioService } from '../../../services/studioService';
import Preloader from '../../../components/Preloader';
import NoDataPlaceholder from '../components/NoDataPlaceholder';

interface ExecutorDashboardProps {
  view: string;
  accent?: string;
  user?: any;
  lang?: string | undefined;
}

const ExecutorDashboard: React.FC<ExecutorDashboardProps> = ({ view, accent, user, lang }) => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLocalLoading(true);
      const [cRes, tRes] = await Promise.all([
        studioService.getContracts(user.id, 'executor'),
        studioService.getMyTasks()
      ]);
      setContracts(Array.isArray(cRes) ? cRes : []);
      setTasks(Array.isArray(tRes) ? tRes : []);
    } catch (e) {
      console.error(e);
      setContracts([]);
      setTasks([]);
    } finally { setLocalLoading(false); }
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

  const handleUpdateStatus = async (taskId: string, currentStatus: string) => {
    const statuses = ['todo', 'in_progress', 'done'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
    
    try {
      await studioService.updateTaskStatus(taskId, nextStatus);
      fetchData();
    } catch (e) {
      alert('Failed to update task.');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (view === 'tasks') {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Production <span className="text-primary">Task Matrix</span></h2>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] font-mono">Status: ASSIGNMENT-LOCKED</p>
                </div>
                <button onClick={() => setView('overview')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Overview Hub</button>
            </header>
            
            <div className="glass-industrial p-12 rounded-[3.5rem] border border-white/5 space-y-10 matrix-grid-bg relative overflow-hidden group">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="relative flex-1 w-full lg:max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                        <input type="text" placeholder="Filter Task ID..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all text-white" />
                    </div>
                    <button onClick={fetchData} className="px-8 py-4 bg-primary text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">Sync Pipeline</button>
               </div>

               <div className="grid gap-6 relative z-10">
                    {localLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)
                    ) : tasks.map((t) => (
                        <div key={t.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between group/tx hover:bg-white/[0.04] transition-all duration-500 border-l-4 border-l-primary/40 card-glow">
                             <div className="flex items-center gap-8">
                                <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/tx:border-primary/40 transition-all shadow-xl">
                                    <Zap size={20} className={`transition-colors ${t.status === 'done' ? 'text-emerald-500' : 'text-white/20 group-hover/tx:text-primary'}`} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover/tx:text-primary transition-colors">{t.title}</h4>
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/40">
                                        <span className="text-primary italic">{t.project?.title || 'GENERAL'}</span>
                                        <span className="size-1 rounded-full bg-white/20" />
                                        <span>Status: {t.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-6 md:mt-0">
                                <button 
                                    onClick={() => handleUpdateStatus(t.id, t.status)}
                                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-bg-dark transition-all flex items-center gap-2 group-hover/tx:border-primary/20"
                                >
                                    Cycle Status
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
          <button onClick={() => setView('tasks')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'tasks' ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <Database size={14} /> Task Pipeline
          </button>
      </div>

      {/* 🛠️ TASK MATRIX PREVIEW */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000">
          <Layout size={240} />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 text-white italic">
               Task Matrix Hub
            </h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono italic">Production Pipeline v2.4 Active</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setView('tasks')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2">
                <Database size={14} /> Full Pipeline
             </button>
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all"><Filter size={20} /></button>
          </div>
        </div>

        {localLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {tasks.slice(0, 4).map((t) => (
              <div key={t.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex flex-col justify-between gap-6 group/task hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 card-glow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t.project?.title || 'General Node'}</span>
                    <Clock size={14} className="text-white/20" />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase leading-tight italic group-hover/task:text-primary transition-colors">{t.title}</h4>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg ${
                    t.status === 'done' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                    t.status === 'in_progress' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/10 text-white/40 border border-white/5'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </div>
                  <button 
                    onClick={() => handleUpdateStatus(t.id, t.status)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-white/5 hover:bg-primary hover:text-bg-dark rounded-xl transition-all active:scale-95 border border-white/10 group/btn"
                  >
                    Sync Status <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Briefcase} message="Wait for assignments." link={`/studio/${lang}`} linkText="Explore Projects" />}
      </motion.div>

      {/* 📜 CONTRACT LEDGER */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000">
          <Boxes size={240} />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">Industrial Contracts</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono italic">Verified Studio Ledger Layer</p>
            </div>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Audit History</button>
        </div>

        <div className="grid gap-6 relative z-10">
          {contracts.map((c) => (
            <div key={c.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-center group/c hover:bg-white/[0.04] transition-all duration-500 border-l-4 border-l-primary/40 card-glow gap-6">
              <div className="flex items-center gap-8">
                <div className="size-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center font-black text-2xl border border-primary/20 shadow-xl shadow-primary/5">
                  <Target size={28} />
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-black uppercase text-white tracking-tight italic group-hover/c:text-primary transition-colors">{c.project?.title || `Pipeline Node ${c.id.slice(0, 4)}`}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-primary font-black font-mono tracking-widest drop-shadow-[0_0_8px_#00ff9d]">${c.amount.toLocaleString()}</span>
                    <span className="size-1 rounded-full bg-white/20" />
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest leading-none">ID: {c.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none px-6 py-3 glass-premium border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 group-hover/c:text-primary transition-colors rounded-xl capitalize text-center">{c.status}</div>
                <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-primary hover:text-bg-dark transition-all shadow-xl group-hover/c:scale-110">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
          {contracts.length === 0 && !localLoading && (
            <div className="text-center py-20 opacity-20 text-[10px] font-black uppercase tracking-[0.5em] italic">No active ledgers found in synchronization</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ExecutorDashboard;
