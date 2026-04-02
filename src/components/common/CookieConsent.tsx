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
      const timer = setTimeout(() => setIsVisible(true), 2000);
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
          className="fixed bottom-6 left-6 right-6 z-[9999] flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-4xl bg-[#0a0a0a]/90 border border-white/10 rounded-[2rem] p-6 backdrop-blur-3xl shadow-3xl pointer-events-auto flex flex-col md:flex-row items-center gap-6 border-glow">
            <div className="size-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0 shadow-lg shadow-red-600/10">
              <Cookie size={28} />
            </div>
            
            <div className="flex-1 space-y-1 text-center md:text-left">
              <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center justify-center md:justify-start gap-2">
                Grid Data Protocol <ShieldCheck size={14} className="text-red-500" />
              </h4>
              <p className="text-[11px] font-medium text-white/40 leading-relaxed max-w-2xl">
                Red Griffin utilizes essential cookies and telemetry nodes to optimize your interface and secure your session. By continuing your traversal through our ecosystem, you acknowledge our tracking protocols. 
                <a href={`/${lang}/privacy`} className="text-red-500 hover:underline ml-1 font-bold">Review Documentation</a>.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setIsVisible(false)}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Declined
              </button>
              <button 
                onClick={handleAccept}
                className="px-8 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 group"
              >
                Acknowledge <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
