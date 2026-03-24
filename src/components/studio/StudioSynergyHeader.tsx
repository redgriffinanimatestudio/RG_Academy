import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles } from 'lucide-react';

interface StudioSynergyHeaderProps {
  hasSynergyCE: boolean;
}

export default function StudioSynergyHeader({ hasSynergyCE }: StudioSynergyHeaderProps) {
  if (!hasSynergyCE) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-1 border border-sky-500/20 bg-sky-500/5 rounded-[2.5rem] backdrop-blur-xl mb-12 overflow-hidden"
    >
      <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="size-16 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/20 shadow-lg shadow-sky-500/10">
            <Layers size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black uppercase tracking-tight text-white italic">Subcontracting Hub</h3>
              <span className="px-2 py-0.5 bg-sky-500 text-bg-dark text-[8px] font-black uppercase tracking-widest rounded shadow-lg shadow-sky-500/20">Production Synergy</span>
            </div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 italic">
              "Может нанимать других и сам браться за работу — идеальный баланс субподряда"
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
            <Sparkles size={14} className="text-sky-400" /> Delegate Tasks
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-sky-500/20">
            Master Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
}
