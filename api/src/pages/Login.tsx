import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, User, Lock, Mail, Github, Globe, Phone, 
  ChevronRight, Sparkles, Shield, UserPlus, CheckCircle2, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'fast' | 'onboarding'>('login');
  const [loginInput, setLoginInput] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [showSms, setShowSms] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // Onboarding States
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [primarySoftware, setPrimarySoftware] = useState('');
  const [learningGoal, setLearningGoal] = useState('Career');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [specialization, setSpecialization] = useState('3D Generalist');
  const [artStationUrl, setArtStationUrl] = useState('');
  const [availability, setAvailability] = useState('Full-time');
  const [hourlyRate, setHourlyRate] = useState('');
  const [clientType, setClientType] = useState('Indie Team');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [industry, setIndustry] = useState('GameDev');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && showSms) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showSms]);

  const { login, register, socialAuth } = useAuth();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(loginInput, password);
      navigate(`/${lang || 'eng'}`);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!showSms) {
      // 1. Запрос OTP-кода от бэкенда
      setIsLoading(true);
      try {
        const res = await fetch('/api/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to request Fast Access Code');
        
        // Переключаем UI
        setTimeLeft(60);
        setShowSms(true);
      } catch (err: any) {
        setError(err.message || 'Network error processing Fast Access');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // 2. Верификация OTP-кода на бэкенде
    setIsLoading(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: smsCode, role: selectedRole })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Invalid Identity Code');
      }

      // Сохраняем токен
      localStorage.setItem('auth_token', data.data.token);
      
      // Если сервер выдал статус 'guest' (новорег по OTP), перекидываем в Онбординг!
      if (data.data.user.role === 'guest') {
        setMode('onboarding');
      } else {
        navigate(`/${lang || 'eng'}`);
        window.location.reload(); 
      }
    } catch (err: any) {
      setError(err.message || 'Authorization rejected');
      setSmsCode(''); // Очистить неправильный код
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let profileData: any = {};
    if (selectedRole === 'student') profileData = { experienceLevel, primarySoftware, learningGoal, portfolioUrl };
    if (selectedRole === 'executor') profileData = { specialization, artStationUrl, availability, hourlyRate: parseFloat(hourlyRate) || 0 };
    if (selectedRole === 'client') profileData = { clientType, companyName, companyWebsite, industry };

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: selectedRole, profileData })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Onboarding failed');

      navigate(`/${lang || 'eng'}`);
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (provider: string) => {
    setIsLoading(true);
    try {
      // Mock Social Data
      const mockData = {
        email: `social_${Math.random().toString(36).slice(2)}@${provider}.com`,
        displayName: `${provider} User`,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
        provider,
        remoteId: `remote_${Date.now()}`
      };
      await socialAuth(mockData);
      navigate(`/${lang || 'eng'}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 py-12 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-10 lg:p-14 shadow-2xl space-y-10">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center size-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary shadow-2xl shadow-primary/20">
              {mode === 'fast' ? <Zap size={36} /> : mode === 'register' ? <UserPlus size={36} /> : <LogIn size={36} />}
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black uppercase tracking-tight text-white italic">
                {mode === 'onboarding' ? 'Finalize Profile' : mode === 'fast' ? 'Fast Access' : mode === 'register' ? 'Join Grid' : 'Welcome back'}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Red Griffin Ecosystem Node</p>
            </div>
          </div>

          {/* Mode Switcher */}
          {mode !== 'onboarding' && (
            <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5">
              {[
                { id: 'login', label: 'Login' },
                { id: 'register', label: 'Join' },
                { id: 'fast', label: 'Fast' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => { setMode(m.id as any); setError(''); setShowSms(false); }}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === m.id ? 'bg-white/5 text-primary shadow-lg' : 'text-white/20 hover:text-white/40'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'onboarding' ? (
              <motion.form 
                key="onboarding"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleOnboardingSubmit} 
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="text-primary font-black uppercase tracking-widest text-xs mb-2">You are joining as: {selectedRole}</div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Complete your profile to unlock specific tools and environments.</p>
                </div>

                {selectedRole === 'student' && (
                  <div className="space-y-4">
                    <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40 appearance-none">
                      <option value="Beginner">Absolute Beginner</option>
                      <option value="Basic">Basic Knowledge</option>
                      <option value="Advanced">Advanced Pro</option>
                    </select>
                    <input type="text" value={primarySoftware} onChange={e => setPrimarySoftware(e.target.value)} placeholder="PRIMARY SOFTWARE (E.G. UNREAL ENGINE)" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40" required />
                    <select value={learningGoal} onChange={e => setLearningGoal(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40 appearance-none">
                      <option value="Career">Find Job in Industry</option>
                      <option value="Hobby">For Myself / Hobby</option>
                      <option value="Upskill">Skill Upgrade</option>
                    </select>
                    <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="SHOWREEL URL (OPTIONAL)" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40" />
                  </div>
                )}

                {selectedRole === 'executor' && (
                  <div className="space-y-4">
                    <select value={specialization} onChange={e => setSpecialization(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40 appearance-none">
                      <option value="3D Generalist">3D Generalist</option>
                      <option value="VFX Artist">VFX Artist</option>
                      <option value="Animator">Animator</option>
                      <option value="Environment Artist">Environment Artist</option>
                    </select>
                    <input type="url" value={artStationUrl} onChange={e => setArtStationUrl(e.target.value)} placeholder="ARTSTATION URL" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40" required />
                    <select value={availability} onChange={e => setAvailability(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40 appearance-none">
                      <option value="Full-time">Full-time Available</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract / Gigs only</option>
                    </select>
                    <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="HOURLY RATE ($ USD)" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40" />
                  </div>
                )}

                {selectedRole === 'client' && (
                  <div className="space-y-4">
                    <select value={clientType} onChange={e => setClientType(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40 appearance-none">
                      <option value="Indie Team">Indie Team</option>
                      <option value="Personal">Personal / Individual</option>
                      <option value="Studio">Studio / Corporation</option>
                    </select>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="COMPANY NAME" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40" required />
                    <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40 appearance-none">
                      <option value="GameDev">Game Development</option>
                      <option value="Cinematics">Cinematics & VFX</option>
                      <option value="Advertising">Advertising / Motion</option>
                      <option value="Architecture">Architecture / Viz</option>
                    </select>
                    <input type="url" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} placeholder="COMPANY WEBSITE (OPTIONAL)" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-bold outline-none focus:border-primary/40" />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-bg-dark py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  {isLoading ? 'SYNCING...' : 'FINALIZE PROFILE'}
                  <ChevronRight size={18} />
                </button>
              </motion.form>
            ) : mode === 'fast' ? (
              <motion.form 
                key="fast"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleFastAuth} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  {!showSms ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-4">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+7 (900) 000-00-00"
                            className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 pl-16 pr-6 text-white text-sm font-bold outline-none focus:border-primary/40 transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-4">Initialize as</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['student', 'client', 'executor', 'lecturer'].map(r => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setSelectedRole(r)}
                              className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedRole === r ? 'bg-primary/10 border-primary text-primary' : 'bg-black/40 border-white/5 text-white/20'}`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6 text-center">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 italic">Verification code sent to {phone}</div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Establishment Code transmitted via system node</div>
                      </div>
                      
                      <input
                        type="text"
                        value={smsCode}
                        onChange={(e) => setSmsCode(e.target.value)}
                        placeholder="ENTER 6-DIGIT CODE"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-8 text-center text-3xl font-black tracking-[0.5em] text-primary outline-none focus:border-primary/40 transition-all shadow-inner"
                        maxLength={6}
                        required
                      />

                      <div className="flex flex-col items-center gap-4">
                        {timeLeft > 0 ? (
                          <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/5">
                            <div className="size-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Resend in {timeLeft}s</span>
                          </div>
                        ) : (
                          <button 
                            type="button" 
                            disabled={isLoading}
                            onClick={async () => {
                              setIsLoading(true);
                              setError('');
                              try {
                                const res = await fetch('/api/otp/send', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ phone })
                                });
                                if (!res.ok) throw new Error('Failed to request Fast Access Code');
                                setTimeLeft(60);
                              } catch (err: any) {
                                setError(err.message);
                              } finally {
                                setIsLoading(false);
                              }
                            }} 
                            className="px-6 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full border border-primary/20 text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Resend Access Key
                          </button>
                        )}
                        
                        <button type="button" onClick={() => setShowSms(false)} className="text-[9px] font-black uppercase text-white/10 hover:text-white/40 transition-colors tracking-widest">Change Identity Contact</button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-bg-dark py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  {isLoading ? 'Processing Node...' : showSms ? 'Authorize Entity' : 'Send Access Key'}
                  <ChevronRight size={18} />
                </button>
              </motion.form>
            ) : mode === 'login' ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="text"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="ACCESS KEY / EMAIL"
                      className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 pl-16 pr-6 text-white text-sm font-bold outline-none focus:border-primary/40 transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ENCRYPTION PASSWORD"
                      className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 pl-16 pr-6 text-white text-sm font-bold outline-none focus:border-primary/40 transition-all"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-bg-dark py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20"
                >
                  {isLoading ? 'Verifying...' : 'Establish Connection'}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="register"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  try {
                    await register({ email, displayName, role: selectedRole });
                    navigate(`/${lang || 'eng'}`);
                  } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
                }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="FULL NAME"
                    className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 px-8 text-white text-sm font-bold outline-none focus:border-primary/40 transition-all"
                    required
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NETWORK EMAIL"
                    className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 px-8 text-white text-sm font-bold outline-none focus:border-primary/40 transition-all"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {['student', 'client', 'executor', 'lecturer'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedRole === r ? 'bg-primary/10 border-primary text-primary' : 'bg-black/40 border-white/5 text-white/20'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-bg-dark py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isLoading ? 'Provisioning...' : 'Initialize Profile'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-3">
              <Shield size={14} /> {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-full border-t border-white/5"></div>
              <span className="relative px-6 bg-[#0f0f0f] text-[9px] font-black uppercase tracking-[0.3em] text-white/20">External Protocols</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSocial('github')}
                className="flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-black/40 border border-white/5 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/60"
              >
                <Github size={18} /> GitHub
              </button>
              <button 
                onClick={() => handleSocial('google')}
                className="flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-black/40 border border-white/5 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/60"
              >
                <Globe size={18} /> Google
              </button>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-center gap-8 opacity-20 grayscale">
            <CheckCircle2 size={16} />
            <Sparkles size={16} />
            <Shield size={16} />
            <Award size={16} className="text-white" />
          </div>

        </div>
        
        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">
          Powering the next generation of CG excellence
        </p>
      </motion.div>
    </div>
  );
};

const Award: React.FC<{ size?: number, className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export default Login;
