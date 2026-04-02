import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, User, Lock, Mail, Github, Globe, 
  ChevronRight, Sparkles, Shield, UserPlus, CheckCircle2, Zap,
  Info, X, ArrowLeft, Loader2, GraduationCap, Briefcase, Users,
  Smartphone, Link as LinkIcon, Send, BriefcaseIcon, UserCheck,
  Calendar, Binary, Cpu, SmartphoneIcon
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

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regStep, setRegStep] = useState(1);
  const [showTreeModal, setShowTreeModal] = useState(false);
  
  const { t, i18n: i18nInstance } = useTranslation();
  const { lang = 'eng' } = useParams();
  const navigate = useNavigate();
  const { login, register, socialAuth } = useAuth();

  // Registration Form State
  const [formData, setFormData] = useState({
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
  });

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
          
          if (mode === 'register') {
            if (!exists) {
              setEmailStatus('success');
              setEmailError('');
            } else {
              setEmailStatus('error');
              setEmailError('Email already registered in Grid');
            }
          } else {
            if (exists) {
              setEmailStatus('success');
              setEmailError('');
            } else {
              setEmailStatus('error');
              setEmailError('Sorry, this Node ID is not in the system');
            }
          }
        }
      } catch (err) { 
        setEmailStatus('error'); 
        setEmailError('Network Sync Error');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [formData.email, mode]);

  // Password Strength Logic
  useEffect(() => {
    const p = formData.password;
    if (!p) { setPassStrength(0); return; }
    let s = 0;
    if (p.length >= 6) s = 1;
    if (p.length >= 10 && /[A-Z]/.test(p) && /[0-9]/.test(p)) s = 2;
    if (p.length >= 12 && /[!@#$%^&*]/.test(p)) s = 3;
    setPassStrength(s as any);
  }, [formData.password]);

  // Password Confirmation Logic
  useEffect(() => {
    if (!formData.confirmPassword) { setPassConfirmStatus('none'); return; }
    setPassConfirmStatus(formData.password === formData.confirmPassword ? 'success' : 'error');
  }, [formData.password, formData.confirmPassword]);

  // Phone Validation Logic
  useEffect(() => {
    if (!formData.phone) { setPhoneStatus('none'); return; }
    if (formData.phone.length < 7) setPhoneStatus('warning');
    else if (formData.phone.length > 15) setPhoneStatus('error');
    else setPhoneStatus('success');
  }, [formData.phone]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate(`/${lang}`);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterFinal = async () => {
    setIsLoading(true);
    try {
      await register({ 
        email: formData.email, 
        displayName: formData.displayName, 
        role: formData.selectedRole, 
        password: formData.password,
        phone: `+${formData.phoneCode}${formData.phone}`,
        profileData: {
          bio: formData.bio,
          country: formData.country,
          citizenship: formData.citizenship,
          linkedInUrl: formData.linkedInUrl,
          telegramHandle: formData.telegramHandle,
          portfolioUrl: formData.portfolioUrl,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth
        }
      });
      setRegStep(5);
      setTimeout(() => navigate(`/${lang}/dashboard`), 2500);
    } catch (err: any) { 
      setError(err.message); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 py-12 overflow-hidden relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-4 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-8 backdrop-blur-3xl min-h-[400px] flex flex-col justify-center">
          
          <div className="text-center space-y-4">
            <motion.div 
              key={mode}
              initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}
              className="inline-flex items-center justify-center size-12 sm:size-16 rounded-[1.2rem] bg-gradient-to-br from-red-600/20 to-red-900/5 border border-red-500/20 text-red-500 shadow-2xl shadow-red-500/20"
            >
              {mode === 'register' ? <UserPlus size={20} className="sm:w-6 sm:h-6" /> : <LogIn size={20} className="sm:w-6 sm:h-6" />}
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white italic leading-none">
                {mode === 'register' ? t('join_grid') : 'Node Auth'}
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
                        <button type="submit" disabled={isLoading} className="bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-700 transition-all shadow-2xl shadow-red-500/30 flex items-center justify-center gap-2">
                          Connect <ChevronRight size={14} />
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
                {/* Step Indicator */}
                <div className="flex items-center justify-between px-2">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`size-7 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all duration-500 ${regStep >= s ? 'bg-red-600 border-red-600 text-white' : 'border-white/10 text-white/20'}`}>
                        {s}
                      </div>
                      {s < 4 && <div className={`h-[2px] w-6 lg:w-10 transition-all duration-500 ${regStep > s ? 'bg-red-600' : 'bg-white/10'}`} />}
                    </div>
                  ))}
                </div>

                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    if (regStep < 4) setRegStep(regStep + 1); 
                    else handleRegisterFinal();
                  }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex-1 px-1">

                  {regStep === 1 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-2">
                      <div className="space-y-2 text-center">
                        <h3 className="text-base font-black uppercase text-white">{t('step_role')}</h3>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">Choose your gateway into the ecosystem</p>
                      </div>
                      <RoleTree onShowDetail={(id) => { handleInputChange('selectedRole', id); setRegStep(2); }} />
                    </motion.div>
                  ) : regStep === 2 ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2 py-0">
                      <InputWithStatus 
                        id="reg-email"
                        autoComplete="email"
                        label={t('network_email')}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="EMAIL@DOMAIN.COM"
                        hint="Real-time availability check enabled."
                        status={emailStatus}
                        errorText={emailError}
                        icon={<Mail size={18} />}
                        required
                      />
                      <div className="space-y-1.5">
                        <InputWithStatus 
                          id="reg-password"
                          autoComplete="new-password"
                          label={t('encryption_password')}
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="••••••••"
                          hint="At least 6 characters. 12+ for Fortified status."
                          status={passStrength === 0 ? 'none' : passStrength < 2 ? 'warning' : 'success'}
                          icon={<Lock size={18} />}
                          required
                        />

                        <div className="px-2">
                           <div className="flex justify-between items-center mb-1">
                             <span className="text-[9px] font-black uppercase tracking-tighter text-white/40">{t('entropy_analysis')}</span>
                             <span className={`text-[9px] font-black uppercase tracking-widest ${passStrength < 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                               {passStrength === 1 ? 'Weak' : passStrength === 2 ? 'Medium' : passStrength === 3 ? 'Fortified' : 'None'}
                             </span>
                           </div>
                           <PasswordStrengthMeter strength={passStrength} />
                        </div>
                      </div>
                      <InputWithStatus 
                        id="reg-confirm-password"
                        autoComplete="new-password"
                        label={t('repeat_security_key')}
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        hint="Repeat password for validation."
                        status={passConfirmStatus}
                        errorText={passConfirmStatus === 'error' ? 'Encryption mismatch' : ''}
                        icon={<Lock size={18} />}
                        required
                      />

                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-white/30 px-2">{t('phone_number')}</label>
                         <div className="flex gap-2">
                           <select 
                             className="bg-black/40 border border-white/5 rounded-2xl px-3 text-white text-xs outline-none focus:border-red-500/40"
                             value={formData.phoneCode}
                             onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                           >
                             {ALL_COUNTRIES.map(c => (
                               <option key={c.code} value={c.phone} className="bg-[#0f0f0f]">{c.flag} +{c.phone}</option>
                             ))}
                           </select>
                           <div className="flex-1 relative">
                             <input 
                               type="tel"
                               className={`w-full bg-black/40 border rounded-2xl py-3 px-5 text-white text-sm outline-none transition-all ${phoneStatus === 'error' ? 'border-red-500/50' : phoneStatus === 'success' ? 'border-emerald-500/30' : 'border-white/5 focus:border-red-500/40'}`}
                               placeholder="Phone Number"
                               value={formData.phone}
                               onChange={(e) => handleInputChange('phone', e.target.value)}
                             />
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                                {phoneStatus === 'success' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                {phoneStatus === 'error' && <X size={14} className="text-red-500" />}
                                {phoneStatus === 'warning' && <Info size={14} className="text-yellow-500" />}
                             </div>
                           </div>
                         </div>
                         <div className="px-2 flex items-center gap-2 opacity-40 group hover:opacity-100 transition-opacity">
                            <Info size={10} className="text-[#00f3ff]" />
                            <p className="text-[8px] font-black uppercase tracking-widest text-white italic">Future Protocol: SMS confirmation required for node activation.</p>
                         </div>
                      </div>
                      <button onClick={() => setRegStep(3)} disabled={!formData.email || !formData.password || emailStatus === 'error' || passConfirmStatus !== 'success' || phoneStatus === 'error' || phoneStatus === 'none'} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                        {t('security_check_passed')} <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  ) : regStep === 3 ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 py-0">
                      <InputWithStatus 
                        label={t('full_name')}
                        value={formData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        placeholder="FIRST LAST"
                        hint="Global display name in the Grid."
                        icon={<UserCheck size={18} />}
                        status={formData.displayName.length > 5 ? 'success' : 'none'}
                        required
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-white/30 px-2">{t('gender')}</label>
                           <div className="grid grid-cols-3 gap-1.5">
                             {['male', 'female', 'other'].map(g => (
                               <button
                                 key={g}
                                 type="button"
                                 onClick={() => handleInputChange('gender', g)}
                                 className={`py-3.5 rounded-xl border transition-all text-[8px] font-black uppercase tracking-widest ${formData.gender === g ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                               >
                                 {t(`gender_${g}`)}
                               </button>
                             ))}
                           </div>
                        </div>

                        <CyberCalendar 
                          value={formData.dateOfBirth}
                          onChange={(val) => handleInputChange('dateOfBirth', val)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <CountrySelector 
                          label="Country of Residence"
                          placeholder="Select Node Host"
                          value={formData.country}
                          onChange={(val) => handleInputChange('country', val)}
                        />

                        <CountrySelector 
                          label="Citizenship"
                          placeholder="Legal Citizenship"
                          value={formData.citizenship}
                          onChange={(val) => handleInputChange('citizenship', val)}
                        />
                      </div>

                      <button onClick={() => setRegStep(4)} disabled={!formData.displayName || !formData.dateOfBirth || !formData.country || !formData.citizenship} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                        {t('establish_identity')} <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  ) : regStep === 4 ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 py-2">
                      <div className="flex justify-between items-center mb-2 px-2">
                        <h3 className="text-lg font-black uppercase text-white">{t('step_specs')}</h3>
                        <button onClick={handleRegisterFinal} className="text-[9px] font-black uppercase text-red-500 border border-red-500/20 px-4 py-2 rounded-xl bg-red-500/5 hover:bg-red-500 hover:text-white transition-all">
                          {t('skip_sync')}
                        </button>
                      </div>
                      <InputWithStatus label="Portfolio URL" value={formData.portfolioUrl} onChange={(e)=>handleInputChange('portfolioUrl', e.target.value)} placeholder="https://..." hint="ArtStation, Behance, or Site." icon={<Briefcase size={18} />} />
                      <div className="grid grid-cols-2 gap-4">
                        <InputWithStatus label="LinkedIn" value={formData.linkedInUrl} onChange={(e)=>handleInputChange('linkedInUrl', e.target.value)} placeholder="ID" hint="Professional link." icon={<LinkIcon size={16} />} />
                        <InputWithStatus label="Telegram" value={formData.telegramHandle} onChange={(e)=>handleInputChange('telegramHandle', e.target.value)} placeholder="@handle" hint="Direct comms." icon={<Send size={16} />} />
                      </div>
                      <div className="space-y-1.5 px-2">
                        <label className="text-[10px] font-black uppercase text-white/30">Brief Intelligence (Bio)</label>
                        <textarea value={formData.bio} onChange={(e)=>handleInputChange('bio', e.target.value)} placeholder="Skills, goals, expertise..." className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-xs outline-none focus:border-red-500/40 min-h-[80px] resize-none" />
                      </div>
                      <button onClick={handleRegisterFinal} disabled={isLoading} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-red-600/40">
                         Node Online <Zap size={14} />
                      </button>
                    </motion.div>
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

                <div className="text-center pt-4 border-t border-white/5 mt-auto">
                   <button onClick={() => { if (regStep > 1) setRegStep(regStep - 1); else setMode('login'); setError(''); }} className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors flex items-center justify-center gap-2 mx-auto">
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
              className="mt-4 p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
              <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                <div className="size-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 mb-1">
                  <Shield size={20} className="animate-pulse" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 italic">Access Denied</h4>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-relaxed max-w-[280px] mx-auto">
                  {error === 'Validation failed' ? 'PROTOCOL ERROR: Invalid Node Pattern' : error}
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
                 <button onClick={() => socialAuth({ provider: 'github' } as any)} className="py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">
                   <Github size={18} /> GitHub
                 </button>
                 <button onClick={() => socialAuth({ provider: 'google' } as any)} className="py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">
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
