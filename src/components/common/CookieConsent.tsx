import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ChevronRight, Cookie } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const { lang = 'eng' } = useParams();

  useEffect(() => {
    const consent = localStorage.getItem('rg_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('rg_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 z-[9999] flex justify-center"
        >
          <div className="w-full max-w-5xl bg-bg-card border border-border-main rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-3xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -left-24 size-48 bg-emerald-500/10 blur-[100px] pointer-events-none" />
            
            <div className="size-16 rounded-[1.25rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-xl shadow-emerald-500/5 transition-transform group-hover:scale-110">
              <ShieldCheck size={32} />
            </div>
            
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-ink">
                  Grid Data Protocol 
                </h4>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Secure</div>
              </div>
              <p className="text-[12px] font-medium text-text-muted leading-relaxed max-w-2xl">
                Red Griffin utilizes essential telemetry nodes and session cookies to optimize your terminal interface and secure regional synchronization. By navigating our ecosystem, you acknowledge our tracking protocols. 
                <a href={`/${lang}/privacy`} className="text-emerald-600 hover:text-emerald-500 underline ml-1 font-bold">Access Documentation</a>.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <button 
                onClick={() => setIsVisible(false)}
                className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-ink transition-colors"
              >
                Declined
              </button>
              <button 
                onClick={handleAccept}
                className="px-10 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95 group"
              >
                Acknowledge <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
