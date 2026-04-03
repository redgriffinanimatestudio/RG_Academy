import React from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, GraduationCap, Box, Users, ChevronDown, ChevronRight, LogIn, LogOut, Settings, Globe, Shield, ShoppingCart, Target, Cpu 
} from 'lucide-react';
import { PERSPECTIVES } from './Layout.constants';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mobileSections: any[];
  expandedSections: Record<string, boolean>;
  toggleSection: (id: string) => void;
  handleSetSub: (sub: any, cat: any) => void;
  activeSubName: string;
  modeColor: string;
  modeBg: string;
  modePrefix: string;
  cardClass: string;
  changeLanguage: (lang: string) => void;
  currentLangCode: string;
  LANGUAGES: any[];
}

export default function MobileMenu({
  isOpen, onClose, mobileSections, expandedSections, toggleSection,
  handleSetSub, activeSubName, modeColor, modeBg, modePrefix, cardClass,
  changeLanguage, currentLangCode, LANGUAGES
}: MobileMenuProps) {
  const { profile, activeRole, setActiveRole, logout } = useAuth();
  const { data: platformData } = usePlatform();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isDashboard = location.pathname.includes('/dashboard');

  const getPerspectiveUrl = (id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id === 'admin') {
      params.delete('perspective');
    } else {
      params.set('perspective', id);
    }
    return `${location.pathname}?${params.toString()}`;
  };

  const cartCount = platformData?.cart?.length || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] lg:hidden"
          />

          {/* Mobile Menu Content: High-Density Industrial Hub */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-[85%] max-w-[400px] h-dvh bg-zinc-950 border-r border-white/5 z-[100] lg:hidden flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <Link to="/" onClick={onClose} className="flex items-center gap-3">
                <div className={`size-10 ${modeBg} rounded-xl flex items-center justify-center text-bg-dark shadow-lg shadow-primary/20 transition-transform active:scale-90`}>
                  <span className="text-xl font-black italic">RG</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-tighter text-white leading-none">Red Griffin</span>
                  <span className={`text-[7px] font-bold tracking-[0.3em] ${modeColor} uppercase leading-none mt-1`}>{t('creative_ecosystem')}</span>
                </div>
              </Link>
              <button onClick={onClose} className="size-10 flex items-center justify-center bg-white/5 rounded-xl text-white/40 active:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
              <div className="relative group" onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }));
                onClose();
              }}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest text-white/40 cursor-pointer">
                  {t('search')}... (CMD+K)
                </div>
              </div>

              {/* ⚡ Tier 1: Layer Switcher (Academy / Studio / Community) */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'academy', label: t('nav_academy'), path: `/aca/${currentLangCode}`, icon: GraduationCap, active: location.pathname.includes('/aca'), color: 'text-primary', glow: 'shadow-red-500/10' },
                  { id: 'studio', label: t('nav_studio'), path: `/studio/${currentLangCode}`, icon: Box, active: location.pathname.includes('/studio'), color: 'text-primary-hover', glow: 'shadow-cyan-400/10' },
                  { id: 'community', label: t('nav_community'), path: `${modePrefix}/${currentLangCode}/community`, icon: Users, active: location.pathname.includes('/community'), color: 'text-emerald-500', glow: 'shadow-emerald-500/10' }
                ].map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={`flex flex-col items-center justify-center p-4 rounded-3xl border transition-all relative overflow-hidden group ${
                      item.active 
                        ? `bg-white/[0.05] border-white/20 ${item.glow} shadow-xl` 
                        : 'bg-white/[0.02] border-white/5 text-white/20 hover:bg-white/5 hover:text-white/40'
                    }`}
                  >
                    <div className={`mb-1 transition-transform group-hover:scale-110 ${item.active ? item.color : 'opacity-40'}`}>
                      <item.icon size={20} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${item.active ? 'text-white' : 'text-white/20'}`}>
                      {item.label}
                    </span>
                    {item.active && (
                      <motion.div layoutId="active-layer" className="absolute bottom-0 inset-x-4 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: item.color.includes('primary') ? (item.id === 'academy' ? '#ff3b30' : '#00ffd1') : '#10b981' }} />
                    )}
                  </Link>
                ))}
              </div>


              {profile && (
                <div className="space-y-6 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between px-2 mb-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{t('evolution_matrix')}</p>
                    <div className="flex items-center gap-2">
                        <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[7px] font-bold text-emerald-500/60 uppercase tracking-widest">{t('neural_sync_active')}</span>
                    </div>
                  </div>

                  {/* 🧬 Identity Evolution Card */}
                  <div className="relative group/evolution p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 overflow-hidden transition-all hover:bg-white/[0.05] hover:border-white/10">
                    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover/evolution:opacity-10 transition-opacity`}>
                        <Target size={40} className={modeColor} />
                    </div>
                    
                    <div className="flex flex-col gap-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${modeColor}`}>
                          {activeRole === 'admin' ? <Shield size={22} /> : activeRole === 'lecturer' ? <GraduationCap size={22} /> : activeRole === 'student' ? <Cpu size={22} /> : <Users size={22} />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">{t('current_role')}</span>
                          <span className="text-sm font-black uppercase text-white truncate">{activeRole || 'Genesis'}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                          <span className="text-white/20">{t('experience_level')}</span>
                          <span className={modeColor}>{t('level_01_matrix')}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: profile.balance > 0 ? '60%' : '20%' }} 
                            className={`h-full ${modeBg.replace('bg-', 'bg-')} shadow-[0_0_10px_rgba(0,245,212,0.3)]`} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ⚡ Identity Switcher (Quick Access) */}
                  {profile.roles && profile.roles.length > 1 && (
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/20 px-2">{t('switch_identity_path')}</p>
                      <div className="flex flex-wrap gap-2 px-2">
                        {profile.roles.filter((r: string) => r !== activeRole).map((r: string) => (
                           <button 
                             key={r}
                             onClick={() => setActiveRole(r as any)}
                             className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                           >
                             <div className="size-1 rounded-full bg-white/20" />
                             {r}
                           </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 px-2 mb-4">{t('explore_modules')}</p>
                {mobileSections.map(section => (
                  <div key={section.id} className="space-y-2">
                    <button onClick={() => toggleSection(section.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${expandedSections[section.id] ? 'bg-white/5 border-white/10' : 'hover:bg-white/[0.02]'}`}>
                      <div className="flex items-center gap-4">
                        {section.icon && <section.icon size={18} className={expandedSections[section.id] ? section.color : 'text-white/40'} />}
                        <span className="text-[11px] font-black uppercase tracking-widest text-white/60">{section.label}</span>
                      </div>
                      <ChevronDown size={16} className={`transition-transform duration-300 text-white/20 ${expandedSections[section.id] ? 'rotate-180 text-white' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSections[section.id] && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }} 
                          className="overflow-hidden space-y-2 ml-4 pl-4 border-l border-white/5"
                        >
                          {section?.categories?.map((cat: any) => {
                            // Phase 25: Dashboard Flattening (Direct Tool Access)
                            const isDashboardSection = section.id === 'dashboards';
                            const subItems = cat.subcategories || [];
                            
                            // If it's a dashboard, we don't want the Hub header (avoids the 'dot' artifact)
                            if (isDashboardSection) {
                              return (
                                <div key={cat.name} className="grid grid-cols-1 gap-1">
                                  {subItems.map((sub: any) => {
                                    const isSubActive = activeSubName === sub.name;
                                    const hasDeepNested = sub.subcategories && sub.subcategories.length > 0;
                                    
                                    return (
                                      <div key={sub.name} className="space-y-1">
                                        <button
                                          onClick={() => { handleSetSub(sub, cat); if (!hasDeepNested) onClose(); }}
                                          className={`w-full text-left px-4 py-3.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-between transition-all ${isSubActive ? (`${modeColor} bg-white/5`) : 'text-white/30 hover:text-white/60'}`}
                                        >
                                          <div className="flex items-center gap-3">
                                            {sub.icon && <sub.icon size={14} className={isSubActive ? modeColor : 'opacity-20'} />}
                                            {t(sub.name)}
                                          </div>
                                          {hasDeepNested ? (
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${isSubActive ? 'rotate-180 opacity-100' : 'opacity-20'}`} />
                                          ) : (
                                            <div className={`size-1 rounded-full ${isSubActive ? (modeColor.replace('text-', 'bg-')) : 'bg-white/10'}`} />
                                          )}
                                        </button>
                                        
                                        {hasDeepNested && isSubActive && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="ml-6 pl-4 border-l border-white/10 space-y-2 py-2"
                                          >
                                            {sub.subcategories.map((deep: any) => (
                                              <button
                                                key={deep.name}
                                                onClick={() => { 
                                                  const params = new URLSearchParams(location.search);
                                                  params.set('view', deep.name.toLowerCase());
                                                  navigate(`${location.pathname}?${params.toString()}`);
                                                  onClose(); 
                                                }}
                                                className="w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] text-white/20 hover:text-primary transition-colors flex items-center gap-3 group"
                                              >
                                                <div className="size-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-colors shadow-sm" />
                                                {t(deep.name)}
                                              </button>
                                            ))}
                                          </motion.div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            }

                            // Standard Academy/Studio Rendering with Headers
                            return (
                              <div key={cat.name} className="py-2">
                                <div className="flex items-center gap-3 mb-3 px-2">
                                  <div className="size-6 rounded-lg bg-white/5 flex items-center justify-center">
                                    {cat.icon ? <cat.icon size={12} className="text-primary" /> : <div className="size-1 rounded-full bg-primary" />}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{t(cat.name)}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                  {subItems.map((sub: any) => {
                                    const isSubActive = activeSubName === sub.name;
                                    const hasDeepNested = sub.subcategories && sub.subcategories.length > 0;
                                    
                                    return (
                                      <div key={sub.name} className="space-y-1">
                                        <button
                                          onClick={() => { handleSetSub(sub, cat); if (!hasDeepNested) onClose(); }}
                                          className={`w-full text-left px-4 py-3.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-between transition-all ${isSubActive ? (`${modeColor} bg-white/5`) : 'text-white/30 hover:text-white/60'}`}
                                        >
                                          <div className="flex items-center gap-3">
                                            {sub.icon && <sub.icon size={14} className={isSubActive ? modeColor : 'opacity-20'} />}
                                            {t(sub.name)}
                                          </div>
                                          {hasDeepNested ? (
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${isSubActive ? 'rotate-180 opacity-100' : 'opacity-20'}`} />
                                          ) : (
                                            <div className={`size-1 rounded-full ${isSubActive ? (modeColor.replace('text-', 'bg-')) : 'bg-white/10'}`} />
                                          )}
                                        </button>
                                        
                                        {hasDeepNested && isSubActive && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="ml-6 pl-4 border-l border-white/10 space-y-2 py-2"
                                          >
                                            {sub.subcategories.map((deep: any) => (
                                              <button
                                                key={deep.name}
                                                onClick={() => { 
                                                  const params = new URLSearchParams(location.search);
                                                  params.set('view', deep.name.toLowerCase());
                                                  navigate(`${location.pathname}?${params.toString()}`);
                                                  onClose(); 
                                                }}
                                                className="w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] text-white/20 hover:text-primary transition-colors flex items-center gap-3 group"
                                              >
                                                <div className="size-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-colors" />
                                                {t(deep.name)}
                                              </button>
                                            ))}
                                          </motion.div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 space-y-6">
              <div className="flex flex-wrap gap-1 p-1 bg-black/40 rounded-2xl border border-white/5">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => changeLanguage(l.code)} className={`px-3 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${currentLangCode === l.code ? `${modeBg} text-bg-dark shadow-lg` : 'text-white/20 hover:text-white/40'}`}>{l.code}</button>
                ))}
              </div>

              {profile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className={`size-12 rounded-xl overflow-hidden border border-white/10 shrink-0`}>
                      {profile.photoURL ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-lg font-black italic ${modeBg} text-bg-dark uppercase`}>{profile.displayName?.substring(0, 2)}</div>}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-black text-white uppercase truncate">{profile.displayName}</span>
                      <span className="text-[10px] font-black text-primary/80 tracking-widest mt-0.5">$ {profile.balance || '0.00'}</span>
                    </div>
                    <button onClick={() => { logout(); onClose(); }} className="size-10 flex items-center justify-center text-rose-500 bg-rose-500/10 rounded-xl active:scale-90 transition-transform"><LogOut size={18} /></button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { navigate(`${modePrefix}/${currentLangCode}/dashboard`); onClose(); }} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"><Shield size={14} /> Dashboard</button>
                    <button onClick={() => { navigate(`/${currentLangCode}/cart`); onClose(); }} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors relative">
                      <ShoppingCart size={14} /> {t('price')} {cartCount > 0 && <span className="absolute top-1 right-2 size-1.5 bg-rose-500 rounded-full" />}
                    </button>
                  </div>
                </div>
              ) : (
                <Link to={`/aca/${currentLangCode}/login`} onClick={onClose} className={`flex items-center justify-center gap-3 w-full py-5 ${modeBg} text-bg-dark text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all`}><LogIn size={18} /> {t('join_ecosystem')}</Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
