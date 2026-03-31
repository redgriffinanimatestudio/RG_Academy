import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MessageSquare, ShieldAlert, CheckCircle2, 
  User, Clock, Zap, Terminal, Send
} from 'lucide-react';
import { GlassCard } from '../../../../components/dashboard/shared/DashboardUI';

interface TicketResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}

export default function TicketResolutionModal({ isOpen, onClose, ticket }: TicketResolutionModalProps) {
  const [resolution, setResolution] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleResolve = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-bg-dark/80 backdrop-blur-xl"
        />

        <motion.div
           initial={{ scale: 0.9, opacity: 0, y: 20 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.9, opacity: 0, y: 20 }}
           className="relative w-full max-w-2xl z-10"
        >
          <GlassCard className="!p-0 overflow-hidden border-sky-400/20 shadow-[0_0_50px_rgba(56,189,248,0.1)]">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-sky-400/5">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-sky-400/10 flex items-center justify-center border border-sky-400/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                  <MessageSquare size={24} className="text-sky-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white italic">Ticket <span className="text-sky-400">Resolution</span></h2>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1 italic">Protocol: Support-Oversight-v4</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/20 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8">
               {!isSuccess ? (
                 <div className="space-y-8">
                    {/* Ticket Intel */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">User Entity</p>
                          <div className="flex items-center gap-2">
                             <User size={14} className="text-sky-400" />
                             <span className="text-xs font-black text-white uppercase italic">{ticket.user}</span>
                          </div>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Priority Class</p>
                          <div className="flex items-center gap-2">
                             <ShieldAlert size={14} className={ticket.priority === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                             <span className="text-xs font-black text-white uppercase italic">{ticket.priority}</span>
                          </div>
                       </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Issue Domain</p>
                       <p className="text-sm font-bold text-white/80">{ticket.category}</p>
                    </div>

                    {/* Resolution Input */}
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic flex items-center gap-2">
                          <Terminal size={12} /> Resolution Narrative
                       </label>
                       <textarea 
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                          placeholder="Initialize resolution sequence..."
                          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-[11px] font-bold text-white outline-none focus:border-sky-400/40 transition-all resize-none"
                       />
                    </div>

                    <button 
                       onClick={handleResolve}
                       disabled={!resolution || isProcessing}
                       className="w-full py-5 bg-sky-400 text-bg-dark rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-sky-400/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                       {isProcessing ? (
                          <div className="size-4 border-2 border-bg-dark/30 border-t-bg-dark rounded-full animate-spin" />
                       ) : (
                          <><Send size={14} /> Commit Resolution</>
                       )}
                    </button>
                 </div>
               ) : (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center space-y-8">
                    <div className="size-24 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                       <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">Protocol <span className="text-emerald-500">Resolved</span></h3>
                       <p className="text-[11px] text-white/40 font-black uppercase tracking-[0.2em]">Incident synchronized and closed in Global Ledger.</p>
                    </div>
                    <button 
                       onClick={onClose}
                       className="px-12 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-bg-dark transition-all"
                    >
                       Return to Hub
                    </button>
                 </motion.div>
               )}
            </div>

            <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-white/20 italic">
               <div className="flex items-center gap-6">
                  <span>Audit ID: RG-S-{(Math.random() * 100000).toFixed(0)}</span>
                  <span>Agent: System Architect</span>
               </div>
               <div className="flex items-center gap-2">
                  <Zap size={12} className="text-sky-400" />
                  <span>Sync: Localized</span>
               </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
