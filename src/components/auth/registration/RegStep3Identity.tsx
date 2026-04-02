import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserCheck, ChevronRight } from 'lucide-react';
import { InputWithStatus } from '../InputWithStatus';
import { CyberCalendar } from '../CyberCalendar';
import { CountrySelector } from '../CountrySelector';

interface RegStep3IdentityProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  lang: string;
}

const RegStep3Identity: React.FC<RegStep3IdentityProps> = ({
  formData,
  onChange,
  onNext,
  lang
}) => {
  const { t } = useTranslation();

  const isNextDisabled = !formData.displayName || !formData.dateOfBirth || !formData.country || !formData.citizenship;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 py-0">
      <InputWithStatus 
        label={t('full_name')}
        value={formData.displayName}
        onChange={(e) => onChange('displayName', e.target.value)}
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
                 onClick={() => onChange('gender', g)}
                 className={`py-3.5 rounded-xl border transition-all text-[8px] font-black uppercase tracking-widest ${formData.gender === g ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
               >
                 {t(`gender_${g}`)}
               </button>
             ))}
           </div>
        </div>

        <CyberCalendar 
          value={formData.dateOfBirth}
          onChange={(val) => onChange('dateOfBirth', val)}
          lang={lang}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CountrySelector 
          label="Country of Residence"
          placeholder="Select Node Host"
          value={formData.country}
          onChange={(val) => onChange('country', val)}
        />

        <CountrySelector 
          label="Citizenship"
          placeholder="Legal Citizenship"
          value={formData.citizenship}
          onChange={(val) => onChange('citizenship', val)}
        />
      </div>

      <button 
        type="button"
        onClick={onNext} 
        disabled={isNextDisabled} 
        className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-red-700 transition-all flex items-center justify-center gap-2 group"
      >
        {t('establish_identity')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export default RegStep3Identity;
