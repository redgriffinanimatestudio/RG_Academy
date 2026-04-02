import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, CheckCircle2, X, Info, ChevronRight } from 'lucide-react';
import { InputWithStatus } from '../InputWithStatus';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { ALL_COUNTRIES } from '../../../utils/countries';

interface RegStep2NetworkProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  emailStatus: 'none' | 'loading' | 'success' | 'error';
  emailError: string;
  passStrength: 0 | 1 | 2 | 3;
  passConfirmStatus: 'none' | 'success' | 'error';
  phoneStatus: 'none' | 'success' | 'warning' | 'error';
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
  onNext
}) => {
  const { t } = useTranslation();

  const isNextDisabled = 
    !formData.email || 
    !formData.password || 
    emailStatus === 'error' || 
    passConfirmStatus !== 'success' || 
    phoneStatus === 'error' || 
    phoneStatus === 'none';

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

      <div className="space-y-1">
         <label className="text-[10px] font-black uppercase text-white/30 px-2">{t('phone_number')}</label>
         <div className="flex gap-2">
           <select 
             className="bg-black/40 border border-white/5 rounded-2xl px-3 text-white text-xs outline-none focus:border-red-500/40"
             value={formData.phoneCode}
             onChange={(e) => onChange('phoneCode', e.target.value)}
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
               onChange={(e) => onChange('phone', e.target.value)}
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
      
      <button 
        type="button"
        onClick={onNext} 
        disabled={isNextDisabled} 
        className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-700 transition-all flex items-center justify-center gap-2 group"
      >
        {t('security_check_passed')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export default RegStep2Network;
