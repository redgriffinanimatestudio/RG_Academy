import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Compass, Zap, Award, Shield, FileText, Users, CheckCircle, 
  X, ChevronRight, ChevronLeft, Sparkles, Box 
} from 'lucide-react';
import { ACADEMY_GUIDE_STEPS, STUDIO_GUIDE_STEPS } from '../constants/guide_content';
import { useParams } from 'react-router-dom';

const iconMap: Record<string, any> = {
  UserPlus, Compass, Zap, Award, Shield, FileText, Users, CheckCircle
};

interface GuideOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'academy' | 'studio';
}

export const GuideOverlay: React.FC<GuideOverlayProps> = ({ isOpen, onClose, mode }) => {
  const { lang = 'eng' } = useParams<{ lang: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = mode === 'academy' ? ACADEMY_GUIDE_STEPS[lang] || ACADEMY_GUIDE_STEPS.eng : STUDIO_GUIDE_STEPS[lang] || STUDIO_GUIDE_STEPS.eng;
  
  if (!isOpen) return null;

  const step = steps[currentStep];
  const Icon = iconMap[step.icon] || Box;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          onClick={onClose}
        />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-5xl bg-[#0a0a0a] border border-white/5 rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl relative"
        >
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
             {/* Visual Side */}
             <div className="hidden lg:block relative bg-gradient-to-br from-white/5 to-transparent border-r border-white/5 p-16">
               <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                 <div className="grid grid-cols-10 gap-4 rotate-12 scale-150">
                   {Array.from({ length: 100 }).map((_, i) => (
                     <div key={i} className="size-2 bg-white/5 rounded-full" />
                   ))}
                 </div>
               </div>

               <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="space-y-4">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-lg text-[9px] font-black uppercase tracking-[0.3em]">
                     <Sparkles size={12} /> Optimization Protocol
                   </div>
                   <h2 className="text-6xl font-black uppercase tracking-tighter text-white italic leading-none">
                     Genesis <br /><span className={mode === 'academy' ? 'text-primary' : 'text-primary-hover'}>Evolution.</span>
                   </h2>
                 </div>

                 <div className="space-y-8">
                   {steps.map((s, i) => (
                     <div key={i} className={`flex items-center gap-6 transition-all duration-500 ${i === currentStep ? 'opacity-100' : 'opacity-20'}`}>
                        <div className={`size-1.5 rounded-full ${i <= currentStep ? (mode === 'academy' ? 'bg-primary shadow-[0_0_10px_#00ff9d]' : 'bg-primary-hover shadow-[0_0_10px_#00d1ff]') : 'bg-white/10'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{s.title}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>

             {/* Guide Side */}
             <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-between relative min-h-[500px]">
                <button onClick={onClose} className="absolute right-8 top-8 text-white/20 hover:text-white transition-colors">
                  <X size={24} />
                </button>

                <div className="space-y-10 flex-1 flex flex-col justify-center">
                   <motion.div 
                     key={currentStep}
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="space-y-8"
                   >
                     <div className={`size-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center ${mode === 'academy' ? 'text-primary' : 'text-primary-hover'} shadow-2xl overflow-hidden relative group`}>
                        <div className="absolute inset-0 bg-current opacity-5 animate-pulse" />
                        <Icon size={32} strokeWidth={2.5} />
                     </div>

                     <div className="space-y-4">
                       <h3 className="text-3xl font-black uppercase tracking-tight text-white italic">
                         {step.title}
                       </h3>
                       <p className="text-sm font-medium text-white/40 leading-relaxed max-w-md">
                         {step.desc}
                       </p>
                     </div>
                   </motion.div>
                </div>

                <div className="flex items-center justify-between pt-12 border-t border-white/5">
                   <button 
                     disabled={currentStep === 0} 
                     onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                     className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white disabled:opacity-0 transition-all border border-white/5"
                   >
                     <ChevronLeft size={20} />
                   </button>

                   <div className="flex items-center gap-2">
                     <span className="text-base font-black text-white italic">{currentStep + 1}</span>
                     <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">/ {steps.length}</span>
                   </div>

                   <button 
                     onClick={() => {
                       if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
                       else onClose();
                     }}
                     className={`px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl flex items-center gap-3 ${mode === 'academy' ? 'bg-primary text-bg-dark shadow-primary/20' : 'bg-primary-hover text-white shadow-primary-hover/20'}`}
                   >
                     {currentStep === steps.length - 1 ? 'Execute Protocol' : 'Sync Next'}
                     <ChevronRight size={16} />
                   </button>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
