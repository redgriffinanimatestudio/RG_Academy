import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Globe, Bell, MessageSquare, User, LayoutDashboard, Shield, LogOut, ChevronDown, ShoppingCart 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

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

  const navClass = isDashboardPage ? 'bg-black/80 border-white/10' : (isStudio ? 'bg-[#030303]/90 border-primary/30' : 'bg-black/80 border-white/10');
  const cardClass = 'bg-white/10 border-white/10 backdrop-blur-3xl';

  return (
    <nav className={`sticky top-0 z-[100] backdrop-blur-3xl border-b transition-colors duration-500 ${navClass}`}>
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          <div className="flex items-center gap-2 sm:gap-6">
            <button onClick={onOpenMobileMenu} className={`lg:hidden p-1.5 sm:p-2 bg-white/5 rounded-lg transition-colors ${modeColor}`}>
              <Menu size={20} />
            </button>
            <Link to={`${modePrefix}/${currentLangCode}`} className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <img src="/logo-web.png" alt="RG" className="h-6 sm:h-8 lg:h-10 w-auto object-contain" />
              <div className="flex flex-col hidden xs:flex lg:hidden xl:flex">
                <span className="text-[10px] sm:text-xs lg:text-base font-black tracking-tighter text-white uppercase leading-none">Red Griffin</span>
                <span className={`text-[5px] sm:text-[6px] lg:text-[8px] font-bold tracking-[0.3em] ${modeColor} uppercase mt-0.5 sm:mt-1`}>{t('creative_ecosystem')}</span> 
              </div>
            </Link>
          </div>

          <div className="hidden md:flex lg:flex items-center gap-4 lg:gap-6 h-full">
            <Link to={`/aca/${currentLangCode}`} className={`text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-colors ${isAcademy ? 'text-primary' : 'text-white/60 hover:text-white'}`}>{t('academy')}</Link>
            <Link to={`/studio/${currentLangCode}`} className={`text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-colors ${isStudio ? 'text-primary-hover' : 'text-white/60 hover:text-white'}`}>{t('studio')}</Link>
            <Link to={`${modePrefix}/${currentLangCode}/community`} className={`text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-colors ${isCommunity ? 'text-primary' : 'text-white/60 hover:text-white'}`}>{t('community')}</Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <div className="relative hidden sm:block">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className={`p-2 transition-colors flex items-center gap-2 font-black text-[9px] sm:text-[10px] uppercase ${modeColor}`}>
                <Globe size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /><span className="hidden md:inline">{currentLang.code}</span>
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`absolute right-0 mt-4 w-44 border rounded-2xl shadow-2xl py-2 z-50 overflow-hidden ${cardClass}`}>
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => changeLanguage(l.code)} className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase flex items-center justify-between transition-all ${currentLang.code === l.code ? 'text-primary bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
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
                  className="p-1.5 sm:p-2 text-white/40 hover:text-primary transition-colors relative group"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 bg-rose-500 rounded-full flex items-center justify-center text-[8px] font-black text-white border-2 border-[#050505] group-hover:scale-110 transition-transform">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button className="p-1.5 sm:p-2 text-white/40 hover:text-primary transition-colors relative">
                  <Bell size={18} />
                  {unreadCount > 0 && <span className={`absolute top-1.5 right-1.5 size-1.5 sm:size-2 rounded-full border-2 ${isStudio ? 'bg-primary-hover border-[#1e1e24]' : 'bg-primary border-[#050505]'}`} />}
                </button>
                
                <div className="relative">
                  <button className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 transition-all group" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <div className="size-7 sm:size-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/40 shrink-0">
                      {profile.photoURL ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-[10px] font-black ${modeBg} text-bg-dark uppercase`}>{profile.displayName?.substring(0, 2) || 'RG'}</div>}
                    </div>
                    <div className="hidden md:flex flex-col items-start text-left">
                      <span className="text-[10px] font-black text-white truncate max-w-[80px] leading-none uppercase">{profile.displayName?.split(' ')[0]}</span>
                      <span className={`text-[7px] font-bold uppercase tracking-widest text-primary leading-none mt-1`}>{activeRole?.replace('_', ' ')}</span>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className={`absolute right-0 mt-4 w-64 border rounded-2xl shadow-2xl py-2 z-50 ${cardClass}`}>
                        <div className="px-6 py-4 border-b border-white/5 text-[9px]">
                          <p className="font-black text-white uppercase">{profile.displayName}</p>
                          <p className="text-white/40 uppercase mt-1">{profile.email}</p>
                        </div>
                        <div className="py-2">
                          {profile?.uid && (
                            <Link to={`/${isStudio ? 'studio' : 'aca'}/${currentLangCode}/profile/${profile.uid}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 flex items-center gap-3"><User size={14} /> {t('my_profile')}</Link>
                          )}
                          <Link to={`${modePrefix}/${currentLangCode}/dashboard`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 flex items-center gap-3"><LayoutDashboard size={14} /> {t('my_dashboard')}</Link>
                          
                          <div className="px-6 py-4 bg-white/[0.03] border-y border-white/5 my-2">
                            <p className="text-[8px] font-black text-white/20 uppercase mb-2">Vault Balance</p>
                            <p className="text-lg font-black text-white">$ {profile.balance || '0.00'}</p>
                          </div>

                          <div className="px-6 py-2">
                            <p className="text-[8px] font-black text-white/20 uppercase mb-2">Switch identity</p>
                            {profile.roles.map(r => (
                              <button key={r} onClick={() => { setActiveRole(r as any); setIsUserMenuOpen(false); navigate(getDashboardLinkForRole(r)); }} className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 ${activeRole === r ? 'text-primary bg-primary/10' : 'text-white/40 hover:bg-white/5'}`}>
                                <div className={`size-1.5 rounded-full ${activeRole === r ? 'bg-primary' : 'bg-white/10'}`} /> {r.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                          <div className="h-[1px] bg-white/5 my-2 mx-6" />
                          <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full text-left px-6 py-4 text-[10px] font-black uppercase text-primary hover:bg-primary/10 flex items-center gap-2">
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
                <Link to={`/aca/${currentLangCode}/login`} className="px-6 py-3 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
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
