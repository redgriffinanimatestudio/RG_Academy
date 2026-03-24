import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  Filter,
  ChevronLeft,
  Box,
  Play,
  Sparkles,
  Video,
  UserPlus,
  Cpu,
  Zap,
  Target,
  Ticket,
  LifeBuoy,
  DollarSign
} from 'lucide-react';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
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
    icon: Box,
    subcategories: [
      { name: 'char_modeling', topics: ['Anatomy for Artists', 'Stylized Characters', 'Realistic Humans', 'Creature Sculpting', 'Retopology'] },
      { name: 'env_art', topics: ['Modular Environments', 'Foliage & Nature', 'World Building', 'Photogrammetry', 'Interior Design'] }
    ]
  },
  {
    name: 'animation',
    icon: Play,
    subcategories: [
      { name: 'animation_3d', topics: ['Body Mechanics', 'Acting for Animation', 'Creature Animation', 'Facial Animation', 'Lip Sync'] },
      { name: 'animation_2d', topics: ['Traditional 2D', 'Toon Boom Harmony', 'Spine 2D', 'Motion Graphics', 'Storyboarding'] }
    ]
  },
  {
    name: 'vfx_compositing',
    icon: Sparkles,
    subcategories: [
      { name: 'visual_effects', topics: ['Houdini Dynamics', 'Niagara VFX', 'Fluid Simulation', 'Destruction FX', 'Particle Systems'] }
    ]
  }
];

const STUDIO_CATEGORIES = [
  {
    name: 'prod_services',
    icon: Video,
    subcategories: [
      { name: 'anim_prod', topics: ['Feature Film Animation', 'Commercial Animation', 'Game Cinematics', 'Motion Capture'] },
      { name: 'vfx_post', topics: ['CGI Environments', 'Digital Compositing', 'Color Grading', 'Sound Design'] }
    ]
  },
  {
    name: 'talent_network',
    icon: UserPlus,
    subcategories: [
      { name: 'creative_talent', topics: ['Concept Artists', '3D Generalists', 'Animators', 'VFX Supervisors'] },
      { name: 'technical_talent', topics: ['Pipeline Engineers', 'Technical Directors', 'Game Developers', 'Rigger'] }
    ]
  },
  {
    name: 'studio_solutions',
    icon: Cpu,
    subcategories: [
      { name: 'infrastructure', topics: ['Render Farm Access', 'Pipeline Tools', 'Asset Management', 'Collaboration Hub'] }
    ]
  }
];

const COMMUNITY_CATEGORIES = [
  {
    name: 'discussions',
    icon: MessageSquare,
    subcategories: [
      { name: 'general_chat', topics: ['Industry News', 'Showreel Feedback', 'Job Postings', 'Technical Support'] }
    ]
  },
  {
    name: 'showcase',
    icon: Sparkles,
    subcategories: [
      { name: 'art_gallery', topics: ['Character Art', 'Environment Design', 'Animation Reels', 'VFX Breakdowns'] }
    ]
  },
  {
    name: 'groups',
    icon: Users,
    subcategories: [
      { name: 'interest_groups', topics: ['Unreal Engine Users', 'Blender Enthusiasts', 'Houdini Artists', 'Concept Art Hub'] }
    ]
  }
];

