import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  sidebarCategories: any[];
  activeCatName: string;
  activeSubName: string;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  handleSetCategory: (cat: any) => void;
  handleSetSub: (sub: any, cat: any) => void;
  modeColor: string;
  isStudio: boolean;
}

export default function Sidebar({
  sidebarCategories,
  activeCatName,
  activeSubName,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  handleSetCategory,
  handleSetSub,
  modeColor,
  isStudio
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block relative shrink-0 z-[40]">
      <motion.aside 
        initial={false} 
        animate={{ width: isSidebarCollapsed ? 70 : 260 }} 
        className="sticky top-24 sm:top-28 lg:top-32 h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar border-r border-white/5 pr-2 sm:pr-4"
      >
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-2">
            {sidebarCategories.map((cat) => {
              const isCatActive = activeCatName === cat.name;
              const Icon = cat.icon;
              return (
                <div key={cat.name} className="space-y-1">
                  <button 
                    onClick={() => { if (isSidebarCollapsed) setIsSidebarCollapsed(false); handleSetCategory(cat); }} 
                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} ${isCatActive ? (isStudio ? 'bg-primary-hover/10 border-primary-hover/20 text-white' : 'bg-primary/10 border-primary/20 text-white') : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Icon size={16} className={isCatActive ? modeColor : 'opacity-40'} />
                      {!isSidebarCollapsed && <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest truncate max-w-[140px]">{t(cat.name)}</span>}
                    </div>
                    {!isSidebarCollapsed && <ChevronDown size={12} className={`transition-transform duration-300 shrink-0 ${isCatActive ? 'rotate-180 opacity-100' : 'opacity-20'}`} />}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isCatActive && !isSidebarCollapsed && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        className="overflow-hidden ml-3 pl-3 border-l border-white/5 space-y-1 mt-1"
                      >
                        {cat.subcategories.map((sub: any) => (
                          <button 
                            key={sub.name} 
                            onClick={() => handleSetSub(sub, cat)} 
                            className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${activeSubName === sub.name ? (isStudio ? 'text-primary-hover' : 'text-primary') : 'text-white/30 hover:text-white/60'}`}
                          >
                            {t(sub.name)}
                            <div className={`size-1 rounded-full ${activeSubName === sub.name ? (isStudio ? 'bg-primary-hover' : 'bg-primary') : 'bg-white/10'}`} />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
