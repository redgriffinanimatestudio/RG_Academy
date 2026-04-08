import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Check, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PathOption {
  id: string;
  titleKey: string;
  descKey: string;
  icon: React.ReactNode;
  color: string;
}

const PATHS: PathOption[] = [
  {
    id: 'student',
    titleKey: 'nav_academy',
    descKey: 'academy_desc_compact', // We'll add this to i18n
    icon: <GraduationCap size={28} />,
    color: 'primary'
  },
  {
    id: 'client',
    titleKey: 'nav_studio',
    descKey: 'studio_desc_compact', // We'll add this to i18n
    icon: <Briefcase size={28} />,
    color: 'blue'
  }
];

interface DualPathSelectionProps {
  onSelect: (id: string) => void;
  selectedId?: string | null;
}

const DualPathSelection: React.FC<DualPathSelectionProps> = ({ onSelect, selectedId }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto px-4">
      {PATHS.map((path) => {
        const isSelected = selectedId === path.id;
        
        return (
          <motion.div
            key={path.id}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(path.id)}
            className={`
              relative p-6 rounded-[2rem] cursor-pointer transition-all duration-500
              glass-pro-max border group overflow-hidden
              ${isSelected ? 'border-primary ring-4 ring-primary/10 shadow-[0_20px_50px_rgba(16,185,129,0.15)]' : 'border-white/5 hover:border-white/20'}
            `}
          >
            {/* Animated Glow Backdrop */}
            <div 
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`}
              style={{ background: `radial-gradient(circle at top right, var(--${path.color}) 0%, transparent 70%)` }}
            />

            <div className="flex flex-col h-full gap-6 relative z-10">
              <div className={`
                size-14 rounded-2xl flex items-center justify-center transition-all duration-500
                ${isSelected ? 'bg-primary text-white scale-110' : 'bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10'}
              `}>
                {path.icon}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                    {t(path.titleKey)}
                  </h3>
                  {isSelected && <Check size={16} className="text-primary" strokeWidth={4} />}
                </div>
                <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest italic group-hover:text-white/60 transition-colors">
                  {/* Fallback description if key missing */}
                  {path.id === 'student' ? 'Master Mastery Sequence' : 'Execute Industrial Briefs'}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${isSelected ? 'text-primary' : 'text-white/20 group-hover:text-white/40'}`}>
                  {path.id === 'student' ? 'Educational Path' : 'Institutional Path'}
                </span>
                <ChevronRight size={14} className={`transition-all ${isSelected ? 'translate-x-0 opacity-100 text-primary' : '-translate-x-2 opacity-0'}`} />
              </div>
            </div>

            {/* Selection indicator line */}
            {isSelected && (
              <motion.div 
                layoutId="path-indicator"
                className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary rounded-t-full shadow-[0_0_20px_var(--primary)]"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default DualPathSelection;
