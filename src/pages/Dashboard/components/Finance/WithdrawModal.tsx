import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, DollarSign, ShieldCheck, Zap, 
  Wallet, Cpu, Server, Lock 
} from 'lucide-react';
import { GlassCard } from '../../../../components/dashboard/shared/DashboardUI';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export default function WithdrawModal({ isOpen, onClose, balance }: WithdrawModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [wallet, setWallet] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Success

  const handleWithdraw = () => {
    if (amount <= 0 || amount > balance) return;
    setStep(2);
    setTimeout(() => setStep(3), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-transparent backdrop-blur-xl"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl z-10"
        >
          <GlassCard className="!p-0 overflow-hidden border-[#00f5d4]/20 shadow-[0_0_50px_rgba(0,245,212,0.1)]">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#00f5d4]/5">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-[#00f5d4]/10 flex items-center justify-center border border-[#00f5d4]/20 shadow-[0_0_15px_rgba(0,245,212,0.1)]">
                  <DollarSign size={24} className="text-[#00f5d4]" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white italic">Treasury <span className="text-[#00f5d4]">Extraction</span></h2>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1 italic">Liquidity Protocol V.4.0</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/20 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  {/* Balance Display */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Available Protocol Assets</span>
                    <span className="text-2xl font-mono font-black text-white italic">${balance.toLocaleString()}</span>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic">Extraction Magnitude</label>
                      <span className="text-xl font-black text-[#00f5d4] italic font-mono">${amount.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max={balance}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#00f5d4]"
                    />
                    <div className="flex justify-between mt-2">
                       {[0.25, 0.5, 0.75, 1].map((pct) => (
                         <button 
                            key={pct}
                            onClick={() => setAmount(Math.floor(balance * pct))}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/40 hover:text-[#00f5d4] hover:border-[#00f5d4]/40 transition-all uppercase tracking-widest"
                         >
                            {pct * 100}%
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Wallet Endpoint */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic">
                      Destination Node (Wallet)
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="text" 
                        placeholder="0x... / wallet_id" 
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-[#00f5d4]/40 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleWithdraw}
                    disabled={amount <= 0}
                    className="w-full py-5 bg-[#00f5d4] text-[#0a0a0a] rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#00f5d4]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    Initiate Asset Extraction
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <div className="py-12 space-y-10 text-center">
                  <div className="relative size-32 mx-auto">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-[#00f5d4] rounded-full shadow-[0_0_20px_#00f5d4]"
                    />
                    <div className="absolute inset-4 rounded-full border border-white/5 flex items-center justify-center">
                      <Cpu size={40} className="text-[#00f5d4]/40" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Validating Protocol...</h3>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Synchronizing nodes • Block: 184,291</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 space-y-10 text-center text-white"
                >
                  <div className="size-24 mx-auto rounded-full bg-[#00f5d4]/20 border border-[#00f5d4]/40 flex items-center justify-center shadow-[0_0_40px_rgba(0,245,212,0.2)]">
                    <Zap size={40} className="text-[#00f5d4]" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">Extraction <span className="text-[#00f5d4]">Success</span></h3>
                    <p className="text-[11px] text-white/40 font-black uppercase tracking-[0.2em]">Assets transmitted to network endpoint.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-12 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#00f5d4] hover:text-[#0a0a0a] transition-all"
                  >
                    Close Terminal
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer Telemetry */}
            <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <Server size={12} className="text-white/20" />
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">RG-TX-SEC-01</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Lock size={12} className="text-[#00f5d4]/40" />
                    <span className="text-[8px] font-black text-[#00f5d4]/40 uppercase tracking-widest italic">Encrypted</span>
                 </div>
              </div>
              <div className="text-[8px] font-mono text-white/10">02:44:12:88:TX</div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
