import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Briefcase, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Users, 
  Bell, 
  Settings, 
  ChevronRight, 
  Globe, 
  ChevronDown, 
  MessageSquare, 
  LogIn,
  LayoutDashboard,
  Shield,
  Filter
} from 'lucide-react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { userService, UserProfile } from '../services/userService';
import { adminService } from '../services/adminService';
import { notificationService, Notification } from '../services/notificationService';
import { useAlert } from './Alert';
import AIAssistant from './AIAssistant';
import ErrorBoundary from './ErrorBoundary';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'eng', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' }
];

const ACADEMY_CATEGORIES = [
  {
    name: 'modeling_3d',
    subcategories: [
      {
        name: 'char_modeling',
        topics: ['Anatomy for Artists', 'Stylized Characters', 'Realistic Humans', 'Creature Sculpting', 'Retopology']
      },
      {
        name: 'env_art',
        topics: ['Modular Environments', 'Foliage & Nature', 'World Building', 'Photogrammetry', 'Interior Design']
      }
    ]
  },
  {
    name: 'animation',
    subcategories: [
      {
        name: 'animation_3d',
        topics: ['Body Mechanics', 'Acting for Animation', 'Creature Animation', 'Facial Animation', 'Lip Sync']
      },
      {
        name: 'animation_2d',
        topics: ['Traditional 2D', 'Toon Boom Harmony', 'Spine 2D', 'Motion Graphics', 'Storyboarding']
      }
    ]
  },
  {
    name: 'vfx_compositing',
    subcategories: [
      {
        name: 'visual_effects',
        topics: ['Houdini Dynamics', 'Niagara VFX', 'Fluid Simulation', 'Destruction FX', 'Particle Systems']
      }
    ]
  }
];

const STUDIO_CATEGORIES = [
  {
    name: 'prod_services',
    subcategories: [
      {
        name: 'anim_prod',
        topics: ['Feature Film Animation', 'Commercial Animation', 'Game Cinematics', 'Motion Capture']
      },
      {
        name: 'vfx_post',
        topics: ['CGI Environments', 'Digital Compositing', 'Color Grading', 'Sound Design']
      }
    ]
  },
  {
    name: 'talent_network',
    subcategories: [
      {
        name: 'creative_talent',
        topics: ['Concept Artists', '3D Generalists', 'Animators', 'VFX Supervisors']
      },
      {
        name: 'technical_talent',
        topics: ['Pipeline Engineers', 'Technical Directors', 'Game Developers', 'Rigger']
      }
    ]
  },
  {
    name: 'studio_solutions',
    subcategories: [
      {
        name: 'infrastructure',
        topics: ['Render Farm Access', 'Pipeline Tools', 'Asset Management', 'Collaboration Hub']
      }
    ]
  }
];

