import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Zap, TrendingUp, History, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { financeService } from '../../services/financeService';

interface LedgerStats {
  available: number;
  tokens: number;
  yieldRate: number;
  recentActivity: any[];
}

export const OperationalLedger: React.FC = () => {
  const [stats, setStats] = useState<LedgerStats>({
    available: 0,
    tokens: 0,
    yieldRate: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await financeService.getMyBalance();
        if (balance) {
          setStats({
            available: balance.available || 0,
            tokens: Math.floor((balance.lifetime || 0) * 10), // Mock tokens logic
            yieldRate: 12.4, // Mock current session yield
            recentActivity: (balance.transactions || []).slice(0, 3)
          });
        }
      } catch (err) {
        console.error("Ledger sync failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 animate-pulse flex flex-col items-center justify-center space-y-4 h-64">
       <Zap className="text-primary/20" size={32} />
       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Initializing_Ledger_Sync...</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 💳 MAIN YIELD HUD */}
      <div className="lg:col-span-2 p-10 rounded-[3.5rem] bg-[#080808] border border-white/10 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
            <TrendingUp size={120} />
         </div>
         
         <div className="space-y-8 relative z-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                        <Wallet size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Industrial_Worth</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Live_Feed</span>
                </div>
            </div>

            <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black tracking-tighter tabular-nums text-white">
                  ${stats.available.toLocaleString()}
                </span>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-emerald-400">
                        <ArrowUpRight size={12} />
                        <span className="text-[10px] font-black tracking-widest">8.4%</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 block mb-2">Neural_Tokens</span>
                    <div className="flex items-center gap-3">
                        <Zap size={14} className="text-primary" fill="currentColor" />
                        <span className="text-xl font-black text-white tabular-nums tracking-tighter">{stats.tokens}</span>
                    </div>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 block mb-2">Sync_Yield</span>
                    <div className="flex items-center gap-3">
                        <TrendingUp size={14} className="text-primary" />
                        <span className="text-xl font-black text-white tabular-nums tracking-tighter">{stats.yieldRate}%</span>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* 📊 ACTIVITY MATRIX MONITOR */}
      <div className="lg:col-span-2 p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
         <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Operational_Log.</h4>
                <History size={16} className="text-white/20" />
            </div>

            <div className="space-y-3">
               {stats.recentActivity.length > 0 ? stats.recentActivity.map((tx, idx) => (
                  <div key={tx.id || idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                           <ShieldCheck size={14} />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-none">{tx.type?.replace('_', ' ') || 'Matrix_Sync'}</span>
                           <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em] block">{new Date(tx.createdAt).toLocaleDateString()}</span>
                        </div>
                     </div>
                     <span className={`text-[11px] font-black font-mono ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount)}
                     </span>
                  </div>
               )) : (
                  <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
                     <span className="text-[8px] font-black uppercase text-white/10 tracking-[0.5em]">No_Activity_Nodes_Detected</span>
                  </div>
               )}
            </div>

            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-[0.98]">
               View_Full_Ledger_Matrix
            </button>
         </div>
      </div>
    </div>
  );
};
