import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Check, Zap } from 'lucide-react';
import { ALL_COUNTRIES } from '../../../utils/countries';

interface RegStep5LegalProps {
  formData: any;
  lang: string;
  termsAccepted: boolean;
  onToggleTerms: () => void;
  onFinalize: () => void;
  isLoading: boolean;
}

const RegStep5Legal: React.FC<RegStep5LegalProps> = ({
  formData,
  lang,
  termsAccepted,
  onToggleTerms,
  onFinalize,
  isLoading
}) => {
  const { t } = useTranslation();

  const countryName = (ALL_COUNTRIES.find(c => c.code === formData.country)?.name || formData.country).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <div className="size-16 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 mb-4">
           <Shield size={32} />
        </div>
        <h3 className="text-xl font-black uppercase text-white tracking-widest">Protocol Agreement</h3>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.22em] leading-relaxed">Final Node Activation Compliance</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
         <div className="flex items-start gap-4">
            <div className="size-2 rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <p className="text-[11px] font-medium text-white/60 leading-relaxed italic">
               You are establishing a professional presence within the Grid. As a resident of <span className="text-red-400 font-black uppercase">{countryName}</span>, your data will be managed according to the Red Griffin Global Protocol and local node hosting regulations.
            </p>
         </div>

         <div 
           onClick={onToggleTerms}
           className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
         >
            <div className={`size-5 rounded-md border-2 flex items-center justify-center transition-all ${termsAccepted ? 'bg-red-600 border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'border-white/10 bg-white/5'}`}>
               {termsAccepted && <Check size={12} className="text-white" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
               I acknowledge and accept the <a href={`/${lang}/terms`} className="text-red-500 hover:underline" onClick={(e)=>e.stopPropagation()}>Terms of Use</a> & <a href={`/${lang}/privacy`} className="text-red-500 hover:underline" onClick={(e)=>e.stopPropagation()}>Privacy Policy</a>.
            </span>
         </div>
      </div>

      <button 
        type="button"
        onClick={onFinalize} 
        disabled={!termsAccepted || isLoading} 
        className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-2xl ${termsAccepted ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/40' : 'bg-white/5 text-white/20 cursor-not-allowed opacity-50'}`}
      >
         ACTIVATE NODE <Zap size={16} />
      </button>
    </motion.div>
  );
};

export default RegStep5Legal;
