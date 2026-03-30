import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Box, Zap, Shield, TrendingUp, CheckCircle2, Clock, ChevronRight, Activity, Rocket, UserPlus } from 'lucide-react';
import { studioService } from '../../../services/studioService';
import Preloader from '../../../components/Preloader';
import NoDataPlaceholder from '../components/NoDataPlaceholder';

interface ExecutorDashboardProps {
  user: any;
}

const ExecutorDashboard: React.FC<ExecutorDashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
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
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-6">
          <Briefcase size={280} className="text-primary" />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <h3 className="text-4xl font-black uppercase tracking-tight text-white italic text-glow">Freelance Node</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 font-mono">Mission: Critical Task Synchronization</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg shadow-primary/5">
                Latency: 24ms
             </div>
             <button onClick={fetchData} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-primary hover:bg-white/10 transition-all transition-colors active:scale-95">
                <Activity size={20} />
             </button>
          </div>
        </div>

        {localLoading ? <Preloader message="Fetching tasks..." size="sm" /> : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {tasks.map((t) => (
              <div key={t.id} className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-8 group/t hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-700 card-glow relative overflow-hidden">
                 <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-3">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Task Node ID: {t.id?.slice(-8)}</span>
                       <h4 className="text-2xl font-black text-white uppercase tracking-tight italic group-hover/t:text-primary transition-colors">{t.title}</h4>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors ${
                       t.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                       {t.status}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-4 relative z-10">
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                       <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Allocation</div>
                       <div className="text-xl font-black text-white">${t.budget || 0}</div>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-1 text-right">
                       <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Deadline Node</div>
                       <div className="text-sm font-black text-white/40">{t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}</div>
                    </div>
                 </div>

                 <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-primary hover:text-bg-dark transition-all active:scale-95 group/btn">
                    Execute Instruction <ChevronRight size={16} className="inline ml-2 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Box} message="No active task nodes in your pipeline." link="/studio" linkText="Sectors Gigs" />}
      </motion.div>

      {/* 💼 INDUSTRIAL CONTRACT LEDGER */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
        className="glass-industrial border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-x-[-1] transition-transform duration-1000 grayscale group-hover:grayscale-0">
          <Shield size={240} className="text-primary" />
        </div>
        
        <div className="relative z-10 space-y-1">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">Contract Ledger</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Escrow Vault Synchronization</p>
        </div>

        <div className="space-y-6 relative z-10">
          {contracts.length > 0 ? contracts.map((c, i) => (
             <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-between group/c hover:bg-white/[0.06] transition-all duration-500 card-glow">
                <div className="flex items-center gap-8">
                   <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover/c:bg-primary group-hover/c:text-bg-dark transition-all border border-white/5">
                      <Zap size={24} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-xl font-black text-white uppercase tracking-tight">{c.title}</div>
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <div className="size-1 bg-primary rounded-full animate-pulse" /> {c.status}
                         </span>
                         <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">Signed: {new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right space-y-1">
                   <div className="text-2xl font-black text-white italic tracking-tighter">${c.budget || 0}</div>
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Authorized Allocation</div>
                </div>
             </div>
          )) : (
            <div className="py-20 text-center opacity-10">
              <Shield size={64} className="mx-auto mb-6" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">No Valid Contracts <br/> Found in Sync</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ExecutorDashboard;
