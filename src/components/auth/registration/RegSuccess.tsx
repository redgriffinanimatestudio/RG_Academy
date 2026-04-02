import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface RegSuccessProps {
  redirectCountdown: number;
  onEnterHub: () => void;
}

const RegSuccess: React.FC<RegSuccessProps> = ({
  redirectCountdown,
  onEnterHub
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center justify-center py-10 text-center space-y-12"
    >
       <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full animate-pulse" />
          <motion.div 
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="size-32 rounded-[2.5rem] bg-[#0a0a0a] border-2 border-emerald-500/40 flex items-center justify-center text-emerald-500 relative z-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
          >
             <CheckCircle2 size={64} className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </motion.div>
       </div>

       <div className="space-y-4 relative z-10">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black uppercase text-white tracking-widest"
          >
             Welcome
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[12px] font-black uppercase tracking-[0.8em] text-emerald-400 italic"
          >
             Node Successfully Forged
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[12px] font-medium text-white/40 max-w-[320px] mx-auto mt-6 leading-relaxed"
          >
             Your identity shard is now synchronized with our global grid. Initializing neural bridge to your dashboard...
          </motion.p>
       </div>

       <div className="w-full max-w-[280px] space-y-4">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: "100%" }}
               animate={{ width: "0%" }}
               transition={{ duration: 5, ease: "linear" }}
               className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
             />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
             Auto-redirect in {redirectCountdown}s...
          </p>
       </div>

       <button 
         onClick={onEnterHub}
         className="px-14 py-5 bg-white text-black rounded-2xl text-[13px] font-black uppercase tracking-[0.5em] hover:bg-emerald-500 hover:text-white transition-all shadow-3xl flex items-center gap-5 group active:scale-95"
       >
          ENTER HUB <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
       </button>
    </motion.div>
  );
};

export default RegSuccess;
