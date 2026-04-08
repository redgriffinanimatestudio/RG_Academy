import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, CheckCircle2, X, Info, ChevronRight, Smartphone } from 'lucide-react';
import { InputWithStatus } from '../InputWithStatus';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { SocialAuthButtons } from '../SocialAuthButtons';
import { ALL_COUNTRIES } from '../../../utils/countries';

interface RegStep2NetworkProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  emailStatus: 'none' | 'loading' | 'success' | 'error';
  emailError: string;
  passStrength: 0 | 1 | 2 | 3;
  passConfirmStatus: 'none' | 'success' | 'error';
  phoneStatus: 'none' | 'loading' | 'success' | 'warning' | 'error';
  phoneError: string;
  onNext: () => void;
}

const RegStep2Network: React.FC<RegStep2NetworkProps> = ({
  formData,
  onChange,
  emailStatus,
  emailError,
  passStrength,
  passConfirmStatus,
  phoneStatus,
  phoneError,
  onNext
}) => {
  const { t } = useTranslation();

  const isNextDisabled = 
    !formData.email || 
    !formData.password || 
    emailStatus === 'error' || 
    passConfirmStatus !== 'success' || 
    phoneStatus !== 'success';

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2 py-0">
      <InputWithStatus 
        id="reg-email"
        autoComplete="email"
        label={t('network_email')}
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
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
          onChange={(e) => onChange('password', e.target.value)}
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
        onChange={(e) => onChange('confirmPassword', e.target.value)}
        placeholder="••••••••"
        hint="Repeat password for validation."
        status={passConfirmStatus}
        errorText={passConfirmStatus === 'error' ? 'Encryption mismatch' : ''}
        icon={<Lock size={18} />}
        required
      />

      <div className="space-y-4">
         <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-white/30 px-2 flex items-center gap-2">
              <Smartphone size={10} className="text-primary" /> {t('phone_number')}
            </label>
            <div className="flex gap-2">
              <select 
                className="bg-black/60 border border-white/5 rounded-2xl px-4 py-3 text-white text-[11px] font-bold outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                value={formData.phoneCode}
                onChange={(e) => onChange('phoneCode', e.target.value)}
              >
                {ALL_COUNTRIES.map(c => (
                  <option key={c.code} value={c.phone} className="bg-[#050505] text-white">
                    {c.flag} +{c.phone}
                  </option>
                ))}
              </select>
              <div className="flex-1 relative group">
                <input 
                  type="tel"
                  autoComplete="tel"
                  className={`w-full bg-black/60 border rounded-2xl py-3.5 px-6 text-white text-sm font-medium outline-none transition-all ${phoneStatus === 'error' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : phoneStatus === 'success' ? 'border-emerald-500/30' : 'border-white/5 focus:border-primary/40 focus:ring-1 focus:ring-primary/20'}`}
                  placeholder="000 000 00 00"
                  value={formData.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                   {phoneStatus === 'loading' && <div className="size-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />}
                   {phoneStatus === 'success' && <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />}
                   {phoneStatus === 'error' && <X size={14} className="text-red-500" />}
                   {phoneStatus === 'warning' && <Info size={14} className="text-yellow-500" />}
                </div>
              </div>
            </div>
         </div>
         <div className="px-2 flex items-center gap-2 opacity-30 group hover:opacity-100 transition-opacity">
            <Info size={10} className="text-primary" />
            <p className="text-[8px] font-bold uppercase tracking-widest text-white/60 italic leading-none">Vessel requires SMS confirmation for neural activation.</p>
         </div>
         {phoneError && (
           <p className={`px-2 text-[9px] font-black uppercase tracking-widest ${phoneStatus === 'error' ? 'text-red-400' : phoneStatus === 'success' ? 'text-emerald-400' : 'text-yellow-400'}`}>
             {phoneError}
           </p>
         )}
      </div>
      
      <div className="pt-4 space-y-6">
        <button 
          type="button"
          onClick={onNext} 
          disabled={isNextDisabled} 
          className="w-full bg-primary text-bg-dark py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3 group relative overflow-hidden shadow-xl shadow-primary/10"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10">{t('security_check_passed')}</span>
          <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>

        <SocialAuthButtons />
      </div>
    </motion.div>
  );
};

export default RegStep2Network;
