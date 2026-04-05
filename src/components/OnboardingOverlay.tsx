import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleTree } from './RoleTree';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, Rocket, Loader2 } from 'lucide-react';
import NeuralPathfinder from './academy/NeuralPathfinder';
import apiClient from '../services/apiClient';

export const OnboardingOverlay: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'role' | 'soul'>('role');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: string) => {
    if (role === 'user') return;
    
    if (role === 'student') {
      setSelectedRole(role);
      setStep('soul');
    } else {
      finalizeOnboarding(role);
    }
  };

  const finalizeOnboarding = async (role: string, pathId?: string) => {
    setIsLoading(true);
    setError('');
    try {
      const { data: result } = await apiClient.post('/auth/onboarding', { 
        role,
        chosenPathId: pathId 
      });
      if (result.success) {
        setIsSuccess(true);
        setTimeout(async () => {
          await refreshProfile();
        }, 3000);
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
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="py-20 flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden"
              >
                {/* 🌌 Crimson Aura */}
                <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />

                <div className="relative">
                  <motion.div 
                    initial={{ rotate: -180, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    transition={{ type: "spring", damping: 10 }}
                    className="size-40 rounded-full border-2 border-primary/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(0,245,212,0.1)]"
                  >
                    <div className="size-32 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                      <Rocket size={64} className="text-primary animate-pulse" />
                    </div>
                    {/* Pulsing Halos */}
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.1, 0.2] }} 
                      transition={{ repeat: Infinity, duration: 3 }} 
                      className="absolute inset-[-20px] rounded-full border border-primary/30 opacity-20" 
                    />
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white italic">Congratulations</h2>
                  <p className="text-[14px] font-black uppercase tracking-[0.8em] text-primary/80 drop-shadow-[0_0_10px_#00f5d444]">Identity Resonated Successfully</p>
                </div>

                <div className="flex flex-col items-center gap-6 pt-10">
                  <div className="flex items-center gap-3">
                    <div className="size-2 bg-primary rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic leading-none">Finalizing Node Protocol...</span>
                  </div>
                  <div className="w-72 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: '100%' }} 
                      transition={{ duration: 3, ease: "easeInOut" }} 
                      className="h-full bg-primary shadow-[0_0_20px_#00f5d4]" 
                    />
                  </div>
                  <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest italic animate-pulse">Ecosystem Synchronization Active</span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="main-onboarding" className="space-y-12">
                {step === 'role' && (
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
                )}

                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-[3rem] gap-4">
                      <div className="size-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Provisioning Node...</span>
                    </div>
                  )}
                  
                  <AnimatePresence mode="wait">
                    {step === 'role' ? (
                      <motion.div
                        key="role-tree"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <RoleTree onShowDetail={handleRoleSelect} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="soul-selection"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="relative z-[100] mt-[-2rem] mb-[-4rem]">
                           <NeuralPathfinder 
                              isDashboard={true} 
                              onComplete={(pathId) => finalizeOnboarding(selectedRole!, pathId)} 
                           />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {step === 'role' && (
                    <div className="mt-8 flex items-center justify-center gap-12 opacity-20">
                      <div className="flex items-center gap-2"><Shield size={16} /> <span className="text-[8px] font-black uppercase tracking-widest">Secure Handshake</span></div>
                      <div className="flex items-center gap-2"><Rocket size={16} /> <span className="text-[8px] font-black uppercase tracking-widest">Instant Deployment</span></div>
                    </div>
                  )}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
