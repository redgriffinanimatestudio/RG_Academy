import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, GraduationCap, Box, Users, ChevronDown, ChevronRight, LogIn, LogOut, Settings, Globe, Shield, ShoppingCart 
} from 'lucide-react';
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
  const { profile, activeRole, logout } = useAuth();
  const { data: platformData } = usePlatform();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cartCount = platformData?.cart?.length || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] lg:hidden" />

          <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }} 
            transition={{ type: 'spring', damping: 28, stiffness: 220 }} 
            className={`fixed inset-y-0 left-0 w-full xs:w-[320px] sm:w-[380px] z-[101] flex flex-col bg-[#050505] border-r border-white/5 shadow-[20px_0_80px_rgba(0,0,0,0.8)]`}
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

              <nav className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 px-2 mb-4">Core Ecosystem</p>
                {[
                  { label: t('academy'), path: `/aca/${currentLangCode}`, icon: GraduationCap, color: 'text-primary' },
                  { label: t('studio'), path: `/studio/${currentLangCode}`, icon: Box, color: 'text-primary-hover' },
                  { label: t('community'), path: `${modePrefix}/${currentLangCode}/community`, icon: Users, color: 'text-emerald-500' }
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 active:scale-[0.98] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon size={20} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-white/80">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-white/10 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </nav>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 px-2 mb-4">Explore Modules</p>
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
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2 ml-4 pl-4 border-l border-white/5">
                          {section?.categories?.map((cat: any) => (
                            <div key={cat?.name} className="py-2">
                              <div className="flex items-center gap-2 mb-2 opacity-40"><cat.icon size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{t(cat?.name)}</span></div>
                              <div className="grid grid-cols-1 gap-1">
                                {cat?.subcategories?.map((sub: any) => (
                                  <button key={sub?.name} onClick={() => { handleSetSub(sub, cat); onClose(); }} className={`px-3 py-2 text-[10px] font-bold uppercase text-left rounded-lg transition-colors ${activeSubName === sub?.name ? section.color : 'text-white/30 hover:text-white hover:bg-white/5'}`}>{t(sub?.name)}</button>
                                ))}
                              </div>
                            </div>
                          ))}
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
                    <button onClick={() => { navigate(`/${currentLangCode}/dashboard`); onClose(); }} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"><Shield size={14} /> Dashboard</button>
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
