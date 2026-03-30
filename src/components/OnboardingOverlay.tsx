import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleTree } from './RoleTree';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, Rocket, Loader2 } from 'lucide-react';
import apiClient from '../services/apiClient';

export const OnboardingOverlay: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = async (role: string) => {
    if (role === 'user') return;
    
    setIsLoading(true);
    setError('');
    try {
      // Use the new onboarding endpoint
      const { data: result } = await apiClient.post('/auth/onboarding', { role });
      if (result.success) {
        await refreshProfile();
      } else {
        setError(result.error || 'Onboarding failed');
      }
    } catch (err: any) {
      setError('Communication link failure. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile || profile.role !== 'user') return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-[#0f0f0f] border border-white/5 rounded-[4rem] p-10 lg:p-16 shadow-2xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} /> Identity Required
            </div>
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-white italic leading-none">
              Initialize Your <span className="text-primary">Node Path</span>
            </h2>
            <p className="max-w-xl mx-auto text-xs font-bold text-white/30 uppercase tracking-widest leading-relaxed">
              Your profile is currently on a neutral frequency. To access the ecosystem hubs, you must select your primary evolution branch.
            </p>
          </div>

          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-[3rem] gap-4">
                <Loader2 className="text-primary animate-spin" size={48} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Provisioning Node...</span>
              </div>
            )}
            
            <RoleTree onShowDetail={handleRoleSelect} />
            
            <div className="mt-8 flex items-center justify-center gap-12 opacity-20">
               <div className="flex items-center gap-2"><Shield size={16} /> <span className="text-[8px] font-black uppercase tracking-widest">Secure Handshake</span></div>
               <div className="flex items-center gap-2"><Rocket size={16} /> <span className="text-[8px] font-black uppercase tracking-widest">Instant Deployment</span></div>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
              {error}
            </motion.div>
          )}

          <div className="text-center">
            <p className="text-[9px] font-black uppercase text-white/10 tracking-[0.5em] italic">
              Red Griffin Digital Ecosystem Architecture v3.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
