import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  isLocked?: boolean;
}

interface IndustrialAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  accentColor?: string;
}

export const IndustrialAccordion: React.FC<IndustrialAccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
  accentColor = '#00f5d4'
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded(prev => {
      if (allowMultiple) {
        return { ...prev, [id]: !prev[id] };
      } else {
        const isCurrentlyExpanded = !!prev[id];
        return isCurrentlyExpanded ? {} : { [id]: true };
      }
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = !!expanded[item.id];
        
        return (
          <div 
            key={item.id} 
            className={`
              group/item rounded-[2.5rem] border transition-all duration-500 overflow-hidden
              ${isOpen ? 'bg-white/[0.03] border-white/10 shadow-2xl' : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.01]'}
            `}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-8 text-left outline-none"
            >
              <div className="flex items-center gap-6">
                <div className={`
                  size-12 rounded-2xl flex items-center justify-center border transition-all duration-500
                  ${isOpen ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]' : 'bg-white/5 border-white/10 text-white/20'}
                `}>
                  {item.icon || <span className="text-[10px] font-black italic">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>}
                </div>
                
                <div className="space-y-1">
                  {item.subtitle && (
                    <span className={`text-[8px] font-black uppercase tracking-[0.4em] transition-colors ${isOpen ? 'text-primary/60' : 'text-white/20'}`}>
                      {item.subtitle}
                    </span>
                  )}
                  <h4 className={`text-lg font-black uppercase tracking-tight transition-colors ${isOpen ? 'text-white' : 'text-white/40 group-hover/item:text-white/60'}`}>
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {item.badge && (
                  <span className="hidden sm:block px-4 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40">
                    {item.badge}
                  </span>
                )}
                <div className={`
                  size-10 rounded-xl border flex items-center justify-center transition-all duration-500
                  ${isOpen ? 'bg-primary border-primary text-bg-dark rotate-180' : 'bg-white/5 border-white/10 text-white/20'}
                `}>
                  <ChevronDown size={14} />
                </div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-8 pb-10 ml-[4.5rem] border-t border-white/5 pt-8 relative">
                    <div className="absolute left-[-2.25rem] top-8 bottom-10 w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />
                    <div className="text-white/40 text-sm leading-[1.8] font-medium italic selection:bg-primary selection:text-bg-dark animate-in fade-in slide-in-from-top-4 duration-700">
                      {item.content}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
