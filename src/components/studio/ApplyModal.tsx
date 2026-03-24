import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ApplyModal({ isOpen, onClose, project, onSubmit }: ApplyModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-zinc-900 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
      >
        <div className="p-12 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Apply to Project</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">{project.title}</h2>
            </div>
            <button onClick={onClose} className="size-12 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-all hover:bg-white/10">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20">Project Description</h3>
            <p className="text-sm text-white/60 leading-relaxed">{project.description}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Proposal / Cover Letter</label>
                <textarea 
                  required
                  placeholder="Explain why you are the best fit for this project..."
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Bid Amount ($)</label>
                  <input type="number" required placeholder="800" className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Estimated Days</label>
                  <input type="number" required placeholder="5" className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
              Submit Application
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
