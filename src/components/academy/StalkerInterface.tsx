import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, MessageCircle, X, ArrowRight, Zap, Target, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { stalkerService, StalkerDialogue } from '../../services/stalkerService';
import { useLocation } from 'react-router-dom';

interface StalkerInterfaceProps {
  currentLesson?: any;
}

export default function StalkerInterface({ currentLesson }: StalkerInterfaceProps) {
  const { profile } = useAuth();
  const [dialogue, setDialogue] = useState<StalkerDialogue | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();

  const isStalkerEnabled = profile?.learningMode === 'STALKER';

  useEffect(() => {
    if (!isStalkerEnabled) {
      setDialogue(null);
      setIsOpen(false);
      return;
    }

    const checkProactiveDialogue = async () => {
      const newDialogue = await stalkerService.analyzeProgress(profile, currentLesson);
      if (newDialogue) {
        setDialogue(newDialogue);
        setIsOpen(true);
        setIsMinimized(false);
      }
    };

    // Trigger check on lesson change or navigation
    const timer = setTimeout(checkProactiveDialogue, 3000);
    return () => clearTimeout(timer);
  }, [currentLesson, location.pathname, isStalkerEnabled, profile]);

  if (!isStalkerEnabled) return null;

  return (
    <div className="fixed bottom-12 right-12 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && !isMinimized && dialogue && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-[380px] glass-pro-max p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6 relative pointer-events-auto overflow-hidden group"
          >
             {/* 📟 Dialogue Header */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="size-2 rounded-full bg-primary animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary italic">Stalker_Link_Established.</span>
                </div>
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors"
                >
                   <X size={14} />
                </button>
             </div>

             {/* 💬 Message Content */}
             <div className="space-y-4">
                <p className="text-sm text-white/80 leading-relaxed font-medium italic selection:bg-primary selection:text-bg-dark">
                   {dialogue.message}
                </p>
                <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-white/10 italic">
                   <Activity size={10} /> Sync_Status: Nominal
                   <Zap size={10} className="text-primary" /> Yield_Locked
                </div>
             </div>

             {/* 🔘 Interaction Options */}
             {dialogue.options && (
               <div className="space-y-2 pt-2">
                  {dialogue.options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => stalkerService.processAction(opt.action)}
                      className={`w-full group/btn h-14 rounded-2xl flex items-center justify-between px-6 transition-all ${i === 0 ? 'bg-primary text-bg-dark font-black tracking-widest text-[9px] shadow-lg shadow-primary/20' : 'bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                    >
                       <span className="uppercase">{opt.label}</span>
                       <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  ))}
               </div>
             )}

             {/* AI Persona Sync indicator */}
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -translate-y-1/2 translate-x-1/2 rotate-12 group-hover:scale-110 transition-transform">
                <Brain size={250} className="text-white" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔮 STALKER NODE (Floating Bubble) */}
      <motion.button 
        layout
        onClick={() => setIsMinimized(!isMinimized)}
        className={`pointer-events-auto size-20 rounded-[2.5rem] flex items-center justify-center relative transition-all duration-700 shadow-2xl border border-white/10 ${isOpen && !isMinimized ? 'bg-white text-bg-dark rotate-90 scale-75' : 'bg-primary text-bg-dark scale-100 hover:scale-110 shadow-primary/30'}`}
      >
         {isOpen && !isMinimized ? <X size={32} /> : <Cpu size={32} className="animate-spin-slow" strokeWidth={2.5} />}
         
         {!isOpen && (
           <motion.div 
             animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="absolute inset-0 bg-primary/20 rounded-full blur-[20px]"
           />
         )}
         
         {/* Pulse Alert */}
         <AnimatePresence>
           {isOpen && isMinimized && (
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               exit={{ scale: 0 }}
               className="absolute -top-1 -right-1 size-6 bg-red-500 rounded-full flex items-center justify-center text-white border-4 border-[#050505] shadow-lg"
             >
                <div className="animate-ping absolute inset-0 bg-red-500 rounded-full opacity-40" />
                <MessageCircle size={10} fill="currentColor" />
             </motion.div>
           )}
         </AnimatePresence>
      </motion.button>
    </div>
  );
}
