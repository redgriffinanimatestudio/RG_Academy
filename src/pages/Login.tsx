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
import { authService } from '../services/authService';
import Preloader from '../components/Preloader';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';
import { useUserJourney } from '../hooks/useUserJourney';

// v2.30 Neural Architecture Decoupling: Registration Shards
import IdentitySidebar from '../components/auth/registration/IdentitySidebar';
import RegStep1Role from '../components/auth/registration/RegStep1Role';
import RegStep2Network from '../components/auth/registration/RegStep2Network';
import RegStep3Identity from '../components/auth/registration/RegStep3Identity';
import RegStep4Specs from '../components/auth/registration/RegStep4Specs';
import RegStep5Legal from '../components/auth/registration/RegStep5Legal';
import RegStep2Soul from '../components/auth/registration/RegStep2Soul';

const normalizePhone = (phoneCode: string, phone: string) => {
  const trimmed = String(phone || '').trim();
  const digits = trimmed.replace(/\D/g, '');
  const codeDigits = String(phoneCode || '').replace(/\D/g, '');

  if (!digits) return '';
  if (trimmed.startsWith('+')) return `+${digits}`;
  if (trimmed.startsWith('00')) return `+${digits.replace(/^00/, '')}`;
  return codeDigits ? `+${codeDigits}${digits}` : digits;
};

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
  const { journey } = useUserJourney();

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
      selectedSoul: '',
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
  const [phoneStatus, setPhoneStatus] = useState<'none' | 'loading' | 'success' | 'warning' | 'error'>('none');
  const [phoneError, setPhoneError] = useState('');
  
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
    const rawPhone = String(formData.phone || '').trim();
    const normalizedPhone = normalizePhone(String(formData.phoneCode || ''), rawPhone);
    const digits = normalizedPhone.replace(/\D/g, '');

    if (!rawPhone) {
      setPhoneStatus('none');
      setPhoneError('');
      return;
    }

    if (digits.length < 7 || digits.length > 15) {
      setPhoneStatus('warning');
      setPhoneError('Use 7-15 digits. Include country code and local number.');
      return;
    }

    setPhoneStatus('loading');
    setPhoneError('Checking phone availability...');

      const timer = setTimeout(async () => {
        try {
          const available = await authService.checkPhone(rawPhone, String(formData.phoneCode || ''));
          if (available) {
            setPhoneStatus('success');
            setPhoneError('');
          } else {
            setPhoneStatus('warning');
            setPhoneError('Phone availability could not be confirmed. Continue to final verification.');
          }
      } catch {
        setPhoneStatus('warning');
        setPhoneError('Phone format looks valid. Availability check unavailable.');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [formData.phone, formData.phoneCode]);

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
        phone: String(formData.phone || '').trim(),
        phoneCode: String(formData.phoneCode || ''),
        role: formData.selectedRole,
        profileData: {
          bio: formData.bio || `Synchronized via ${formData.selectedRole.toUpperCase()} PROTOCOL`,
          country: formData.country,
          citizenship: formData.citizenship,
          linkedInUrl: formData.linkedInUrl,
          telegramHandle: formData.telegramHandle,
          portfolioUrl: formData.portfolioUrl,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          chosenPathId: formData.selectedRole === 'student' ? formData.selectedSoul : undefined
        },
        selectedPath: formData.selectedRole === 'student' ? 'ACADEMY' : journey.selectedPath,
        metadata: {
          ...journey,
          registrationSource: 'industrial_forge'
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
      setError(err?.message || err.response?.data?.error || 'Registration failed: Internal Server Error or Connection Issue');
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
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-2 sm:p-8 font-['Inter'] selection:bg-emerald-500/30 overflow-x-hidden relative">
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      
      <motion.div 
        variants={shakeVariants}
        animate={isShaking ? "shake" : { opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-[1550px] bg-bg-card backdrop-blur-3xl border border-border-main rounded-[2rem] sm:rounded-[4.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative group z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/5 via-transparent to-primary/5 pointer-events-none" />
        
        {/* Sidebar */}
        <div className="lg:w-[480px] p-8 sm:p-16 border-b lg:border-r lg:border-b-0 border-border-main relative z-10 flex flex-col justify-center bg-bg-dark/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
            <Binary size={500} className="text-ink -rotate-12 translate-x-[-100px]" />
          </div>
          {/* Sidebar content removed - moved to Main Content as per UI/UX optimization */}
          <div className="hidden lg:block relative space-y-12 opacity-20 hover:opacity-40 transition-opacity duration-1000">
            <div className="space-y-4">
              <div className="h-[2px] w-12 bg-red-600/30" />
              <p className="text-[10px] font-black uppercase tracking-[1em] text-text-muted opacity-20 italic">Red Griffin Sanctum</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 sm:p-20 relative z-10 flex flex-col min-h-[650px] bg-bg-card/20">
          <AnimatePresence mode="wait">
            <motion.div key="form-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col h-full">
              <div className="flex items-center gap-6 mb-12">
                <div className={`p-4 rounded-[1.8rem] transition-all duration-700 ${mode === 'login' ? 'bg-primary text-white shadow-2xl shadow-primary/20' : 'bg-border-main text-text-muted hover:text-ink'}`}>
                  <LogIn size={26} />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase text-ink tracking-[0.2em] leading-tight">
                    {mode === 'login' ? t('node_connect') : t('identity_forge')}
                  </h2>
                  <p className="text-[11px] font-black uppercase tracking-[0.6em] text-text-muted opacity-40 italic">{t('reg_protocol')}</p>
                </div>
              </div>

              {/* Sub-Header Branding Area (Minimalist Industrial Zone) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 p-6 rounded-[2.5rem] bg-ink/5 border border-border-main backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Shield size={18} className="text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-ink italic">Authorized Access</span>
                    <span className="block text-[8px] font-bold text-text-muted opacity-60 uppercase tracking-widest">Secure Protocol Node</span>
                  </div>
                </div>
                <div className="h-px w-full sm:h-8 sm:w-px bg-border-main opacity-20" />
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Globe size={18} className="text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-ink italic">Global Hub</span>
                    <span className="block text-[8px] font-bold text-text-muted opacity-60 uppercase tracking-widest">Verified Infrastructure</span>
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
                          <InputWithStatus id="login-email" label="Account Identity" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="name@domain.com" hint="Professional identity signature" status={emailStatus} icon={<User size={18} />} autoComplete="email" required />
                          <InputWithStatus id="login-password" label="Security Password" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="••••••••" hint="Encrypted secure passkey" icon={<Lock size={18} />} autoComplete="current-password" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <button type="submit" disabled={isLoading} className="bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-emerald-600 transition-all hover:scale-[1.02] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group relative overflow-hidden">
                            <span className="relative z-10">Get Access</span>
                            <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button type="button" onClick={() => setMode('register')} className="bg-bg-card border border-border-main text-text-muted py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-border-main hover:text-ink transition-all flex items-center justify-center gap-3">
                             Create Account <UserPlus size={16} />
                          </button>
                        </div>

                        <SocialAuthButtons className="pt-6" />
                      </form>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="register-shard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between px-2">
                      {Array.from({ length: formData.selectedRole === 'student' ? 6 : 5 }, (_, i) => i + 1).map(s => (
                        <div key={s} className="flex items-center gap-2">
                          <div className={`size-7 sm:size-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-700 ${regStep >= s ? 'bg-primary border-primary shadow-lg shadow-primary/20 text-white' : 'border-border-main text-text-muted opacity-30'}`}>
                            {s}
                          </div>
                          {s < (formData.selectedRole === 'student' ? 6 : 5) && <div className={`h-[2px] w-4 lg:w-10 transition-all duration-700 ${regStep > s ? 'bg-primary' : 'bg-border-main'}`} />}
                        </div>
                      ))}
                    </div>
                    <div className={`flex flex-col lg:flex-row gap-6 sm:gap-12 flex-1 ${regStep > 1 ? 'items-stretch' : 'items-center'}`}>
                      {regStep > 1 && <IdentitySidebar role={formData.selectedRole} step={regStep} />}
                      <form onSubmit={(e) => { e.preventDefault(); if (regStep < (formData.selectedRole === 'student' ? 6 : 5)) setRegStep(regStep + 1); else handleRegisterFinal(); }} className="flex-1 flex flex-col">
                        <div className="flex-1">
                          {(() => {
                            const isStudent = formData.selectedRole === 'student';
                            const totalSteps = isStudent ? 6 : 5;
                            
                            if (regStep === 1) return <RegStep1Role onSelect={(id) => { handleInputChange('selectedRole', id); setRegStep(2); }} selectedId={formData.selectedRole} />;
                            
                            if (isStudent && regStep === 2) {
                              return <RegStep2Soul onSelect={(id) => { handleInputChange('selectedSoul', id); setRegStep(3); }} selectedId={formData.selectedSoul} />;
                            }
                            
                            const offset = isStudent ? 1 : 0;
                            
                            if (regStep === 2 + offset) return <RegStep2Network formData={formData} onChange={handleInputChange} emailStatus={emailStatus} emailError={emailError} passStrength={passStrength} passConfirmStatus={passConfirmStatus} phoneStatus={phoneStatus} phoneError={phoneError} onNext={() => setRegStep(3 + offset)} />;
                            if (regStep === 3 + offset) return <RegStep3Identity formData={formData} onChange={handleInputChange} onNext={() => setRegStep(4 + offset)} lang={lang} />;
                            if (regStep === 4 + offset) return <RegStep4Specs formData={formData} onChange={handleInputChange} onNext={() => setRegStep(5 + offset)} onSkip={() => setRegStep(5 + offset)} />;
                            if (regStep === 5 + offset) return <RegStep5Legal formData={formData} lang={lang} termsAccepted={termsAccepted} onToggleTerms={() => setTermsAccepted(!termsAccepted)} onFinalize={handleRegisterFinal} isLoading={isLoading} />;
                            
                            return null;
                          })()}
                        </div>
                      </form>
                    </div>
                    <div className="text-center pt-8 border-t border-white/5 mt-auto">
                      <button type="button" onClick={() => { if (regStep > 1) setRegStep(regStep - 1); else { setMode('login'); setError(''); } }} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-primary transition-all flex items-center justify-center gap-3 mx-auto py-2 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('go_back')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] relative overflow-hidden">
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0"><Shield size={20} className="animate-pulse" /></div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Security Fault Detected</h4>
                      <p className="text-[11px] font-bold text-ink leading-relaxed uppercase">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
