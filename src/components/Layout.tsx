import React from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, User, LogOut, Menu, X, Search, ShoppingBag, Users, Bell, Settings, Heart, ShoppingCart, ChevronRight, Globe, ChevronDown, MessageSquare } from 'lucide-react';
import { auth, logout } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { userService, UserProfile } from '../services/userService';
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

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'USD' },
  { code: 'EUR', symbol: '€', name: 'EUR' },
  { code: 'TRY', symbol: '₺', name: 'TRY' },
  { code: 'RUB', symbol: '₽', name: 'RUB' },
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);
  const { showAlert } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = React.useState<'academy' | 'studio' | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);
  
  const [activeAcademyCategory, setActiveAcademyCategory] = React.useState(ACADEMY_CATEGORIES[0]);
  const [activeAcademySub, setActiveAcademySub] = React.useState(ACADEMY_CATEGORIES[0].subcategories[0]);
  
  const [activeStudioCategory, setActiveStudioCategory] = React.useState(STUDIO_CATEGORIES[0]);
  const [activeStudioSub, setActiveStudioSub] = React.useState(STUDIO_CATEGORIES[0].subcategories[0]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [showBanner, setShowBanner] = React.useState(true);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  React.useEffect(() => {
    const syncProfile = async () => {
      if (user) {
        let profile = await userService.getProfile(user.uid);
        if (!profile) {
          await userService.createProfile(user.uid, user.email || '', user.displayName, user.photoURL);
          profile = await userService.getProfile(user.uid);
        }
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    };
    syncProfile();
  }, [user]);

  React.useEffect(() => {
    if (user) {
      const unsubscribe = notificationService.subscribeToNotifications(user.uid, (newNotifications) => {
        setNotifications(newNotifications);
      });
      return () => unsubscribe();
    } else {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const isAcademy = location.pathname.includes('/aca/');
  const isStudio = location.pathname.includes('/studio/');
  const isCommunity = location.pathname.includes('/community/');

  const currentLang = LANGUAGES.find(l => l.code === (lang || 'eng')) || LANGUAGES[0];

  const changeLanguage = (newLang: string) => {
    const pathParts = location.pathname.split('/');
    // Handle paths like /aca/eng/community or /eng
    if (pathParts[1] === 'aca' || pathParts[1] === 'studio' || pathParts[1] === 'community' || pathParts[1] === 'login' || pathParts[1] === 'signup' || pathParts[1] === 'messages' || pathParts[1] === 'contracts' || pathParts[1] === 'dashboard' || pathParts[1] === 'projects') {
      pathParts[2] = newLang;
    } else if (LANGUAGES.some(l => l.code === pathParts[1])) {
      pathParts[1] = newLang;
    } else {
      // Fallback if path structure is unexpected
      navigate(`/${newLang}`);
      setIsLangMenuOpen(false);
      return;
    }
    navigate(pathParts.join('/'));
    setIsLangMenuOpen(false);
  };

  const modeColor = isAcademy || isStudio ? 'text-primary' : 'text-white';
  const modeBg = isAcademy || isStudio ? 'bg-primary' : 'bg-white/10';
  const modeShadow = isAcademy || isStudio ? 'shadow-primary/20' : 'shadow-white/10';
  const modeBorder = isAcademy || isStudio ? 'border-primary/20' : 'border-white/10';
  const modeAccent = isAcademy || isStudio ? 'primary' : 'white';
  const modePrefix = isStudio ? '/studio' : '/aca';

  const triggerTestAlert = () => {
    showAlert({
      type: 'info',
      isSoft: true,
      title: 'New Workshop Alert',
      message: 'Mastering Unreal Engine 5.4 for Film is now available in the Academy!',
      duration: 6000
    });
  };

  return (
    <div className="min-h-screen bg-bg-dark font-sans text-white">
      {showBanner && (
        <div className="bg-primary text-bg-dark py-2 px-4 relative text-center text-[10px] font-black uppercase tracking-widest z-[60]">
          <span>{isStudio ? t('studio_collab') : t('academy_workshops')}: {isStudio ? t('studio_desc') : t('master_cg')}</span>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <nav className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-3 group">
                <div className={`w-10 h-10 ${modeBg} rounded-lg flex items-center justify-center text-bg-dark shadow-lg ${modeShadow} group-hover:scale-105 transition-transform`}>
                  <span className="text-lg font-black italic">RG</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tighter text-white leading-none">RED GRIFFIN</span>
                  <span className={`text-[8px] font-bold tracking-[0.3em] ${modeColor} leading-none mt-1 uppercase`}>{t('creative_ecosystem')}</span>
                </div>
              </Link>

              {/* Mode Switcher */}
              <div className="hidden sm:flex bg-white/5 rounded-full p-1 border border-white/10 relative min-w-[160px]">
                <motion.div
                  className={`absolute inset-y-1 rounded-full bg-primary`}
                  initial={false}
                  animate={{
                    left: isAcademy ? '4px' : isStudio ? '50%' : '4px',
                    width: (isAcademy || isStudio) ? 'calc(50% - 4px)' : '0%',
                    opacity: (isAcademy || isStudio) ? 1 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
                <Link 
                  to={`/aca/${lang || 'eng'}`}
                  className={`relative z-10 flex-1 text-center py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${isAcademy ? 'text-bg-dark' : 'text-white/40 hover:text-white'}`}
                >
                  {t('academy')}
                </Link>
                <Link 
                  to={`/studio/${lang || 'eng'}`}
                  className={`relative z-10 flex-1 text-center py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${isStudio ? 'text-bg-dark' : 'text-white/40 hover:text-white'}`}
                >
                  {t('studio')}
                </Link>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="hidden lg:flex items-center gap-2 h-full">
              {/* Academy Link + Mega Menu */}
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveMegaMenu('academy')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link 
                  to={`/aca/${lang || 'eng'}`} 
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${isAcademy ? 'text-primary' : 'text-white/60 hover:text-white'}`}
                >
                  {t('academy')}
                  <ChevronDown size={12} className={`transition-transform ${activeMegaMenu === 'academy' ? 'rotate-180' : ''}`} />
                </Link>
                
                <AnimatePresence>
                  {activeMegaMenu === 'academy' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 top-full w-[1100px] bg-bg-card border border-white/5 shadow-2xl flex z-50 min-h-[500px] rounded-b-[40px] overflow-hidden"
                    >
                      {/* Column 1: Categories */}
                      <div className="w-[220px] border-r border-white/5 py-8 bg-black/40">
                        <div className="px-8 mb-6">
                          <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{t('categories')}</h3>
                        </div>
                        {ACADEMY_CATEGORIES.map((cat) => (
                          <button
                            key={cat.name}
                            onMouseEnter={() => {
                              setActiveAcademyCategory(cat);
                              setActiveAcademySub(cat.subcategories[0]);
                            }}
                            className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${
                              activeAcademyCategory.name === cat.name ? 'bg-primary text-bg-dark' : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {t(cat.name)}
                            <ChevronRight size={12} className={`transition-transform ${activeAcademyCategory.name === cat.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-20 group-hover:translate-x-0'}`} />
                          </button>
                        ))}
                      </div>

                      {/* Column 2: Subcategories */}
                      <div className="w-[240px] border-r border-white/5 py-8 bg-white/[0.01]">
                        <div className="px-8 mb-6">
                          <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{t('specialization')}</h3>
                        </div>
                        {activeAcademyCategory.subcategories.map((sub) => (
                          <button
                            key={sub.name}
                            onMouseEnter={() => setActiveAcademySub(sub)}
                            className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${
                              activeAcademySub.name === sub.name ? 'text-primary bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {t(sub.name)}
                            <ChevronRight size={12} className={`transition-transform ${activeAcademySub.name === sub.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-20 group-hover:translate-x-0'}`} />
                          </button>
                        ))}
                      </div>

                      {/* Column 3: Topics */}
                      <div className="w-[280px] py-10 px-10 bg-bg-card">
                        <div className="mb-8">
                          <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-6">{t('learning_paths')}</h3>
                          <div className="grid grid-cols-1 gap-y-3">
                            {activeAcademySub.topics.map((topic) => (
                              <Link
                                key={topic}
                                to={`/aca/${lang}/topic/${topic.toLowerCase().replace(/ /g, '-')}`}
                                className="text-xs font-bold text-white/40 hover:text-primary transition-all flex items-center gap-3 group/topic"
                              >
                                <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover/topic:opacity-100 transition-all" />
                                {topic}
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-8 border-t border-white/5">
                          <Link to={`/aca/${lang}/all`} className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors flex items-center gap-2">
                            {t('view_all_academy')} <ChevronRight size={10} />
                          </Link>
                        </div>
                      </div>

                      {/* Column 4: Featured */}
                      <div className="flex-1 bg-black/60 p-8 flex flex-col justify-between border-l border-white/5">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group/feat">
                          <img 
                            src="https://picsum.photos/seed/academy/600/400" 
                            alt="Featured Course" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/feat:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="inline-block px-2 py-1 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded mb-2">{t('featured_workshop')}</span>
                            <h4 className="text-sm font-black text-white leading-tight">Mastering Unreal Engine 5.4 for Cinematic Production</h4>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-[10px] text-white/40 font-medium leading-relaxed">
                            Join our intensive 12-week program and learn from industry veterans who worked on major AAA titles.
                          </p>
                          <Link to={`/aca/${lang}/featured`} className="criativo-btn !w-full !py-3 !text-[9px] flex items-center justify-center gap-2">
                            {t('explore_workshop')} <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Studio Link + Mega Menu */}
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveMegaMenu('studio')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link 
                  to={`/studio/${lang || 'eng'}`} 
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${isStudio ? 'text-primary' : 'text-white/60 hover:text-white'}`}
                >
                  {t('studio')}
                  <ChevronDown size={12} className={`transition-transform ${activeMegaMenu === 'studio' ? 'rotate-180' : ''}`} />
                </Link>
                
                <AnimatePresence>
                  {activeMegaMenu === 'studio' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 top-full w-[1100px] bg-bg-card border border-white/5 shadow-2xl flex z-50 min-h-[500px] rounded-b-[40px] overflow-hidden"
                    >
                      {/* Column 1: Categories */}
                      <div className="w-[220px] border-r border-white/5 py-8 bg-black/40">
                        <div className="px-8 mb-6">
                          <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{t('services')}</h3>
                        </div>
                        {STUDIO_CATEGORIES.map((cat) => (
                          <button
                            key={cat.name}
                            onMouseEnter={() => {
                              setActiveStudioCategory(cat);
                              setActiveStudioSub(cat.subcategories[0]);
                            }}
                            className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${
                              activeStudioCategory.name === cat.name ? 'bg-primary-hover text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {t(cat.name)}
                            <ChevronRight size={12} className={`transition-transform ${activeStudioCategory.name === cat.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-20 group-hover:translate-x-0'}`} />
                          </button>
                        ))}
                      </div>
 
                      {/* Column 2: Subcategories */}
                      <div className="w-[240px] border-r border-white/5 py-8 bg-white/[0.01]">
                        <div className="px-8 mb-6">
                          <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{t('solutions')}</h3>
                        </div>
                        {activeStudioCategory.subcategories.map((sub) => (
                          <button
                            key={sub.name}
                            onMouseEnter={() => setActiveStudioSub(sub)}
                            className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${
                              activeStudioSub.name === sub.name ? 'text-primary bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {t(sub.name)}
                            <ChevronRight size={12} className={`transition-transform ${activeStudioSub.name === sub.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-20 group-hover:translate-x-0'}`} />
                          </button>
                        ))}
                      </div>
 
                      {/* Column 3: Topics */}
                      <div className="w-[280px] py-10 px-10 bg-bg-card">
                        <div className="mb-8">
                          <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-6">{t('studio_offerings')}</h3>
                          <div className="grid grid-cols-1 gap-y-3">
                            {activeStudioSub.topics.map((topic) => (
                              <Link
                                key={topic}
                                to={`/studio/${lang}/service/${topic.toLowerCase().replace(/ /g, '-')}`}
                                className="text-xs font-bold text-white/40 hover:text-primary transition-all flex items-center gap-3 group/topic"
                              >
                                <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover/topic:opacity-100 transition-all" />
                                {topic}
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-8 border-t border-white/5">
                          <Link to={`/studio/${lang}/all`} className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors flex items-center gap-2">
                            {t('view_all_studio')} <ChevronRight size={10} />
                          </Link>
                        </div>
                      </div>
 
                      {/* Column 4: Featured */}
                      <div className="flex-1 bg-black/60 p-8 flex flex-col justify-between border-l border-white/5">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group/feat">
                          <img 
                            src="https://picsum.photos/seed/studio/600/400" 
                            alt="Featured Project" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/feat:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="inline-block px-2 py-1 bg-primary-hover text-white text-[8px] font-black uppercase tracking-widest rounded mb-2">{t('featured_project')}</span>
                            <h4 className="text-sm font-black text-white leading-tight">Cyberpunk 2077: Phantom Liberty Cinematics</h4>
                          </div>
                        </div>
 
                        <div className="space-y-4">
                          <p className="text-[10px] text-white/40 font-medium leading-relaxed">
                            Discover how our talent network contributed to one of the most visually stunning game expansions of the year.
                          </p>
                          <button className="w-full py-3 bg-primary-hover text-white font-black uppercase tracking-widest text-[9px] rounded-lg transition-all hover:bg-primary hover:text-bg-dark hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                            {t('view_case_study')} <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to={`${modePrefix}/${lang || 'eng'}/community`} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${isCommunity ? modeColor : 'text-white/60 hover:text-white'}`}>{t('community')}</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`flex items-center gap-2 p-2 text-white/40 hover:${modeColor} transition-colors font-black text-[9px] uppercase tracking-widest`}
                >
                  <Globe size={16} />
                  <span>{currentLang.code}</span>
                </button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-40 bg-bg-card border border-white/5 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => changeLanguage(l.code)}
                          className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all ${
                            currentLang.code === l.code ? `${modeColor} bg-white/5` : 'text-white/40 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {l.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`p-2 text-white/40 hover:${modeColor} transition-colors relative`}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className={`absolute top-2 right-2 w-2 h-2 ${modeBg} rounded-full border-2 border-bg-dark`} />
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 w-80 bg-bg-card border border-white/5 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('notifications')}</span>
                        {unreadCount > 0 && (
                          <span className={`px-2 py-0.5 ${modeBg} text-bg-dark text-[8px] font-black rounded-full`}>{unreadCount} {t('new_notif')}</span>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-white/[0.02]' : ''}`}
                              onClick={() => notificationService.markAsRead(n.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${!n.read ? modeBg : 'bg-white/10'}`} />
                                <div className="space-y-1">
                                  <p className="text-[11px] font-bold text-white leading-tight">{n.title}</p>
                                  <p className="text-[10px] text-white/40 leading-relaxed">{n.message}</p>
                                  <p className="text-[8px] text-white/20 font-black uppercase tracking-widest">
                                    {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-6 py-12 text-center">
                            <Bell size={24} className="mx-auto text-white/10 mb-3" />
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">No notifications yet</p>
                          </div>
                        )}
                      </div>
                      <div className="px-6 py-4 bg-black/20 text-center">
                        <button className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                          {t('view_all_activity')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                to={`${modePrefix}/${lang}/messages`}
                className={`p-2 text-white/40 hover:${modeColor} transition-colors`}
              >
                <MessageSquare size={18} />
              </Link>

              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 text-white/40 hover:${modeColor} transition-colors`}
              >
                <Search size={18} />
              </button>

              <div className="h-6 w-[1px] bg-white/5 mx-2 hidden md:block" />

              {user ? (
                <div className="relative hidden md:block">
                  <div 
                    className={`size-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:${modeBorder.replace('border-', 'border-').replace('/20', '/40')} transition-all`}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User size={18} className="text-white/60" />
                  </div>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-4 w-64 bg-bg-card border border-white/5 rounded-2xl shadow-2xl py-2 z-50"
                      >
                        <div className="px-6 py-4 border-b border-white/5">
                          <p className="text-xs font-black text-white truncate">{user.displayName}</p>
                          <p className="text-[9px] text-white/40 truncate font-bold uppercase tracking-widest mt-1">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to={`/aca/${lang}/dashboard`} className={`block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary hover:bg-white/5 transition-all`}>{t('my_learning')}</Link>
                          <Link to={`/studio/${lang}/projects`} className={`block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary hover:bg-white/5 transition-all`}>{t('my_projects')}</Link>
                          <Link to={`${modePrefix}/${lang}/messages`} className={`block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary hover:bg-white/5 transition-all`}>{t('messages')}</Link>
                          <Link to={`${modePrefix}/${lang}/contracts`} className={`block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary hover:bg-white/5 transition-all`}>{t('contracts')}</Link>
                        </div>
                        <div className="border-t border-white/5 pt-2">
                          <button
                            onClick={() => auth.signOut()}
                            className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all flex items-center gap-2"
                          >
                            <LogOut size={14} />
                            {t('logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to={`${modePrefix}/${lang || 'eng'}/login`} className={`criativo-btn !px-6 !py-2.5 !text-[10px] hidden md:flex`}>
                  {t('join_ecosystem')}
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2 text-white/40 hover:${modeColor} transition-colors`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 z-[100] bg-bg-dark lg:hidden flex flex-col"
            >
              <div className="flex h-20 items-center justify-between px-4 border-b border-white/5">
                <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${modeBg} rounded flex items-center justify-center text-bg-dark`}>
                    <span className="text-sm font-black italic">RG</span>
                  </div>
                  <span className="text-sm font-black tracking-tighter text-white">RED GRIFFIN</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className={`p-2 text-white/40 hover:${modeColor}`}>
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
                <div className="space-y-4">
                  <h3 className={`text-[10px] font-black ${modeColor} uppercase tracking-[0.4em] px-4`}>{t('search')}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Link 
                      to={`/aca/${lang || 'eng'}`} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      <span className="text-sm font-black uppercase tracking-widest">{t('academy')}</span>
                      <ChevronRight size={16} className="text-primary" />
                    </Link>
                    <Link 
                      to={`/studio/${lang || 'eng'}`} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      <span className="text-sm font-black uppercase tracking-widest">{t('studio')}</span>
                      <ChevronRight size={16} className="text-primary" />
                    </Link>
                    <Link 
                      to={`${modePrefix}/${lang || 'eng'}/community`} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      <span className="text-sm font-black uppercase tracking-widest">{t('community')}</span>
                      <ChevronRight size={16} className={modeColor} />
                    </Link>
                    <Link 
                      to={`${modePrefix}/${lang || 'eng'}/messages`} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      <span className="text-sm font-black uppercase tracking-widest">{t('messages')}</span>
                      <ChevronRight size={16} className={modeColor} />
                    </Link>
                    <Link 
                      to={`${modePrefix}/${lang || 'eng'}/contracts`} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                    >
                      <span className="text-sm font-black uppercase tracking-widest">{t('contracts')}</span>
                      <ChevronRight size={16} className={modeColor} />
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={`text-[10px] font-black ${modeColor} uppercase tracking-[0.4em] px-4`}>{t('profile')}</h3>
                  {user ? (
                    <div className="space-y-2">
                      <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${modeBg.replace('bg-', 'bg-').replace('primary', 'primary/20')} flex items-center justify-center ${modeColor}`}>
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">{user.displayName}</p>
                          <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { auth.signOut(); setIsMenuOpen(false); }}
                        className="w-full p-4 text-primary font-black uppercase tracking-widest text-[10px] bg-primary/5 rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut size={16} />
                        {t('logout')}
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to={`${modePrefix}/${lang || 'eng'}/login`} 
                      onClick={() => setIsMenuOpen(false)}
                      className={`criativo-btn !w-full !flex !items-center !justify-center !rounded-2xl`}
                    >
                      {t('login')}
                    </Link>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className={`text-[10px] font-black ${modeColor} uppercase tracking-[0.4em] px-4`}>Language</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { changeLanguage(l.code); setIsMenuOpen(false); }}
                        className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          currentLang.code === l.code ? `${modeBg} text-bg-dark` : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-x-0 top-0 h-20 bg-bg-dark z-[60] flex items-center px-4 sm:px-8 border-b border-white/5"
            >
              <div className="mx-auto w-full max-w-4xl flex items-center gap-4">
                <Search className={modeColor} size={20} />
                <input 
                  autoFocus
                  type="text"
                  placeholder={t('search_placeholder')}
                  className="flex-1 bg-transparent border-none text-white text-lg font-bold focus:outline-none placeholder:text-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setIsSearchOpen(false)} className={`p-2 text-white/40 hover:${modeColor}`}>
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </ErrorBoundary>
      </main>

      <footer className="bg-black border-t border-white/5 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-3">
                <div className={`w-10 h-10 ${modeBg} rounded-lg flex items-center justify-center text-bg-dark`}>
                  <span className="text-lg font-black italic">RG</span>
                </div>
                <span className="text-xl font-black tracking-tighter text-white">RED GRIFFIN</span>
              </Link>
              <p className="text-sm text-white/40 font-medium leading-relaxed">
                {t('ecosystem_desc')}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">{t('academy')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to={`/aca/${lang}`} className="hover:text-white transition-colors">{t('workshops')}</Link></li>
                <li><Link to={`/aca/${lang}`} className="hover:text-white transition-colors">{t('mentorship')}</Link></li>
                <li><Link to={`/aca/${lang}`} className="hover:text-white transition-colors">{t('certifications')}</Link></li>
                <li><Link to={`/aca/${lang}`} className="hover:text-white transition-colors">{t('enterprise')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">{t('studio')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to={`/studio/${lang}`} className="hover:text-white transition-colors">{t('hire_talent')}</Link></li>
                <li><Link to={`/studio/${lang}`} className="hover:text-white transition-colors">{t('post_project')}</Link></li>
                <li><Link to={`/studio/${lang}`} className="hover:text-white transition-colors">{t('production')}</Link></li>
                <li><Link to={`/studio/${lang}`} className="hover:text-white transition-colors">{t('pro_tools')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8">{t('connect')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to={`${modePrefix}/${lang}/community`} className="hover:text-white transition-colors">{t('community')}</Link></li>
                <li><Link to={`${modePrefix}/${lang}/about`} className="hover:text-white transition-colors">{t('about_us')}</Link></li>
                <li><Link to={`${modePrefix}/${lang}/contact`} className="hover:text-white transition-colors">{t('contact')}</Link></li>
                <li><Link to={`${modePrefix}/${lang}/support`} className="hover:text-white transition-colors">{t('support')}</Link></li>
                <li><Link to={`/dev/${lang || 'ru'}`} className="hover:text-white transition-colors">{t('api_explorer')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} RED GRIFFIN ECOSYSTEM. {t('all_rights_reserved')}
            </p>
            <div className="flex items-center gap-8">
              <Link to="/privacy" className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">{t('privacy_policy')}</Link>
              <Link to="/terms" className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">{t('terms_of_service')}</Link>
            </div>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}
