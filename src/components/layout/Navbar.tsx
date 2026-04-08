import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Globe, Bell, MessageSquare, User, LayoutDashboard, Shield, LogOut, ChevronDown, ShoppingCart, 
  Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { useTheme } from '../../context/ThemeContext';
import { AcademyMegaMenu } from './MegaMenu';

interface NavbarProps {
  isStudio: boolean;
  isAcademy: boolean;
  isCommunity: boolean;
  isDashboardPage: boolean;
  modePrefix: string;
  modeColor: string;
  modeBg: string;
  unreadCount: number;
  onOpenMobileMenu: () => void;
}

import { LANGUAGES } from './Layout.constants';

export default function Navbar({ 
  isStudio, isAcademy, isCommunity, isDashboardPage, 
  modePrefix, modeColor, modeBg, unreadCount, onOpenMobileMenu 
}: NavbarProps) {
  const { profile, activeRole, setActiveRole, logout } = useAuth();
  const { data: platformData } = usePlatform();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentLangCode = lang || 'eng';
  const currentLang = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[0];

  const cartCount = platformData?.cart?.length || 0;

  const changeLanguage = (newLang: string) => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const modes = ['aca', 'studio', 'community', 'dashboard', 'dev'];
    
    if (modes.includes(pathParts[0])) {
      if (pathParts[1] && LANGUAGES.some(l => l.code === pathParts[1])) {
        pathParts[1] = newLang;
      } else {
        pathParts.splice(1, 0, newLang);
      }
    } else if (LANGUAGES.some(l => l.code === pathParts[0])) {
      pathParts[0] = newLang;
    } else {
      pathParts.unshift(newLang);
    }
    
    navigate('/' + pathParts.join('/'));
    setIsLangMenuOpen(false);
  };

  const getDashboardLinkForRole = (role: string) => {
    return `${modePrefix}/${currentLangCode}/dashboard`;
  };

  const navClass = 'bg-bg-dark/80 backdrop-blur-md border-border-main shadow-sm';
  const cardClass = 'bg-bg-card border-border-main backdrop-blur-3xl shadow-2xl';

  return (
    <nav className={`sticky top-0 z-[100] glass-pro-max border-b transition-all duration-500 ${navClass}`}>
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 lg:h-22 items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          <div className="flex items-center gap-2 sm:gap-6">
            <button onClick={onOpenMobileMenu} className={`lg:hidden p-1.5 sm:p-2 bg-bg-card rounded-lg transition-colors ${modeColor}`}>
              <Menu size={20} />
            </button>
            <Link to={`${modePrefix}/${currentLangCode}`} className="flex items-center gap-2 sm:gap-4 group shrink-0">
              <img src="/logo-web.png" alt="RG" className="h-6 sm:h-8 lg:h-12 w-auto object-contain" />
              <div className="flex flex-col hidden xs:flex lg:hidden xl:flex">
                <span className="text-[10px] sm:text-xs lg:text-lg font-black tracking-tighter text-ink uppercase leading-none">Red Griffin</span>
                <span className={`text-[5px] sm:text-[6px] lg:text-[9px] font-bold tracking-[0.3em] text-emerald-600 uppercase mt-0.5 sm:mt-1`}>{t('creative_ecosystem')}</span> 
              </div>
            </Link>
          </div>

          <div className="hidden md:flex lg:flex items-center gap-4 lg:gap-6 h-full">
            <AcademyMegaMenu />
            <Link to={`/studio/${currentLangCode}`} className={`text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-colors ${isStudio ? 'text-emerald-600' : 'text-text-muted hover:text-ink'}`}>{t('studio')}</Link>
            <Link to={`${modePrefix}/${currentLangCode}/community`} className={`text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-colors ${isCommunity ? 'text-emerald-600' : 'text-text-muted hover:text-ink'}`}>{t('community')}</Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-xl bg-[var(--switcher-bg)] text-ink hover:text-emerald-500 transition-all active:scale-95 group shadow-sm border border-border-main"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -10, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <div className="relative hidden sm:block">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className={`p-2 transition-colors flex items-center gap-2 font-black text-[9px] sm:text-[10px] uppercase ${modeColor}`}>
                <Globe size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /><span className="hidden md:inline">{currentLang.code}</span>
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`absolute right-0 mt-4 w-44 border rounded-2xl shadow-2xl py-2 z-50 overflow-hidden ${cardClass}`}>
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => changeLanguage(l.code)} className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase flex items-center justify-between transition-all ${currentLang.code === l.code ? 'text-emerald-600 bg-emerald-500/10' : 'text-text-muted hover:text-ink hover:bg-border-main/5'}`}>
                        <span className="flex items-center gap-3"><span>{l.flag}</span> {l.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {profile ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <button 
                  onClick={() => navigate(`/${currentLangCode}/cart`)} 
                  className="p-1.5 sm:p-2 text-text-muted hover:text-emerald-600 transition-colors relative group"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] font-black text-white border-2 border-white group-hover:scale-110 transition-transform">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button className="p-1.5 sm:p-2 text-text-muted hover:text-emerald-600 transition-colors relative">
                  <Bell size={18} />
                  {unreadCount > 0 && <span className={`absolute top-1.5 right-1.5 size-1.5 sm:size-2 rounded-full border-2 bg-emerald-500 border-white`} />}
                </button>
                
                <div className="relative">
                  <button className="flex items-center gap-2 p-1 sm:pr-4 rounded-xl border border-border-main bg-bg-card hover:border-emerald-500/40 transition-all group shadow-sm" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <div className="size-7 sm:size-9 rounded-lg overflow-hidden border border-border-main group-hover:border-emerald-500/40 shrink-0">
                      {profile.photoURL ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-[10px] font-black bg-emerald-500 text-white uppercase`}>{profile.displayName?.substring(0, 2) || 'RG'}</div>}
                    </div>
                    <div className="hidden md:flex flex-col items-start text-left">
                      <span className="text-[10px] font-black text-ink truncate max-w-[80px] leading-none uppercase">{profile.displayName?.split(' ')[0]}</span>
                      <span className={`text-[7px] font-bold uppercase tracking-widest text-emerald-600 leading-none mt-1.5`}>{activeRole?.replace('_', ' ')}</span>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className={`absolute right-0 mt-4 w-72 bg-bg-card border border-border-main rounded-[2.5rem] shadow-2xl py-4 z-50`}>
                        <div className="px-8 py-4 border-b border-border-main text-[9px]">
                          <p className="font-black text-ink uppercase text-xs">{profile.displayName}</p>
                          <p className="text-text-muted uppercase mt-1.5">{profile.email}</p>
                        </div>
                        <div className="py-2">
                          {profile?.uid && (
                            <Link to={`/${isStudio ? 'studio' : 'aca'}/${currentLangCode}/profile/${profile.uid}`} onClick={() => setIsUserMenuOpen(false)} className="block px-8 py-3.5 text-[10px] font-black uppercase text-text-muted hover:text-emerald-600 hover:bg-emerald-500/10 transition-all flex items-center gap-4"><User size={14} /> {t('my_profile')}</Link>
                          )}
                          <Link to={`${modePrefix}/${currentLangCode}/dashboard`} onClick={() => setIsUserMenuOpen(false)} className="block px-8 py-3.5 text-[10px] font-black uppercase text-text-muted hover:text-emerald-600 hover:bg-emerald-500/10 transition-all flex items-center gap-4"><LayoutDashboard size={14} /> {t('my_dashboard')}</Link>
                          
                          <div className="px-8 py-5 bg-bg-dark/5 border-y border-border-main my-2">
                            <p className="text-[8px] font-black text-text-muted opacity-40 uppercase mb-2 leading-none">Vault Balance</p>
                            <p className="text-2xl font-black text-ink">$ {profile.balance || '0.00'}</p>
                          </div>

                          <div className="px-8 py-3">
                            <p className="text-[8px] font-black text-text-muted opacity-40 uppercase mb-3 leading-none">Switch identity</p>
                            {profile.roles.map(r => (
                              <button key={r} onClick={() => { setActiveRole(r as any); setIsUserMenuOpen(false); navigate(getDashboardLinkForRole(r)); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-3 transition-all ${activeRole === r ? 'text-emerald-600 bg-emerald-500/10 shadow-sm' : 'text-text-muted opacity-40 hover:bg-bg-dark/5'}`}>
                                <div className={`size-1.5 rounded-full ${activeRole === r ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-border-main'}`} /> {r.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                          <div className="h-[1px] bg-border-main my-2 mx-8" />
                          <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full text-left px-8 py-4 text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-500/10 flex items-center gap-3 transition-all">
                            <LogOut size={14} /> {t('logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 sm:gap-6">
                <Link to={`/aca/${currentLangCode}/login`} className="px-8 py-3.5 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20">
                  Join Ecosystem
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
