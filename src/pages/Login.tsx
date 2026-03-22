import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth, signInWithGoogle, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import { useAuth } from '../context/AuthContext';
import OAuthConsent from '../components/OAuthConsent';
import { ConfirmationResult } from 'firebase/auth';
import { 
  Phone, 
// ... rest of imports

  ArrowRight, 
  Eye, 
  EyeOff, 
  Github, 
  Globe, 
  Linkedin, 
  Instagram,
  Music2, 
  Share2,
  ChevronDown,
  MessageSquareDot,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRIES = [
  { name: 'Afghanistan', code: '+93', flag: '🇦🇫' },
  { name: 'Albania', code: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: '+213', flag: '🇩🇿' },
  { name: 'Andorra', code: '+376', flag: '🇦🇩' },
  { name: 'Angola', code: '+244', flag: '🇦🇴' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷' },
  { name: 'Armenia', code: '+374', flag: '🇦🇲' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Austria', code: '+43', flag: '🇦🇹' },
  { name: 'Azerbaijan', code: '+994', flag: '🇦🇿' },
  { name: 'Bahamas', code: '+1', flag: '🇧🇸' },
  { name: 'Bahrain', code: '+973', flag: '🇧🇭' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
  { name: 'Belarus', code: '+375', flag: '🇧🇾' },
  { name: 'Belgium', code: '+32', flag: '🇧🇪' },
  { name: 'Belize', code: '+501', flag: '🇧🇿' },
  { name: 'Benin', code: '+229', flag: '🇧🇯' },
  { name: 'Bhutan', code: '+975', flag: '🇧🇹' },
  { name: 'Bolivia', code: '+591', flag: '🇧🇴' },
  { name: 'Bosnia and Herzegovina', code: '+387', flag: '🇧🇦' },
  { name: 'Botswana', code: '+267', flag: '🇧🇼' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'Bulgaria', code: '+359', flag: '🇧🇬' },
  { name: 'Burkina Faso', code: '+226', flag: '🇧🇫' },
  { name: 'Burundi', code: '+257', flag: '🇧🇮' },
  { name: 'Cambodia', code: '+855', flag: '🇰🇭' },
  { name: 'Cameroon', code: '+237', flag: '🇨🇲' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Chad', code: '+235', flag: '🇹🇩' },
  { name: 'Chile', code: '+56', flag: '🇨🇱' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴' },
  { name: 'Congo', code: '+242', flag: '🇨🇬' },
  { name: 'Costa Rica', code: '+506', flag: '🇨🇷' },
  { name: 'Croatia', code: '+385', flag: '🇭🇷' },
  { name: 'Cuba', code: '+53', flag: '🇨🇺' },
  { name: 'Cyprus', code: '+357', flag: '🇨🇾' },
  { name: 'Czech Republic', code: '+420', flag: '🇨🇿' },
  { name: 'Denmark', code: '+45', flag: '🇩🇰' },
  { name: 'Dominican Republic', code: '+1', flag: '🇩🇴' },
  { name: 'Ecuador', code: '+593', flag: '🇪🇨' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬' },
  { name: 'El Salvador', code: '+503', flag: '🇸🇻' },
  { name: 'Estonia', code: '+372', flag: '🇪🇪' },
  { name: 'Ethiopia', code: '+251', flag: '🇪🇹' },
  { name: 'Fiji', code: '+679', flag: '🇫🇯' },
  { name: 'Finland', code: '+358', flag: '🇫🇮' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Georgia', code: '+995', flag: '🇬🇪' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'Greece', code: '+30', flag: '🇬🇷' },
  { name: 'Guatemala', code: '+502', flag: '🇬🇹' },
  { name: 'Honduras', code: '+504', flag: '🇭🇳' },
  { name: 'Hungary', code: '+36', flag: '🇭🇺' },
  { name: 'Iceland', code: '+354', flag: '🇮🇸' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
  { name: 'Iran', code: '+98', flag: '🇮🇷' },
  { name: 'Iraq', code: '+964', flag: '🇮🇶' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪' },
  { name: 'Israel', code: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
  { name: 'Jamaica', code: '+1', flag: '🇯🇲' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'Jordan', code: '+962', flag: '🇯🇴' },
  { name: 'Kazakhstan', code: '+7', flag: '🇰🇿' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Kuwait', code: '+965', flag: '🇰🇼' },
  { name: 'Kyrgyzstan', code: '+996', flag: '🇰🇬' },
  { name: 'Latvia', code: '+371', flag: '🇱🇻' },
  { name: 'Lebanon', code: '+961', flag: '🇱🇧' },
  { name: 'Libya', code: '+218', flag: '🇱🇾' },
  { name: 'Lithuania', code: '+370', flag: '🇱🇹' },
  { name: 'Luxembourg', code: '+352', flag: '🇱🇺' },
  { name: 'Madagascar', code: '+261', flag: '🇲🇬' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
  { name: 'Maldives', code: '+960', flag: '🇲🇻' },
  { name: 'Malta', code: '+356', flag: '🇲🇹' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'Moldova', code: '+373', flag: '🇲🇩' },
  { name: 'Monaco', code: '+377', flag: '🇲🇨' },
  { name: 'Mongolia', code: '+976', flag: '🇲🇳' },
  { name: 'Montenegro', code: '+382', flag: '🇲🇪' },
  { name: 'Morocco', code: '+212', flag: '🇲🇦' },
  { name: 'Nepal', code: '+977', flag: '🇳🇵' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
  { name: 'Nicaragua', code: '+505', flag: '🇳🇮' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'North Korea', code: '+850', flag: '🇰🇵' },
  { name: 'Norway', code: '+47', flag: '🇳🇴' },
  { name: 'Oman', code: '+968', flag: '🇴🇲' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { name: 'Panama', code: '+507', flag: '🇵🇦' },
  { name: 'Paraguay', code: '+595', flag: '🇵🇾' },
  { name: 'Peru', code: '+51', flag: '🇵🇪' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭' },
  { name: 'Poland', code: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: '+974', flag: '🇶🇦' },
  { name: 'Romania', code: '+40', flag: '🇷🇴' },
  { name: 'Russia', code: '+7', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'Senegal', code: '+221', flag: '🇸🇳' },
  { name: 'Serbia', code: '+381', flag: '🇷🇸' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Slovakia', code: '+421', flag: '🇸🇰' },
  { name: 'Slovenia', code: '+386', flag: '🇸🇮' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' },
  { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
  { name: 'Sudan', code: '+249', flag: '🇸🇩' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
  { name: 'Syria', code: '+963', flag: '🇸🇾' },
  { name: 'Taiwan', code: '+886', flag: '🇹🇼' },
  { name: 'Tajikistan', code: '+992', flag: '🇹🇯' },
  { name: 'Tanzania', code: '+255', flag: '🇹🇿' },
  { name: 'Thailand', code: '+66', flag: '🇹🇭' },
  { name: 'Tunisia', code: '+216', flag: '🇹🇳' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷' },
  { name: 'Turkmenistan', code: '+993', flag: '🇹🇲' },
  { name: 'Uganda', code: '+256', flag: '🇺🇬' },
  { name: 'Ukraine', code: '+380', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'Uruguay', code: '+598', flag: '🇺🇾' },
  { name: 'Uzbekistan', code: '+998', flag: '🇺🇿' },
  { name: 'Venezuela', code: '+58', flag: '🇻🇪' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
  { name: 'Yemen', code: '+967', flag: '🇾🇪' },
  { name: 'Zambia', code: '+260', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼' },
].sort((a, b) => a.name.localeCompare(b.name));

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, loading, loginAsGuest } = useAuth() as any;
  const { lang } = useParams();
  const navigate = useNavigate();
  
  const [showConsent, setShowConsent] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.name === 'United States') || COUNTRIES[0]);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Removed automatic reCAPTCHA initialization from useEffect to prevent auth/argument-error

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fullPhone = `${selectedCountry.code}${phone}`;
    try {
      // Initialize reCAPTCHA only when needed
      if (!(window as any).recaptchaVerifier) {
        const container = document.getElementById('recaptcha-container');
        if (!container) throw new Error("Recaptcha container not found");
        
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible'
        });
      }

      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(confirmation);
      setIsVerificationStep(true);
    } catch (err: any) {
      console.error("SMS send failed:", err);
      setError(err.message || "Failed to send SMS. Check your connection or Firebase config.");
      // Reset reCAPTCHA on failure
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        } catch (e) {}
      }
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (err: any) {
      console.error("Verification failed:", err);
      setError(err.message);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setShowConsent(true);
  };

  const handleAcceptConsent = async () => {
    setShowConsent(false);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setError(t('login.error_unauthorized_domain', 'This domain is not authorized for Firebase Authentication. Please add localhost to Authorized Domains in Firebase Console.'));
      } else {
        setError(error.message);
      }
    }
  };

  const socialProviders = [
    { id: 'google', name: 'Google', icon: <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" /> },
    { id: 'github', name: 'GitHub', icon: <Github size={16} className="text-white/40 group-hover:text-white transition-colors" /> },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={16} className="text-white/40 group-hover:text-[#0A66C2] transition-colors" /> },
    { id: 'instagram', name: 'Instagram', icon: <Instagram size={16} className="text-white/40 group-hover:text-[#E4405F] transition-colors" /> },
    { id: 'vk', name: 'VKontakte', icon: <Share2 size={16} className="text-white/40 group-hover:text-[#0077FF] transition-colors" /> },
    { id: 'tiktok', name: 'TikTok', icon: <Music2 size={16} className="text-white/40 group-hover:text-[#EE1D52] transition-colors" /> },
  ];

  const handleDevAccess = async () => {
    const login = prompt("Enter developer login:");
    const password = prompt("Enter developer password:");

    if (login === 'admin' && password === 'admin') {
      try {
        const response = await fetch('/api/dev/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login, password })
        });
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('rg_dev_user', JSON.stringify(data.user));
          window.location.reload(); // Reload to update AuthContext
        } else {
          alert("Invalid credentials from server");
        }
      } catch (error) {
        console.error("Dev auth failed:", error);
        alert("Server error during auth");
      }
    } else {
      alert("Access denied: Incorrect login or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 relative overflow-hidden">
      <div id="recaptcha-container"></div>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 mb-8 shadow-2xl">
            <img src="/welcome.png" alt="Welcome" className="w-full h-full object-cover" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <ShieldCheck size={12} className="text-primary" />
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Secure Phone Auth</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white">
            {t('welcome_back').split('|')[0]} <br />
            <span className="text-primary italic">{t('welcome_back').split('|')[1]}</span>
          </h2>
          <p className="text-white/40 font-medium text-sm">
            {isVerificationStep 
              ? "Enter the 6-digit code sent to your phone." 
              : "Enter your phone number to sign in or create an account."}
          </p>
          
          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-[10px] font-bold uppercase p-3 rounded-xl animate-shake">
              {error}
            </div>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {!isVerificationStep ? (
            <motion.form 
              key="phone-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleInitialSubmit} 
              className="space-y-6"
            >
              <div className="group relative">
                <label className="absolute left-4 -top-2 px-2 bg-bg-dark text-[9px] font-black uppercase tracking-widest text-white/20 group-focus-within:text-primary transition-colors z-10">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCountryMenuOpen(!isCountryMenuOpen);
                        setCountrySearch('');
                      }}
                      className="h-[60px] flex items-center gap-2 px-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold text-white whitespace-nowrap min-w-[120px]"
                    >
                      <span>{selectedCountry.flag}</span>
                      <span>{selectedCountry.code}</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isCountryMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isCountryMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-bg-card border border-white/5 rounded-2xl shadow-2xl py-4 z-50 overflow-hidden"
                        >
                          <div className="px-4 mb-3">
                            <input 
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search country..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50"
                              autoFocus
                            />
                          </div>
                          <div className="max-h-60 overflow-y-auto no-scrollbar">
                            {filteredCountries.map((country) => (
                              <button
                                key={country.name}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setIsCountryMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
                              >
                                <span className="text-base">{country.flag}</span>
                                <span className="text-xs font-bold text-white/60 truncate flex-1">{country.name}</span>
                                <span className="text-[10px] font-black text-primary">{country.code}</span>
                              </button>
                            ))}
                            {filteredCountries.length === 0 && (
                              <div className="px-4 py-3 text-center text-[10px] font-black uppercase text-white/20 tracking-widest">
                                No results found
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Number Input */}
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="000 000 00 00"
                      className="w-full h-[60px] bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-black tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
              >
                Send Verification SMS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="verify-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifySubmit} 
              className="space-y-6"
            >
              <div className="group relative">
                <label className="absolute left-4 -top-2 px-2 bg-bg-dark text-[9px] font-black uppercase tracking-widest text-white/20 group-focus-within:text-primary transition-colors z-10">
                  SMS Code
                </label>
                <div className="relative">
                  <MessageSquareDot className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-center text-xl font-black tracking-[0.5em] text-white placeholder:text-white/10 placeholder:tracking-normal placeholder:text-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <button 
                  type="button"
                  onClick={() => setIsVerificationStep(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                >
                  Change Number
                </button>
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                  Resend Code
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
              >
                Verify & Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-[1px] bg-white/5" />
            <span className="relative px-4 bg-bg-dark text-[10px] font-black uppercase tracking-[0.4em] text-white/10">OR CONTINUE WITH</span>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
            {socialProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSocialLogin(provider.id)}
                className="flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/5 text-white p-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all active:scale-95 group"
              >
                {provider.icon}
                <span className="text-white/40 group-hover:text-white transition-colors">{provider.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={handleDevAccess}
              className="w-full py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/20 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/5"
            >
              <Zap size={14} fill="currentColor" /> Development Access (Admin Login)
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20">
          By continuing, you agree to our {' '}
          <Link to={`/${lang || 'eng'}/terms`} className="text-primary hover:underline underline-offset-4">Terms</Link>
          {' '} & {' '}
          <Link to={`/${lang || 'eng'}/privacy`} className="text-primary hover:underline underline-offset-4">Privacy</Link>
        </p>
      </div>

      <OAuthConsent 
        isOpen={showConsent} 
        onClose={() => setShowConsent(false)} 
        onAccept={handleAcceptConsent}
      />
    </div>
  );
};

export default Login;
