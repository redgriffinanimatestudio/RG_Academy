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
  Zap
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
    icon: Box,
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
    icon: Play,
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
    icon: Sparkles,
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
    icon: Video,
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
    icon: UserPlus,
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
    icon: Cpu,
    subcategories: [
      {
        name: 'infrastructure',
        topics: ['Render Farm Access', 'Pipeline Tools', 'Asset Management', 'Collaboration Hub']
      }
    ]
  }
];

const COMMUNITY_CATEGORIES = [
  {
    name: 'discussions',
    icon: MessageSquare,
    subcategories: [
      {
        name: 'general_chat',
        topics: ['Industry News', 'Showreel Feedback', 'Job Postings', 'Technical Support']
      }
    ]
  },
  {
    name: 'showcase',
    icon: Sparkles,
    subcategories: [
      {
        name: 'art_gallery',
        topics: ['Character Art', 'Environment Design', 'Animation Reels', 'VFX Breakdowns']
      }
    ]
  },
  {
    name: 'groups',
    icon: Users,
    subcategories: [
      {
        name: 'interest_groups',
        topics: ['Unreal Engine Users', 'Blender Enthusiasts', 'Houdini Artists', 'Concept Art Hub']
      }
    ]
  }
];

import { useAuth } from '../context/AuthContext';

