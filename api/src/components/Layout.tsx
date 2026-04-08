import React, { useState, useEffect } from 'react';
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

import { useAuth } from '../context/AuthContext';
import { notificationService, Notification } from '../services/notificationService';
import { useAlert } from './Alert';
import AIAssistant from './AIAssistant';
import ErrorBoundary from './ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { ACADEMIC_TREE, Department, Chair } from '../config/academic';

const LANGUAGES = [
  { code: 'eng', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' }
];

const ACADEMY_CATEGORIES = ACADEMIC_TREE;
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
    { nameKey: 'learning_dashboard', icon: GraduationCap, chairs: [{ nameKey: 'my_progress' }, { nameKey: 'academy_calendar' }] },
    { nameKey: 'student_finance', icon: Zap, chairs: [{ nameKey: 'purchases' }] }
  ],
  lecturer: [
    { nameKey: 'instructor_hub', icon: Video, chairs: [{ nameKey: 'content_mgmt' }, { nameKey: 'student_engagement' }] },
    { nameKey: 'lecturer_wallet', icon: Zap, chairs: [{ nameKey: 'financials' }] }
  ],
  executor: [
    { nameKey: 'pro_workspace', icon: Briefcase, chairs: [{ nameKey: 'job_pipeline' }, { nameKey: 'pro_profile' }] },
    { nameKey: 'business_ops', icon: Users, chairs: [{ nameKey: 'networking' }, { nameKey: 'finances' }] }
  ],
  client: [
    { nameKey: 'client_workspace', icon: Box, chairs: [{ nameKey: 'project_mgmt' }, { nameKey: 'talent_acquisition' }] },
    { nameKey: 'client_billing', icon: Settings, chairs: [{ nameKey: 'finances' }] }
  ],
  admin: [
    { nameKey: 'core_management', icon: Shield, chairs: [{ nameKey: 'dashboard' }] },
    { nameKey: 'user_operations', icon: Users, chairs: [{ nameKey: 'users' }, { nameKey: 'rbac' }, { nameKey: 'profile' }] },
    { nameKey: 'platform_content', icon: Box, chairs: [{ nameKey: 'create' }, { nameKey: 'detail' }] },
    { nameKey: 'communications', icon: MessageSquare, chairs: [{ nameKey: 'chat' }] },
    { nameKey: 'system_health', icon: Cpu, chairs: [{ nameKey: 'settings' }] }
  ],
  chief_manager: [
    { nameKey: 'strategic_hub', icon: Target, chairs: [{ nameKey: 'dashboard' }, { nameKey: 'kpi_metrics' }, { nameKey: 'growth' }] },
    { nameKey: 'team_mgmt', icon: Users, chairs: [{ nameKey: 'staff_list' }, { nameKey: 'performance' }] },
    { nameKey: 'ops_mgmt', icon: Briefcase, chairs: [{ nameKey: 'all_contracts' }, { nameKey: 'legal' }] }
  ],
  manager: [
    { nameKey: 'operational_overview', icon: LayoutDashboard, chairs: [{ nameKey: 'overview' }] },
    { nameKey: 'academy_ops', icon: GraduationCap, chairs: [{ nameKey: 'courses_review' }, { nameKey: 'student_feedback' }] },
    { nameKey: 'studio_ops', icon: Box, chairs: [{ nameKey: 'project_board' }, { nameKey: 'contract_status' }, { nameKey: 'escrow_alerts' }] },
    { nameKey: 'user_management', icon: Users, chairs: [{ nameKey: 'user_list' }, { nameKey: 'role_requests' }] }
  ],
  moderator: [{ nameKey: 'content_moderation', icon: Shield, chairs: [{ nameKey: 'dashboard' }, { nameKey: 'reported_reviews' }, { nameKey: 'flagged_posts' }, { nameKey: 'banned_keywords' }] }],
  hr: [{ nameKey: 'talent_mgmt', icon: Users, chairs: [{ nameKey: 'dashboard' }, { nameKey: 'job_openings' }, { nameKey: 'applications' }, { nameKey: 'interview_schedule' }] }],
  finance: [{ nameKey: 'financial_ops', icon: DollarSign, chairs: [{ nameKey: 'dashboard' }, { nameKey: 'payment_queue' }, { nameKey: 'revenue_share' }, { nameKey: 'tax_compliance' }] }],
  support: [{ nameKey: 'help_desk', icon: LifeBuoy, chairs: [{ nameKey: 'dashboard' }, { nameKey: 'open_tickets' }, { nameKey: 'base_knowledge' }, { nameKey: 'user_search' }] }]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, activeRole, setActiveRole, loading: authLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, role } = useParams();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const path = location.pathname.toLowerCase();
  const isDashboardPage = path.includes('/dashboard') || 
                          ['admin', 'chief-manager', 'manager', 'moderator', 'hr', 'finance', 'support'].some(r => path.includes(`/${r}/`));

  const isProfile = path.includes('/profile/');
  const isCommunity = (path.includes('/community') || path.includes('/messages') || path.includes('/contracts')) && !isDashboardPage && !isProfile;
  const isStudio = path.includes('/studio/') && !isDashboardPage && !isProfile;
  const isAcademy = (path.includes('/aca/') || path.includes('/learn/')) && !isCommunity && !isDashboardPage && !isProfile;

  // Base categories
  const baseCategories = isCommunity ? COMMUNITY_CATEGORIES : (isStudio ? STUDIO_CATEGORIES : ACADEMY_CATEGORIES);

  // Dashboard category (only for logged-in users)
  const dashboardCategory = React.useMemo(() => {
    if (!profile) return null;
    const effectiveRole = activeRole || (profile?.roles.includes('admin') ? 'admin' : profile?.roles[0]);
    if (!effectiveRole || !DASHBOARD_MENUS[effectiveRole]) return null;

    return {
      id: 'my_dashboard',
      nameKey: 'my_dashboard',
      icon: LayoutDashboard,
      isDashboard: true,
      chairs: DASHBOARD_MENUS[effectiveRole]
    };
  }, [profile, activeRole]);

  // Sync activeRole from URL if in professional route
  useEffect(() => {
    if (role) {
      const validRoles = ['admin', 'chief-manager', 'manager', 'moderator', 'hr', 'finance', 'support'];
      if (validRoles.includes(role)) {
        const formattedRole = role.replace('-', '_');
        // Admin or superadmin can always switch to any professional role via URL
        const hasPermission = profile?.roles.includes(formattedRole) || profile?.isAdmin;
        
        if (activeRole !== formattedRole && hasPermission) {
          setActiveRole(formattedRole as any);
        }
      }
    }
  }, [role, profile, activeRole, setActiveRole]);

  // Combined sidebar categories: Flat array of category objects
  const sidebarCategories = React.useMemo(() => {
    const base = ACADEMY_CATEGORIES as any[];
    if (!profile || !dashboardCategory) return base;
    
    // Flatten roles like 'admin' or 'manager' that have multiple core categories
    const dashItems = (dashboardCategory.chairs || []).map((c: any) => ({ 
      ...c, 
      isDashboard: true,
      // Ensure we use the dashboard category icon if category doesn't have one
      icon: c.icon || dashboardCategory.icon 
    }));
    
    return [...dashItems, ...base];
  }, [profile, dashboardCategory]);

  // Sync sidebar state with URL 'view' parameter and activeRole
  const [activeCatName, setActiveCatName] = useState(sidebarCategories?.[0]?.nameKey || sidebarCategories?.[0]?.name);
  const [activeSubName, setActiveSubName] = useState(sidebarCategories?.[0]?.chairs?.[0]?.nameKey || sidebarCategories?.[0]?.subcategories?.[0]?.name);

  // Force reset sidebar state when role changes to avoid "stuck" menus
  useEffect(() => {
    if (isDashboardPage && dashboardCategory && (dashboardCategory.chairs || []).length > 0) {
      const firstCat = dashboardCategory.chairs[0];
      setActiveCatName(firstCat.nameKey || firstCat.name);
      const firstSub = (firstCat.chairs || firstCat.subcategories || [])[0];
      if (firstSub) {
        setActiveSubName(firstSub.nameKey || firstSub.name);
      }
    }
  }, [activeRole, isDashboardPage, dashboardCategory]);

  useEffect(() => {
    if (isDashboardPage && dashboardCategory) {
      const currentView = searchParams.get('view') || 'dashboard';

      let viewFound = false;
      (dashboardCategory.chairs || []).forEach((cat: any) => {
        const sub = (cat.chairs || cat.subcategories || []).find((s: any) =>
          (s.nameKey || s.name).toLowerCase().replace(/ /g, '_') === currentView
        );
        if (sub) {
          setActiveCatName(cat.nameKey || cat.name);
          setActiveSubName(sub.nameKey || sub.name);
          viewFound = true;
        }
      });

      // If view is invalid for this role, reset to first category/subcategory
      if (!viewFound && (dashboardCategory.chairs || []).length > 0) {
        const firstCat = dashboardCategory.chairs[0];
        setActiveCatName(firstCat.nameKey || firstCat.name);
        const firstSub = (firstCat.chairs || firstCat.subcategories || [])[0];
        if (firstSub) {
          setActiveSubName(firstSub.nameKey || firstSub.name);
        }
      }
    } else if (!activeCatName || (sidebarCategories.length > 0 && !sidebarCategories.some(c => (c.nameKey || c.name) === activeCatName))) {
      const firstCat = baseCategories[0] as any;
      setActiveCatName(firstCat?.nameKey || firstCat?.name);
      setActiveSubName(firstCat?.chairs?.[0]?.nameKey || firstCat?.subcategories?.[0]?.name);
    }
  }, [location.search, isDashboardPage, dashboardCategory, baseCategories, activeRole, sidebarCategories]);

  const activeCategory = sidebarCategories.find(c => (c.nameKey || c.name) === activeCatName) || sidebarCategories[0];

  const handleSetCategory = (cat: any) => {
    setActiveCatName(cat.nameKey || cat.name);
    if (!cat.isDashboard) {
      const firstSub = (cat.chairs || cat.subcategories || [])[0];
      setActiveSubName(firstSub?.nameKey || firstSub?.name);
    }
  };

  const handleSetSub = (sub: any, parentCat: any) => {
    const subName = sub.nameKey || sub.name;
    setActiveSubName(subName);
    if (parentCat.isDashboard) {
      const viewSlug = subName.toLowerCase().replace(/ /g, '_');
      navigate(`${location.pathname}?view=${viewSlug}`);
    } else {
      const mode = isStudio ? 'studio' : 'aca';
      navigate(`/${mode}/${lang || 'eng'}/topic/${sub.slug || subName}`);
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

            {/* Desktop Center Links with Mega Menu logic */}
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
                    className={`px-2 py-2 text-[11px] font-black uppercase tracking-widest transition-all relative ${item.active ? (item.id === 'studio' ? 'text-primary-hover' : 'text-primary') : 'text-white/60 hover:text-white'}`}
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
                        className={`absolute left-0 top-full w-screen max-w-[1000px] border rounded-b-3xl shadow-2xl p-8 z-[100] ${cardClass}`}
                      >
                        <div className="grid grid-cols-4 gap-8">
                          <div className="col-span-3 grid grid-cols-3 gap-8">
                            {item.categories.map((cat: any) => {
                              const catNameKey = cat.nameKey || cat.name;
                              const chairsList = cat.chairs || cat.subcategories || [];
                              return (
                                <div key={cat.id || catNameKey} className="space-y-4 group/cat">
                                  <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${item.id === 'studio' ? 'text-primary-hover group-hover/cat:text-white' : 'text-primary group-hover/cat:text-white'}`}>
                                    <cat.icon size={14} /> {t(catNameKey)}
                                  </h4>
                                  <div className="flex flex-col gap-2 border-l border-white/5 pl-4 ml-1.5">
                                    {chairsList.map((chair: any) => (
                                      <button 
                                        key={chair.id || chair.nameKey || chair.name} 
                                        onClick={() => { handleSetSub(chair, cat); setActiveMegaMenu(null); }}
                                        className="text-left text-xs font-bold text-white/40 hover:text-white hover:translate-x-1 transition-all"
                                      >
                                        • {t(chair.nameKey || chair.name)}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* FEATURED CARD */}
                          <div className="col-span-1 border-l border-white/10 pl-8 flex flex-col justify-between">
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Featured Track</h4>
                              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group/card">
                                <img src="/featured_academy_track.png" alt="Featured" className="w-full h-full object-cover transition-transform group-hover/card:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                  <p className="text-[10px] font-bold text-white leading-tight uppercase">Master Professional VFX <br /><span className={modeColor}>Pipeline 2026</span></p>
                                </div>
                              </div>
                              <p className="text-[9px] text-white/40 leading-relaxed uppercase font-medium">Join our most advanced track led by industry veterans from Wētā and ILM.</p>
                            </div>
                            <button className={`w-full py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${isStudio ? 'border-primary-hover/20 bg-primary-hover/10 text-primary-hover hover:bg-primary-hover hover:text-white' : 'border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}>
                              Apply Now
                            </button>
                          </div>
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

              {/* DYNAMIC AUTH BLOCK */}
              {profile ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button className="p-2 text-white/40 hover:text-primary transition-colors relative"><Bell size={18} />{unreadCount > 0 && <span className={`absolute top-2 right-2 size-2 rounded-full border-2 ${isStudio ? 'bg-primary-hover border-[#1e1e24]' : 'bg-primary border-[#050505]'}`} />}</button>
                  <Link to={`${modePrefix}/${lang || 'eng'}/messages`} className="p-2 text-white/40 hover:text-primary transition-colors"><MessageSquare size={18} /></Link>
                  <div className="h-6 w-[1px] bg-white/5 mx-1 hidden sm:block" />
                  <div className="relative">
                    <button className="flex items-center gap-3 p-1 pr-3 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 transition-all group" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                      <div className="size-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/40 transition-all">
                        {profile.photoURL ? (
                          <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-[10px] font-black ${modeBg} text-bg-dark uppercase`}>
                            {profile.displayName?.substring(0, 2) || 'RG'}
                          </div>
                        )}
                      </div>
                      <div className="hidden sm:flex flex-col items-start text-left">
                        <span className="text-[10px] font-black text-white truncate max-w-[80px] leading-none uppercase">
                          {profile.displayName?.split(' ')[0] || 'User'}
                        </span>
                        <span className={`text-[7px] font-bold uppercase tracking-widest ${modeColor} leading-none mt-1`}>
                          {activeRole?.replace('_', ' ') || 'Member'}
                        </span>
                      </div>
                      <ChevronDown size={12} className={`text-white/20 group-hover:text-primary transition-all ${isUserMenuOpen ? 'rotate-180' : ''}`} />
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
                            <Link 
                              to={['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support'].includes(activeRole || '') 
                                ? `/${(activeRole || '').replace('_', '-')}/${lang || 'eng'}` 
                                : `/aca/${lang || 'eng'}/dashboard`
                              } 
                              onClick={() => setIsUserMenuOpen(false)} 
                              className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3"
                            >
                              <LayoutDashboard size={14} /> {t('my_dashboard')}
                            </Link>

                            <div className="px-6 py-2 border-t border-white/5 mt-2">
                              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">Switch identity</p>
                              {(() => {
                                const availableRoles = [...(profile?.roles || [])];
                                if (profile?.isAdmin) {
                                  ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support'].forEach(r => {
                                    const role = r as UserRole;
                                    if (!availableRoles.includes(role)) availableRoles.push(role);
                                  });
                                }
                                return availableRoles.map(r => (
                                  <button
                                    key={r}
                                    onClick={() => {
                                      setActiveRole(r as any);
                                      setIsUserMenuOpen(false);
                                      const targetPath = ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support'].includes(r) 
                                        ? `/${r.replace('_', '-')}/${lang || 'eng'}` 
                                        : `/${isStudio ? 'studio' : 'aca'}/${lang || 'eng'}/dashboard`;
                                      navigate(targetPath);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-2 ${activeRole === r ? (isStudio ? 'text-primary-hover bg-primary-hover/10' : 'text-primary bg-primary/10') : 'text-white/40 hover:bg-white/5'}`}
                                  >
                                    <div className={`size-1.5 rounded-full ${activeRole === r ? (isStudio ? 'bg-primary-hover' : 'bg-primary') : 'bg-white/10'}`} />
                                    {t(r)}
                                  </button>
                                ));
                              })()}
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
                <div className="flex items-center gap-6">
                  <Link to={`/aca/${lang || 'eng'}/login`} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all">{t('login')}</Link>
                  <Link to={`/aca/${lang || 'eng'}/login`} className="criativo-btn !px-8 !py-3 !text-[10px] shadow-xl shadow-primary/20">Присоединиться к системе</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className={`fixed inset-y-0 left-0 w-[300px] z-[101] p-8 lg:hidden flex flex-col border-r ${cardClass}`}>
                <div className="flex items-center justify-between mb-12">
                  <img src="/logo-web.png" alt="" className="h-8 w-auto" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                {/* TEST LINK */}
                <div className="bg-red-500/20 p-4 rounded-xl border border-red-500/40 mb-4 mx-1">
                  <span className="text-[10px] font-black uppercase text-red-500">System Test: API Menu active</span>
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
                  <nav className="space-y-2">
                    {[
                      { id: 'academy', label: 'API_ACADEMY_DEBUG', path: `/aca/${lang || 'eng'}`, icon: GraduationCap, active: path.includes('academy') || path.includes('/aca'), color: 'text-primary' },
                      { id: 'studio', label: 'API_STUDIO_DEBUG', path: `/studio/${lang || 'eng'}`, icon: Box, active: path.includes('studio'), color: 'text-primary-hover' },
                      { id: 'community', label: 'API_COMMUNITY_DEBUG', path: `${modePrefix}/${lang || 'eng'}/community`, icon: Users, active: path.includes('community'), color: 'text-white/40' }
                    ].map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${item.active ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.02]'}`}
                      >
                        <item.icon size={18} className={item.active ? item.color : 'opacity-40'} />
                        <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                  <div className="pt-8 border-t border-white/5 space-y-6">
                    {sidebarCategories.map(cat => (
                      <div key={cat.id || cat.nameKey || cat.name} className="space-y-3">
                        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/60"><cat.icon size={14} className={modeColor} /> {t(cat.nameKey || cat.name)}</div>
                        <div className="grid grid-cols-1 gap-2 pl-6">
                          {cat.chairs.map((chair: any) => (
                            <button key={chair.id || chair.nameKey} onClick={() => { handleSetSub(chair, cat); setIsMobileMenuOpen(false); }} className="text-left text-[10px] font-bold text-white/30 hover:text-white uppercase">• {t(chair.nameKey)}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {!profile ? (
                  <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
                    <Link to={`/aca/${lang || 'eng'}/login`} onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5 rounded-2xl">{t('login')}</Link>
                    <Link to={`/aca/${lang || 'eng'}/login`} onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-[10px] font-black uppercase tracking-widest bg-primary text-bg-dark rounded-2xl shadow-xl shadow-primary/20">Присоединиться к системе</Link>
                  </div>
                ) : (
                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                    <div className={`size-10 rounded-xl ${modeBg} flex items-center justify-center text-bg-dark font-black uppercase`}>{profile.displayName?.substring(0, 2)}</div>
                    <div className="flex flex-col"><span className="text-xs font-black text-white uppercase">{profile.displayName}</span><span className={`text-[8px] font-bold uppercase tracking-widest ${modeColor}`}>{activeRole}</span></div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main className="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 lg:px-8">
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
                      const catName = cat.nameKey || cat.name;
                      const isCatActive = activeCatName === catName;
                      const Icon = cat.icon;
                      return (
                        <div key={cat.id || catName} className="space-y-1">
                          <button onClick={() => { if (isSidebarCollapsed) setIsSidebarCollapsed(false); handleSetCategory(cat); }} className={`w-full text-left p-3 rounded-xl border transition-all flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} ${isCatActive ? (isStudio ? 'bg-primary-hover/10 border-primary-hover/20 text-white' : 'bg-primary/10 border-primary/20 text-white') : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white'}`}>
                            <div className="flex items-center gap-3"><Icon size={16} className={isCatActive ? modeColor : 'opacity-40'} />{!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">{t(catName)}</span>}</div>
                            {!isSidebarCollapsed && <ChevronDown size={12} className={`transition-transform duration-300 ${isCatActive ? 'rotate-180 opacity-100' : 'opacity-20'}`} />}
                          </button>
                          <AnimatePresence initial={false}>
                            {isCatActive && !isSidebarCollapsed && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-3 pl-3 border-l border-white/5 space-y-1 mt-1">
                                {cat.chairs.map((chair: any) => (
                                  <button key={chair.id || chair.nameKey} onClick={() => handleSetSub(chair, cat)} className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${activeSubName === chair.nameKey ? (isStudio ? 'text-primary-hover' : 'text-primary') : 'text-white/30 hover:text-white/60'}`}>
                                    {t(chair.nameKey)}<div className={`size-1 rounded-full ${activeSubName === chair.nameKey ? (isStudio ? 'bg-primary-hover' : 'bg-primary') : 'bg-white/10'}`} />
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
