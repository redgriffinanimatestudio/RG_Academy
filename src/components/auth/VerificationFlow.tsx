import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ShieldCheck, ArrowRight, CheckCircle2, Lock, Smartphone, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function VerificationFlow() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'phone' | 'success'>(profile?.emailVerified ? 'phone' : 'email');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState(profile?.phone || '');

  const handleVerifyEmail = async () => {
    setLoading(true);
    // Mock API Call
    setTimeout(() => {
      setStep('phone');
      setLoading(false);
    }, 1500);
  };

  const handleVerifyPhone = async () => {
    setLoading(true);
    // Mock API Call
    setTimeout(() => {
      setStep('success');
      setLoading(false);
    }, 1500);
  };

  const handleComplete = async () => {
    await refreshProfile();
    navigate('/aca/eng/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* 🔮 Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-pro-max p-10 space-y-8 relative z-10 border border-white/10 shadow-2xl rounded-[3rem]"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="size-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
            <ShieldCheck size={40} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">Neural Identity <span className="text-primary">Sync.</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Protocol_Level: Specialist_Onboarding</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div 
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="text-primary" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60 italic">Email_Verification</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                  We've sent a synchronization code to <span className="text-white font-bold">{profile?.email}</span>. Please authorize the link.
                </p>
              </div>
              <button 
                onClick={handleVerifyEmail}
                disabled={loading}
                className="w-full h-16 bg-white text-bg-dark rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Authorizing...' : 'Verify Email Node'}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 'phone' && (
            <motion.div 
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="relative group">
                  <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 text-sm font-bold text-white outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="text"
                    placeholder="ENTER_6_DIGIT_CODE"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 text-sm font-mono tracking-[0.5em] text-primary outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleVerifyPhone}
                  disabled={loading || code.length < 6}
                  className="w-full h-16 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? 'Synchronizing...' : 'Finalize Identity Protocol'}
                  <CheckCircle2 size={16} />
                </button>
                <button className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors py-2 flex items-center justify-center gap-2">
                  <Send size={12} /> Resend Pulse
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="space-y-2">
                <div className="text-primary font-black uppercase tracking-[0.5em] text-[10px] italic">Access_Granted</div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Identity <span className="text-primary">Locked.</span></h2>
              </div>
              <p className="text-white/40 text-sm italic leading-relaxed">
                Your neural profile is now fully synchronized. The **AI STALKER** protocol is ready for activation.
              </p>
              <button 
                onClick={handleComplete}
                className="w-full h-20 bg-white text-bg-dark rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-primary transition-all shadow-2xl active:scale-95"
              >
                Enter Global Nexus Hub
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-white/10 italic">
                <span>Security_Status: Nominal</span>
                <span>Node: RG_VERIFY_442</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