const DASHBOARD_MENUS: Record<string, any[]> = {
  student: [
    {
      name: 'learning_center',
      icon: GraduationCap,
      subcategories: [
        { name: 'my_education', topics: ['Active Courses', 'Completed', 'Certificates', 'Wishlist'] },
        { name: 'schedule', topics: ['Live Sessions', 'Deadlines', 'Reminders'] }
      ]
    },
    {
      name: 'finances',
      icon: Zap,
      subcategories: [
        { name: 'billing', topics: ['Purchase History', 'Payment Methods', 'Invoices'] }
      ]
    }
  ],
  lecturer: [
    {
      name: 'workshop_mgmt',
      icon: Video,
      subcategories: [
        { name: 'content', topics: ['My Workshops', 'Drafts', 'Reviews', 'Create New'] },
        { name: 'students', topics: ['Enrollments', 'Assignments', 'Q&A Support'] }
      ]
    },
    {
      name: 'lecturer_analytics',
      icon: Zap,
      subcategories: [
        { name: 'earnings', topics: ['Payout History', 'Course Performance', 'Tax Settings'] }
      ]
    }
  ],
  executor: [
    {
      name: 'pro_hub',
      icon: Briefcase,
      subcategories: [
        { name: 'work', topics: ['Active Contracts', 'Invitations', 'Job Board'] },
        { name: 'portfolio', topics: ['Visibility', 'Skills & Bio', 'Projects List'] }
      ]
    },
    {
      name: 'executor_finance',
      icon: Users,
      subcategories: [
        { name: 'earnings', topics: ['Wallet', 'Withdrawals', 'Invoices'] }
      ]
    }
  ],
  client: [
    {
      name: 'client_center',
      icon: Box,
      subcategories: [
        { name: 'management', topics: ['My Projects', 'Post Job', 'Active Talent'] },
        { name: 'talents', topics: ['Saved Experts', 'Interviews', 'Messages'] }
      ]
    },
    {
      name: 'client_operations',
      icon: Settings,
      subcategories: [
        { name: 'billing', topics: ['Deposits', 'Payments', 'Reporting'] }
      ]
    }
  ],
  admin: [
    {
      name: 'system_mgmt',
      icon: Shield,
      subcategories: [
        { name: 'users', topics: ['User List', 'Roles & Permissions', 'Banned Users'] },
        { name: 'content', topics: ['Courses Review', 'Studio Moderation', 'Reports'] }
      ]
    },
    {
      name: 'infrastructure',
      icon: Cpu,
      subcategories: [
        { name: 'server', topics: ['Logs', 'Sync Status', 'Backups'] }
      ]
    }
  ]
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
  const [activeMegaMenu, setActiveMegaMenu] = useState<'academy' | 'studio' | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [isMobileAcademyOpen, setIsMobileAcademyOpen] = useState(false);
  const [isMobileStudioOpen, setIsMobileStudioOpen] = useState(false);
  
  const [activeAcademyCategory, setActiveAcademyCategory] = useState(ACADEMY_CATEGORIES[0]);
  const [activeAcademySub, setActiveAcademySub] = useState(ACADEMY_CATEGORIES[0].subcategories[0]);
  
  const [activeStudioCategory, setActiveStudioCategory] = useState(STUDIO_CATEGORIES[0]);
  const [activeStudioSub, setActiveStudioSub] = useState(STUDIO_CATEGORIES[0].subcategories[0]);

  const [activeCommunityCategory, setActiveCommunityCategory] = useState(COMMUNITY_CATEGORIES[0]);
  const [activeCommunitySub, setActiveCommunitySub] = useState(COMMUNITY_CATEGORIES[0].subcategories[0]);

  const [showBanner, setShowBanner] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync sidebar state with URL
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const categories = path.includes('/community') ? COMMUNITY_CATEGORIES : (path.includes('/studio') ? STUDIO_CATEGORIES : ACADEMY_CATEGORIES);
    
    for (const cat of categories) {
      for (const sub of cat.subcategories) {
        if (sub.topics.some(t => path.includes(t.toLowerCase().replace(/ /g, '-')))) {
          if (path.includes('/community')) {
            setActiveCommunityCategory(cat);
            setActiveCommunitySub(sub);
          } else if (path.includes('/studio')) {
            setActiveStudioCategory(cat);
            setActiveStudioSub(sub);
          } else {
            setActiveAcademyCategory(cat);
            setActiveAcademySub(sub);
          }
          return;
        }
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      const unsubscribe = notificationService.subscribeToNotifications(user.uid, (newNotifications) => {
        setNotifications(newNotifications);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Robust Path Detection
  const path = location.pathname.toLowerCase();
  const isDashboard = path.includes('/dashboard');
  const isCommunity = (path.includes('/community') || path.includes('/messages') || path.includes('/contracts')) && !isDashboard;
  const isStudio = path.includes('/studio/') && !isDashboard;
  const isAcademy = (path.includes('/aca/') || path.includes('/learn/')) && !isCommunity && !isDashboard;
  
  // Choose correct categories based on mode and role
  let sidebarCategories = isCommunity ? COMMUNITY_CATEGORIES : (isStudio ? STUDIO_CATEGORIES : ACADEMY_CATEGORIES);
  
  if (isDashboard && activeRole && DASHBOARD_MENUS[activeRole]) {
    sidebarCategories = DASHBOARD_MENUS[activeRole];
  } else if (isDashboard && profile && adminService.isAdmin(profile.roles) && !activeRole) {
    sidebarCategories = DASHBOARD_MENUS.admin;
  }
  
  // Determine which state to use
  const [activeDashboardCatIdx, setActiveDashboardCatIdx] = useState(0);
  const [activeDashboardSubIdx, setActiveDashboardSubIdx] = useState(0);

  // Reset indices when role changes
  useEffect(() => {
    if (isDashboard) {
      setActiveDashboardCatIdx(0);
      setActiveDashboardSubIdx(0);
    }
  }, [activeRole, isDashboard]);

  const activeCategory = isDashboard 
    ? (sidebarCategories[activeDashboardCatIdx] || sidebarCategories[0]) 
    : (isCommunity ? activeCommunityCategory : (isStudio ? activeStudioCategory : activeAcademyCategory));

  const activeSub = isDashboard 
    ? (activeCategory?.subcategories?.[activeDashboardSubIdx] || activeCategory?.subcategories?.[0] || { name: '', topics: [] }) 
    : (isCommunity ? activeCommunitySub : (isStudio ? activeStudioSub : activeAcademySub));

  const handleSetCategory = (cat: any) => {
    if (isDashboard) {
      const idx = sidebarCategories.indexOf(cat);
      setActiveDashboardCatIdx(idx !== -1 ? idx : 0);
      setActiveDashboardSubIdx(0);
    } else if (isCommunity) {
      setActiveCommunityCategory(cat);
      setActiveCommunitySub(cat.subcategories[0]);
    } else if (isStudio) {
      setActiveStudioCategory(cat);
      setActiveStudioSub(cat.subcategories[0]);
    } else {
      setActiveAcademyCategory(cat);
      setActiveAcademySub(cat.subcategories[0]);
    }
  };

  const handleSetSub = (sub: any) => {
    if (isDashboard) {
      const idx = activeCategory.subcategories.indexOf(sub);
      setActiveDashboardSubIdx(idx !== -1 ? idx : 0);
    } else if (isCommunity) {
      setActiveCommunitySub(sub);
    } else if (isStudio) {
      setActiveStudioSub(sub);
    } else {
      setActiveAcademySub(sub);
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === (lang || 'eng')) || LANGUAGES[0];

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

  const modePrefix = isStudio ? '/studio' : '/aca';
  const navClass = isDashboard ? 'bg-zinc-900/80 border-white/5' : (isStudio ? 'bg-bg-dark/80 border-primary/20' : 'bg-black/80 border-white/5');
  const cardClass = isDashboard ? 'bg-zinc-900 border-white/10' : (isStudio ? 'bg-bg-card border-primary/10' : 'bg-white/[0.03] border-white/5');
  
  // Dynamic Theme Colors
  const themeClass = isDashboard ? 'theme-dashboard' : (isStudio ? 'theme-studio' : 'theme-academy');
  const modeColor = isDashboard ? (activeRole === 'admin' ? 'text-red-500' : 'text-primary') : (isCommunity ? 'text-primary' : (isStudio ? 'text-primary-hover' : 'text-primary'));
  const modeBg = isDashboard ? (activeRole === 'admin' ? 'bg-red-500' : 'bg-primary') : (isCommunity ? 'bg-primary' : (isStudio ? 'bg-primary-hover' : 'bg-primary'));
  const modeShadow = isDashboard ? (activeRole === 'admin' ? 'shadow-red-500/20' : 'shadow-primary/20') : (isCommunity ? 'shadow-primary/20' : (isStudio ? 'shadow-primary-hover/20' : 'shadow-primary/20'));

  const navItems = isDashboard ? [
    { icon: LayoutDashboard, label: t('overview', 'Overview'), path: `/aca/${lang || 'eng'}/dashboard` },
    ...(activeRole === 'student' ? [
      { icon: GraduationCap, label: t('my_courses', 'My Courses'), path: '#' },
      { icon: Zap, label: t('achievements', 'Achievements'), path: '#' },
    ] : []),
    ...(activeRole === 'lecturer' ? [
      { icon: Video, label: t('my_workshops', 'My Workshops'), path: '#' },
      { icon: Users, label: t('student_list', 'Students'), path: '#' },
    ] : []),
    ...(activeRole === 'executor' ? [
      { icon: Briefcase, label: t('my_jobs', 'My Jobs'), path: '#' },
      { icon: Sparkles, label: t('portfolio', 'Portfolio'), path: '#' },
    ] : []),
    ...(activeRole === 'client' ? [
      { icon: Box, label: t('my_projects', 'My Projects'), path: '#' },
      { icon: UserPlus, label: t('hire_experts', 'Hire Experts'), path: '#' },
    ] : []),
    ...(activeRole === 'admin' ? [
      { icon: Shield, label: t('admin_console', 'Admin Console'), path: `/admin/${lang || 'eng'}` },
      { icon: Cpu, label: t('system_logs', 'System Logs'), path: '#' },
    ] : []),
    { icon: MessageSquare, label: t('messages'), path: `${modePrefix}/${lang || 'eng'}/messages` },
  ] : [
    { icon: GraduationCap, label: t('workshops'), path: `/aca/${lang || 'eng'}` },
    { icon: Briefcase, label: t('studio_collab'), path: `/studio/${lang || 'eng'}` },
    { icon: Users, label: t('community'), path: `${modePrefix}/${lang || 'eng'}/community` },
    { icon: MessageSquare, label: t('messages'), path: `${modePrefix}/${lang || 'eng'}/messages` },
  ];

  if (profile && adminService.isAdmin(profile.roles)) {
    navItems.push({ icon: Shield, label: 'Admin Console', path: `/admin/${lang || 'eng'}` });
  }

  if (authLoading) {
    return (
      <div className={`min-h-screen font-sans text-white flex items-center justify-center bg-[#050505]`}>
        <div className="flex flex-col items-center gap-6">
          <div className="relative size-20">
            <div className={`absolute inset-0 rounded-3xl border-4 border-primary/20 animate-pulse`} />
            <div className={`absolute inset-0 rounded-3xl border-t-4 border-primary animate-spin`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black italic tracking-tighter text-white">RG</span>
            </div>
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
      {/* Top Banner */}
      {showBanner && (
        <div className={`${modeBg} text-bg-dark py-2 px-4 relative text-center text-[10px] font-black uppercase tracking-widest z-[60]`}>
          <span>{isStudio ? t('studio_collab') : t('academy_workshops')}: {isStudio ? t('studio_desc') : t('master_cg')}</span>
          <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80"><X size={14} /></button>
        </div>
      )}

      {/* --- DESKTOP TOP NAV --- */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${navClass}`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-2 bg-white/5 rounded-xl transition-colors ${modeColor}`}
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
                  className={`absolute inset-y-1 rounded-full ${modeBg}`}
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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute left-0 top-full w-[1100px] shadow-2xl flex z-50 min-h-[500px] rounded-b-[40px] overflow-hidden border ${cardClass}`}>
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
                      <div className="w-[280px] py-10 px-10">
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
                <Link to={`/studio/${lang || 'eng'}`} className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${isStudio ? 'text-primary-hover' : 'text-white/60 hover:text-white'}`}>
                  {t('studio')} <ChevronDown size={12} className={`transition-transform ${activeMegaMenu === 'studio' ? 'rotate-180' : ''}`} />
                </Link>
                <AnimatePresence>
                  {activeMegaMenu === 'studio' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute left-0 top-full w-[1100px] shadow-2xl flex z-50 min-h-[500px] rounded-b-[40px] overflow-hidden border ${cardClass}`}>
                      <div className="w-[220px] border-r border-white/5 py-8 bg-black/40">
                        <div className="px-8 mb-6"><h3 className="text-[9px] font-black text-primary-hover uppercase tracking-[0.4em]">{t('services')}</h3></div>
                        {STUDIO_CATEGORIES.map((cat) => (
                          <button key={cat.name} onMouseEnter={() => { setActiveStudioCategory(cat); setActiveStudioSub(cat.subcategories[0]); }} className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${activeStudioCategory.name === cat.name ? 'bg-primary-hover text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                            {t(cat.name)} <ChevronRight size={12} className={`transition-transform ${activeStudioCategory.name === cat.name ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="w-[240px] border-r border-white/5 py-8 bg-white/[0.01]">
                        <div className="px-8 mb-6"><h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{t('solutions')}</h3></div>
                        {activeStudioCategory.subcategories.map((sub) => (
                          <button key={sub.name} onMouseEnter={() => setActiveStudioSub(sub)} className={`w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all group ${activeStudioSub.name === sub.name ? 'text-primary-hover bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                            {t(sub.name)} <ChevronRight size={12} className={`transition-transform ${activeStudioSub.name === sub.name ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="w-[280px] py-10 px-10">
                        <div className="mb-8"><h3 className="text-[9px] font-black text-primary-hover uppercase tracking-[0.4em] mb-6">{t('studio_offerings')}</h3>
                          <div className="grid grid-cols-1 gap-y-3">
                            {activeStudioSub.topics.map((topic) => (
                              <Link key={topic} to={`/studio/${lang || 'eng'}/service/${topic.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-white/40 hover:text-primary-hover transition-all flex items-center gap-3 group/topic">
                                <div className="w-1 h-1 bg-primary-hover rounded-full opacity-0 group-hover/topic:opacity-100 transition-all" />{topic}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 bg-black/60 p-8 border-l border-white/5 flex flex-col justify-between">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group/feat">
                          <img src="https://picsum.photos/seed/studio/600/400" alt="" className="w-full h-full object-cover group-hover:feat:scale-110 transition-transform duration-700" />
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
                  className={`p-2 transition-colors flex items-center gap-2 font-black text-[10px] uppercase ${modeColor}`}
                >
                  <Globe size={18} />
                  <span>{currentLang.code}</span>
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
                  <button className="p-2 text-white/40 hover:text-primary transition-colors relative">
                    <Bell size={18} />
                    {unreadCount > 0 && <span className={`absolute top-2 right-2 size-2 rounded-full border-2 ${isStudio ? 'bg-primary-hover border-[#1e1e24]' : 'bg-primary border-[#050505]'}`} />}
                  </button>
                  <Link to={`${modePrefix}/${lang || 'eng'}/messages`} className="p-2 text-white/40 hover:text-primary transition-colors">
                    <MessageSquare size={18} />
                  </Link>
                  
                  <div className="h-6 w-[1px] bg-white/5 mx-1 hidden sm:block" />

                  <div className="relative">
                    <button 
                      className="flex items-center gap-3 p-1 pr-3 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 transition-all group"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      <div className="size-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/40 transition-all">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-[10px] font-black ${modeBg} text-bg-dark uppercase`}>
                            {user.displayName?.substring(0, 2) || 'RG'}
                          </div>
                        )}
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-[10px] font-black text-white truncate max-w-[80px] leading-none uppercase">{user.displayName?.split(' ')[0] || 'User'}</span>
                        <span className={`text-[7px] font-bold uppercase tracking-widest ${modeColor} leading-none mt-1`}>{activeRole || 'Member'}</span>
                      </div>
                      <ChevronDown size={12} className={`text-white/20 group-hover:text-primary transition-all ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className={`absolute right-0 mt-4 w-64 border rounded-2xl shadow-2xl py-2 z-50 ${cardClass}`}>
                          <div className="px-6 py-4 border-b border-white/5">
                            <p className="text-xs font-black text-white truncate">{user.displayName || 'User'}</p>
                            <p className="text-[9px] text-white/40 truncate font-bold uppercase mt-1">{user.email}</p>
                          </div>
                          
                          {/* Role Switcher in Menu */}
                          {profile && profile.roles.length > 1 && (
                            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Active Role</p>
                              <div className="flex flex-wrap gap-1">
                                {profile.roles.map(role => (
                                  <button 
                                    key={role}
                                    onClick={() => setActiveRole(role)}
                                    className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${activeRole === role ? (isStudio ? 'bg-primary-hover text-white' : 'bg-primary text-bg-dark') : 'bg-white/5 text-white/40 hover:text-white'}`}
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="py-2">
                            <Link to={`${modePrefix}/${lang || 'eng'}/profile/${user.uid}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3">
                              <User size={14} /> {t('my_profile')}
                            </Link>
                            <Link to={`${modePrefix}/${lang || 'eng'}/dashboard`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3">
                              <LayoutDashboard size={14} /> {t('my_dashboard')}
                            </Link>
                            {profile && adminService.isAdmin(profile.roles) && (
                              <Link to={`/admin/${lang || 'eng'}`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-3">
                                <Shield size={14} /> Admin Panel
                              </Link>
                            )}
                            <div className="h-[1px] bg-white/5 my-2 mx-6" />
                            <button onClick={() => { auth.signOut(); setIsUserMenuOpen(false); }} className="w-full text-left px-6 py-4 text-[10px] font-black uppercase text-primary hover:bg-primary/10 transition-all flex items-center gap-2">
                              <LogOut size={14} /> {t('logout')}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button 
                    className="flex items-center gap-3 p-1 pr-3 rounded-xl border border-white/10 bg-white/5 hover:border-primary/40 transition-all group"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="size-8 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-all">
                      <User size={18} />
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-[10px] font-black text-white leading-none uppercase">{t('guest', 'Guest')}</span>
                      <span className={`text-[7px] font-bold uppercase tracking-widest ${modeColor} leading-none mt-1`}>{t('account', 'Account')}</span>
                    </div>
                    <ChevronDown size={12} className={`text-white/20 group-hover:text-primary transition-all ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className={`absolute right-0 mt-4 w-56 border rounded-2xl shadow-2xl py-2 z-50 ${cardClass}`}>
                        <div className="px-6 py-3 border-b border-white/5">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{t('welcome', 'Welcome')}</p>
                        </div>
                        <div className="py-2">
                          <Link to={`${modePrefix}/${lang || 'eng'}/login`} onClick={() => setIsUserMenuOpen(false)} className="block px-6 py-4 text-[10px] font-black uppercase text-white/60 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3">
                            <LogIn size={14} /> {t('login')}
                          </Link>
                          <div className="px-4 py-2">
                            <Link to={`${modePrefix}/${lang || 'eng'}/login`} onClick={() => setIsUserMenuOpen(false)} className={`block w-full text-center py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${modeBg} ${modeShadow} text-bg-dark`}>
                              {t('join_ecosystem')}
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR (Drawer) --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[100] border-r transition-all duration-300 ease-in-out flex flex-col w-80 lg:hidden ${cardClass}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 shrink-0 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className={`size-10 ${modeBg} rounded-xl flex items-center justify-center text-bg-dark shadow-lg shadow-black/20`}><span className="text-xl font-black italic">RG</span></div>
            <div className="flex flex-col"><span className="text-base font-black tracking-tighter uppercase">Red Griffin</span><span className={`text-[8px] font-bold uppercase ${modeColor}`}>Ecosystem</span></div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/20 hover:text-white bg-white/5 rounded-xl"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 no-scrollbar">
          {/* Mobile Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 mx-2">
            <Link to={`/aca/${lang || 'eng'}`} onClick={() => setIsMobileMenuOpen(false)} className={`text-center py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${isAcademy ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40'}`}>{t('academy')}</Link>
            <Link to={`/studio/${lang || 'eng'}`} onClick={() => setIsMobileMenuOpen(false)} className={`text-center py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${isStudio ? 'bg-primary-hover text-white shadow-lg shadow-primary-hover/20' : 'text-white/40'}`}>{t('studio')}</Link>
          </div>

          <div className="space-y-4">
            <div className={`flex items-center gap-3 px-4 ${modeColor}`}>
              <Filter size={14} className="opacity-40" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">{t('categories')}</h3>
            </div>
            
            <div className="space-y-2">
              {sidebarCategories.map((cat) => {
                const isCatActive = activeCategory.name === cat.name;
                const Icon = cat.icon;
                return (
                  <div key={cat.name} className="space-y-1">
                    <button 
                      onClick={() => handleSetCategory(cat)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group
                        ${isCatActive 
                          ? (isStudio ? 'bg-primary-hover/10 border-primary-hover/20 text-white' : 'bg-primary/10 border-primary/20 text-white') 
                          : 'bg-white/[0.02] border-white/5 text-white/40'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon size={18} className={isCatActive ? modeColor : 'opacity-40'} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{t(cat.name)}</span>
                      </div>
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-300 ${isCatActive ? 'rotate-180 opacity-100' : 'opacity-20'}`} 
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isCatActive && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden ml-4 pl-4 border-l border-white/5 space-y-1 mt-1"
                        >
                          {cat.subcategories.map((sub) => {
                            const isSubActive = activeSub.name === sub.name;
                            return (
                              <div key={sub.name} className="space-y-1">
                                <button
                                  onClick={() => handleSetSub(sub)}
                                  className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between
                                    ${isSubActive ? (isStudio ? 'text-primary-hover bg-white/5' : 'text-primary bg-white/5') : 'text-white/30'}`}
                                >
                                  {t(sub.name)}
                                  <div className={`size-1.5 rounded-full ${isSubActive ? (isStudio ? 'bg-primary-hover' : 'bg-primary') : 'bg-white/10'}`} />
                                </button>
                                
                                <AnimatePresence>
                                  {isSubActive && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden space-y-1 ml-2"
                                    >
                                      {sub.topics.map((topic) => {
                                        const topicSlug = topic.toLowerCase().replace(/ /g, '-');
                                        const isActiveTopic = location.pathname.includes(topicSlug);
                                        return (
                                          <Link
                                            key={topic}
                                            to={`${isAcademy ? '/aca' : (isStudio ? '/studio' : '/community')}/${lang || 'eng'}/${isAcademy ? 'topic' : (isStudio ? 'service' : 'group')}/${topicSlug}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all border
                                              ${isActiveTopic 
                                                ? (isStudio ? 'bg-primary-hover/5 border-primary-hover/20 text-primary-hover' : 'bg-primary/5 border-primary/20 text-primary') 
                                                : 'text-white/20 border-transparent'
                                              }`}
                                          >
                                            <span className="opacity-40 mr-2">•</span>
                                            {topic}
                                          </Link>
                                        );
                                      })}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="pt-6 border-t border-white/5 space-y-2 px-2">
            {[
              { icon: MessageSquare, label: t('messages'), path: `${modePrefix}/${lang || 'eng'}/messages` },
              { icon: Settings, label: t('contracts'), path: `${modePrefix}/${lang || 'eng'}/contracts` },
              { icon: User, label: t('my_profile'), path: `${modePrefix}/${lang || 'eng'}/dashboard` },
            ].map((item, idx) => (
              <Link 
                key={idx} 
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-white/40 hover:text-white"
              >
                <item.icon size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <button 
            onClick={() => { auth.signOut(); setIsMobileMenuOpen(false); }}
            className="w-full py-4 rounded-2xl bg-white/5 text-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border border-primary/10 hover:bg-primary/10 transition-all"
          >
            <LogOut size={16} /> {t('logout')}
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" />
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop/Tablet Left Sidebar */}
          {(isAcademy || isStudio || isCommunity) && (
            <div className="hidden md:block relative shrink-0 overflow-visible">
              {/* Floating Collapse Toggle */}
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`absolute -right-4 top-10 z-[150] size-9 rounded-full border-2 border-primary/40 bg-[#0a0a0a] flex items-center justify-center hover:scale-110 hover:border-primary transition-all shadow-[0_0_30px_rgba(0,0,0,0.9)] group animate-pulse-border`}
                title={isSidebarCollapsed ? "Expand" : "Collapse"}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight size={18} className="text-primary group-hover:scale-110 transition-transform" />
                ) : (
                  <ChevronLeft size={18} className="text-primary group-hover:scale-110 transition-transform" />
                )}
              </button>

              <motion.aside 
                initial={false}
                animate={{ width: isSidebarCollapsed ? 80 : 288 }}
                className="sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar border-r border-white/5 pr-4"
              >
                <div className="space-y-8">
                  <div className={`flex items-center justify-between px-2 transition-all ${isSidebarCollapsed ? 'flex-col gap-4' : ''} ${modeColor}`}>
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                        <Filter size={14} />
                      </div>
                      {!isSidebarCollapsed && (
                        <motion.h3 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] font-black uppercase tracking-[0.4em]"
                        >
                          {t('categories')}
                        </motion.h3>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {sidebarCategories.map((cat) => {
                      const isCatActive = activeCategory.name === cat.name;
                      const Icon = cat.icon;
                      return (
                        <div key={cat.name} className="space-y-1">
                          <button 
                            onClick={() => {
                              if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                              handleSetCategory(cat);
                            }}
                            title={t(cat.name)}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center group
                              ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}
                              ${isCatActive 
                                ? (isStudio ? 'bg-primary-hover/10 border-primary-hover/20 text-white' : 'bg-primary/10 border-primary/20 text-white') 
                                : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={16} className={isCatActive ? modeColor : 'opacity-40'} />
                              {!isSidebarCollapsed && (
                                <span className="text-[10px] font-black uppercase tracking-widest">{t(cat.name)}</span>
                              )}
                            </div>
                            {!isSidebarCollapsed && (
                              <ChevronDown 
                                size={12} 
                                className={`transition-transform duration-300 ${isCatActive ? 'rotate-180 opacity-100' : 'opacity-20 group-hover:opacity-100'}`} 
                              />
                            )}
                          </button>

                          <AnimatePresence initial={false}>
                            {isCatActive && !isSidebarCollapsed && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "circOut" }}
                                className="overflow-hidden ml-3 pl-3 border-l border-white/5 space-y-1 mt-1"
                              >
                                {cat.subcategories.map((sub) => {
                                  const isSubActive = activeSub.name === sub.name;
                                  return (
                                    <div key={sub.name} className="space-y-1">
                                      <button
                                        onClick={() => handleSetSub(sub)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between group
                                          ${isSubActive ? (isStudio ? 'text-primary-hover' : 'text-primary') : 'text-white/30 hover:text-white/60'}`}
                                      >
                                        {t(sub.name)}
                                        <div className={`size-1 rounded-full transition-all ${isSubActive ? (isStudio ? 'bg-primary-hover' : 'bg-primary') : 'bg-white/10'}`} />
                                      </button>

                                      <AnimatePresence>
                                        {isSubActive && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden space-y-1 ml-2"
                                          >
                                            {sub.topics.map((topic) => {
                                              const topicSlug = topic.toLowerCase().replace(/ /g, '-');
                                              const isActiveTopic = location.pathname.includes(topicSlug);
                                              return (
                                                <Link
                                                  key={topic}
                                                  to={`${isAcademy ? '/aca' : (isStudio ? '/studio' : '/community')}/${lang || 'eng'}/${isAcademy ? 'topic' : (isStudio ? 'service' : 'group')}/${topicSlug}`}
                                                  className={`block px-3 py-1.5 rounded-md text-[9px] font-bold transition-all border
                                                    ${isActiveTopic 
                                                      ? (isStudio ? 'bg-primary-hover/5 border-primary-hover/20 text-primary-hover' : 'bg-primary/5 border-primary/20 text-primary') 
                                                      : 'text-white/20 border-transparent hover:text-white/50 hover:bg-white/[0.02]'
                                                    }`}
                                                >
                                                  <span className="opacity-40 mr-2">•</span>
                                                  {topic}
                                                </Link>
                                              );
                                            })}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                  {/* Additional Sidebar Info / Help */}
                  {!isSidebarCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="pt-8 border-t border-white/5 space-y-4"
                    >
                      {/* Subscription Card for Dashboard */}
                      {isDashboard && activeRole !== 'admin' && (
                        <div className="p-5 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 size-20 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-all" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Pro Ecosystem</h4>
                          <p className="text-[9px] text-white/40 font-bold leading-relaxed mb-4">Unlock advanced tools and higher visibility.</p>
                          <button className="w-full py-2.5 bg-primary text-bg-dark text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
                            Upgrade Now
                          </button>
                        </div>
                      )}

                      <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{t('quick_tip')}</p>
                        <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                          {isDashboard ? "Switch roles in the top-right menu to manage different aspects of your profile." : (isAcademy ? t('mentor_desc').split('.')[0] : t('studio_pro_desc').split('.')[0])}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.aside>
            </div>
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

      <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Section: Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
            {/* Column 1: Academy */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('academy')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to={`/aca/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('workshops')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('mentorship')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('business')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('get_app')}</Link></li>
              </ul>
            </div>

            {/* Column 2: Studio */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-hover">{t('studio')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to={`/studio/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('hire_talent')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('production')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('portfolio')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('case_studies')}</Link></li>
              </ul>
            </div>

            {/* Column 3: Community */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{t('community')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to="#" className="hover:text-white transition-colors">{t('blog')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('help_center')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('affiliate')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('investors')}</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal & More */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{t('legal')}</h4>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                <li><Link to="#" className="hover:text-white transition-colors">{t('terms')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('cookie_settings')}</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">{t('sitemap')}</Link></li>
              </ul>
            </div>

            {/* Column 5: Language & Social */}
            <div className="space-y-8 lg:col-span-1 col-span-full">
              <div className="relative group">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={16} className={modeColor} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{currentLang.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                </button>
                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      className={`absolute bottom-full left-0 mb-4 w-full border rounded-2xl shadow-2xl py-2 z-50 overflow-hidden ${cardClass}`}
                    >
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => changeLanguage(l.code)} className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase flex items-center justify-between transition-all ${currentLang.code === l.code ? 'text-primary bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                          {l.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'LinkedIn', 'ArtStation'].map((social) => (
                  <button key={social} className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-primary/40 transition-all text-white/20 hover:text-white group" title={social}>
                    <Zap size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section: Logo & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
            <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-4 group">
              <div className={`size-12 ${modeBg} rounded-2xl flex items-center justify-center text-bg-dark shadow-xl transition-transform group-hover:scale-110`}>
                <span className="text-xl font-black italic tracking-tighter">RG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-white uppercase leading-none">Red Griffin</span>
                <span className={`text-[8px] font-bold tracking-[0.4em] ${modeColor} uppercase mt-1`}>{t('creative_ecosystem')}</span>
              </div>
            </Link>
            
            <div className="flex flex-col md:items-end gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                © {new Date().getFullYear()} Red Griffin Creative Ecosystem. {t('all_rights_reserved')}
              </p>
              <div className="flex gap-6 text-[8px] font-black uppercase tracking-widest text-white/10">
                <span className="hover:text-white cursor-pointer transition-colors">v2.4.0 Codename "Phoenix"</span>
                <span className="hover:text-white cursor-pointer transition-colors">Server: Frankfurt-01</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}
