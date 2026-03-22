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
    { name: 'strategic_hub', icon: Target, subcategories: [{ name: 'dashboard' }, { name: 'kpi_metrics' }, { name: 'growth' }] },
    { name: 'team_mgmt', icon: Users, subcategories: [{ name: 'staff_list' }, { name: 'performance' }] },
    { name: 'ops_mgmt', icon: Briefcase, subcategories: [{ name: 'all_contracts' }, { name: 'legal' }] }
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
  const { user, profile, activeRole, setActiveRole, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  
  const [activeAcademyCategory, setActiveAcademyCategory] = useState(ACADEMY_CATEGORIES[0]);
  const [activeAcademySub, setActiveAcademySub] = useState(ACADEMY_CATEGORIES[0].subcategories[0]);
  const [activeStudioCategory, setActiveStudioCategory] = useState(STUDIO_CATEGORIES[0]);
  const [activeStudioSub, setActiveStudioSub] = useState(STUDIO_CATEGORIES[0].subcategories[0]);
  const [activeCommunityCategory, setActiveCommunityCategory] = useState(COMMUNITY_CATEGORIES[0]);
  const [activeCommunitySub, setActiveCommunitySub] = useState(COMMUNITY_CATEGORIES[0].subcategories[0]);

  const [showBanner, setShowBanner] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = notificationService.subscribeToNotifications(user.uid, (newNotifications) => {
        setNotifications(newNotifications);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const path = location.pathname.toLowerCase();
  const isDashboardPage = path.includes('/dashboard') || 
                     ['/admin/', '/chief-manager/', '/manager/', '/moderator/', '/hr/', '/finance/', '/support/'].some(p => path.includes(p));
  
  const isProfile = path.includes('/profile/');
  const isCommunity = (path.includes('/community') || path.includes('/messages') || path.includes('/contracts')) && !isDashboardPage && !isProfile;
  const isStudio = path.includes('/studio/') && !isDashboardPage && !isProfile;
  const isAcademy = (path.includes('/aca/') || path.includes('/learn/')) && !isCommunity && !isDashboardPage && !isProfile;
  
  // Base categories
  const baseCategories = isCommunity ? COMMUNITY_CATEGORIES : (isStudio ? STUDIO_CATEGORIES : ACADEMY_CATEGORIES);
  
  // Dashboard category (only for logged-in users)
  const dashboardCategory = React.useMemo(() => {
    if (!user) return null;
    const effectiveRole = activeRole || (profile?.roles.includes('admin') ? 'admin' : profile?.roles[0]);
    if (!effectiveRole || !DASHBOARD_MENUS[effectiveRole]) return null;

    return {
      name: 'my_dashboard',
      icon: LayoutDashboard,
      isDashboard: true,
      subcategories: DASHBOARD_MENUS[effectiveRole]
    };
  }, [user, activeRole, profile]);

  // Combined sidebar categories
  const sidebarCategories = React.useMemo(() => {
    if (!user) return baseCategories;
    return dashboardCategory ? [dashboardCategory, ...baseCategories] : baseCategories;
  }, [user, dashboardCategory, baseCategories]);
  
  const [activeDashboardCatIdx, setActiveDashboardCatIdx] = useState(0);
  const [activeDashboardSubIdx, setActiveDashboardSubIdx] = useState(0);

  // Sync sidebar state with URL 'view' parameter
  useEffect(() => {
    if (isDashboardPage && dashboardCategory) {
      const searchParams = new URLSearchParams(location.search);
      const currentView = searchParams.get('view') || 'dashboard';
      
      dashboardCategory.subcategories.forEach((cat: any, catIdx: number) => {
        const subIdx = cat.subcategories.findIndex((sub: any) => 
          sub.name.toLowerCase().replace(/ /g, '_') === currentView
        );
        if (subIdx !== -1) {
          setActiveDashboardCatIdx(catIdx);
          setActiveDashboardSubIdx(subIdx);
        }
      });
    }
  }, [location.search, isDashboardPage, dashboardCategory]);

  // Logic for active items
  const [activeCatName, setActiveCatName] = useState(sidebarCategories[0]?.name);
  const [activeSubName, setActiveSubName] = useState(sidebarCategories[0]?.subcategories[0]?.name);

  // Auto-set active category based on page
  useEffect(() => {
    if (isDashboardPage && dashboardCategory) {
      setActiveCatName('my_dashboard');
    } else if (!activeCatName || activeCatName === 'my_dashboard') {
      setActiveCatName(baseCategories[0]?.name);
    }
  }, [isDashboardPage, dashboardCategory, baseCategories]);

  const activeCategory = sidebarCategories.find(c => c.name === activeCatName) || sidebarCategories[0];
  const activeSub = activeCategory?.subcategories.find((s: any) => s.name === activeSubName) || activeCategory?.subcategories[0];

  const handleSetCategory = (cat: any) => {
    setActiveCatName(cat.name);
    if (!cat.isDashboard) {
      setActiveSubName(cat.subcategories[0]?.name);
    }
  };

  const handleSetSub = (sub: any, parentCat: any) => {
    setActiveSubName(sub.name);
    if (parentCat.isDashboard) {
      // Logic for dashboard navigation
      const viewSlug = sub.name.toLowerCase().replace(/ /g, '_');
      navigate(`${location.pathname}?view=${viewSlug}`);
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

  const modePrefix = isStudio ? '/studio' : '/aca';
  const navClass = isDashboardPage ? 'bg-zinc-900/80 border-white/5' : (isStudio ? 'bg-bg-dark/80 border-primary/20' : 'bg-black/80 border-white/5');
  const cardClass = isDashboardPage ? 'bg-zinc-900 border-white/10' : (isStudio ? 'bg-bg-card border-primary/10' : 'bg-white/[0.03] border-white/5');
  
  const themeClass = isDashboardPage ? 'theme-dashboard' : (isStudio ? 'theme-studio' : 'theme-academy');
  const modeColor = isDashboardPage ? (activeRole === 'admin' ? 'text-red-500' : 'text-primary') : (isCommunity ? 'text-primary' : (isStudio ? 'text-primary-hover' : 'text-primary'));
  const modeBg = isDashboardPage ? (activeRole === 'admin' ? 'bg-red-500' : 'bg-primary') : (isCommunity ? 'bg-primary' : (isStudio ? 'bg-primary-hover' : 'bg-primary'));
  const modeShadow = isDashboardPage ? (activeRole === 'admin' ? 'shadow-red-500/20' : 'shadow-primary/20') : (isCommunity ? 'shadow-primary/20' : (isStudio ? 'shadow-primary-hover/20' : 'shadow-primary/20'));

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
              <button onClick={() => setIsMobileMenuOpen(true)} className={`lg:hidden p-2 bg-white/5 rounded-lg transition-colors ${modeColor}`}><Menu size={20} /></button>
              <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-3 group">
                <img src="/logo-web.png" alt="Red Griffin" className="h-8 lg:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                <div className="flex flex-col hidden xs:flex">
                  <span className="text-sm lg:text-base font-black tracking-tighter text-white leading-none uppercase">Red Griffin</span>
                  <span className={`text-[7px] lg:text-[8px] font-bold tracking-[0.3em] ${modeColor} leading-none mt-1 uppercase`}>{t('creative_ecosystem')}</span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Links */}
            <div className="hidden lg:flex items-center gap-2 h-full">
              {[
                { id: 'academy', label: t('academy'), path: `/aca/${lang || 'eng'}`, categories: ACADEMY_CATEGORIES, active: isAcademy },
                { id: 'studio', label: t('studio'), path: `/studio/${lang || 'eng'}`, categories: STUDIO_CATEGORIES, active: isStudio },
                { id: 'community', label: t('community'), path: `${modePrefix}/${lang || 'eng'}/community`, categories: COMMUNITY_CATEGORIES, active: isCommunity }
              ].map((item) => (
                <div 
                  key={item.id} 
                  className="h-full flex items-center"
                  onMouseEnter={() => setActiveMegaMenu(item.id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link 
                    to={item.path} 
                    className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all relative ${item.active ? (item.id === 'studio' ? 'text-primary-hover' : 'text-primary') : 'text-white/60 hover:text-white'}`}
                  >
                    {item.label}
                    {item.active && <motion.div layoutId="nav-active" className={`absolute -bottom-[26px] left-0 right-0 h-[2px] ${item.id === 'studio' ? 'bg-primary-hover' : 'bg-primary'}`} />}
                  </Link>

                  <AnimatePresence>
                    {activeMegaMenu === item.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute top-full left-0 right-0 border-b border-white/5 shadow-2xl z-40 overflow-hidden ${cardClass} backdrop-blur-3xl`}
                      >
                        <div className="mx-auto max-w-[1600px] px-8 py-12">
                          <div className="grid grid-cols-3 gap-12">
                            {item.categories.map((cat) => (
                              <div key={cat.name} className="space-y-6">
                                <div className="flex items-center gap-3">
                                  <cat.icon size={20} className={item.id === 'studio' ? 'text-primary-hover' : 'text-primary'} />
                                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">{t(cat.name)}</h4>
                                </div>
                                <div className="grid gap-4">
                                  {cat.subcategories.map((sub) => (
                                    <div key={sub.name} className="group cursor-pointer" onClick={() => { navigate(item.path); setActiveMegaMenu(null); }}>
                                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors flex items-center justify-between">
                                        {t(sub.name)}
                                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                      </div>
                                      {sub.topics && (
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                                          {sub.topics.map((topic: string) => (
                                            <span key={topic} className="text-[8px] font-bold uppercase tracking-widest text-white/10 hover:text-primary transition-colors">{topic}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/[0.02] border-t border-white/5 px-8 py-4 flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Red Griffin Creative Ecosystem / {item.label} Hub</span>
                          <Link to={item.path} onClick={() => setActiveMegaMenu(null)} className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${item.id === 'studio' ? 'text-primary-hover' : 'text-primary'} hover:brightness-125`}>
                            Explore All {item.label} <ChevronRight size={12} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative mr-2">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className={`p-2 transition-colors flex items-center gap-2 font-black text-[10px] uppercase ${modeColor}`}>
                  <Globe size={18} /><span>{currentLang.code}</span>
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

              {user ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button className="p-2 text-white/40 hover:text-primary transition-colors relative"><Bell size={18} />{unreadCount > 0 && <span className={`absolute top-2 right-2 size-2 rounded-full border-2 ${isStudio ? 'bg-primary-hover border-[#1e1e24]' : 'bg-primary border-[#050505]'}`} />}</button>
                  <Link to={`${modePrefix}/${lang || 'eng'}/messages`} className="p-2 text-white/40 hover:text-primary transition-colors"><MessageSquare size={18} /></Link>
                  <div className="h-6 w-[1px] bg-white/5 mx-1 hidden sm:block" />
                  <div className="relative">
                    <button className="flex items-center gap-3 p-1 pr-3 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 transition-all group" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                      <div className="size-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/40 transition-all">{user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-[10px] font-black ${modeBg} text-bg-dark uppercase`}>{user.displayName?.substring(0, 2) || 'RG'}</div>}</div>
                      <div className="hidden sm:flex flex-col items-start"><span className="text-[10px] font-black text-white truncate max-w-[80px] leading-none uppercase">{user.displayName?.split(' ')[0] || 'User'}</span><span className={`text-[7px] font-bold uppercase tracking-widest ${modeColor} leading-none mt-1`}>{activeRole || 'Member'}</span></div>
                      <ChevronDown size={12} className={`text-white/20 group-hover:text-primary transition-all ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className={`absolute right-0 mt-4 w-64 border rounded-2xl shadow-2xl py-2 z-50 ${cardClass}`}>
                          <div className="px-6 py-4 border-b border-white/5"><p className="text-xs font-black text-white truncate">{user.displayName || 'User'}</p><p className="text-[9px] text-white/40 truncate font-bold uppercase mt-1">{user.email}</p></div>
                          <div className="py-2">
                            <Link to={`${modePrefix}/${lang || 'eng'}/profile/${user.uid}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3"><User size={14} /> {t('my_profile')}</Link>
                            <Link to={`${isStudio ? '/studio' : '/aca'}/${lang || 'eng'}/dashboard`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3"><LayoutDashboard size={14} /> {t('my_dashboard')}</Link>
                            
                            {profile?.roles.includes('admin') && (
                              <Link to={`/admin/${lang || 'eng'}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 flex items-center gap-3 border-t border-white/5 mt-2 pt-4">
                                <Shield size={14} /> Admin Control
                              </Link>
                            )}
                            {profile?.roles.includes('chief_manager') && (
                              <Link to={`/chief-manager/${lang || 'eng'}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-purple-500 hover:bg-purple-500/10 flex items-center gap-3">
                                <Target size={14} /> Strategic Hub
                              </Link>
                            )}
                            {profile?.roles.includes('manager') && (
                              <Link to={`/manager/${lang || 'eng'}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-[#1d9e75] hover:bg-[#1d9e75]/10 flex items-center gap-3">
                                <LayoutDashboard size={14} /> Ops Manager
                              </Link>
                            )}
                            
                            <div className="h-[1px] bg-white/5 my-2 mx-6" />
                            <button 
                              onClick={() => { 
                                auth.signOut(); 
                                localStorage.removeItem('rg_dev_user');
                                window.location.href = `/${lang || 'eng'}`;
                                setIsUserMenuOpen(false); 
                              }} 
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
                <div className="flex items-center gap-6">
                  <Link 
                    to={`/aca/${lang || 'eng'}/login`} 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    to={`/aca/${lang || 'eng'}/login`} 
                    className="criativo-btn !px-8 !py-3 !text-[10px] shadow-xl shadow-primary/20"
                  >
                    {t('join_ecosystem')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative w-full max-w-sm h-full bg-[#0a0a0a] border-r border-white/10 flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-10 ${modeBg} rounded-xl flex items-center justify-center text-bg-dark shadow-lg`}><span className="text-lg font-black italic">RG</span></div>
                  <span className="text-lg font-black tracking-tighter uppercase text-white">Red Griffin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/40 hover:text-white"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Navigation</p>
                  <div className="grid gap-2">
                    <Link to={`/aca/${lang || 'eng'}`} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isAcademy ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-white/60'}`}><GraduationCap size={20} /><span className="text-xs font-black uppercase tracking-widest">{t('academy')}</span></Link>
                    <Link to={`/studio/${lang || 'eng'}`} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isStudio ? 'bg-primary-hover/10 border-primary-hover/20 text-primary-hover' : 'bg-white/5 border-white/5 text-white/60'}`}><Briefcase size={20} /><span className="text-xs font-black uppercase tracking-widest">{t('studio')}</span></Link>
                    <Link to={`${modePrefix}/${lang || 'eng'}/community`} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isCommunity ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-white/60'}`}><Users size={20} /><span className="text-xs font-black uppercase tracking-widest">{t('community')}</span></Link>
                  </div>
                </div>
                {!user && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Account</p>
                    <div className="grid gap-3">
                      <Link to={`/aca/${lang || 'eng'}/login`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white">{t('login')}</Link>
                      <Link to={`/aca/${lang || 'eng'}/login`} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center justify-center p-4 ${modeBg} text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl ${modeShadow}`}>{t('join_ecosystem')}</Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 text-white/60"><Globe size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{currentLang.name}</span></div>
                  <ChevronRight size={16} className="text-white/20" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {(isAcademy || isStudio || isCommunity) && (
            <div className="hidden md:block relative shrink-0 overflow-visible">
              <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="absolute -right-4 top-10 z-[150] size-9 rounded-full border-2 border-primary/40 bg-[#0a0a0a] flex items-center justify-center hover:scale-110 hover:border-primary transition-all shadow-[0_0_30px_rgba(0,0,0,0.9)] group">
                {isSidebarCollapsed ? <ChevronRight size={18} className="text-primary" /> : <ChevronLeft size={18} className="text-primary" />}
              </button>
              <motion.aside initial={false} animate={{ width: isSidebarCollapsed ? 80 : 288 }} className="sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar border-r border-white/5 pr-4">
                <div className="space-y-8">
                  <div className="space-y-2">
                    {sidebarCategories.map((cat) => {
                      const isCatActive = activeCategory.name === cat.name;
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
                                {cat.subcategories.map((sub) => (
                                  <button key={sub.name} onClick={() => handleSetSub(sub)} className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${activeSub.name === sub.name ? (isStudio ? 'text-primary-hover' : 'text-primary') : 'text-white/30 hover:text-white/60'}`}>
                                    {t(sub.name)}<div className={`size-1 rounded-full ${activeSub.name === sub.name ? (isStudio ? 'bg-primary-hover' : 'bg-primary') : 'bg-white/10'}`} />
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
