import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DualPathSelection from './DualPathSelection';

interface RegStep1RoleProps {
  onSelect: (roleId: string) => void;
  selectedId?: string | null;
}

const RegStep1Role: React.FC<RegStep1RoleProps> = ({ onSelect, selectedId }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="space-y-6 pt-4 pb-10"
    >
      <div className="space-y-3 text-center">
        <h3 className="text-2xl font-black uppercase text-white tracking-[0.2em]">{t('step_role')}</h3>
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] leading-relaxed italic max-w-md mx-auto">
          Synchronize your professional intent within the industrial ecosystem
        </p>
      </div>
      
      <div className="relative mt-8">
        <DualPathSelection onSelect={onSelect} selectedId={selectedId} />
      </div>
    </motion.div>
  );
};

export default RegStep1Role;
