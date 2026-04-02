import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, Link as LinkIcon, Send, ChevronRight } from 'lucide-react';
import { InputWithStatus } from '../InputWithStatus';

interface RegStep4SpecsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const RegStep4Specs: React.FC<RegStep4SpecsProps> = ({
  formData,
  onChange,
  onNext,
  onSkip
}) => {
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 py-2">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-lg font-black uppercase text-white">{t('step_specs')}</h3>
        <button 
          type="button"
          onClick={onSkip} 
          className="text-[9px] font-black uppercase text-red-500 border border-red-500/20 px-4 py-2 rounded-xl bg-red-500/5 hover:bg-red-500 hover:text-white transition-all"
        >
          {t('skip_sync')}
        </button>
      </div>
      <InputWithStatus 
        label="Portfolio URL" 
        value={formData.portfolioUrl} 
        onChange={(e)=>onChange('portfolioUrl', e.target.value)} 
        placeholder="https://..." 
        hint="ArtStation, Behance, or Site." 
        icon={<Briefcase size={18} />} 
      />
      <div className="grid grid-cols-2 gap-4">
        <InputWithStatus 
          label="LinkedIn" 
          value={formData.linkedInUrl} 
          onChange={(e)=>onChange('linkedInUrl', e.target.value)} 
          placeholder="ID" 
          hint="Professional link." 
          icon={<LinkIcon size={16} />} 
        />
        <InputWithStatus 
          label="Telegram" 
          value={formData.telegramHandle} 
          onChange={(e)=>onChange('telegramHandle', e.target.value)} 
          placeholder="@handle" 
          hint="Direct comms." 
          icon={<Send size={16} />} 
        />
      </div>
      <div className="space-y-1.5 px-2">
        <label className="text-[10px] font-black uppercase text-white/30">Brief Intelligence (Bio)</label>
        <textarea 
          value={formData.bio} 
          onChange={(e)=>onChange('bio', e.target.value)} 
          placeholder="Skills, goals, expertise..." 
          className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-xs outline-none focus:border-red-500/40 min-h-[80px] resize-none" 
        />
      </div>
      <button 
        type="button"
        onClick={onNext} 
        className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-red-600/40 group"
      >
        {t('next_step')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export default RegStep4Specs;
