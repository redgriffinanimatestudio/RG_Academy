import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CheckCircle2, Zap, Clock, ChevronRight, Layout, Boxes, Target } from 'lucide-react';
import { studioService } from '../../../../services/studioService';
import Preloader from '../../../../components/Preloader';
import NoDataPlaceholder from '../NoDataPlaceholder';

interface ExecutorDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const ExecutorDashboard: React.FC<ExecutorDashboardProps> = ({ view, accent, user, lang }) => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 🛠️ TASK MATRIX HUB */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000">
          <Layout size={240} />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 text-white italic">
              <div className="size-3 rounded-full bg-primary animate-ping" /> Task Matrix Hub
            </h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono italic">Production Pipeline v2.4 Active</p>
          </div>
          <div className="px-6 py-2 glass-premium border border-primary/20 text-primary text-[10px] font-black uppercase rounded-xl tracking-widest shadow-lg shadow-primary/10">
            Real-time Sync
          </div>
        </div>

        {localLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {tasks.map((t) => (
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
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-white/5 hover:bg-white text-white hover:text-bg-dark rounded-xl transition-all active:scale-95 border border-white/10 group/btn"
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
        
        <div className="relative z-10 space-y-1">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">Industrial Contracts</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Verified Studio Ledger</p>
        </div>

        <div className="grid gap-6 relative z-10">
          {contracts.map((c) => (
            <div key={c.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex justify-between items-center group/c hover:bg-white/[0.04] transition-all duration-500 border-l-4 border-l-primary/40">
              <div className="flex items-center gap-8">
                <div className="size-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center font-black text-2xl border border-primary/20 shadow-xl shadow-primary/5">
                  <Target size={28} />
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-black uppercase text-white tracking-tight">{c.project?.title || `Pipeline Node ${c.id.slice(0, 4)}`}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-primary font-black font-mono tracking-widest">${c.amount.toLocaleString()}</span>
                    <span className="size-1 rounded-full bg-white/20" />
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest leading-none pt-0.5">ID: {c.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-5 py-2.5 glass-premium border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 group-hover/c:text-primary transition-colors rounded-xl capitalize">{c.status}</div>
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover/c:bg-primary group-hover/c:text-bg-dark transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
          {contracts.length === 0 && !localLoading && (
            <div className="text-center py-20 opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">No active ledgers found</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ExecutorDashboard;
