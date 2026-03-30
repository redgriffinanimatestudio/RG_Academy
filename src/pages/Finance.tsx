import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  Lock, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  X,
  CreditCard,
  Building2,
  FileText,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { financeService } from '../services/financeService';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  metadata?: string;
}

interface Escrow {
  id: string;
  amount: number;
  status: string;
  contract: {
    project: { title: string; id: string };
    client: { displayName: string };
  };
}

export default function Finance() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [balanceData, setBalanceData] = useState({ available: 0, inEscrow: 0, lifetime: 0, transactions: [] as Transaction[] });
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'revenue' | 'withdrawals'>('all');

  useEffect(() => {
    loadFinances();
  }, []);

  const loadFinances = async () => {
    setLoading(true);
    const [balance, escrowList] = await Promise.all([
      financeService.getMyBalance(),
      financeService.getEscrows('locked')
    ]);
    if (balance) setBalanceData(balance);
    if (escrowList) setEscrows(escrowList);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-emerald-400" size={14} />;
      case 'pending': return <Clock className="text-amber-400" size={14} />;
      case 'failed': return <AlertCircle className="text-rose-400" size={14} />;
      default: return <History className="text-white/40" size={14} />;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white p-6 pt-24 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- HEADER: TELEMETRY NODES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TelemetryNode 
            title="Available Balance" 
            value={formatCurrency(balanceData.available)} 
            icon={<Wallet className="text-emerald-400" />} 
            trend="+12% vs last month"
            color="emerald"
          />
          <TelemetryNode 
            title="In Escrow (Hold)" 
            value={formatCurrency(balanceData.inEscrow)} 
            icon={<Lock className="text-amber-400" />} 
            trend="Active Project Funding"
            color="amber"
          />
          <TelemetryNode 
            title="Lifetime Revenue" 
            value={formatCurrency(balanceData.lifetime)} 
            icon={<TrendingUp className="text-blue-400" />} 
            trend="Total Yield Index"
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- TRANSACTION MATRIX --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-industrial p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <History size={120} />
              </div>
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                    <History className="text-primary" />
                    Transaction Matrix
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Industrial Revenue Ledger</p>
                </div>
                <div className="flex gap-2">
                  {(['all', 'revenue', 'withdrawals'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab ? 'bg-primary text-bg-dark shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {loading ? (
                  <div className="py-20 text-center animate-pulse">
                    <Zap className="mx-auto text-primary/20 mb-4" size={40} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Ledger...</span>
                  </div>
                ) : balanceData.transactions.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
                    <History className="mx-auto text-white/10 mb-4" size={40} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Empty Matrix</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-[10px] font-black uppercase tracking-widest text-white/20">
                          <th className="px-4 pb-2">Reference</th>
                          <th className="px-4 pb-2">Type</th>
                          <th className="px-4 pb-2">Status</th>
                          <th className="px-4 pb-2 text-right">Yield</th>
                        </tr>
                      </thead>
                      <tbody>
                        {balanceData.transactions.map((tx) => (
                          <motion.tr 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={tx.id} 
                            className="bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-2xl cursor-pointer group"
                            onClick={() => setSelectedInvoice(tx)}
                          >
                            <td className="px-4 py-4 rounded-l-2xl border-l border-y border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-xl text-white/40 group-hover:text-primary transition-colors">
                                  <FileText size={16} />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80 block">#RG-{tx.id.slice(0, 6)}</span>
                                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 border-y border-white/5">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{tx.type.replace('_', ' ')}</span>
                            </td>
                            <td className="px-4 py-4 border-y border-white/5">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(tx.status)}
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{tx.status}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 rounded-r-2xl border-r border-y border-white/5 text-right">
                              <span className={`text-[12px] font-black font-mono ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- ESCROW MONITOR --- */}
          <div className="space-y-6">
            <div className="glass-industrial p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <Lock className="text-amber-400" />
                    Escrow Monitor
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Pending Releases</p>
                </div>
              </div>

              <div className="space-y-4">
                {escrows.length === 0 ? (
                  <div className="p-8 text-center bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                    <Clock className="mx-auto text-white/10 mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">All Projects Stabilized</p>
                  </div>
                ) : (
                  escrows.map(escrow => (
                    <div key={escrow.id} className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-4 relative group">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/80 block">{escrow.contract.project.title}</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Client: {escrow.contract.client.displayName}</span>
                        </div>
                        <span className="text-[12px] font-black font-mono text-amber-400">{formatCurrency(escrow.amount)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            className="h-full bg-amber-400/50"
                          />
                        </div>
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                          <span>Progress Node: 65%</span>
                          <span>Auto-release 48h</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* QUICK PIN ACTION */}
              <button className="w-full mt-8 py-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 text-white/40 hover:text-white">
                <CreditCard size={14} />
                Manage Payout Methods
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- INVOICE PORTAL MODAL --- */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-dark/80 backdrop-blur-3xl" 
              onClick={() => setSelectedInvoice(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-bg-light border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              {/* INDUSTRIAL INVOICE HEADER */}
              <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between gap-8 bg-white/[0.01]">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-bg-dark text-xl">RG</div>
                    <div>
                      <h1 className="text-2xl font-black uppercase tracking-tighter italic">Red Griffin <span className="text-primary italic-none tracking-normal">Academy</span></h1>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Studio • Education • Tech</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-[10px] font-black uppercase tracking-widest text-white/20 ml-16">
                    <p>88 Industrial District, Core Center</p>
                    <p>contact@redgriffin.academy</p>
                  </div>
                </div>
                
                <div className="text-right space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white/10">INVOICE</h2>
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">#RG-{selectedInvoice.id.slice(0, 12)}</p>
                  </div>
                  <div className="space-y-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                    <p>Issue Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                    <p>Due Date: Immediate</p>
                  </div>
                </div>
              </div>

              {/* INVOICE CONTENT */}
              <div className="p-8 md:p-12 space-y-12">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 block">Billed To</span>
                    <div className="space-y-1">
                      <p className="text-[14px] font-black uppercase tracking-widest">{user?.displayName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 block">Payment Method</span>
                    <div className="flex items-center justify-end gap-3">
                      <div className="p-2 bg-white/5 rounded-xl"><CreditCard size={16} /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Mastercard •••• 4492</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-4 text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5 pb-4 px-4">
                    <div className="col-span-2">Description</div>
                    <div className="text-center">Rate</div>
                    <div className="text-right">Total</div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="col-span-2 space-y-1">
                      <p className="text-[12px] font-black uppercase tracking-widest">{selectedInvoice.type.replace('_', ' ')}</p>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Industrial ID: {selectedInvoice.id}</p>
                    </div>
                    <div className="text-center font-mono text-[12px] text-white/60">{formatCurrency(Math.abs(selectedInvoice.amount))}</div>
                    <div className="text-right font-mono font-black text-[14px] text-emerald-400">{formatCurrency(Math.abs(selectedInvoice.amount))}</div>
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <div className="w-full max-w-xs space-y-4">
                    <div className="flex justify-between text-[12px] font-black uppercase tracking-widest">
                      <span className="text-white/20">Subtotal</span>
                      <span>{formatCurrency(Math.abs(selectedInvoice.amount))}</span>
                    </div>
                    <div className="flex justify-between text-[12px] font-black uppercase tracking-widest border-t border-white/5 pt-4">
                      <span className="text-white/20">Tax (0%)</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-center py-6 px-6 bg-primary text-bg-dark rounded-3xl mt-4">
                      <span className="text-[12px] font-black uppercase tracking-widest">Total Amount</span>
                      <span className="text-[20px] font-black font-mono">{formatCurrency(Math.abs(selectedInvoice.amount))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10">Authorized by Red Griffin Sentient Engine v2.6.0</p>
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3">
                    <Download size={14} />
                    Download PDF
                  </button>
                  <button 
                    onClick={() => setSelectedInvoice(null)}
                    className="p-3 bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 rounded-2xl transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function TelemetryNode({ title, value, icon, trend, color }: any) {
  const colors: any = {
    emerald: "from-emerald-500/20 to-transparent border-emerald-500/20",
    amber: "from-amber-500/20 to-transparent border-amber-500/20",
    blue: "from-blue-500/20 to-transparent border-blue-500/20"
  };

  return (
    <div className={`glass-industrial p-8 rounded-[2.5rem] border ${colors[color]} relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none" />
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{title}</p>
            <h3 className="text-3xl font-black mt-1 font-mono">{value}</h3>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20">
            {trend.includes('+') ? <ArrowUpRight size={12} className="text-emerald-400" /> : <Clock size={12} />}
            {trend}
          </div>
        </div>
        <div className="p-4 bg-white/5 rounded-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
      </div>
    </div>
  );
}