import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, activeRole, setActiveRole } = useAuth();
  const [user] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { showAlert } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'academy' | 'studio' | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [isMobileAcademyOpen, setIsMobileAcademyOpen] = useState(false);
  const [isMobileStudioOpen, setIsMobileStudioOpen] = useState(false);
  
  const [activeAcademyCategory, setActiveAcademyCategory] = useState(ACADEMY_CATEGORIES[0]);
  const [activeAcademySub, setActiveAcademySub] = useState(ACADEMY_CATEGORIES[0].subcategories[0]);
  
  const [activeStudioCategory, setActiveStudioCategory] = useState(STUDIO_CATEGORIES[0]);
  const [activeStudioSub, setActiveStudioSub] = useState(STUDIO_CATEGORIES[0].subcategories[0]);

  const [showBanner, setShowBanner] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      userService.getProfile(user.uid).then(setUserProfile);
      const unsubscribe = notificationService.subscribeToNotifications(user.uid, (newNotifications) => {
        setNotifications(newNotifications);
      });
      return () => unsubscribe();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isAcademy = location.pathname.includes('/aca/');
  const isStudio = location.pathname.includes('/studio/');
  const isCommunity = location.pathname.includes('/community/');
  const currentLang = LANGUAGES.find(l => l.code === (lang || 'eng')) || LANGUAGES[0];
  const modePrefix = isStudio ? '/studio' : '/aca';
  const logoLink = (isAcademy || isStudio) ? `${modePrefix}/${lang || 'eng'}` : `/${lang || 'eng'}`;
  const modeColor = isAcademy || isStudio ? 'text-primary' : 'text-white';
  const modeBg = isAcademy || isStudio ? 'bg-primary' : 'bg-white/10';
  const modeShadow = isAcademy || isStudio ? 'shadow-primary/20' : 'shadow-white/10';

  const changeLanguage = (newLang: string) => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'aca' || pathParts[1] === 'studio' || pathParts[1] === 'community' || pathParts[1] === 'login' || pathParts[1] === 'signup' || pathParts[1] === 'messages' || pathParts[1] === 'contracts' || pathParts[1] === 'dashboard' || pathParts[1] === 'projects') {
      pathParts[2] = newLang;
    } else if (LANGUAGES.some(l => l.code === pathParts[1])) {
      pathParts[1] = newLang;
    } else {
      navigate(`/${newLang}`);
      setIsLangMenuOpen(false);
      return;
    }
    navigate(pathParts.join('/'));
    setIsLangMenuOpen(false);
  };

  const navItems = [
    { icon: GraduationCap, label: t('workshops'), path: `/aca/${lang || 'eng'}` },
    { icon: Briefcase, label: t('studio_collab'), path: `/studio/${lang || 'eng'}` },
    { icon: Users, label: t('community'), path: `${modePrefix}/${lang || 'eng'}/community` },
    { icon: MessageSquare, label: t('messages'), path: `${modePrefix}/${lang || 'eng'}/messages` },
    { icon: Settings, label: t('contracts'), path: `${modePrefix}/${lang || 'eng'}/contracts` },
  ];

  if (userProfile && adminService.isAdmin(userProfile.roles)) {
    navItems.push({ icon: Shield, label: 'Admin Console', path: `/admin/${lang || 'eng'}` });
  }

  return (
    <div className="min-h-screen bg-bg-dark font-sans text-white">
      {/* Top Banner */}
      {showBanner && (
        <div className="bg-primary text-bg-dark py-2 px-4 relative text-center text-[10px] font-black uppercase tracking-widest z-[60]">
          <span>{isStudio ? t('studio_collab') : t('academy_workshops')}: {isStudio ? t('studio_desc') : t('master_cg')}</span>
          <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80"><X size={14} /></button>
        </div>
      )}

      {/* --- DESKTOP TOP NAV --- */}
      <nav className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-white/40 hover:text-primary bg-white/5 rounded-xl transition-colors"
              >
                <Menu size={24} />
              </button>

              <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-4 group">
                <img src="/logo-web.png" alt="Red Griffin Ecosystem" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                <div className="flex flex-col hidden xs:flex">
                  <span className="text-base font-black tracking-tighter text-white leading-none uppercase">Red Griffin</span>
                  <span className={`text-[8px] font-bold tracking-[0.3em] ${modeColor} leading-none mt-1 uppercase`}>{t('creative_ecosystem')}</span>
                </div>
              </Link>

              <div className="hidden sm:flex bg-white/5 rounded-full p-1 border border-white/10 relative min-w-[160px] ml-4">
                <motion.div
                  className="absolute inset-y-1 rounded-full bg-primary"
                  initial={false}
                  animate={{ left: isAcademy ? '4px' : isStudio ? '50%' : '4px', width: (isAcademy || isStudio) ? 'calc(50% - 4px)' : '0%', opacity: (isAcademy || isStudio) ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
                <Link to={`/aca/${lang || 'eng'}`} className={`relative z-10 flex-1 text-center py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${isAcademy ? 'text-bg-dark' : 'text-white/40 hover:text-white'}`}>{t('academy')}</Link>
                <Link to={`/studio/${lang || 'eng'}`} className={`relative z-10 flex-1 text-center py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${isStudio ? 'text-bg-dark' : 'text-white/40 hover:text-white'}`}>{t('studio')}</Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 h-full">
              {/* Academy Mega Menu */}
              <div className="relative h-full flex items-center" onMouseEnter={() => setActiveMegaMenu('academy')} onMouseLeave={() => setActiveMegaMenu(null)}>
                <Link to={`/aca/${lang || 'eng'}`} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${isAcademy ? 'text-primary' : 'text-white/60 hover:text-white'}`}>
                  {t('academy')} <ChevronDown size={12} className={`transition-transform ${activeMegaMenu === 'academy' ? 'rotate-180' : ''}`} />
                </Link>
                <AnimatePresence>
                  {activeMegaMenu === 'academy' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 top-full w-[1100px] bg-bg-card border border-white/5 shadow-2xl flex z-50 min-h-[500px] rounded-b-[40px] overflow-hidden">
                      <div className="w-[220px] border-r border-white/5 py-8 bg-black/40">
                        <div className="px-8 mb-6"><h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{t('categories')}</h3></div>
                        {ACADEMY_CATEGORIES.map((cat) => (
                          <button key={cat.name} onMouseEnter={() => { setActiveAcademyCategory(cat); setActiveAcademySub(cat.subcategories[0]); }} className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${activeAcademyCategory.name === cat.name ? 'bg-primary text-bg-dark' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                            {t(cat.name)} <ChevronRight size={12} className={`transition-transform ${activeAcademyCategory.name === cat.name ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="w-[240px] border-r border-white/5 py-8 bg-white/[0.01]">
                        <div className="px-8 mb-6"><h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{t('specialization')}</h3></div>
                        {activeAcademyCategory.subcategories.map((sub) => (
                          <button key={sub.name} onMouseEnter={() => setActiveAcademySub(sub)} className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${activeAcademySub.name === sub.name ? 'text-primary bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                            {t(sub.name)} <ChevronRight size={12} className={`transition-transform ${activeAcademySub.name === sub.name ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="w-[280px] py-10 px-10 bg-bg-card">
                        <div className="mb-8"><h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-6">{t('learning_paths')}</h3>
                          <div className="grid grid-cols-1 gap-y-3">
                            {activeAcademySub.topics.map((topic) => (
                              <Link key={topic} to={`/aca/${lang || 'eng'}/topic/${topic.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-white/40 hover:text-primary transition-all flex items-center gap-3 group/topic">
                                <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover/topic:opacity-100 transition-all" />{topic}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 bg-black/60 p-8 border-l border-white/5 flex flex-col justify-between">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group/feat">
                          <img src="https://picsum.photos/seed/academy/600/400" alt="" className="w-full h-full object-cover group-hover/feat:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4"><span className="px-2 py-1 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded">FEATURED</span><h4 className="text-sm font-black text-white mt-2 leading-tight">Mastering Unreal Engine 5.4</h4></div>
                        </div>
                        <button className="criativo-btn !w-full !py-3 !text-[9px] uppercase tracking-widest">Explore All Workshops</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Studio Mega Menu */}
              <div className="relative h-full flex items-center" onMouseEnter={() => setActiveMegaMenu('studio')} onMouseLeave={() => setActiveMegaMenu(null)}>
                <Link to={`/studio/${lang || 'eng'}`} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${isStudio ? 'text-primary' : 'text-white/60 hover:text-white'}`}>
                  {t('studio')} <ChevronDown size={12} className={`transition-transform ${activeMegaMenu === 'studio' ? 'rotate-180' : ''}`} />
                </Link>
                <AnimatePresence>
                  {activeMegaMenu === 'studio' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 top-full w-[1100px] bg-bg-card border border-white/5 shadow-2xl flex z-50 min-h-[500px] rounded-b-[40px] overflow-hidden">
                      <div className="w-[220px] border-r border-white/5 py-8 bg-black/40">
                        <div className="px-8 mb-6"><h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{t('services')}</h3></div>
                        {STUDIO_CATEGORIES.map((cat) => (
                          <button key={cat.name} onMouseEnter={() => { setActiveStudioCategory(cat); setActiveStudioSub(cat.subcategories[0]); }} className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${activeStudioCategory.name === cat.name ? 'bg-primary-hover text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                            {t(cat.name)} <ChevronRight size={12} className={`transition-transform ${activeStudioCategory.name === cat.name ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="w-[240px] border-r border-white/5 py-8 bg-white/[0.01]">
                        <div className="px-8 mb-6"><h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{t('solutions')}</h3></div>
                        {activeStudioCategory.subcategories.map((sub) => (
                          <button key={sub.name} onMouseEnter={() => setActiveStudioSub(sub)} className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${activeStudioSub.name === sub.name ? 'text-primary bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                            {t(sub.name)} <ChevronRight size={12} className={`transition-transform ${activeStudioSub.name === sub.name ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="w-[280px] py-10 px-10 bg-bg-card">
                        <div className="mb-8"><h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-6">{t('studio_offerings')}</h3>
                          <div className="grid grid-cols-1 gap-y-3">
                            {activeStudioSub.topics.map((topic) => (
                              <Link key={topic} to={`/studio/${lang || 'eng'}/service/${topic.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-white/40 hover:text-primary transition-all flex items-center gap-3 group/topic">
                                <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover/topic:opacity-100 transition-all" />{topic}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 bg-black/60 p-8 border-l border-white/5 flex flex-col justify-between">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group/feat">
                          <img src="https://picsum.photos/seed/studio/600/400" alt="" className="w-full h-full object-cover group-hover/feat:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4"><span className="px-2 py-1 bg-primary-hover text-white text-[8px] font-black uppercase tracking-widest rounded mb-2">FEATURED PROJECT</span><h4 className="text-sm font-black text-white leading-tight">Cyberpunk 2077: Cinematic Expansion</h4></div>
                        </div>
                        <button className="w-full py-3 bg-primary-hover text-white font-black uppercase tracking-widest text-[9px] rounded-lg transition-all hover:bg-primary hover:text-bg-dark">View Case Study</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to={`${modePrefix}/${lang || 'eng'}/community`} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${isCommunity ? modeColor : 'text-white/60 hover:text-white'}`}>{t('community')}</Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="p-2 text-white/40 hover:text-primary transition-colors flex items-center gap-2 font-black text-[10px] uppercase"
                >
                  <Globe size={18} />
                  <span>{currentLang.code}</span>
                </button>
                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 mt-4 w-40 bg-bg-card border border-white/5 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => changeLanguage(l.code)} className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase flex items-center justify-between transition-all ${currentLang.code === l.code ? 'text-primary bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                          {l.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="p-2 text-white/40 hover:text-primary transition-colors relative">
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-bg-dark" />}
              </button>
              <Link to={`${modePrefix}/${lang || 'eng'}/messages`} className="p-2 text-white/40 hover:text-primary transition-colors"><MessageSquare size={18} /></Link>
              
              <div className="h-6 w-[1px] bg-white/5 mx-2 hidden md:block" />

              {user ? (
                <div className="relative hidden md:block">
                  <div 
                    className="size-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-primary/40 transition-all"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User size={18} className="text-white/60" />
                  </div>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="absolute right-0 mt-4 w-64 bg-bg-card border border-white/5 rounded-2xl shadow-2xl py-2 z-50">
                        <div className="px-6 py-4 border-b border-white/5">
                          <p className="text-xs font-black text-white truncate">{user.displayName}</p>
                          <p className="text-[9px] text-white/40 truncate font-bold uppercase mt-1">{user.email}</p>
                        </div>
                        {profile && profile.roles.length > 1 && (
                          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Switch Role</p>
                            <div className="space-y-2">
                              {profile.roles.map(role => (
                                <button 
                                  key={role}
                                  onClick={() => setActiveRole(role)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === role ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                  {role.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="py-2">
                          <Link to={`/aca/${lang || 'eng'}/dashboard`} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all">{t('my_learning')}</Link>
                          <button onClick={() => auth.signOut()} className="w-full text-left px-6 py-4 text-[10px] font-black uppercase text-primary hover:bg-primary/10 transition-all flex items-center gap-2"><LogOut size={14} /> {t('logout')}</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to={`${modePrefix}/${lang || 'eng'}/login`} className="criativo-btn !px-6 !py-2.5 !text-[10px] hidden md:flex">{t('join_ecosystem')}</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR (Drawer) --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[100] bg-bg-card border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col w-72 lg:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-24 flex items-center justify-between px-6 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`size-10 ${modeBg} rounded-xl flex items-center justify-center text-bg-dark shadow-lg`}><span className="text-xl font-black italic">RG</span></div>
            <div className="flex flex-col"><span className="text-base font-black tracking-tighter uppercase">Red Griffin</span><span className="text-[8px] font-bold text-primary uppercase">Ecosystem</span></div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/20 hover:text-white bg-white/5 rounded-xl"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-10 no-scrollbar">
          {/* Mobile Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
            <Link to={`/aca/${lang || 'eng'}`} onClick={() => setIsMobileMenuOpen(false)} className={`text-center py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${isAcademy ? 'bg-primary text-bg-dark' : 'text-white/40'}`}>{t('academy')}</Link>
            <Link to={`/studio/${lang || 'eng'}`} onClick={() => setIsMobileMenuOpen(false)} className={`text-center py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${isStudio ? 'bg-primary text-bg-dark' : 'text-white/40'}`}>{t('studio')}</Link>
          </div>

          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em] px-2">Ecosystem</h3>
            <div className="space-y-2">
              {/* Mobile Academy Menu */}
              <div className="space-y-1">
                <button 
                  onClick={() => setIsMobileAcademyOpen(!isMobileAcademyOpen)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${isMobileAcademyOpen ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/60 hover:text-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <GraduationCap size={18} className={isMobileAcademyOpen ? 'text-bg-dark' : 'text-white/40 group-hover:text-primary'} />
                    <span className="text-xs font-bold uppercase tracking-widest">{t('academy')}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isMobileAcademyOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMobileAcademyOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white/[0.02] rounded-2xl border border-white/5 ml-2"
                    >
                      {ACADEMY_CATEGORIES.map((cat) => (
                        <div key={cat.name} className="p-4 space-y-4 border-b border-white/5 last:border-0">
                          <h4 className="text-[9px] font-black text-primary uppercase tracking-widest">{t(cat.name)}</h4>
                          <div className="space-y-4 pl-2">
                            {cat.subcategories.map((sub) => (
                              <div key={sub.name} className="space-y-2">
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{t(sub.name)}</p>
                                <div className="grid grid-cols-1 gap-1">
                                  {sub.topics.map((topic) => (
                                    <Link 
                                      key={topic} 
                                      to={`/aca/${lang || 'eng'}/topic/${topic.toLowerCase().replace(/ /g, '-')}`}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="text-[10px] font-bold text-white/60 hover:text-primary py-1 transition-colors"
                                    >
                                      • {topic}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Link to={`/aca/${lang || 'eng'}`} onClick={() => setIsMobileMenuOpen(false)} className="block p-4 text-center text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-bg-dark transition-all">
                        {t('view_all_academy')}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Studio Menu */}
              <div className="space-y-1">
                <button 
                  onClick={() => setIsMobileStudioOpen(!isMobileStudioOpen)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${isMobileStudioOpen ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/60 hover:text-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <Briefcase size={18} className={isMobileStudioOpen ? 'text-bg-dark' : 'text-white/40 group-hover:text-primary'} />
                    <span className="text-xs font-bold uppercase tracking-widest">{t('studio')}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isMobileStudioOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMobileStudioOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white/[0.02] rounded-2xl border border-white/5 ml-2"
                    >
                      {STUDIO_CATEGORIES.map((cat) => (
                        <div key={cat.name} className="p-4 space-y-4 border-b border-white/5 last:border-0">
                          <h4 className="text-[9px] font-black text-primary-hover uppercase tracking-widest">{t(cat.name)}</h4>
                          <div className="space-y-4 pl-2">
                            {cat.subcategories.map((sub) => (
                              <div key={sub.name} className="space-y-2">
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{t(sub.name)}</p>
                                <div className="grid grid-cols-1 gap-1">
                                  {sub.topics.map((topic) => (
                                    <Link 
                                      key={topic} 
                                      to={`/studio/${lang || 'eng'}/service/${topic.toLowerCase().replace(/ /g, '-')}`}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="text-[10px] font-bold text-white/60 hover:text-primary-hover py-1 transition-colors"
                                    >
                                      • {topic}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Link to={`/studio/${lang || 'eng'}`} onClick={() => setIsMobileMenuOpen(false)} className="block p-4 text-center text-[9px] font-black uppercase tracking-widest bg-primary-hover/10 text-primary-hover hover:bg-primary-hover hover:text-white transition-all">
                        {t('view_all_studio')}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Navigation Items */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                {[
                  { icon: Users, label: t('community'), path: `${modePrefix}/${lang || 'eng'}/community` },
                  { icon: MessageSquare, label: t('messages'), path: `${modePrefix}/${lang || 'eng'}/messages` },
                  { icon: Settings, label: t('contracts'), path: `${modePrefix}/${lang || 'eng'}/contracts` },
                ].map((item, idx) => (
                  <Link key={idx} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group">
                    <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors"><item.icon size={18} /></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Language Section */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em] px-2">Language</h3>
            <div className="relative">
              <button 
                onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-white/40 group-hover:text-primary transition-colors" />
                  <span>{currentLang.name}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isMobileLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isMobileLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-white/5 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    {LANGUAGES.map((l) => (
                      <button 
                        key={l.code} 
                        onClick={() => { changeLanguage(l.code); setIsMobileLangOpen(false); }} 
                        className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase flex items-center justify-between transition-all ${currentLang.code === l.code ? 'text-primary bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{l.flag}</span>
                          {l.name}
                        </div>
                        {currentLang.code === l.code && <div className="size-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--color-primary),0.6)]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            {user ? (
              <div className="space-y-3">
                <Link to={`/aca/${lang || 'eng'}/dashboard`} onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-white/5 rounded-3xl flex items-center gap-4 border border-white/5 relative overflow-hidden group">
                  <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-bg-dark shadow-lg shrink-0"><User size={24} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate uppercase">{user.displayName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded">Active: {activeRole?.replace('_', ' ')}</span>
                    </div>
                  </div>
                </Link>

                {profile && profile.roles.length > 1 && (
                  <div className="p-4 bg-white/[0.02] rounded-3xl border border-white/5 space-y-3">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Switch Account Role</p>
                    <div className="grid grid-cols-1 gap-2">
                      {profile.roles.map(role => (
                        <button 
                          key={role}
                          onClick={() => { setActiveRole(role); setIsMobileMenuOpen(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === role ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/40'}`}
                        >
                          {role.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => { auth.signOut(); setIsMobileMenuOpen(false); }} className="w-full p-4 text-primary font-black uppercase text-[10px] bg-primary/5 rounded-2xl hover:bg-primary/10 flex items-center justify-center gap-3 border border-primary/10 transition-all"><LogOut size={16} />{t('logout')}</button>
              </div>
            ) : (
              <Link to={`${modePrefix}/${lang || 'eng'}/login`} onClick={() => setIsMobileMenuOpen(false)} className="criativo-btn !w-full !py-4 !flex !items-center !justify-center !rounded-2xl !text-[10px] uppercase font-black"><LogIn size={16} className="mr-2" />{t('login')}</Link>
            )}
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" />
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Left Sidebar */}
          {(isAcademy || isStudio) && (
            <aside className="hidden lg:block w-64 shrink-0 space-y-10 sticky top-32 h-fit">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="size-8 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Filter size={16} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">{t('categories')}</h3>
                </div>
                
                <div className="space-y-2">
                  {(isAcademy ? ACADEMY_CATEGORIES : STUDIO_CATEGORIES).map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <button 
                        className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-between group"
                      >
                        {t(cat.name)}
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                      <div className="pl-4 py-2 space-y-2">
                        {cat.subcategories.map(sub => (
                          <Link 
                            key={sub.name}
                            to={`${modePrefix}/${lang || 'eng'}/${isAcademy ? 'topic' : 'service'}/${sub.topics[0].toLowerCase().replace(/ /g, '-')}`}
                            className="block text-[10px] font-bold text-white/20 hover:text-primary transition-colors uppercase tracking-widest"
                          >
                            • {t(sub.name)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/10 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">{t('newsletter')}</h4>
                <p className="text-[10px] text-white/40 font-medium leading-relaxed">Get the latest CG trends and workshop updates.</p>
                <input type="email" placeholder="Email" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-[10px] text-white focus:border-primary outline-none" />
                <button className="w-full py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Join</button>
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0">
            <ErrorBoundary>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {children}
              </motion.div>
            </ErrorBoundary>
          </div>
        </div>
      </main>

      <footer className="bg-black border-t border-white/5 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-3">
                <div className={`w-10 h-10 ${modeBg} rounded-lg flex items-center justify-center text-bg-dark`}>
                  <span className="text-lg font-black italic">RG</span>
                </div>
                <span className="text-xl font-black tracking-tighter text-white uppercase">Red Griffin</span>
              </Link>
              <p className="text-sm text-white/40 font-medium leading-relaxed">{t('ecosystem_desc')}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">{t('academy')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to={`/aca/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('workshops')}</Link></li>
                <li><Link to={`/aca/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('mentorship')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">{t('studio')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to={`/studio/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('hire_talent')}</Link></li>
                <li><Link to={`/studio/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('post_project')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8">{t('connect')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to={`${modePrefix}/${lang || 'eng'}/community`} className="hover:text-white transition-colors">{t('community')}</Link></li>
                <li><Link to={`${modePrefix}/${lang || 'eng'}/about`} className="hover:text-white transition-colors">{t('about_us')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} RED GRIFFIN ECOSYSTEM.</p>
            <div className="flex items-center gap-8">
              <Link to="/privacy" className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white">PRIVACY</Link>
              <Link to="/terms" className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white">TERMS</Link>
            </div>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}
