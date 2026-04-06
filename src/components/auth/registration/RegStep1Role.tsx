import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import IdentityGateway from './IdentityGateway';

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
      className="space-y-10 py-6"
    >
      <div className="space-y-4 text-center">
        <h3 className="text-3xl font-black uppercase text-white tracking-[0.2em]">{t('step_role')}</h3>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.6em] leading-relaxed italic">
          Choose your gateway into the collective ecosystem
        </p>
      </div>
      
      <div className="relative mt-8">
        <IdentityGateway onSelect={onSelect} selectedId={selectedId} />
      </div>
    </motion.div>
  );
};

export default RegStep1Role;
