import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User, Mail, ShieldCheck, X } from 'lucide-react';

interface OAuthConsentProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  appName?: string;
}

const OAuthConsent: React.FC<OAuthConsentProps> = ({ isOpen, onClose, onAccept, appName = "Red Griffin Ecosystem" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Consent Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#121212] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-bg-dark shadow-lg shadow-primary/20">
                    <span className="text-lg font-black italic">RG</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white uppercase tracking-tighter">{appName}</span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Wants to access your Google Account</span>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* User Identity (Dummy) */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white/20">
                  <User size={24} />
                </div>
                <div className="flex-1">
                  <div className="h-2 w-32 bg-white/20 rounded-full mb-2" />
                  <div className="h-1.5 w-24 bg-white/10 rounded-full" />
                </div>
              </div>

              {/* Permissions Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 px-2">Requested Access</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5 group">
                    <div className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">View your basic profile info</p>
                      <p className="text-[10px] text-white/40 font-medium mt-1">Your name, profile picture, and gender if public.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5 group">
                    <div className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">View your email address</p>
                      <p className="text-[10px] text-white/40 font-medium mt-1">The email address associated with your Google account.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer / Privacy Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                  <ShieldCheck size={16} className="text-primary" />
                  <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Verified and Secure Authorization</p>
                </div>
                
                <p className="text-[9px] text-white/20 text-center font-medium leading-relaxed px-4">
                  By clicking "Allow", you authorize <span className="text-white/40">{appName}</span> to use your information in accordance with their <span className="text-white/40 underline cursor-pointer hover:text-white transition-colors">Terms of Service</span> and <span className="text-white/40 underline cursor-pointer hover:text-white transition-colors">Privacy Policy</span>.
                </p>

                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border border-white/5"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={onAccept}
                    className="flex-1 py-4 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    Allow
                  </button>
                </div>
              </div>
            </div>
            
            {/* Security Banner */}
            <div className="bg-black/40 py-4 px-8 border-t border-white/5 flex items-center justify-center gap-2">
              <Globe size={12} className="text-white/20" />
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Google OAuth 2.0 Secure System</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OAuthConsent;