const DASHBOARD_MENUS: Record<string, any[]> = {
  student: [
    { name: 'learning_dashboard', icon: GraduationCap, subcategories: [{ name: 'my_progress' }, { name: 'academy_calendar' }] },
    { name: 'student_finance', icon: Zap, subcategories: [{ name: 'purchases' }] }
  ],
  lecturer: [
    { name: 'instructor_hub', icon: Video, subcategories: [{ name: 'content_mgmt' }, { name: 'student_engagement' }] },
    { name: 'lecturer_wallet', icon: Zap, subcategories: [{ name: 'financials' }] }
  ],
  executor: [
    { name: 'pro_workspace', icon: Briefcase, subcategories: [{ name: 'job_pipeline' }, { name: 'pro_profile' }] },
    { name: 'business_ops', icon: Users, subcategories: [{ name: 'networking' }, { name: 'finances' }] }
  ],
  client: [
    { name: 'client_workspace', icon: Box, subcategories: [{ name: 'project_mgmt' }, { name: 'talent_acquisition' }] },
    { name: 'client_billing', icon: Settings, subcategories: [{ name: 'finances' }] }
  ],
  admin: [
    { name: 'core_management', icon: Shield, subcategories: [{ name: 'dashboard' }] },
    { name: 'user_operations', icon: Users, subcategories: [{ name: 'users' }, { name: 'rbac' }, { name: 'profile' }] },
    { name: 'platform_content', icon: Box, subcategories: [{ name: 'create' }, { name: 'detail' }] },
    { name: 'communications', icon: MessageSquare, subcategories: [{ name: 'chat' }] },
    { name: 'system_health', icon: Cpu, subcategories: [{ name: 'settings' }] }
  ],
  chief_manager: [
    { name: 'strategic_hub', icon: Target, subcategories: [{ name: 'overview' }] },
    { name: 'academy_oversight', icon: GraduationCap, subcategories: [{ name: 'academy' }] },
    { name: 'studio_ops', icon: Box, subcategories: [{ name: 'studio' }] },
    { name: 'team_orchestration', icon: Users, subcategories: [{ name: 'team' }] },
    { name: 'contract_ledger', icon: Briefcase, subcategories: [{ name: 'contracts' }] },
    { name: 'action_queue', icon: Shield, subcategories: [{ name: 'queue' }] }
  ],
  manager: [
    { name: 'operational_overview', icon: LayoutDashboard, subcategories: [{ name: 'overview' }] },
    { name: 'academy_ops', icon: GraduationCap, subcategories: [{ name: 'courses_review' }, { name: 'student_feedback' }] },
    { name: 'studio_ops', icon: Box, subcategories: [{ name: 'project_board' }, { name: 'contract_status' }, { name: 'escrow_alerts' }] },
    { name: 'user_management', icon: Users, subcategories: [{ name: 'user_list' }, { name: 'role_requests' }] }
  ],
  moderator: [{ name: 'content_moderation', icon: Shield, subcategories: [{ name: 'dashboard' }, { name: 'reported_reviews' }, { name: 'flagged_posts' }, { name: 'banned_keywords' }] }],
  hr: [{ name: 'talent_mgmt', icon: Users, subcategories: [{ name: 'dashboard' }, { name: 'job_openings' }, { name: 'applications' }, { name: 'interview_schedule' }] }],
  finance: [{ name: 'financial_ops', icon: DollarSign, subcategories: [{ name: 'dashboard' }, { name: 'payment_queue' }, { name: 'revenue_share' }, { name: 'tax_compliance' }] }],
  support: [{ name: 'help_desk', icon: LifeBuoy, subcategories: [{ name: 'dashboard' }, { name: 'open_tickets' }, { name: 'base_knowledge' }, { name: 'user_search' }] }]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, activeRole, setActiveRole, loading: authLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    academy: true,
    studio: false,
    community: false,
    dashboards: true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [showBanner, setShowBanner] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (profile) {
      const unsubscribe = notificationService.subscribeToNotifications(profile.uid, (newNotifications) => {
        setNotifications(newNotifications);
      });
      return () => unsubscribe();
    }
  }, [profile]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const path = location.pathname.toLowerCase();
  const isDashboardPage = path.includes('/dashboard') || 
                          path.includes('/admin') || 
                          path.includes('/chief-manager') || 
                          path.includes('/manager') || 
                          path.includes('/moderator') || 
                          path.includes('/hr') || 
                          path.includes('/finance') || 
                          path.includes('/support');

  const isProfile = path.includes('/profile/');
  const isCommunity = (path.includes('/community') || path.includes('/messages') || path.includes('/contracts')) && !isDashboardPage && !isProfile;
  const isStudio = path.includes('/studio/') && !isDashboardPage && !isProfile;
  const isAcademy = (path.includes('/aca/') || path.includes('/learn/')) && !isCommunity && !isDashboardPage && !isProfile;

  // Base categories
  const baseCategories = isCommunity ? COMMUNITY_CATEGORIES : (isStudio ? STUDIO_CATEGORIES : ACADEMY_CATEGORIES);

  // Dashboard category (only for logged-in users) - Shows modules for the ONE active role
  const dashboardCategory = useMemo(() => {
    if (!profile) return null;
    const effectiveRole = activeRole || (profile?.roles.includes('admin') ? 'admin' : profile?.roles[0]);
    if (!effectiveRole || !DASHBOARD_MENUS[effectiveRole]) return null;

    // The "Hub" view depends on the role type
    const hubView = ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support'].includes(effectiveRole) ? 'dashboard' : 'overview';

    // We inject a "Dashboard Hub" entry at the very top of the subcategories
    const hubItem = { 
      name: 'dashboard_hub', 
      icon: LayoutDashboard, 
      subcategories: [{ name: hubView }] 
    };

    return {
      name: 'dashboards',
      icon: LayoutDashboard,
      isDashboard: true,
      subcategories: [hubItem, ...DASHBOARD_MENUS[effectiveRole]]
    };
  }, [profile, activeRole]);

  // Combined sidebar categories - Reverted to original sequence
  const sidebarCategories = useMemo(() => {
    if (!profile) return baseCategories;
    return dashboardCategory ? [dashboardCategory, ...baseCategories] : baseCategories;
  }, [profile, dashboardCategory, baseCategories]);

  // Sync sidebar state with URL 'view' parameter
  const [activeCatName, setActiveCatName] = useState(sidebarCategories[0]?.name);
  const [activeSubName, setActiveSubName] = useState(sidebarCategories[0]?.subcategories[0]?.name);

  useEffect(() => {
    if (isDashboardPage && dashboardCategory) {
      setActiveCatName('dashboards');
      const currentView = searchParams.get('view') || 'dashboard';

      dashboardCategory.subcategories.forEach((cat: any) => {
        const sub = cat.subcategories.find((s: any) =>
          s.name.toLowerCase().replace(/ /g, '_') === currentView
        );
        if (sub) {
          setActiveSubName(sub.name);
        }
      });
    } else if (!activeCatName || activeCatName === 'dashboards') {
      setActiveCatName(baseCategories[0]?.name);
      setActiveSubName(baseCategories[0]?.subcategories[0]?.name);
    }
  }, [location.search, isDashboardPage, dashboardCategory, baseCategories]);

  const activeCategory = sidebarCategories.find(c => c.name === activeCatName) || sidebarCategories[0];

  const handleSetCategory = (cat: any) => {
    setActiveCatName(cat.name);
    if (!cat.isDashboard) {
      setActiveSubName(cat.subcategories[0]?.name);
    }
  };

  const handleSetSub = (sub: any, parentCat: any) => {
    setActiveSubName(sub.name);
    const slug = sub.name.toLowerCase().replace(/ /g, '-');
    
    if (parentCat.isDashboard) {
      const viewSlug = sub.name.toLowerCase().replace(/ /g, '_');
      navigate(`${location.pathname}?view=${viewSlug}`);
    } else if (parentCat.name === 'prod_services' || parentCat.name === 'talent_network' || parentCat.name === 'studio_solutions') {
      navigate(`/studio/${lang || 'eng'}/service/${slug}`);
    } else if (parentCat.name === 'discussions' || parentCat.name === 'showcase' || parentCat.name === 'groups') {
      navigate(`/aca/${lang || 'eng'}/community/topic/${slug}`);
    } else {
      navigate(`/aca/${lang || 'eng'}/topic/${slug}`);
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === (lang || 'eng')) || LANGUAGES[0];

  const changeLanguage = (newLang: string) => {
    const pathParts = location.pathname.split('/');
    if (['aca', 'studio', 'community', 'login', 'signup', 'messages', 'contracts', 'dashboard', 'projects'].includes(pathParts[1])) {
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

  const getDashboardLinkForRole = (role: string) => {
    return `/${isStudio ? 'studio' : 'aca'}/${lang || 'eng'}/dashboard?role=${role}`;
  };

  const modePrefix = isStudio ? '/studio' : '/aca';
  const mobileSections = useMemo(() => {
    const sections = [];
    
    if (profile && dashboardCategory) {
      sections.push({
        id: 'dashboards',
        label: t('my_dashboard'),
        icon: LayoutDashboard,
        path: `${isStudio ? '/studio' : '/aca'}/${lang || 'eng'}/dashboard`,
        categories: dashboardCategory.subcategories,
        active: isDashboardPage,
        color: activeRole === 'admin' ? 'text-red-500' : 'text-primary'
      });
    }

    sections.push({
      id: 'academy',
      label: t('academy'),
      icon: GraduationCap,
      path: `/aca/${lang || 'eng'}`,
      categories: ACADEMY_CATEGORIES,
      active: isAcademy,
      color: 'text-primary'
    });

    sections.push({
      id: 'studio',
      label: t('studio'),
      icon: Box,
      path: `/studio/${lang || 'eng'}`,
      categories: STUDIO_CATEGORIES,
      active: isStudio,
      color: 'text-primary-hover'
    });

    sections.push({
      id: 'community',
      label: t('community'),
      icon: Users,
      path: `${modePrefix}/${lang || 'eng'}/community`,
      categories: COMMUNITY_CATEGORIES,
      active: isCommunity,
      color: 'text-white/40'
    });

    return sections;
  }, [profile, dashboardCategory, lang, isStudio, isDashboardPage, isAcademy, isCommunity, t, modePrefix, activeRole]);
  const navClass = isDashboardPage ? 'bg-black/10 border-white/10' : (isStudio ? 'bg-[#030303]/10 border-primary/30' : 'bg-black/10 border-white/10');
  const cardClass = 'bg-white/10 border-white/10 backdrop-blur-3xl';

  const themeClass = isDashboardPage ? 'theme-dashboard' : (isStudio ? 'theme-studio' : 'theme-academy');
  const modeColor = isDashboardPage ? (activeRole === 'admin' ? 'text-red-500' : 'text-primary') : (isCommunity ? 'text-primary' : (isStudio ? 'text-primary-hover' : 'text-primary'));
  const modeBg = isDashboardPage ? (activeRole === 'admin' ? 'bg-red-500' : 'bg-primary') : (isCommunity ? 'bg-primary' : (isStudio ? 'bg-primary-hover' : 'bg-primary'));

  if (authLoading) {
    return (
      <div className="min-h-screen font-sans text-white flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative size-20">
            <div className="absolute inset-0 rounded-3xl border-4 border-primary/20 animate-pulse" />
            <div className="absolute inset-0 rounded-3xl border-t-4 border-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-black italic text-white">RG</span></div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">Red Griffin</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mt-2">Initializing System...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans text-white transition-colors duration-500 ${themeClass}`}>
      {showBanner && (
        <div className={`${modeBg} text-bg-dark py-2 px-4 relative text-center text-[10px] font-black uppercase tracking-widest z-[60]`}>
          <span>{isStudio ? t('studio_collab') : t('academy_workshops')}: {isStudio ? t('studio_desc') : t('master_cg')}</span>
          <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80"><X size={14} /></button>
        </div>
      )}

      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${navClass}`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4 lg:gap-8">
            <div className="flex items-center gap-3 sm:gap-6">
              <button onClick={() => setIsMobileMenuOpen(true)} className={`lg:hidden p-2 bg-white/5 rounded-lg transition-colors ${modeColor} active:scale-90 transition-transform`}><Menu size={20} /></button>
              <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-3 group">
                <img src="/logo-web.png" alt="Red Griffin" className="h-7 sm:h-8 lg:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                <div className="flex flex-col hidden sm:flex lg:hidden xl:flex">
                  <span className="text-xs lg:text-base font-black tracking-tighter text-white leading-none uppercase">Red Griffin</span>
                  <span className={`text-[6px] lg:text-[8px] font-bold tracking-[0.3em] ${modeColor} leading-none mt-1 uppercase`}>{t('creative_ecosystem')}</span> 
                </div>
              </Link>
            </div>

            {/* Desktop Center Links - Hidden below 1024px (lg) */}
            <div className="hidden lg:flex items-center gap-6 h-full">
              {[
                { id: 'academy', label: t('academy'), path: `/aca/${lang || 'eng'}`, categories: ACADEMY_CATEGORIES, active: isAcademy },
                { id: 'studio', label: t('studio'), path: `/studio/${lang || 'eng'}`, categories: STUDIO_CATEGORIES, active: isStudio },
                { id: 'community', label: t('community'), path: `${modePrefix}/${lang || 'eng'}/community`, categories: COMMUNITY_CATEGORIES, active: isCommunity }
              ].map((item) => (
                <div
                  key={item.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveMegaMenu(item.id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    to={item.path}
                    className={`px-1.5 lg:px-2 py-2 text-[10px] lg:text-[11px] font-black uppercase tracking-widest transition-all relative ${item.active ? (item.id === 'studio' ? 'text-primary-hover' : 'text-primary') : 'text-white/60 hover:text-white'}`}
                  >
                    {item.label}
                    {item.active && <motion.div layoutId="nav-active" className={`absolute -bottom-[26px] left-0 right-0 h-[2px] ${item.id === 'studio' ? 'bg-primary-hover' : 'bg-primary'}`} />}
                  </Link>
                  <AnimatePresence>
                    {activeMegaMenu === item.id && item.categories && item.categories.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }} 
                        className={`absolute left-0 top-full w-[calc(100vw-4rem)] max-w-[800px] border rounded-b-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-3 gap-8 z-[100] ${cardClass}`}
                      >
                        {item.categories.map((cat: any) => (
                          <div key={cat.name} className="space-y-4">
                            <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${item.id === 'studio' ? 'text-primary-hover' : 'text-primary'}`}>
                              <cat.icon size={14} /> {t(cat.name)}
                            </h4>
                            <div className="flex flex-col gap-2">
                              {cat.subcategories.map((sub: any) => (
                                <button 
                                  key={sub.name} 
                                  onClick={() => { handleSetSub(sub, cat); setActiveMegaMenu(null); }}
                                  className="text-left text-xs font-bold text-white/70 hover:text-white transition-colors"
                                >
                                  • {t(sub.name)}
                                </button>
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

            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Language - Desktop/Tablet */}
              <div className="relative hidden xs:block">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className={`p-2 transition-colors flex items-center gap-2 font-black text-[10px] uppercase ${modeColor}`}>
                  <Globe size={18} /><span className="hidden sm:inline">{currentLang.code}</span>
                </button>
                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`absolute right-0 mt-4 w-40 border rounded-2xl shadow-2xl py-2 z-50 overflow-hidden ${cardClass}`}>
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => changeLanguage(l.code)} className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase flex items-center justify-between transition-all ${currentLang.code === l.code ? 'text-primary bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                          {l.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* DYNAMIC AUTH BLOCK */}
              {profile ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button className="p-1.5 sm:p-2 text-white/40 hover:text-primary transition-colors relative">
                    <Bell size={18} />
                    {unreadCount > 0 && <span className={`absolute top-1.5 right-1.5 size-1.5 sm:size-2 rounded-full border-2 ${isStudio ? 'bg-primary-hover border-[#1e1e24]' : 'bg-primary border-[#050505]'}`} />}
                  </button>
                  
                  <Link to={`${modePrefix}/${lang || 'eng'}/messages`} className="hidden sm:flex p-1.5 sm:p-2 text-white/40 hover:text-primary transition-colors">
                    <MessageSquare size={18} />
                  </Link>

                  <div className="h-6 w-[1px] bg-white/5 mx-1 hidden sm:block" />
                  
                  <div className="relative">
                    <button className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 transition-all group" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                      <div className="size-7 sm:size-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/40 transition-all shrink-0">
                        {profile.photoURL ? (
                          <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-[10px] font-black ${modeBg} text-bg-dark uppercase`}>
                            {profile.displayName?.substring(0, 2) || 'RG'}
                          </div>
                        )}
                      </div>
                      <div className="hidden md:flex flex-col items-start text-left">
                        <span className="text-[10px] font-black text-white truncate max-w-[80px] leading-none uppercase">
                          {profile.displayName?.split(' ')[0] || 'User'}
                        </span>
                        <span className={`text-[7px] font-bold uppercase tracking-widest text-primary leading-none mt-1`}>
                          {activeRole?.replace('_', ' ') || 'Member'}
                        </span>
                      </div>
                      <ChevronDown size={12} className={`text-white/20 group-hover:text-primary transition-all hidden lg:block ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                          animate={{ opacity: 1, scale: 1, y: 0 }} 
                          exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                          className={`absolute right-0 mt-4 w-64 border rounded-2xl shadow-2xl py-2 z-50 ${cardClass}`}
                        >
                          <div className="px-6 py-4 border-b border-white/5">
                            <p className="text-xs font-black text-white truncate">{profile.displayName || 'User'}</p>
                            <p className="text-[9px] text-white/40 truncate font-bold uppercase mt-1">{profile.email}</p>
                          </div>
                          
                          <div className="py-2">
                            <Link to={`/${isStudio ? 'studio' : 'aca'}/${lang || 'eng'}/profile/${profile.uid}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3"><User size={14} /> {t('my_profile')}</Link>  

                            {profile?.isAdmin && (
                              <Link to={`/dev/${lang || 'eng'}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-3 font-bold border-t border-white/5 mt-2 pt-4">
                                <Shield size={14} /> Master Control Engine
                              </Link>
                            )}

                            <Link to={`${isStudio ? '/studio' : '/aca'}/${lang || 'eng'}/dashboard`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3"><LayoutDashboard size={14} /> {t('my_dashboard')}</Link>
                            <div className="px-6 py-2 border-t border-white/5 mt-2">
                              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">Switch identity</p>
                              {profile.roles.map(r => (
                                <button
                                  key={r}
                                  onClick={() => {
                                    setActiveRole(r as any);
                                    setIsUserMenuOpen(false);
                                    navigate(getDashboardLinkForRole(r));
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-2 ${activeRole === r ? 'text-primary bg-primary/10' : 'text-white/40 hover:bg-white/5'}`}
                                >
                                  <div className={`size-1.5 rounded-full ${activeRole === r ? 'bg-primary' : 'bg-white/10'}`} />
                                  {r.replace('_', ' ')}
                                </button>
                              ))}
                            </div>

                            <div className="h-[1px] bg-white/5 my-2 mx-6" />
                            <button
                              onClick={() => { logout(); setIsUserMenuOpen(false); }}
                              className="w-full text-left px-6 py-4 text-[10px] font-black uppercase text-primary hover:bg-primary/10 transition-all flex items-center gap-2"
                            >
                              <LogOut size={14} /> {t('logout')}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-6">
                  <Link to={`/aca/${lang || 'eng'}/login`} className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all whitespace-nowrap">{t('login')}</Link>
                  <Link to={`/aca/${lang || 'eng'}/login`} className="criativo-btn !px-4 sm:!px-8 !py-2 sm:!py-3 !text-[10px] shadow-xl shadow-primary/20 whitespace-nowrap !rounded-xl">
                    <span className="hidden sm:inline">Присоединиться</span>
                    <span className="sm:hidden">Вступить</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-navigation (Quick categories scroll) */}
        {(isAcademy || isStudio || isCommunity || isDashboardPage) && (
          <div className="md:hidden border-t border-white/5 bg-black/20 backdrop-blur-md overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-6 px-6 h-12 whitespace-nowrap">
              {sidebarCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleSetCategory(cat)}
                  className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeCatName === cat.name ? modeColor : 'text-white/30'}`}
                >
                  <cat.icon size={12} className={activeCatName === cat.name ? modeColor : 'opacity-30'} />
                  {t(cat.name)}
                  {activeCatName === cat.name && <motion.div layoutId="mobile-subnav-active" className={`h-1 w-1 rounded-full ${modeBg}`} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Background Backdrop - Always lg:hidden */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[100] lg:hidden" 
              />
              
              {/* Menu Container - Always lg:hidden */}
              <motion.div 
                initial={{ x: '-100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '-100%' }} 
                transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                className={`fixed inset-y-0 left-0 w-[90%] max-w-[360px] z-[101] p-6 lg:hidden flex flex-col border-r ${cardClass} shadow-[30px_0_60px_rgba(0,0,0,0.9)]`}
              >
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                    <div className={`size-10 ${modeBg} rounded-xl flex items-center justify-center text-bg-dark shadow-lg shadow-primary/20`}>
                      <span className="text-xl font-black italic">RG</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tighter text-white">Red Griffin</span>
                      <span className={`text-[7px] font-bold tracking-[0.3em] ${modeColor} uppercase leading-none mt-1`}>{t('creative_ecosystem')}</span>
                    </div>
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="size-10 flex items-center justify-center bg-white/5 rounded-xl text-white/40 hover:text-white transition-all">
                    <X size={20} />
                  </button>
                </div>

                {/* Main Scrollable Navigation Tree */}
                <div className="flex-1 overflow-y-auto no-scrollbar -mr-2 pr-2 space-y-6">
                  
                  {/* SEARCH (Mobile Version) */}
                  <div className="relative group px-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="text" 
                      placeholder={t('search')} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:border-primary/40 focus:bg-white/10 outline-none transition-all"
                    />
                  </div>

                  {/* TEST LINK */}
                  <div className="bg-red-500/20 p-4 rounded-xl border border-red-500/40 mb-4 mx-1">
                    <span className="text-[10px] font-black uppercase text-red-500">System Test: Menu active</span>
                  </div>

                  {/* STATIC MAIN LINKS */}
                  <nav className="space-y-1 px-1">
                    {[
                      { id: 'academy', label: t('academy'), path: `/aca/${lang || 'eng'}`, icon: GraduationCap, active: isAcademy, color: 'text-primary' },
                      { id: 'studio', label: t('studio'), path: `/studio/${lang || 'eng'}`, icon: Box, active: isStudio, color: 'text-primary-hover' },
                      { id: 'community', label: t('community'), path: `${modePrefix}/${lang || 'eng'}/community`, icon: Users, active: isCommunity, color: 'text-white/40' }
                    ].map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${item.active ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.02]'}`}
                      >
                        <item.icon size={18} className={item.active ? item.color : 'opacity-40'} />
                        <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                        {item.active && <motion.div layoutId="mobile-main-active" className={`ml-auto size-1.5 rounded-full ${item.id === 'studio' ? 'bg-primary-hover' : 'bg-primary'}`} />}
                      </Link>
                    ))}
                  </nav>

                  <div className="h-[1px] bg-white/5 mx-4 my-2" />

                  {/* Dynamic sections */}
                  {mobileSections.map(section => (
                    <div key={section.id} className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <Link 
                          to={section.path} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 flex-1"
                        >
                          <section.icon size={16} className={section.active ? section.color : 'text-white/40'} />
                          <h5 className={`text-[10px] font-black uppercase tracking-[0.3em] ${section.active ? 'text-white' : 'text-white/60'}`}>{section.label}</h5>
                        </Link>
                        <button 
                          onClick={() => toggleSection(section.id)}
                          className="p-2 text-white/20 hover:text-white transition-all"
                        >
                          <ChevronDown size={14} className={`transition-transform duration-300 ${expandedSections[section.id] ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {expandedSections[section.id] && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-3"
                          >
                            {section.categories.map((cat: any) => (
                              <div key={cat.name} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden ml-2">
                                <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-white/[0.02]">
                                  <cat.icon size={14} className={`${section.color} opacity-60`} />
                                  <span className="text-[10px] font-black uppercase tracking-wider text-white/80">{t(cat.name)}</span>
                                </div>
                                <div className="p-3 grid grid-cols-1 gap-1">
                                  {cat.subcategories.map((sub: any) => (
                                    <button 
                                      key={sub.name} 
                                      onClick={() => { handleSetSub(sub, cat); setIsMobileMenuOpen(false); }}
                                      className={`px-3 py-2 text-[9px] font-bold uppercase transition-all flex items-center justify-between group ${activeSubName === sub.name ? section.color : 'text-white/30 hover:text-white'}`}
                                    >
                                      {t(sub.name)}
                                      <ChevronRight size={10} className={`transition-all ${activeSubName === sub.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                    </button>
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

                {/* Account / Language Hub (Always Fixed at bottom) */}
                <div className="mt-6 pt-6 border-t border-white/5 space-y-6">
                  {/* Language Switcher */}
                  <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/5">
                    {LANGUAGES.map(l => (
                      <button 
                        key={l.code} 
                        onClick={() => changeLanguage(l.code)} 
                        className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all ${currentLang.code === l.code ? `${modeBg} text-bg-dark shadow-lg` : 'text-white/20 hover:text-white'}`}
                      >
                        {l.code}
                      </button>
                    ))}
                  </div>

                  {!profile ? (
                    <Link to={`/aca/${lang || 'eng'}/login`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 w-full py-5 bg-primary text-bg-dark text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all">
                      <LogIn size={18} /> {t('join_system')}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className={`size-12 rounded-xl ${modeBg} flex items-center justify-center text-bg-dark text-lg font-black italic shrink-0`}>
                        {profile.displayName?.substring(0, 2) || 'RG'}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-black text-white uppercase truncate">{profile.displayName}</span>
                        <span className={`text-[7px] font-bold uppercase tracking-widest ${modeColor}`}>{activeRole?.replace('_', ' ')}</span>
                      </div>
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="p-3 text-primary hover:bg-primary/10 rounded-xl transition-all">
                        <LogOut size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {(isAcademy || isStudio || isCommunity || isDashboardPage) && (
            <div className="hidden md:block relative shrink-0 overflow-visible">
              <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="absolute -right-4 top-10 z-[150] size-9 rounded-full border-2 border-primary/40 bg-[#0a0a0a] flex items-center justify-center hover:scale-110 hover:border-primary transition-all shadow-[0_0_30px_rgba(0,0,0,0.9)] group">
                {isSidebarCollapsed ? <ChevronRight size={18} className="text-primary" /> : <ChevronLeft size={18} className="text-primary" />}
              </button>
              <motion.aside initial={false} animate={{ width: isSidebarCollapsed ? 80 : 288 }} className="sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar border-r border-white/5 pr-4">
                <div className="space-y-8">
                  <div className="space-y-2">
                    {sidebarCategories.map((cat) => {
                      const isCatActive = activeCatName === cat.name;
                      const Icon = cat.icon;
                      return (
                        <div key={cat.name} className="space-y-1">
                          <button onClick={() => { if (isSidebarCollapsed) setIsSidebarCollapsed(false); handleSetCategory(cat); }} className={`w-full text-left p-3 rounded-xl border transition-all flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} ${isCatActive ? (isStudio ? 'bg-primary-hover/10 border-primary-hover/20 text-white' : 'bg-primary/10 border-primary/20 text-white') : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white'}`}>
                            <div className="flex items-center gap-3"><Icon size={16} className={isCatActive ? modeColor : 'opacity-40'} />{!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">{t(cat.name)}</span>}</div>
                            {!isSidebarCollapsed && <ChevronDown size={12} className={`transition-transform duration-300 ${isCatActive ? 'rotate-180 opacity-100' : 'opacity-20'}`} />}
                          </button>
                          <AnimatePresence initial={false}>
                            {isCatActive && !isSidebarCollapsed && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-3 pl-3 border-l border-white/5 space-y-1 mt-1">
                                {cat.subcategories.map((sub: any) => (
                                  <button key={sub.name} onClick={() => handleSetSub(sub, cat)} className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${activeSubName === sub.name ? (isStudio ? 'text-primary-hover' : 'text-primary') : 'text-white/30 hover:text-white/60'}`}>
                                    {t(sub.name)}<div className={`size-1 rounded-full ${activeSubName === sub.name ? (isStudio ? 'bg-primary-hover' : 'bg-primary') : 'bg-white/10'}`} />
                                  </button>
                                ))}
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
          )}
          <div className="flex-1 min-w-0"><ErrorBoundary><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>{children}</motion.div></ErrorBoundary></div>
        </div>
      </main>

      <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
            <div className="space-y-6"><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('academy')}</h4><ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40"><li><Link to={`/aca/${lang || 'eng'}`} className="hover:text-white">{t('workshops')}</Link></li></ul></div>
            <div className="space-y-6"><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-hover">{t('studio')}</h4><ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40"><li><Link to={`/studio/${lang || 'eng'}`} className="hover:text-white">{t('hire_talent')}</Link></li></ul></div>
            <div className="space-y-6"><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{t('community')}</h4><ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40"><li><Link to="#" className="hover:text-white">{t('blog')}</Link></li></ul></div>
            <div className="space-y-6"><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{t('legal')}</h4><ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40"><li><Link to="#" className="hover:text-white">{t('terms')}</Link></li></ul></div>
            <div className="space-y-8 col-span-full lg:col-span-1">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="w-full flex items-center justify-between px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3"><Globe size={16} className={modeColor} /><span className="text-[10px] font-black uppercase tracking-widest">{currentLang.name}</span></div>
                <ChevronRight size={14} className="opacity-40" />
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
            <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-4 group"><div className={`size-12 ${modeBg} rounded-2xl flex items-center justify-center text-bg-dark shadow-xl`}><span className="text-xl font-black italic">RG</span></div><div className="flex flex-col"><span className="text-lg font-black tracking-tighter text-white uppercase leading-none">Red Griffin</span><span className={`text-[8px] font-bold tracking-[0.4em] ${modeColor} uppercase mt-1`}>{t('creative_ecosystem')}</span></div></Link>
            <div className="flex flex-col md:items-end gap-2"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">© {new Date().getFullYear()} Red Griffin Creative Ecosystem. {t('all_rights_reserved')}</p></div>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}
