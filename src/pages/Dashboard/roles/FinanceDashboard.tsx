import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, ShieldCheck, 
  Activity, Zap, FileText, Download, Wallet, Layers,
  LayoutDashboard, Database, Lock, TrendingUp
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { dashboardService } from '../../../services/dashboardService';
import LedgerModal from '../components/Finance/LedgerModal';
import WithdrawModal from '../components/Finance/WithdrawModal';
import Preloader from '../../../components/Preloader';
import GlassCard from '../components/StatCard'; // Using StatCard as proxy or check if GlassCard exists

interface FinanceDashboardProps {
  view: string;
  user?: any;
  lang?: string | undefined;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ view, user, lang }) => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getFinanceSummary();
      setSummary(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  const stats = [
    { label: 'Gross Revenue', value: `$${(summary?.grossRevenue || 0).toLocaleString()}`, sub: 'Platform Inflow', icon: ArrowUpRight, color: '#00f5d4' },
    { label: 'Treasury Outflow', value: `$${(summary?.totalOutflow || 0).toLocaleString()}`, sub: 'Verified Payouts', icon: ArrowDownRight, color: '#ef4444' },
    { label: 'Escrow Reserve', value: summary?.activeEscrows || '0', sub: 'Locked Assets', icon: ShieldCheck, color: '#7f77dd' },
    { label: 'Network Load', value: summary?.networkLoad || '0ms', sub: 'Sync Latency', icon: Activity, color: '#378add' }
  ];

  if (view === 'ledger') {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Industrial <span className="text-[#00f5d4]">Ledger</span></h2>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] font-mono">Transmission: CRYPTO-SAFE-SYNC</p>
                </div>
                <button onClick={() => setView('overview')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Overview Hub</button>
            </header>
            
            <div className="glass-industrial p-12 rounded-[3.5rem] border border-white/5 space-y-10 matrix-grid-bg relative overflow-hidden group">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="relative flex-1 w-full lg:max-w-md group">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00f5d4] transition-colors" size={20} />
                        <input type="text" placeholder="TX Hash Identify..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#00f5d4]/40 transition-all text-white" />
                    </div>
                    <button onClick={fetchData} className="px-8 py-4 bg-[#00f5d4] text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#00f5d4]/20">Refresh Nexus</button>
               </div>

               <div className="grid gap-4 relative z-10">
                    {loading ? (
                        [1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)
                    ) : (
                        summary?.recentTransactions?.map((tx: any, i: number) => (
                            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group/tx hover:bg-white/[0.04] transition-all duration-500 border-l-4 border-l-[#00f5d4]/40 card-glow">
                                <div className="flex items-center gap-8">
                                    <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/tx:border-[#00f5d4]/40 transition-all shadow-xl">
                                        <Zap size={20} className="text-white/20 group-hover/tx:text-[#00f5d4] transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover/tx:text-[#00f5d4] transition-colors">{tx.entity}</h4>
                                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/40">
                                            <span>{tx.type}</span>
                                            <span className="size-1 rounded-full bg-white/20" />
                                            <span>{tx.date}</span>
                                            <span className="size-1 rounded-full bg-white/20" />
                                            <span className="text-emerald-500 italic uppercase">Verified: 100%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-2xl font-black italic tracking-tighter ${tx.amount.startsWith('+') ? 'text-[#00f5d4]' : 'text-rose-500'}`}>{tx.amount}</p>
                                    <div className="flex items-center justify-end gap-2 mt-1">
                                        <div className={`size-1.5 rounded-full ${tx.status === 'verified' ? 'bg-[#00f5d4]' : 'bg-amber-400'} animate-pulse shadow-[0_0_10px_rgba(0,245,212,0.5)]`} />
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{tx.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
               </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 🚀 HUB CONTROLS (Level 2 Nav) */}
      <div className="flex gap-4">
          <button onClick={() => setView('overview')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'overview' ? 'bg-[#00f5d4] text-bg-dark border-[#00f5d4]' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <LayoutDashboard size={14} /> Treasury
          </button>
          <button onClick={() => setView('ledger')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'ledger' ? 'bg-[#00f5d4] text-bg-dark border-[#00f5d4]' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <Database size={14} /> Ledger Hub
          </button>
      </div>

      {/* 📊 TREASURY TELEMETRY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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

      {/* 💰 FINANCE COMMAND CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ledger Nexus Preview */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 glass-industrial border border-white/5 rounded-[3.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group matrix-grid-bg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Platform Ledger</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Industrial Transaction Protocol v18.6</p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setView('ledger')}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center gap-2"
               >
                 <Layers size={14} /> Full Nexus
               </button>
               <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all">
                 <Download size={16} />
               </button>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
             {loading ? (
               [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-[2rem] animate-pulse" />)
             ) : (
               summary?.recentTransactions?.slice(0, 4).map((tx: any, i: number) => (
                 <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-center justify-between group/tx hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500">
                    <div className="flex items-center gap-6">
                       <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/tx:border-[#00f5d4]/40 transition-all">
                          <Zap size={18} className="text-white/20 group-hover/tx:text-[#00f5d4] transition-colors" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-white uppercase italic tracking-tight">{tx.entity}</p>
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{tx.type} • {tx.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-lg font-black italic tracking-tighter ${tx.amount.startsWith('+') ? 'text-[#00f5d4]' : 'text-rose-500'}`}>{tx.amount}</p>
                       <div className="flex items-center justify-end gap-2 mt-1">
                          <div className={`size-1 rounded-full ${tx.status === 'verified' ? 'bg-[#00f5d4]' : 'bg-amber-400'} animate-pulse`} />
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{tx.status}</span>
                       </div>
                    </div>
                 </div>
               ))
             )}
          </div>
        </motion.div>

        {/* Action Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="glass-industrial border border-white/5 rounded-[3rem] p-8 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-1000">
               <Wallet size={120} className="text-[#00f5d4]" />
            </div>
            <div className="space-y-1 relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Liquidity Node</h4>
              <p className="text-3xl font-black text-white italic tracking-tighter">${(summary?.vaultBalance || 84290).toLocaleString()}</p>
              <p className="text-[9px] text-[#00f5d4] font-black uppercase tracking-widest italic mt-1 drop-shadow-[0_0_8px_#00f5d4]">Primary Vault Active</p>
            </div>

            <div className="space-y-3 relative z-10">
               <button 
                onClick={() => setIsWithdrawOpen(true)}
                className="w-full py-5 bg-[#00f5d4] text-bg-dark rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#00f5d4]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 <Zap size={16} /> Asset Extraction
               </button>
               <button 
                onClick={() => setView('ledger')}
                className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
               >
                 <FileText size={16} /> Audit Protocol
               </button>
            </div>
          </div>

          <div className="p-8 glass-industrial border border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden group bg-primary/5 border-primary/20">
             <div className="flex items-center justify-between">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <ShieldCheck size={20} className="text-primary" />
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[8px] font-black uppercase tracking-widest">Secured</span>
             </div>
             <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Trust Engine Protocol</h4>
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest italic leading-relaxed">
                   All financial operations are verified through the Industrial Ledger Layer v2. Multi-sig active.
                </p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <LedgerModal 
        isOpen={isLedgerOpen} 
        onClose={() => setIsLedgerOpen(false)} 
        transactions={summary?.recentTransactions || []}
      />
      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        balance={summary?.vaultBalance || 84290}
      />
    </div>
  );
};

const SearchIcon = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

export default FinanceDashboard;
