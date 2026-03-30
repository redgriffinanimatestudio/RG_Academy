import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, LifeBuoy, AlertCircle, HelpCircle } from 'lucide-react';
import { supportService } from '../../services/supportService';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function HelpModal({ isOpen, onClose, user }: HelpModalProps) {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await supportService.createReport({
        reason,
        targetType: category,
        targetId: 'system_help'
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setReason('');
      }, 2000);
    } catch (err) {
      console.error('Support ticket failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="w-full max-w-xl bg-[#0a0a0a] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative"
      >
        <div className="p-10 lg:p-14 space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <LifeBuoy size={12} /> Help Hub
              </span>
              <h2 className="text-4xl font-black uppercase tracking-tight text-white italic">Submit <span className="text-primary not-italic">Ticket.</span></h2>
            </div>
            <button onClick={onClose} className="size-14 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-all hover:bg-white/10 border border-white/5">
              <X size={28} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-6"
              >
                <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-2 border-primary/40 shadow-xl shadow-primary/20">
                  <Send className="text-primary" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Ticket Transmitted</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mt-2">Operational staff will reach out shortly.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'general', label: 'General', icon: HelpCircle },
                    { id: 'technical', label: 'Tech', icon: Zap },
                    { id: 'billing', label: 'Billing', icon: DollarSign }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                        category === cat.id 
                        ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
                      }`}
                    >
                      <cat.icon size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest">{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Describe the situation</label>
                  <textarea 
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide details about your request..."
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm text-white focus:border-primary transition-all outline-none min-h-[160px] resize-none"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                  <AlertCircle size={18} className="text-white/20 mt-1 shrink-0" />
                  <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-tight">
                    By submitting, you agree that your entity data will be accessible to the high-authority support staff for diagnostic purposes.
                  </p>
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full py-5 bg-primary text-bg-dark rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:scale-[1.03] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  <Send size={18} /> {loading ? 'Transmitting...' : 'Establish Ticket Connection'}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -ml-32 -mb-32" />
      </motion.div>
    </div>
  );
}

import { Zap, DollarSign } from 'lucide-react';
