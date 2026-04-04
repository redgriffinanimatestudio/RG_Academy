import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

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
      initial={{ opacity: 0, scale: 0.95, y: 30 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-10 text-center space-y-12"
    >
       <div className="relative group">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-emerald-500/30 blur-[100px] rounded-full" 
          />
          <motion.div 
            initial={{ rotate: -180, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
            className="size-36 rounded-[3rem] bg-[#050505] border shadow-[0_0_80px_rgba(16,185,129,0.3)] border-emerald-500/40 flex items-center justify-center text-emerald-500 relative z-10"
          >
             <CheckCircle2 size={72} className="drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
             
             {/* Particles Overlay */}
             <motion.div 
               initial={{ opacity: 0, scale: 0 }} 
               animate={{ opacity: 1, scale: 1 }} 
               transition={{ delay: 0.8 }} 
               className="absolute -top-4 -right-4 text-yellow-400"
             >
                <Sparkles size={32} className="animate-pulse drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, scale: 0 }} 
               animate={{ opacity: 1, scale: 1 }} 
               transition={{ delay: 1 }} 
               className="absolute -bottom-2 -left-4 text-emerald-400"
             >
                <Sparkles size={24} className="animate-bounce drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
             </motion.div>
          </motion.div>
       </div>

       <div className="space-y-4 relative z-10">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-black uppercase text-white tracking-[0.2em] drop-shadow-md"
          >
             Congratulations
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[12px] font-black uppercase tracking-[0.8em] text-emerald-400 italic"
          >
             Node Successfully Forged
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-[12px] font-medium text-white/40 max-w-[320px] mx-auto mt-6 leading-relaxed"
          >
             Your identity shard is now synchronized with our global grid. Initializing neural bridge to your dashboard...
          </motion.p>
       </div>

       <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 1 }}
         className="w-full max-w-[280px] space-y-4"
       >
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: "100%" }}
               animate={{ width: "0%" }}
               transition={{ duration: redirectCountdown > 0 ? redirectCountdown : 3, ease: "linear" }}
               className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
             />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
             Auto-redirect in {redirectCountdown}s...
          </p>
       </motion.div>

       <motion.button 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 1.2 }}
         onClick={onEnterHub}
         className="px-14 py-5 bg-white text-black rounded-2xl text-[13px] font-black uppercase tracking-[0.5em] hover:bg-emerald-500 hover:text-white transition-all shadow-3xl flex items-center gap-5 group active:scale-95"
       >
          ENTER HUB <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
       </motion.button>
    </motion.div>
  );
};

export default RegSuccess;
