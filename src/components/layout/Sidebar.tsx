import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, ChevronLeft, Box } from 'lucide-react';

interface SidebarProps {
  profile: any;
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
  profile,
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
          {/* 🧿 Tier 1: Contextual Discovery (Guest only) */}
          {!profile && !isSidebarCollapsed && (
            <div className="px-2 mb-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Box size={40} className={modeColor} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Genesis Guide</h4>
                <p className="text-[11px] font-bold text-white mb-4 leading-relaxed">Join the Red Griffin Creative Ecosystem to unlock professional nodes.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase text-primary">
                    <div className="size-1 rounded-full bg-primary animate-pulse" />
                    How to start
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/40 hover:text-white transition-colors cursor-pointer">
                    <div className="size-1 rounded-full bg-white/10" />
                    Ecosystem Map
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {sidebarCategories.map((cat) => {
              const isCatActive = activeCatName === cat?.name;
              const Icon = cat?.icon || Box;
              return (
                <div key={cat?.name || Math.random()} className="space-y-1">
                  <button 
                    onClick={() => { if (isSidebarCollapsed) setIsSidebarCollapsed(false); handleSetCategory(cat); }} 
                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} ${isCatActive ? (isStudio ? 'bg-primary-hover/10 border-primary-hover/20 text-white' : 'bg-primary/10 border-primary/20 text-white') : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Icon size={16} className={isCatActive ? modeColor : 'opacity-40'} />
                      {!isSidebarCollapsed && <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest truncate max-w-[140px]">{t(cat?.name || '')}</span>}
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
                        {cat?.subcategories?.map((sub: any) => {
                          const isSubActive = activeSubName === sub?.name;
                          const hasDeepNested = sub?.subcategories && sub.subcategories.length > 0;
                          
                          return (
                            <div key={sub?.name || Math.random()} className="space-y-1">
                              <button 
                                onClick={() => handleSetSub(sub, cat)} 
                                className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${isSubActive ? (isStudio ? 'text-primary-hover bg-white/5' : 'text-primary bg-white/5') : 'text-white/30 hover:text-white/60'}`}
                              >
                                {t(sub?.name || '')}
                                {hasDeepNested ? (
                                  <ChevronDown size={10} className={`transition-transform duration-300 ${isSubActive ? 'rotate-180 opacity-100' : 'opacity-20'}`} />
                                ) : (
                                  <div className={`size-1 rounded-full ${isSubActive ? (isStudio ? 'bg-primary-hover' : 'bg-primary shadow-[0_0_8px_#00ff9d]') : 'bg-white/10'}`} />
                                )}
                              </button>

                              {/* 💎 THIRD LEVEL: Role Specific Sub-items */}
                              {hasDeepNested && isSubActive && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  className="ml-3 pl-3 border-l border-white/10 space-y-1 py-1"
                                >
                                  {sub.subcategories.map((deep: any) => (
                                    <button
                                      key={deep.name}
                                      className="w-full text-left px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                      <div className="size-1 rounded-full bg-white/10" />
                                      {t(deep.name)}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
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
