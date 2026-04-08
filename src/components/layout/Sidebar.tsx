import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Home as HomeIcon, 
  LayoutDashboard, 
  Database, 
  Users, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  Menu,
  ChevronRight,
  ShieldCheck,
  Zap,
  Fingerprint,
  ChevronDown
} from 'lucide-react';
import StalkerToggle from '../navigation/StalkerToggle';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

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

// 🌳 Recursive Tree Component
const NavTreeItem = ({ item, depth = 0, isExpanded, t, onSelect, activeName }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon || (depth === 0 ? Box : null);
  const hasSub = item.subcategories && item.subcategories.length > 0;
  const isActive = activeName === item.name;

  return (
    <div className="w-full">
      <button
        onClick={() => {
          if (hasSub) setIsOpen(!isOpen);
          onSelect(item);
        }}
        className={`w-full group/item px-3 py-3 rounded-2xl transition-all flex items-center gap-3 relative overflow-hidden ${isActive ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]' : 'text-white/40 hover:bg-white/[0.03] hover:text-white'}`}
      >
        <div className="shrink-0 flex items-center justify-center w-6">
           {Icon ? <Icon size={18} className={isActive ? 'neural-pulse' : ''} /> : <div className="size-1 rounded-full bg-current opacity-20" />}
        </div>
        
        {isExpanded && (
          <div className="flex-1 flex items-center justify-between min-w-0">
             <span className={`text-[10px] font-black uppercase tracking-widest truncate ${isActive ? 'text-primary' : ''}`}>
                {t(item.name || '')}
             </span>
             {hasSub && (
               <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                  <ChevronDown size={12} className="opacity-40" />
               </motion.div>
             )}
          </div>
        )}
      </button>

      {/* Recursive Children */}
      <AnimatePresence>
        {isOpen && hasSub && isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 mt-1 border-l border-white/5 pl-2 space-y-1 relative"
          >
             {/* Tree Connector Lines */}
             <div className="absolute left-[-8px] top-0 bottom-4 w-px bg-white/5" />
             
             {item.subcategories.map((sub: any) => (
               <NavTreeItem 
                 key={sub.name} 
                 item={sub} 
                 depth={depth + 1} 
                 isExpanded={isExpanded} 
                 t={t} 
                 onSelect={onSelect}
                 activeName={activeName}
               />
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const [hovered, setHovered] = useState(false);
  const isExpanded = hovered || !isSidebarCollapsed;
  const { profile: userProfile } = useAuth();
  const navigate = useNavigate();
  const { lang = 'eng' } = useParams();

  const handleModeToggle = async (newMode: 'SOLO' | 'STALKER') => {
    if (!userProfile) return;
    try {
      await userService.updateProfile(userProfile.uid, { learningMode: newMode });
      window.location.reload();
    } catch (err) {
      console.error("[SIDEBAR] Protocol Shift Failed:", err);
    }
  };

  const handleItemSelect = (item: any) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.subcategories) {
       // Root category select logic
       handleSetCategory(item);
    } else {
       // Subcategory select logic
       handleSetSub(item, null);
    }
  };

  return (
    <div className="hidden md:block relative shrink-0 z-[40]">
      <motion.aside 
        initial={false} 
        animate={{ 
          width: isExpanded ? 280 : 72,
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        }} 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="sticky top-24 h-[calc(100vh-12rem)] flex flex-col items-center py-8 rounded-[2.5rem] glass-pro-max border border-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden"
      >
        {/* 💠 Sidebar Header: Terminal Status */}
        <div className="w-full px-4 mb-8 space-y-4">
           {isExpanded ? (
             <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase text-white italic tracking-tighter">Command <span className="text-primary">Center.</span></span>
                   <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20 italic italic">Protocol: {userProfile?.learningMode || 'GUEST'}</span>
                </div>
                <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Fingerprint size={16} />
                </div>
             </div>
           ) : (
             <div className="flex justify-center">
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                    <Menu size={20} />
                </div>
             </div>
           )}
        </div>

        {/* 🌳 MAIN NAVIGATION TREE */}
        <div className="flex-1 flex flex-col items-center gap-6 w-full overflow-y-auto no-scrollbar scroll-smooth px-3">
          <div className="flex flex-col gap-2 w-full">
            {sidebarCategories.map((cat) => (
              <NavTreeItem 
                key={cat.name}
                item={cat}
                isExpanded={isExpanded}
                t={t}
                onSelect={handleItemSelect}
                activeName={activeCatName || activeSubName}
              />
            ))}
          </div>

          {/* ⚡ STALKER COMMAND INTERFACE */}
          {profile && (
             <StalkerToggle 
               mode={userProfile?.learningMode || 'SOLO'}
               onToggle={handleModeToggle}
               isExpanded={isExpanded}
             />
          )}

          {/* 🛠️ Utility Sector */}
          <div className="w-full mt-auto pb-4 space-y-2">
            <button 
              onClick={onOpenGuide}
              className={`w-full group h-12 rounded-2xl bg-white/[0.02] border border-white/5 text-white/30 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-4 relative overflow-hidden`}
            >
              <div className={`shrink-0 flex items-center justify-center transition-all ${isExpanded ? 'w-10 ml-1' : 'w-full'}`}>
                 <HelpCircle size={18} />
              </div>
              {isExpanded && <span className="text-[10px] font-black uppercase tracking-widest truncate">Protocol Guide</span>}
            </button>

            <button 
              onClick={() => navigate(`/${lang}/dashboard?view=settings`)}
              className={`w-full group h-12 rounded-[2rem] bg-bg-dark border border-white/5 text-white/30 hover:bg-primary hover:text-bg-dark transition-all flex items-center gap-4 relative overflow-hidden shadow-xl`}
            >
              <div className={`shrink-0 flex items-center justify-center transition-all ${isExpanded ? 'w-10 ml-1' : 'w-full'}`}>
                 <Settings size={18} className="group-hover:rotate-180 transition-transform duration-700" />
              </div>
              {isExpanded && <span className="text-[10px] font-black uppercase tracking-widest italic truncate">Core Settings</span>}
            </button>
          </div>
        </div>

        {/* 📟 Terminal Pulse Indicator */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center opacity-20">
           <div className="h-[1px] w-12 bg-white/20 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ x: [-48, 48] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                 className="h-full w-8 bg-primary blur-[1px]" 
               />
           </div>
        </div>
      </motion.aside>
    </div>
  );
}
