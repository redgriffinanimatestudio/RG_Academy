import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Box, Users, Settings, Briefcase, ChevronRight, Check } from 'lucide-react';

interface PathOption {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const FACULTIES: PathOption[] = [
  {
    id: 'archviz',
    title: 'ArchViz Specialist',
    desc: 'Master photorealistic architectural visualization and VR environments.',
    icon: <Box size={28} />,
    color: 'emerald-500' // Using tailwind color strings for custom logic
  },
  {
    id: 'animator',
    title: 'Character Animator',
    desc: 'Breathe life into digital entities with advanced rigging and motion.',
    icon: <Users size={28} />,
    color: 'blue-500'
  },
  {
    id: 'game_artist',
    title: 'Game Artist',
    desc: 'Forge real-time interactive worlds, weapons, and game assets.',
    icon: <Settings size={28} />,
    color: 'rose-500'
  }
];

interface RegStep2SoulProps {
  onSelect: (soulId: string) => void;
  selectedId?: string | null;
}

const RegStep2Soul: React.FC<RegStep2SoulProps> = ({ onSelect, selectedId }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="space-y-6 pt-4 pb-10"
    >
      <div className="space-y-3 text-center">
        <h3 className="text-2xl font-black uppercase text-white tracking-[0.2em]">Synchronize Your Soul</h3>
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] leading-relaxed italic max-w-md mx-auto">
          Establish your permanent industrial trajectory within the academy
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto px-4 mt-8">
        {FACULTIES.map((faculty) => {
          const isSelected = selectedId === faculty.id;
          
          return (
            <motion.div
              key={faculty.id}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(faculty.id)}
              className={`
                relative p-6 rounded-[2rem] cursor-pointer transition-all duration-500
                glass-pro-max border group overflow-hidden
                ${isSelected ? 'border-primary ring-4 ring-primary/10 shadow-2xl shadow-primary/20 bg-primary/5' : 'border-white/5 hover:border-white/20 bg-white/[0.02]'}
              `}
            >
              <div className="flex flex-col h-full gap-6 relative z-10">
                <div className={`
                  size-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl
                  ${isSelected ? 'bg-primary text-bg-dark scale-110' : 'bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10'}
                `}>
                  {faculty.icon}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                      {faculty.title}
                    </h3>
                  </div>
                  <p className="text-[10px] font-bold text-white/40 leading-relaxed italic group-hover:text-white/60 transition-colors">
                    {faculty.desc}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${isSelected ? 'text-primary' : 'text-white/20 group-hover:text-white/40'}`}>
                    {isSelected ? 'Synergy Locked' : 'Select Protocol'}
                  </span>
                  <div className={`size-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/20'}`}>
                    {isSelected ? <Check size={14} strokeWidth={4} /> : <ChevronRight size={14} />}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RegStep2Soul;
