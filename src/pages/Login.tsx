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

// v2.30 Neural Architecture Decoupling: Registration Shards
import IdentitySidebar from '../components/auth/registration/IdentitySidebar';
import RegStep1Role from '../components/auth/registration/RegStep1Role';
import RegStep2Network from '../components/auth/registration/RegStep2Network';
import RegStep3Identity from '../components/auth/registration/RegStep3Identity';
import RegStep4Specs from '../components/auth/registration/RegStep4Specs';
import RegStep5Legal from '../components/auth/registration/RegStep5Legal';
import RegSuccess from '../components/auth/registration/RegSuccess';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regStep, setRegStep] = useState(() => {
    const saved = sessionStorage.getItem('rg_reg_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
    try {
      const result = await login(formData.email, formData.password);
      if (result.user.isOnboarded === false) {
        setMode('register');
        setRegStep(1);
      } else {
        navigate(`/${lang}/dashboard`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t('login_failed_notice'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterFinal = async () => {
    setIsLoading(true);
    setError('');
    try {
      const signature = Buffer.from(`SIGNED_BY_${formData.email}_AT_${Date.now()}`).toString('base64');
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
        console.log("[AUTH] Authenticated node detected. Executing ONBOARDING PROTOCOL.");
        await onboard(payload);
      } else {
        console.log("[AUTH] No active session. Executing NEW NODE REGISTRATION.");
        await register(payload);
      }
      setIsRegistered(true);
      sessionStorage.removeItem('rg_reg_data');
      sessionStorage.removeItem('rg_reg_step');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isRegistered && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    } else if (isRegistered && redirectCountdown === 0) {
      navigate(`/${lang}/dashboard`);
    }
    return () => clearTimeout(timer);
  }, [isRegistered, redirectCountdown, navigate, lang]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-2 sm:p-8 font-['Inter'] selection:bg-red-500/30 overflow-x-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-7xl bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/5 rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-emerald-500/5 opacity-30 pointer-events-none" />
        
        <div className="lg:w-[420px] p-6 sm:p-14 border-b lg:border-r lg:border-b-0 border-white/5 relative z-10 flex flex-col justify-center bg-black/20">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
            <div className="size-16 rounded-[2rem] bg-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform duration-500">
               <Zap size={32} className="text-white fill-white" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                Red Griffin<br/><span className="text-red-600">Academy</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 italic">Neural Grid Access v2.29</p>
            </div>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 text-white/40">
                <Shield size={18} className="text-red-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-loose">Secured by Industrial-Grade Identity Sharding Protocol</span>
              </div>
              <div className="flex items-center gap-4 text-white/40">
                <Globe size={18} className="text-[#00f3ff]" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-loose">Global Creative Network Synchronized</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 p-6 sm:p-14 relative z-10 flex flex-col min-h-[500px]">
          <div className="flex items-center gap-6 mb-12">
            <div className={`p-4 rounded-2.5xl transition-all duration-500 ${mode === 'login' ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'bg-white/5 text-white/40 hover:text-white'}`}>
              <LogIn size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-widest leading-tight">
                {mode === 'login' ? t('node_connect') : t('identity_forge')}
              </h2>
              <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/30">{t('reg_protocol')}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 flex-1 flex flex-col justify-center">
                {isLoading ? (
                  <div className="py-20">
                    <Preloader message="Authenticating Node..." size="md" />
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleLogin} className="space-y-6">
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <InputWithStatus 
                          id="login-email"
                          autoComplete="username"
                          label="Access Key / Email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="ENTER NODE ID"
                          hint="Use your registered email or system-assigned node identifier."
                          status={emailStatus}
                          errorText={emailError}
                          icon={<User size={18} />}
                          required
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <InputWithStatus 
                          id="login-password"
                          autoComplete="current-password"
                          label="Encryption Password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="ENTER PASSCODE"
                          hint="Enter the encryption key associated with this node."
                          icon={<Lock size={18} />}
                          required
                        />
                      </motion.div>

                      <div className="grid grid-cols-2 gap-4">
                        <button type="submit" disabled={isLoading} className="bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-700 transition-all shadow-2xl shadow-red-500/30 flex items-center justify-center gap-2 group">
                          Connect <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button type="button" onClick={() => setMode('register')} className="bg-white/5 border border-white/10 text-white/60 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                           New Node <UserPlus size={14} />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between px-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`size-6 sm:size-7 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all duration-500 ${regStep >= s ? 'bg-red-600 border-red-600 text-white' : 'border-white/10 text-white/20'}`}>
                        {s}
                      </div>
                      {s < 5 && <div className={`h-[2px] w-4 lg:w-8 transition-all duration-500 ${regStep > s ? 'bg-red-600' : 'bg-white/10'}`} />}
                    </div>
                  ))}
                </div>

                <div className={`flex flex-col lg:flex-row gap-4 sm:gap-10 ${regStep > 1 ? 'items-stretch' : 'items-center'}`}>
                  {regStep > 1 && !isRegistered && <IdentitySidebar role={formData.selectedRole} step={regStep} />}
                  
                  <form 
                    onSubmit={(e) => { 
                      e.preventDefault(); 
                      if (regStep < 5) setRegStep(regStep + 1); 
                      else handleRegisterFinal();
                    }}
                    className="flex-1 flex flex-col min-w-0"
                  >
                    <div className="flex-1 px-1">
                      {regStep === 1 ? (
                        <RegStep1Role onSelect={(id) => { handleInputChange('selectedRole', id); setRegStep(2); }} />
                      ) : regStep === 2 ? (
                        <RegStep2Network 
                          formData={formData} 
                          onChange={handleInputChange} 
                          emailStatus={emailStatus} 
                          emailError={emailError} 
                          passStrength={passStrength} 
                          passConfirmStatus={passConfirmStatus} 
                          phoneStatus={phoneStatus} 
                          onNext={() => setRegStep(3)} 
                        />
                      ) : regStep === 3 ? (
                        <RegStep3Identity 
                          formData={formData} 
                          onChange={handleInputChange} 
                          onNext={() => setRegStep(4)} 
                          lang={lang} 
                        />
                      ) : regStep === 4 ? (
                        <RegStep4Specs 
                          formData={formData} 
                          onChange={handleInputChange} 
                          onNext={() => setRegStep(5)} 
                          onSkip={() => setRegStep(5)} 
                        />
                      ) : regStep === 5 ? (
                        <RegStep5Legal 
                          formData={formData} 
                          lang={lang} 
                          termsAccepted={termsAccepted} 
                          onToggleTerms={() => setTermsAccepted(!termsAccepted)} 
                          onFinalize={handleRegisterFinal} 
                          isLoading={isLoading} 
                        />
                      ) : isRegistered ? (
                        <RegSuccess 
                          redirectCountdown={redirectCountdown} 
                          onEnterHub={() => navigate(`/${lang}/dashboard`)} 
                        />
                      ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                          <Preloader message="Synchronizing Identity..." size="lg" />
                          <div className="space-y-2">
                            <h3 className="text-3xl font-black uppercase text-white">{t('node_online')}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 animate-bounce">{t('sync_success')}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </form>
                </div>

                <div className="text-center pt-4 border-t border-white/5 mt-auto">
                  <button 
                    type="button"
                    onClick={() => { 
                      if (regStep > 1) setRegStep(regStep - 1); 
                      else { setMode('login'); setError(''); }
                    }} 
                    className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <ArrowLeft size={14} /> {t('go_back')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="mt-4 p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] relative overflow-hidden group shadow-2xl shadow-red-500/10"
            >
              <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
              <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                <div className="size-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 mb-1">
                  <Shield size={20} className="animate-pulse" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 italic">Central Command Notice</h4>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white leading-relaxed max-w-[320px] mx-auto font-bold uppercase text-center">
                  {error}
                </p>
              </div>
            </motion.div>
          )}

          {(mode === 'login' || (mode === 'register' && regStep === 1)) && (
            <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <span className="relative bg-[#0f0f0f] px-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Handshake</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={async () => {
                    try {
                      const res: any = await socialAuth({ provider: 'github' } as any);
                      const u = res?.user || res;
                      if (u && u.isOnboarded === false) { setMode('register'); setRegStep(1); }
                    } catch(e) {}
                  }} 
                  className="py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Github size={18} /> GitHub
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const res: any = await socialAuth({ provider: 'google' } as any);
                      const u = res?.user || res;
                      if (u && u.isOnboarded === false) { setMode('register'); setRegStep(1); }
                    } catch(e) {}
                  }} 
                  className="py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Globe size={18} /> Google
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
