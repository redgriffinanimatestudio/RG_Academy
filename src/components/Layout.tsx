import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Briefcase, Users, Bell, MessageSquare, LayoutDashboard, Shield, Box, Video, UserPlus, Cpu, Zap, Target, LifeBuoy, DollarSign, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService, Notification } from '../services/notificationService';
import { useTranslation } from 'react-i18next';

// Modular Components
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import MobileMenu from './layout/MobileMenu';
import Footer from './layout/Footer';
import AIAssistant from './AIAssistant';
import ErrorBoundary from './ErrorBoundary';

const LANGUAGES = [
  { code: 'eng', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' }
];

const ACADEMY_CATEGORIES = [
  { name: 'modeling_3d', icon: Box, subcategories: [{ name: 'char_modeling' }, { name: 'env_art' }] },
  { name: 'animation', icon: Video, subcategories: [{ name: 'animation_3d' }, { name: 'animation_2d' }] },
  { name: 'vfx_compositing', icon: Zap, subcategories: [{ name: 'visual_effects' }] }
];

const STUDIO_CATEGORIES = [
  { name: 'prod_services', icon: Video, subcategories: [{ name: 'anim_prod' }, { name: 'vfx_post' }] },
  { name: 'talent_network', icon: UserPlus, subcategories: [{ name: 'creative_talent' }, { name: 'technical_talent' }] },
  { name: 'studio_solutions', icon: Cpu, subcategories: [{ name: 'infrastructure' }] }
];

const COMMUNITY_CATEGORIES = [
  { name: 'discussions', icon: MessageSquare, subcategories: [{ name: 'general_chat' }] },
  { name: 'showcase', icon: Users, subcategories: [{ name: 'art_gallery' }] }
];

const DASHBOARD_MENUS: Record<string, any[]> = {
  student: [{ name: 'learning_dashboard', icon: GraduationCap, subcategories: [{ name: 'my_progress' }] }],
  admin: [{ name: 'core_management', icon: Shield, subcategories: [{ name: 'dashboard' }] }],
  chief_manager: [{ name: 'strategic_hub', icon: Target, subcategories: [{ name: 'overview' }] }],
  manager: [{ name: 'operational_overview', icon: LayoutDashboard, subcategories: [{ name: 'overview' }] }]
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ academy: true, dashboards: true });

  const [showBanner, setShowBanner] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (profile) {
      const unsubscribe = notificationService.subscribeToNotifications(profile.uid, setNotifications);
      return () => unsubscribe();
    }
  }, [profile]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const path = location.pathname.toLowerCase();
  
  const isDashboardPage = path.includes('/dashboard') || path.includes('/admin') || path.includes('/chief-manager') || path.includes('/manager');
  const isProfile = path.includes('/profile/');
  const isStudio = path.includes('/studio/') && !isDashboardPage && !isProfile;
  const isAcademy = (path.includes('/aca/') || path.includes('/learn/')) && !isDashboardPage && !isProfile;
  const isCommunity = path.includes('/community') && !isDashboardPage && !isProfile;

  const modePrefix = isStudio ? '/studio' : '/aca';
  const modeColor = isDashboardPage ? (activeRole === 'admin' ? 'text-red-500' : 'text-primary') : (isStudio ? 'text-primary-hover' : 'text-primary');
  const modeBg = isDashboardPage ? (activeRole === 'admin' ? 'bg-red-500' : 'bg-primary') : (isStudio ? 'bg-primary-hover' : 'bg-primary');

  const dashboardCategory = useMemo(() => {
    if (!profile || !activeRole || !DASHBOARD_MENUS[activeRole]) return null;
    return {
      name: 'dashboards',
      icon: LayoutDashboard,
      isDashboard: true,
      subcategories: DASHBOARD_MENUS[activeRole]
    };
  }, [profile, activeRole]);

  const baseCategories = isCommunity ? COMMUNITY_CATEGORIES : (isStudio ? STUDIO_CATEGORIES : ACADEMY_CATEGORIES);
  const sidebarCategories = useMemo(() => {
    if (!profile) return baseCategories;
    return dashboardCategory ? [dashboardCategory, ...baseCategories] : baseCategories;
  }, [profile, dashboardCategory, baseCategories]);

  const [activeCatName, setActiveCatName] = useState(sidebarCategories[0]?.name);
  const [activeSubName, setActiveSubName] = useState(sidebarCategories[0]?.subcategories[0]?.name);

  const handleSetCategory = (cat: any) => setActiveCatName(cat.name);
  const handleSetSub = (sub: any, parentCat: any) => {
    setActiveSubName(sub.name);
    if (parentCat.isDashboard) navigate(`${location.pathname}?view=${sub.name.toLowerCase()}`);
    else navigate(`${modePrefix}/${lang || 'eng'}/topic/${sub.name}`);
  };

  const mobileSections = useMemo(() => [
    { id: 'academy', label: t('academy'), path: `/aca/${lang || 'eng'}`, icon: GraduationCap, active: isAcademy, categories: ACADEMY_CATEGORIES, color: 'text-primary' },
    { id: 'studio', label: t('studio'), path: `/studio/${lang || 'eng'}`, icon: Box, active: isStudio, categories: STUDIO_CATEGORIES, color: 'text-primary-hover' }
  ], [lang, isAcademy, isStudio, t]);

  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">Initializing...</div>;

  return (
    <div className={`min-h-screen font-sans text-white transition-colors duration-500`}>
      {showBanner && (
        <div className={`${modeBg} text-bg-dark py-2 px-4 text-center text-[10px] font-black uppercase tracking-widest relative z-[60]`}>
          <span>{isStudio ? t('studio_collab') : t('academy_workshops')}</span>
          <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2"><X size={14} /></button>
        </div>
      )}

      <Navbar 
        isStudio={isStudio} isAcademy={isAcademy} isCommunity={isCommunity} isDashboardPage={isDashboardPage}
        modePrefix={modePrefix} modeColor={modeColor} modeBg={modeBg} unreadCount={unreadCount}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <MobileMenu 
        isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}
        mobileSections={mobileSections} expandedSections={expandedSections}
        toggleSection={(id) => setExpandedSections(p => ({ ...p, [id]: !p[id] }))}
        handleSetSub={handleSetSub} activeSubName={activeSubName}
        modeColor={modeColor} modeBg={modeBg} modePrefix={modePrefix} cardClass="bg-white/10"
        changeLanguage={(l) => navigate(location.pathname.replace(`/${lang}`, `/${l}`))}
        currentLangCode={lang || 'eng'} LANGUAGES={LANGUAGES}
      />

      <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {(isAcademy || isStudio || isCommunity || isDashboardPage) && (
            <Sidebar 
              sidebarCategories={sidebarCategories} activeCatName={activeCatName} activeSubName={activeSubName}
              isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}
              handleSetCategory={handleSetCategory} handleSetSub={handleSetSub}
              modeColor={modeColor} isStudio={isStudio}
            />
          )}
          <div className="flex-1 min-w-0">
            <ErrorBoundary>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{children}</motion.div>
            </ErrorBoundary>
          </div>
        </div>
      </main>

      <Footer 
        modePrefix={modePrefix} modeColor={modeColor} modeBg={modeBg} 
        currentLang={LANGUAGES.find(l => l.code === (lang || 'eng'))}
        onOpenLangMenu={() => {}}
      />
      <AIAssistant />
    </div>
  );
}

function X({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>; }
