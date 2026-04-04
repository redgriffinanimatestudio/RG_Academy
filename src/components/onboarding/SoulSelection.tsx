import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MASTER_PLAN_DATA, SovereignPath } from '../../data/MasterPlanData';
import { useTranslation } from 'react-i18next';
import { Shield, ChevronRight, Binary, Sparkles, Target } from 'lucide-react';

interface SoulSelectionProps {
  onSelect: (pathId: string) => void;
  isLoading: boolean;
}

export const SoulSelection: React.FC<SoulSelectionProps> = ({ onSelect, isLoading }) => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white italic">
          Select Your <span className="text-primary">Sovereignty Path</span>
        </h3>
        <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-widest max-w-lg mx-auto">
          Your choice determines your evolution tree and sacred vessels. This resonance is permanent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MASTER_PLAN_DATA.map((path) => {
          const isSelected = selectedId === path.id;
          return (
            <button
              key={path.id}
              onClick={() => setSelectedId(path.id)}
              className={`group relative p-6 rounded-[2.5rem] border transition-all text-left overflow-hidden ${
                isSelected 
                  ? 'bg-primary/10 border-primary/40 shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              {/* Background Art */}
              <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <path.icon size={80} className={isSelected ? 'text-primary' : 'text-white'} />
              </div>

              <div className="relative z-10 space-y-4">
                <div className={`size-12 rounded-2xl flex items-center justify-center border transition-all ${isSelected ? 'bg-primary border-primary text-bg-dark' : 'bg-white/5 border-white/10 text-white/40'}`}>
                  <path.icon size={24} />
                </div>
                
                <div>
                  <h4 className={`text-lg font-black uppercase tracking-tight italic ${isSelected ? 'text-white' : 'text-white/60'}`}>{path.name}</h4>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Sovereignty_{path.id}</p>
                </div>

                <p className={`text-[10px] leading-relaxed font-medium line-clamp-2 ${isSelected ? 'text-white/60' : 'text-white/30'}`}>
                  {path.description}
                </p>

                {isSelected && (
                   <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-primary">
                      <Target size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Resonating...</span>
                   </motion.div>
                )}
              </div>

              {isSelected && <motion.div layoutId="path_glow" className="absolute inset-0 border-2 border-primary rounded-[2.5rem] pointer-events-none" />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6 pt-8 border-t border-white/5">
        <button
          onClick={handleConfirm}
          disabled={!selectedId || isLoading}
          className={`h-16 px-12 rounded-2xl font-black uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-4 ${
            selectedId && !isLoading
              ? 'bg-primary text-bg-dark hover:scale-105 shadow-[0_20px_50px_-20px_rgba(var(--primary-rgb),0.5)]'
              : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
          }`}
        >
          {isLoading ? <Binary className="animate-spin" size={18} /> : (
            <>Finalize Choice <ChevronRight size={18} /></>
          )}
        </button>
        
        <div className="flex items-center gap-3 opacity-20 group">
          <div className="size-1 rounded-full bg-white group-hover:bg-primary transition-colors" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em]">Seal the Blood-Codec Ritual</span>
          <div className="size-1 rounded-full bg-white group-hover:bg-primary transition-colors" />
        </div>
      </div>
    </div>
  );
};
