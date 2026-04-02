import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RoleTree } from '../../RoleTree';

interface RegStep1RoleProps {
  onSelect: (roleId: string) => void;
}

const RegStep1Role: React.FC<RegStep1RoleProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 py-2"
    >
      <div className="space-y-2 text-center">
        <h3 className="text-base font-black uppercase text-white">{t('step_role')}</h3>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
          Choose your gateway into the ecosystem
        </p>
      </div>
      <RoleTree onShowDetail={onSelect} />
    </motion.div>
  );
};

export default RegStep1Role;
