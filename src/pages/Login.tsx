import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, User, Lock, Mail, Github, Globe, 
  ChevronRight, ChevronLeft, Sparkles, Shield, UserPlus, CheckCircle2, Zap, Check,
  Info, X, ArrowLeft, Loader2, GraduationCap, Briefcase, Users,
  Smartphone, Link as LinkIcon, Send, BriefcaseIcon, UserCheck,
  Calendar, Binary, Cpu, SmartphoneIcon, Share2, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleTree } from '../components/RoleTree';
import { InputWithStatus } from '../components/auth/InputWithStatus';
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter';
import { CountrySelector } from '../components/auth/CountrySelector';
import { CyberCalendar } from '../components/auth/CyberCalendar';
import { ALL_COUNTRIES } from '../utils/countries';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/apiClient';
import Preloader from '../components/Preloader';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';

// v2.30 Neural Architecture Decoupling: Registration Shards
import IdentitySidebar from '../components/auth/registration/IdentitySidebar';
import RegStep1Role from '../components/auth/registration/RegStep1Role';
import RegStep2Network from '../components/auth/registration/RegStep2Network';
import RegStep3Identity from '../components/auth/registration/RegStep3Identity';
import RegStep4Specs from '../components/auth/registration/RegStep4Specs';
import RegStep5Legal from '../components/auth/registration/RegStep5Legal';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regStep, setRegStep] = useState(() => {
    const saved = sessionStorage.getItem('rg_reg_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const { t, i18n: i18nInstance } = useTranslation();
  const { lang = 'eng' } = useParams();
  const navigate = useNavigate();
  const { login, register, socialAuth, onboard, user } = useAuth();

  // Registration Form State with Session Persistence
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('rg_reg_data');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      phone: '',
      phoneCode: '7',
      country: '',
      citizenship: '',
      selectedRole: 'user',
      bio: '',
      portfolioUrl: '',
      linkedInUrl: '',
      telegramHandle: '',
      gender: 'none' as 'male' | 'female' | 'other' | 'none',
      dateOfBirth: ''
    };
  });

  // Save to Session Storage on change
  useEffect(() => {
    sessionStorage.setItem('rg_reg_data', JSON.stringify(formData));
    sessionStorage.setItem('rg_reg_step', regStep.toString());
  }, [formData, regStep]);

  // Validation States
  const [emailStatus, setEmailStatus] = useState<'none' | 'loading' | 'success' | 'error'>('none');
  const [emailError, setEmailError] = useState('');
  const [passStrength, setPassStrength] = useState<0 | 1 | 2 | 3>(0);
  const [passConfirmStatus, setPassConfirmStatus] = useState<'none' | 'success' | 'error'>('none');
  const [phoneStatus, setPhoneStatus] = useState<'none' | 'success' | 'warning' | 'error'>('none');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Sync language with URL
  useEffect(() => {
    if (lang && i18nInstance.language !== lang) {
      i18nInstance.changeLanguage(lang);
    }
  }, [lang, i18nInstance]);

  // Real-time Email Check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!formData.email) { setEmailStatus('none'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email !== 'admin') {
        setEmailStatus('error');
        setEmailError('Invalid Node Pattern (Email)');
        return;
      }
      setEmailStatus('loading');
      try {
        const { data } = await apiClient.post('/auth/check-email', { email: formData.email });
        if (data.success) {
          const exists = !data.data.available;
          setEmailStatus(exists ? 'error' : 'success');
          setEmailError(exists ? 'Node identifier already synchronized' : '');
        }
      } catch {
        setEmailStatus('none');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [formData.email]);

  // Passwords match check
  useEffect(() => {
    if (!formData.confirmPassword) { setPassConfirmStatus('none'); return; }
    setPassConfirmStatus(formData.password === formData.confirmPassword ? 'success' : 'error');
  }, [formData.password, formData.confirmPassword]);

  // Password strength
  useEffect(() => {
    const p = formData.password;
    if (!p) setPassStrength(0);
    else if (p.length < 6) setPassStrength(1);
    else if (p.length < 12) setPassStrength(2);
    else setPassStrength(3);
  }, [formData.password]);

  // Phone validation
  useEffect(() => {
    if (!formData.phone) { setPhoneStatus('none'); return; }
    if (formData.phone.length >= 7) setPhoneStatus('success');
    else setPhoneStatus('warning');
  }, [formData.phone]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsShaking(false);
    try {
      const result = await login(formData.email, formData.password);
      if (result.user.isOnboarded === false) {
        setMode('register');
        setRegStep(1);
      } else {
        navigate(`/${lang}/dashboard`);
      }
    } catch (err: any) {
      setIsShaking(true);
      setError(err.response?.data?.error || t('login_failed_notice'));
      setTimeout(() => setIsShaking(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterFinal = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Browser-native base64 encoding (Buffer.from is not available in browsers)
      const signature = btoa(unescape(encodeURIComponent(`SIGNED_BY_${formData.email}_AT_${Date.now()}`)));
      const payload = {
        ...formData,
        role: formData.selectedRole,
        profileData: {
          bio: formData.bio || `Synchronized via ${formData.selectedRole.toUpperCase()} PROTOCOL`,
          country: formData.country,
          citizenship: formData.citizenship,
          linkedInUrl: formData.linkedInUrl,
          telegramHandle: formData.telegramHandle,
          portfolioUrl: formData.portfolioUrl,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth
        },
        signature
      };

      if (user && (user.id || user.uid)) {
        await onboard(payload);
      } else {
        await register(payload);
      }
      sessionStorage.removeItem('rg_reg_data');
      sessionStorage.removeItem('rg_reg_step');
      navigate(`/${lang}/dashboard`);
    } catch (err: any) {
      console.error('❌ [REGISTRATION] Failure during final submission:', err);
      setError(err.response?.data?.error || 'Registration failed: Internal Server Error or Connection Issue');
    } finally {
      setIsLoading(false);
    }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-2 sm:p-8 font-['Inter'] selection:bg-red-500/30 overflow-x-hidden relative">
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      
      <motion.div 
        variants={shakeVariants}
        animate={isShaking ? "shake" : { opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-7xl bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/5 rounded-[2rem] sm:rounded-[4.5rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row relative group z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/5 via-transparent to-emerald-600/5 pointer-events-none" />
        
        {/* Sidebar */}
        <div className="lg:w-[480px] p-8 sm:p-16 border-b lg:border-r lg:border-b-0 border-white/5 relative z-10 flex flex-col justify-center bg-black/30 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
            <Binary size={500} className="text-white -rotate-12 translate-x-[-100px]" />
          </div>
          {/* Sidebar content removed - moved to Main Content as per UI/UX optimization */}
          <div className="hidden lg:block relative space-y-12 opacity-20 hover:opacity-40 transition-opacity duration-1000">
            <div className="space-y-4">
              <div className="h-[2px] w-12 bg-red-600/30" />
              <p className="text-[10px] font-black uppercase tracking-[1em] text-white/10 italic">Red Griffin Sanctum</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 sm:p-20 relative z-10 flex flex-col min-h-[650px] bg-black/20">
          <AnimatePresence mode="wait">
            <motion.div key="form-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col h-full">
              <div className="flex items-center gap-6 mb-12">
                <div className={`p-4 rounded-[1.8rem] transition-all duration-700 ${mode === 'login' ? 'bg-red-700 text-white shadow-[0_0_50px_rgba(185,28,28,0.5)]' : 'bg-white/10 text-white/40 hover:text-white'}`}>
                  <LogIn size={26} />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase text-white tracking-[0.2em] leading-tight">
                    {mode === 'login' ? t('node_connect') : t('identity_forge')}
                  </h2>
                  <p className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20 italic">{t('reg_protocol')}</p>
                </div>
              </div>

              {/* Sub-Header Branding Area (Blue Rectangle Zone) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                    <Shield size={18} className="text-red-600" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-white/60">Blood-Codec Ritual</span>
                    <span className="block text-[8px] font-bold text-white/20 uppercase tracking-widest italic">Secure Vessel Access</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Globe size={18} className="text-emerald-500" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-white/60">Celestial Weave</span>
                    <span className="block text-[8px] font-bold text-white/20 uppercase tracking-widest italic">Attuned Network</span>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div key="login-shard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 flex-1 flex flex-col justify-center">
                    {isLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center space-y-8">
                        <Preloader message="Communing with Soul Sigil..." size="md" />
                        <div className="text-[10px] font-black uppercase text-red-500/40 tracking-[0.4em] animate-pulse">Establishing Aetheric Link</div>
                      </div>
                    ) : (
                      <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                          <InputWithStatus id="login-email" label="Soul Sigil" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="VESSEL_ID@PROTOCOL" hint="Unified essence signature" status={emailStatus} icon={<User size={18} />} required />
                          <InputWithStatus id="login-password" label="Void Cipher" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="••••••••" hint="Aetheric secure passkey" icon={<Lock size={18} />} required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <button type="submit" disabled={isLoading} className="bg-red-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-red-600 transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(185,28,28,0.3)] flex items-center justify-center gap-3 group relative overflow-hidden">
                            <span className="relative z-10">Attune Vessel</span>
                            <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button type="button" onClick={() => setMode('register')} className="bg-white/5 border border-white/5 text-white/50 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3">
                             Awaken Essence <UserPlus size={16} />
                          </button>
                        </div>

                        <SocialAuthButtons className="pt-6" />
                      </form>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="register-shard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between px-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className="flex items-center gap-2">
                          <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-700 ${regStep >= s ? 'bg-red-700 border-red-700 shadow-[0_0_15px_rgba(185,28,28,0.4)] text-white' : 'border-white/10 text-white/20'}`}>
                            {s}
                          </div>
                          {s < 5 && <div className={`h-[2px] w-4 lg:w-10 transition-all duration-700 ${regStep > s ? 'bg-red-700' : 'bg-white/5'}`} />}
                        </div>
                      ))}
                    </div>
                    <div className={`flex flex-col lg:flex-row gap-6 sm:gap-12 flex-1 ${regStep > 1 ? 'items-stretch' : 'items-center'}`}>
                      {regStep > 1 && <IdentitySidebar role={formData.selectedRole} step={regStep} />}
                      <form onSubmit={(e) => { e.preventDefault(); if (regStep < 5) setRegStep(regStep + 1); else handleRegisterFinal(); }} className="flex-1 flex flex-col">
                        <div className="flex-1">
                          {regStep === 1 ? (
                            <RegStep1Role onSelect={(id) => { handleInputChange('selectedRole', id); setRegStep(2); }} />
                          ) : regStep === 2 ? (
                            <RegStep2Network formData={formData} onChange={handleInputChange} emailStatus={emailStatus} emailError={emailError} passStrength={passStrength} passConfirmStatus={passConfirmStatus} phoneStatus={phoneStatus} onNext={() => setRegStep(3)} />
                          ) : regStep === 3 ? (
                            <RegStep3Identity formData={formData} onChange={handleInputChange} onNext={() => setRegStep(4)} lang={lang} />
                          ) : regStep === 4 ? (
                            <RegStep4Specs formData={formData} onChange={handleInputChange} onNext={() => setRegStep(5)} onSkip={() => setRegStep(5)} />
                          ) : regStep === 5 ? (
                            <RegStep5Legal formData={formData} lang={lang} termsAccepted={termsAccepted} onToggleTerms={() => setTermsAccepted(!termsAccepted)} onFinalize={handleRegisterFinal} isLoading={isLoading} />
                          ) : null}
                        </div>
                      </form>
                    </div>
                    <div className="text-center pt-8 border-t border-white/5 mt-auto">
                      <button type="button" onClick={() => { if (regStep > 1) setRegStep(regStep - 1); else { setMode('login'); setError(''); } }} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-red-600 transition-all flex items-center justify-center gap-3 mx-auto py-2 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('go_back')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-red-950/20 border border-red-900/50 rounded-[2rem] relative overflow-hidden">
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="size-10 rounded-2xl bg-red-900/30 flex items-center justify-center text-red-500 shrink-0"><Shield size={20} className="animate-pulse" /></div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Security Fault Detected</h4>
                      <p className="text-[11px] font-bold text-white/80 leading-relaxed uppercase">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {(mode === 'login' || (mode === 'register' && regStep === 1)) && (
                <div className="pt-12 mt-auto border-t border-white/5 space-y-6">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <span className="relative bg-black px-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">External Handshake</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <button onClick={async () => { try { const res: any = await socialAuth({ provider: 'github' } as any); if (res?.user?.isOnboarded === false) { setMode('register'); setRegStep(1); } } catch(e) {} }} className="py-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:bg-white/5 hover:text-white transition-all">
                      <Github size={20} /> GitHub
                    </button>
                    <button onClick={async () => { try { const res: any = await socialAuth({ provider: 'google' } as any); if (res?.user?.isOnboarded === false) { setMode('register'); setRegStep(1); } } catch(e) {} }} className="py-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:bg-white/5 hover:text-white transition-all">
                      <Globe size={20} /> Google
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
