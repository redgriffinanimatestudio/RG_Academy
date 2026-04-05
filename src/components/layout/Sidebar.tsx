import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Home, LayoutDashboard, Database, Users, MessageSquare, Settings, HelpCircle } from 'lucide-react';

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
  onOpenGuide: () => void;
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
  isStudio,
  onOpenGuide
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block relative shrink-0 z-[40]">
      <motion.aside 
        initial={false} 
        animate={{ width: 72 }} 
        className="sticky top-24 h-[calc(100vh-12rem)] flex flex-col items-center py-8 rounded-[2.5rem] glass-pro-max border-none shadow-xl"
      >
        <div className="flex flex-col items-center gap-6 w-full">
          {/* 🧿 Navigation Hub */}
          <div className="flex flex-col items-center gap-4 w-full px-3">
            {sidebarCategories.map((cat) => {
              const isCatActive = activeCatName === cat?.name;
              const Icon = cat?.icon || Box;
              
              return (
                <div key={cat?.name || Math.random()} className="relative group">
                  <button 
                    onClick={() => handleSetCategory(cat)} 
                    className={`size-12 rounded-2xl transition-all flex items-center justify-center relative overflow-hidden backdrop-blur-md shadow-sm border border-border-main ${isCatActive ? 'bg-primary text-white shadow-primary/20 border-primary' : 'bg-bg-card/40 text-text-muted hover:bg-bg-card hover:text-primary transition-colors'}`}
                  >
                    <Icon size={20} className={isCatActive ? 'neural-pulse' : ''} />
                    
                    {/* Tooltip */}
                    <div className="absolute left-16 px-3 py-1.5 bg-bg-dark border border-border-main text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-2xl">
                      {t(cat?.name || '')}
                    </div>
                  </button>

                  {/* Active Indicator dot */}
                  {isCatActive && (
                    <motion.div 
                      layoutId="sidebar-dot"
                      className="absolute -right-1 top-1/2 -translate-y-1/2 size-1.5 bg-emerald-500 rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Separator line */}
          <div className="w-8 h-[1px] bg-border-main opacity-40 my-2" />

          {/* Support/Settings Hub */}
          <div className="flex flex-col items-center gap-4 mt-auto pb-2">
            <button 
              onClick={onOpenGuide}
              className="size-12 rounded-2xl bg-bg-card/40 text-text-muted hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center shadow-sm border border-border-main"
            >
              <HelpCircle size={20} />
            </button>
            <button className="size-12 rounded-2xl bg-bg-dark text-white hover:bg-primary transition-all flex items-center justify-center shadow-lg border border-border-main">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
