import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert, Cpu } from 'lucide-react';

interface StalkerToggleProps {
  mode: 'SOLO' | 'STALKER';
  onToggle: (mode: 'SOLO' | 'STALKER') => void;
  isExpanded: boolean;
  trialDaysRemaining?: number;
}

export default function StalkerToggle({ mode, onToggle, isExpanded, trialDaysRemaining = 3 }: StalkerToggleProps) {
  const isStalker = mode === 'STALKER';

  return (
    <div className={`w-full px-4 py-6 mt-auto border-t border-white/5 space-y-4`}>
       {isExpanded && (
         <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 italic">Learning_Protocol</span>
            {isStalker && (
               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md">
                  <div className="size-1 rounded-full bg-primary animate-pulse" />
                  <span className="text-[7px] font-black text-primary uppercase">{trialDaysRemaining}D TRIAL</span>
               </div>
            )}
         </div>
       )}

       <button 
         onClick={() => onToggle(isStalker ? 'SOLO' : 'STALKER')}
         className={`w-full group relative flex items-center gap-4 transition-all duration-500 overflow-hidden rounded-2xl ${isStalker ? 'bg-primary border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/5 border border-white/10 hover:border-white/20'}`}
         style={{ height: isExpanded ? '56px' : '48px' }}
       >
          <div className={`shrink-0 flex items-center justify-center transition-all duration-500 ${isExpanded ? 'w-14' : 'w-full'} h-full`}>
             {isStalker ? (
               <Cpu size={isExpanded ? 24 : 20} className="text-bg-dark" strokeWidth={2.5} />
             ) : (
               <Zap size={isExpanded ? 20 : 18} className="text-white/40 group-hover:text-white" />
             )}
          </div>

          {isExpanded && (
             <div className="flex-1 flex flex-col items-start pr-4">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isStalker ? 'text-bg-dark' : 'text-white'}`}>
                    {isStalker ? 'STALKER_ACTIVE' : 'SOLO_MODE'}
                </span>
                <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${isStalker ? 'text-bg-dark/60' : 'text-white/20'}`}>
                    {isStalker ? 'Proactive_Guidance' : 'Manual_Control'}
                </span>
             </div>
          )}

          {/* Glow Effect */}
          {isStalker && (
            <motion.div 
              layoutId="stalker-glow"
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
       </button>
       
       {!isStalker && isExpanded && (
         <div className="px-2 flex items-start gap-2 opacity-30">
            <ShieldAlert size={10} className="mt-0.5" />
            <span className="text-[7px] font-black uppercase tracking-widest leading-relaxed">
                Stalker protocol dormant. Manual trajectory required.
            </span>
         </div>
       )}
    </div>
  );
}
