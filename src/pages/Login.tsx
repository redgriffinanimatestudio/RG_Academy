import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, User, Lock, Mail, Github, Globe, 
  ChevronRight, Sparkles, Shield, UserPlus, CheckCircle2, Zap,
  Info, X, ArrowLeft, Loader2, GraduationCap, Briefcase, Users,
  Smartphone, Link as LinkIcon, Send, BriefcaseIcon, UserCheck,
  Calendar, Binary, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleTree } from '../components/RoleTree';
import { InputWithStatus } from '../components/auth/InputWithStatus';
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter';
import { CountrySelector } from '../components/auth/CountrySelector';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/apiClient';

// Comprehensive Country Data
const COUNTRIES = [
  { code: 'US', name: 'United States', phone: '1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', phone: '44', flag: '🇬🇧' },
  { code: 'RU', name: 'Russia', phone: '7', flag: '🇷🇺' },
  { code: 'KZ', name: 'Kazakhstan', phone: '7', flag: '🇰🇿' },
  { code: 'GE', name: 'Georgia', phone: '995', flag: '🇬🇪' },
  { code: 'UA', name: 'Ukraine', phone: '380', flag: '🇺🇦' },
  { code: 'BY', name: 'Belarus', phone: '375', flag: '🇧🇾' },
  { code: 'UZ', name: 'Uzbekistan', phone: '998', flag: '🇺🇿' },
  { code: 'TR', name: 'Turkey', phone: '90', flag: '🇹🇷' },
  { code: 'PL', name: 'Poland', phone: '48', flag: '🇵🇱' },
  { code: 'DE', name: 'Germany', phone: '49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', phone: '33', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', phone: '34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', phone: '39', flag: '🇮🇹' },
  { code: 'CA', name: 'Canada', phone: '1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', phone: '61', flag: '🇦🇺' },
  { code: 'CN', name: 'China', phone: '86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', phone: '81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', phone: '82', flag: '🇰🇷' },
  { code: 'AE', name: 'United Arab Emirates', phone: '971', flag: '🇦🇪' },
  { code: 'IL', name: 'Israel', phone: '972', flag: '🇮🇱' },
  { code: 'RS', name: 'Serbia', phone: '381', flag: '🇷🇸' },
  { code: 'ME', name: 'Montenegro', phone: '382', flag: '🇲🇪' },
  { code: 'TH', name: 'Thailand', phone: '66', flag: '🇹🇭' },
  { code: 'ID', name: 'Indonesia', phone: '62', flag: '🇮🇩' },
  { code: 'VN', name: 'Vietnam', phone: '84', flag: '🇻🇳' },
];

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
        if (data.success && data.data.available) {
          setEmailStatus('success');
          setEmailError('');
        } else {
          setEmailStatus('error');
          setEmailError('Email already registered in Grid');
        }
      } catch (err) { 
        setEmailStatus('error'); 
        setEmailError('Network Sync Error');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [formData.email]);

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
      setTimeout(() => navigate(`/${lang}/dashboard`), 3000);
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
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[4rem] p-10 lg:p-14 shadow-2xl space-y-10 backdrop-blur-3xl min-h-[750px] flex flex-col justify-center">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div 
              key={mode}
              initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}
              className="inline-flex items-center justify-center size-20 rounded-[2rem] bg-gradient-to-br from-red-600/20 to-red-900/5 border border-red-500/20 text-red-500 shadow-2xl shadow-red-500/20"
            >
              {mode === 'register' ? <UserPlus size={32} /> : <LogIn size={32} />}
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic leading-none">
                {mode === 'register' ? t('join_grid') : 'Node Auth'}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{t('reg_protocol')}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 flex-1 flex flex-col justify-center">
                <form onSubmit={handleLogin} className="space-y-6">
                  <InputWithStatus 
                    id="login-email"
                    autoComplete="username"
                    label="Access Key / Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="ENTER NODE ID"
                    hint="Use your registered email or system-assigned node identifier."
                    icon={<User size={18} />}
                    required
                  />
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

                  <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-red-700 transition-all shadow-2xl shadow-red-500/30 flex items-center justify-center gap-3">
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Establish Connection'}
                    <ChevronRight size={18} />
                  </button>
                </form>
                <div className="text-center">
                  <button onClick={() => setMode('register')} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors">
                    Don't have a node? <span className="text-white underline decoration-red-500/40 underline-offset-4">Initialize Journey</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 flex-1 flex flex-col">
                {/* Step Indicator */}
                <div className="flex items-center justify-between px-2">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`size-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500 ${regStep >= s ? 'bg-red-600 border-red-600 text-white' : 'border-white/10 text-white/20'}`}>
                        {s}
                      </div>
                      {s < 4 && <div className={`h-[2px] w-8 lg:w-12 transition-all duration-500 ${regStep > s ? 'bg-red-600' : 'bg-white/10'}`} />}
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
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-1 max-h-[500px]">

                  {regStep === 1 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 py-4">
                      <div className="space-y-2 text-center">
                        <h3 className="text-lg font-black uppercase tracking-widest text-white">{t('step_role')}</h3>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">Choose your gateway into the ecosystem</p>
                      </div>
                      <RoleTree onShowDetail={(id) => { handleInputChange('selectedRole', id); setRegStep(2); }} />
                    </motion.div>
                  ) : regStep === 2 ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 py-4">
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
                      <div className="space-y-4">
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

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-white/30 px-2">{t('phone_number')}</label>
                         <div className="flex gap-2">
                           <select 
                             className="bg-black/40 border border-white/5 rounded-2xl px-4 text-white text-sm outline-none focus:border-red-500/40"
                             value={formData.phoneCode}
                             onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                           >
                             {COUNTRIES.sort((a,b)=>a.name.localeCompare(b.name)).map(c => (
                               <option key={c.code} value={c.phone} className="bg-[#0f0f0f]">{c.flag} +{c.phone}</option>
                             ))}
                           </select>
                           <input 
                             type="tel"
                             className="flex-1 bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-red-500/40"
                             placeholder="Phone Number"
                             value={formData.phone}
                             onChange={(e) => handleInputChange('phone', e.target.value)}
                           />
                         </div>
                      </div>
                      <button onClick={() => setRegStep(3)} disabled={!formData.email || !formData.password || emailStatus === 'error' || passConfirmStatus !== 'success'} className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                        {t('security_check_passed')} <ChevronRight size={18} />
                      </button>
                    </motion.div>
                  ) : regStep === 3 ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 py-4">
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
                      
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-white/30 px-2">{t('gender')}</label>
                         <div className="grid grid-cols-3 gap-3">
                           {['male', 'female', 'other'].map(g => (
                             <button
                               key={g}
                               onClick={() => handleInputChange('gender', g)}
                               className={`py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${formData.gender === g ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                             >
                               {t(`gender_${g}`)}
                             </button>
                           ))}
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-white/30 px-2">{t('date_of_birth')}</label>
                         <div className="relative">
                            <input 
                              type="date"
                              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-red-500/40 custom-calendar-icon"
                              value={formData.dateOfBirth}
                              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            />
                            <Calendar size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                         </div>
                         <p className="text-[9px] text-white/20 px-2 italic uppercase font-bold tracking-tighter leading-tight">
                           <Shield size={10} className="inline mr-1" /> {t('age_restriction_notice')}
                         </p>
                      </div>

                      <CountrySelector 
                        value={formData.country}
                        onChange={(val) => handleInputChange('country', val)}
                      />

                      <InputWithStatus 
                        label={t('citizenship')}
                        value={formData.citizenship}
                        onChange={(e) => handleInputChange('citizenship', e.target.value)}
                        placeholder="e.g. GR, UK, RU"
                        hint="Legal residency status."
                        icon={<Globe size={18} />}
                        required
                      />

                      <button onClick={() => setRegStep(4)} disabled={!formData.displayName || !formData.dateOfBirth || !formData.country || !formData.citizenship} className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                        {t('establish_identity')} <ChevronRight size={18} />
                      </button>
                    </motion.div>
                  ) : regStep === 4 ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 py-4">
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
                      <div className="space-y-2 px-2">
                        <label className="text-[10px] font-black uppercase text-white/30">Brief Intelligence (Bio)</label>
                        <textarea value={formData.bio} onChange={(e)=>handleInputChange('bio', e.target.value)} placeholder="Skills, goals, expertise..." className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-white text-sm outline-none focus:border-red-500/40 min-h-[100px] resize-none" />
                      </div>
                      <button onClick={handleRegisterFinal} disabled={isLoading} className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-3">
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : t('node_online')} <Zap size={18} />
                      </button>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                          animate={{ opacity: 1, scale: 1, y: 0 }} 
                          className="mt-6 p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-red-500/10"
                        >
                          {/* Error Background Pulse */}
                          <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
                          
                          <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                            <div className="size-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 mb-2 shadow-xl shadow-red-500/20">
                              <Shield size={24} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-red-500 italic">Access Denied</h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-relaxed max-w-[280px] mx-auto">
                                {error === 'Validation failed' ? 'PROTOCOL ERROR: Invalid Node Identification Pattern' : error}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                       <div className="size-32 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-emerald-500/10">
                         <CheckCircle2 size={64} className="animate-pulse" />
                       </div>
                       <div className="space-y-2">
                         <h3 className="text-3xl font-black uppercase text-white">{t('node_online')}</h3>
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 animate-bounce">{t('sync_success')}</p>
                       </div>
                    </motion.div>
                  )}
                </div>
              </form>



                <div className="text-center pt-8 border-t border-white/5 mt-auto">
                   <button onClick={() => { setMode('login'); setRegStep(1); setError(''); }} className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors flex items-center justify-center gap-2 mx-auto">
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
              className="mt-6 p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-red-500/10"
            >
              {/* Error Background Pulse */}
              <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="size-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 mb-2 shadow-xl shadow-red-500/20">
                  <Shield size={24} className="animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-red-500 italic">Access Denied</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-relaxed max-w-[280px] mx-auto">
                    {error === 'Validation failed' ? 'PROTOCOL ERROR: Invalid Node Identification Pattern' : error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {(mode === 'login' || (mode === 'register' && regStep === 1)) && (
            <div className="pt-10 border-t border-white/5 space-y-6">
               <div className="relative flex items-center justify-center">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                 <span className="relative bg-[#0f0f0f] px-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Handshake</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => socialAuth({ provider: 'github' } as any)} className="py-5 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">
                   <Github size={18} /> GitHub
                 </button>
                 <button onClick={() => socialAuth({ provider: 'google' } as any)} className="py-5 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">
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
