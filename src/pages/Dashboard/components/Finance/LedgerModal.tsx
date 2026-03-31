import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Filter, Download, 
  ArrowUpRight, ArrowDownRight, 
  ShieldCheck, Activity, Globe,
  MoreVertical, FileText
} from 'lucide-react';
import { GlassCard } from '../../../../components/dashboard/shared/DashboardUI';

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: any[];
}

export default function LedgerModal({ isOpen, onClose, transactions }: LedgerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-bg-dark/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          className="relative w-full max-w-7xl h-[95vh] sm:h-[85vh] z-10"
        >
          <GlassCard className="h-full !p-0 flex flex-col overflow-hidden border-white/5 bg-[#0a0a0a]/90">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(0,245,212,0.1)]">
                  <FileText size={28} className="text-primary" />
                </div>
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">Platform <span className="text-primary">Financial Ledger</span></h2>
                   <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                         <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Node: Global-Audit-v4</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <ShieldCheck size={12} className="text-primary/60" />
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Integrity Verified</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search entities, IDs, protocols..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                    />
                 </div>
                 <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
                    <Filter size={18} />
                 </button>
                 <button className="p-3 bg-primary text-bg-dark border border-primary/20 rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
                    <Download size={18} />
                 </button>
                 <div className="w-px h-10 bg-white/5 mx-2 hidden md:block" />
                 <button 
                  onClick={onClose}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-white/20 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                  {[
                    { label: 'Total Inflow', value: '+$1.24M', icon: ArrowUpRight, color: 'text-primary' },
                    { label: 'Total Outflow', value: '-$428K', icon: ArrowDownRight, color: 'text-red-400' },
                    { label: 'Active Escrows', value: '12', icon: ShieldCheck, color: 'text-amber-400' },
                    { label: 'Network Load', value: '0.42ms', icon: Activity, color: 'text-sky-400' },
                  ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] italic">{stat.label}</p>
                          <stat.icon size={16} className={stat.color} />
                       </div>
                       <p className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</p>
                    </div>
                  ))}
               </div>

               <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/20">Entity / Transaction ID</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/20">Protocol / Type</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/20">Operational Value</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/20">Timestamp</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="group hover:bg-white/[0.03] transition-all cursor-pointer">
                          <td className="px-8 py-7">
                            <div className="flex items-center gap-4">
                               <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/40 transition-all">
                                  <Globe size={16} className="text-white/20 group-hover:text-primary transition-all" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[12px] font-black text-white uppercase group-hover:text-primary transition-colors italic">{tx.entity}</span>
                                  <span className="text-[9px] font-bold text-white/20 font-mono tracking-tighter uppercase">REF-ID: {tx.id}</span>
                               </div>
                            </div>
                          </td>
                          <td className="px-8 py-7 text-[10px] font-black uppercase tracking-widest text-white/40">
                             {tx.type}
                          </td>
                          <td className="px-8 py-7">
                             <span className={`text-[13px] font-black font-mono tracking-tighter italic ${tx.amount.startsWith('+') ? 'text-primary' : 'text-red-400'}`}>
                                {tx.amount}
                             </span>
                          </td>
                          <td className="px-8 py-7 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                             {tx.date}
                          </td>
                          <td className="px-8 py-7 text-right">
                             <div className="flex items-center justify-end gap-3">
                                <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest italic ${
                                   tx.status === 'verified' ? 'bg-primary/10 border-primary/20 text-primary' : 
                                   tx.status === 'pending' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400 animate-pulse' :
                                   'bg-sky-400/10 border-sky-400/20 text-sky-400'
                                }`}>
                                   {tx.status}
                                </div>
                                <button className="p-2 text-white/10 hover:text-white transition-colors">
                                   <MoreVertical size={16} />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-[#000] border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
               <div className="flex items-center gap-8 italic">
                  <span>Authorized by Red Griffin Security</span>
                  <span>IP: 192.168.1.TX</span>
                  <span>Session: {Math.random().toString(36).substring(7).toUpperCase()}</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary" />
                  <span>Encrypted Channel Active</span>
               </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
