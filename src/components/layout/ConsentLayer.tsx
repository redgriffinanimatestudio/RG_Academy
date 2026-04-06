import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Globe, ChevronRight, Lock, ArrowRight, X } from 'lucide-react';

export default function ConsentLayer() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const consent = localStorage.getItem('rg_consent_v1');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('rg_consent_v1', 'accepted');
    setShow(false);
  };

  const handleMinimal = () => {
    localStorage.setItem('rg_consent_v1', 'minimal');
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-8 pointer-events-none">
        <motion.div
           initial={{ opacity: 0, y: 100, scale: 0.9 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, scale: 0.9, y: 40 }}
           className="w-full max-w-2xl bg-bg-card backdrop-blur-3xl border border-border-main rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto"
        >
          <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar Branding */}
            <div className="md:w-1/3 bg-primary/10 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border-main">
              <div className="space-y-4">
                <div className="size-12 rounded-2xl bg-bg-dark flex items-center justify-center text-primary border border-border-main shadow-lg">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic text-ink leading-tight">Protocol <br /><span className="text-primary">Initialization.</span></h3>
              </div>
              <div className="hidden md:block py-4">
                <div className="text-[8px] font-black uppercase tracking-[0.4em] text-text-muted opacity-40 italic">Red Griffin Edict v2.1</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 sm:p-10 relative">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary italic">Phase 01: Legal Framework</div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-ink italic">Regulatory Compliance</h4>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed font-medium">
                      Red Griffin Academy operates within a strictly defined legal framework for personal data processing. We adhere to **GDPR**, **ISO/IEC 27001**, and international digital rights standards to ensure your identity remains sovereign and secure.
                    </p>
                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => setStep(2)}
                        className="flex-1 py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        Proceed to Initialization <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary italic">Phase 02: Context Optimization</div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter text-ink italic">Interaction Design</h4>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed font-medium">
                      To provide you with the most relevant career architecture and localized communication channels, we request permission to process geographical context and professional aspirations. **No rights are infringed during this synchronization.**
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <button 
                          onClick={handleAccept}
                          className="py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                        >
                          Synchronize Identity <ArrowRight size={16} />
                        </button>
                        <button 
                          onClick={handleMinimal}
                          className="py-4 bg-bg-dark border border-border-main text-text-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border-main transition-all"
                        >
                          Basic Access
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
