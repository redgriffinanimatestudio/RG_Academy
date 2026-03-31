import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  Home, 
  GraduationCap, 
  Briefcase, 
  Search, 
  LayoutDashboard,
  LogIn
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const { profile } = useAuth();
  const { data: platformData } = usePlatform();
  
  const currentLangCode = lang || 'eng';
  const cartCount = platformData?.cart?.length || 0;

    const isStudio = location.pathname.includes('/studio');
    const modePrefix = isStudio ? '/studio' : '/aca';
  
    const navItems = [
      { icon: Home, label: 'Home', path: `/${currentLangCode}` },
      { icon: GraduationCap, label: 'Academy', path: `/aca/${currentLangCode}` },
      { icon: Search, label: 'Search', action: () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }));
      }},
      { icon: Briefcase, label: 'Studio', path: `/studio/${currentLangCode}` },
      profile 
        ? { icon: LayoutDashboard, label: 'Dashboard', path: `${modePrefix}/${currentLangCode}/dashboard` }
        : { icon: LogIn, label: 'Join', path: `/aca/${currentLangCode}/login` }
    ];

  const isActive = (path?: string) => path && location.pathname === path;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[150] md:hidden px-6 pb-8 pointer-events-none"
    >
      <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 flex items-center justify-between shadow-2xl pointer-events-auto overflow-hidden">
        {navItems.map((item: any, idx) => (
          <button
            key={idx}
            onClick={() => item.path ? navigate(item.path) : item.action?.()}
            className="relative flex flex-col items-center justify-center flex-1 py-3 group outline-none"
          >
            <div className={`relative z-10 transition-all duration-300 ${isActive(item.path) ? 'text-primary scale-110' : 'text-white/20 group-active:scale-90'}`}>
              <item.icon size={20} strokeWidth={isActive(item.path) ? 3 : 2} />
              
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 size-4 bg-rose-500 rounded-full flex items-center justify-center text-[7px] font-black text-white border-2 border-[#050505]">
                  {item.badge}
                </span>
              )}
            </div>
            
            {isActive(item.path) && (
              <motion.div 
                layoutId="bottom-nav-active"
                className="absolute inset-x-2 inset-y-1 bg-white/5 rounded-2xl -z-0"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className={`text-[8px] font-black uppercase tracking-widest mt-1.5 transition-colors ${isActive(item.path) ? 'text-white' : 'text-white/20'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
