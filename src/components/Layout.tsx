import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Box, X, LayoutDashboard } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { usePlatform } from '../context/PlatformContext';
import { useTranslation } from 'react-i18next';

// Modular Components
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import MobileMenu from './layout/MobileMenu';
import BottomNav from './layout/BottomNav';
import Footer from './layout/Footer';
import AIAssistant from './AIAssistant';
import ErrorBoundary from './ErrorBoundary';
import Preloader from './Preloader';

// Optimization Hooks & Constants
import { LANGUAGES, ACADEMY_CATEGORIES, STUDIO_CATEGORIES } from './layout/Layout.constants';
import { useLayoutMetadata } from './layout/useLayoutMetadata';
import { GuideOverlay } from './GuideOverlay';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, activeRole, setActiveRole, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang = 'eng' } = useParams<{ lang: string }>();
  const path = location.pathname.toLowerCase();
  const isProfile = path.includes('/profile/');
  const { t } = useTranslation();

  const { data: platformData } = usePlatform();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1200);

  const { 
    isDashboardPage, isStudio, isAcademy, isCommunity, 
    modePrefix, modeColor, modeBg, sidebarCategories,
    dashboardCategories 
  } = useLayoutMetadata(profile, activeRole || '');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) setIsSidebarCollapsed(true);
      else setIsSidebarCollapsed(false);

      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ academy: true, dashboards: true });
  const [showBanner, setShowBanner] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  
  const notifications = Array.isArray(platformData.notifications) ? platformData.notifications : [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const [activeCatName, setActiveCatName] = useState(sidebarCategories[0]?.name || '');
  const [activeSubName, setActiveSubName] = useState(sidebarCategories[0]?.subcategories?.[0]?.name || '');

  // Sync active categories when sidebarCategories change
  useEffect(() => {
    if (sidebarCategories.length > 0) {
      setActiveCatName(sidebarCategories[0].name || '');
      setActiveSubName(sidebarCategories[0].subcategories?.[0]?.name || '');
    }
  }, [sidebarCategories]);

  const handleSetCategory = (cat: any) => setActiveCatName(cat.name);
  const handleSetSub = async (sub: any, parentCat: any) => {
    setActiveSubName(sub.name);
    
    if (parentCat.isDashboard) {
      const viewParam = sub.subcategories ? sub.subcategories[0].name.toLowerCase() : sub.name.toLowerCase();
      
      // Phase 18: Industrial Role Switch Integration
      if (sub.isPerspective && sub.perspectiveRole && sub.perspectiveRole !== activeRole) {
        console.log(`[Layout] Hub triggering perspective shift: ${sub.perspectiveRole}`);
        await setActiveRole(sub.perspectiveRole as any);
      }

      const roleParam = sub.isPerspective ? `&perspective=${sub.perspectiveRole}` : '';
      navigate(`${location.pathname}?view=${viewParam}${roleParam}`);
    } else {
      if (sub.name === 'neural_engine') {
        navigate(`/studio/${lang || 'eng'}/neural`);
      } else {
        navigate(`${modePrefix}/${lang || 'eng'}/topic/${sub.name}`);
      }
    }
    // Ensures mobile vertical menu automatically closes after transition
    setIsMobileMenuOpen(false);
  };

  const mobileSections = React.useMemo(() => {
    const sections = [
      { id: 'academy', label: t('academy'), path: `/aca/${lang || 'eng'}`, icon: GraduationCap, active: isAcademy, categories: ACADEMY_CATEGORIES, color: 'text-primary' },
      { id: 'studio', label: t('studio'), path: `/studio/${lang || 'eng'}`, icon: Box, active: isStudio, categories: STUDIO_CATEGORIES, color: 'text-primary-hover' }
    ];

    if ((isDashboardPage || profile) && dashboardCategories.length > 0) {
      // Inject ONLY Dashboard-specific sections at the top
      sections.unshift({
        id: 'dashboards',
        label: t('dashboards'),
        path: `${modePrefix}/${lang || 'eng'}/dashboard`,
        icon: LayoutDashboard,
        active: true,
        categories: dashboardCategories,
        color: modeColor
      });
    }

    // Phase 40: Guest Sovereignty Preview (Manual Injection)
    if (!profile && isAcademy && !isDashboardPage) {
      sections.push({
        id: 'preview_roadmap',
        label: 'Sovereignty Path',
        path: `/aca/${lang || 'eng'}`,
        icon: GraduationCap,
        active: false,
        categories: [{
          name: 'path_preview',
          icon: LayoutDashboard,
          subcategories: [{ name: 'master_plan' }]
        }],
        color: 'text-primary'
      });
    }

    return sections;
  }, [lang, isAcademy, isStudio, isDashboardPage, dashboardCategories, modePrefix, modeColor, t, profile]);


  const isPublicPage = path.includes('/login') || path.includes('/register') || path === `/${lang}` || path === `/${lang}/` || path === '/';
  
  // Phase 31: Logout & API Fallback Guard (Anti-Black Screen)
  useEffect(() => {
    if (!authLoading && !profile && (isDashboardPage || isProfile) && !isPublicPage) {
      console.log("[Layout] Unauthorized access detected, redirecting to landing...");
      window.location.href = `/${lang || 'eng'}`;
    }
  }, [profile, authLoading, isDashboardPage, isProfile, isPublicPage, lang]);

  if (authLoading) return <div className="min-h-screen bg-bg-dark flex items-center justify-center"><Preloader message="Initializing Red Griffin..." size="lg" /></div>;
  
  if (!profile && (isDashboardPage || isProfile) && !isPublicPage) {
    return <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="size-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  const changeLanguage = (newLang: string) => {
    const pathParts = location.pathname.split('/').filter(Boolean);
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
  };

  return (
    <div className={`min-h-screen font-sans text-ink bg-bg-dark transition-colors duration-500 touch-manipulation relative overflow-x-hidden`}>
      {showBanner && (
        <div className={`${modeBg} text-white py-2.5 px-6 text-center text-[10px] font-black uppercase tracking-[0.3em] relative z-[60] shadow-sm`}>
          <span>{isStudio ? t('studio_collab') : t('academy_workshops')}</span>
          <button onClick={() => setShowBanner(false)} className="absolute right-6 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"><X size={14} /></button>
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
        changeLanguage={changeLanguage}
        currentLangCode={lang || 'eng'} LANGUAGES={LANGUAGES}
      />

      <main className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 lg:py-16">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-10 lg:gap-14 items-start">
          {(isAcademy || isStudio || isCommunity || isDashboardPage) && !isPublicPage && (
            <div className="hidden md:block shrink-0">
              <Sidebar 
                profile={profile}
                sidebarCategories={sidebarCategories} activeCatName={activeCatName} activeSubName={activeSubName}
                isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}
                handleSetCategory={handleSetCategory} handleSetSub={handleSetSub}
                modeColor={modeColor} isStudio={isStudio}
                onOpenGuide={() => setShowGuide(true)}
              />
            </div>
          )}
          <div className="flex-1 min-w-0 w-full overflow-hidden px-1 sm:px-0 pb-24 md:pb-0">
            <ErrorBoundary>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                {children}
              </motion.div>
            </ErrorBoundary>
          </div>
        </div>
      </main>

      <Footer 
        profile={profile}
        modePrefix={modePrefix} modeColor={modeColor} modeBg={modeBg} 
        currentLang={LANGUAGES.find(l => l.code === (lang || 'eng')) || LANGUAGES[0]}
        onOpenLangMenu={() => {}}
        onChangeLanguage={changeLanguage}
      />
      <BottomNav />
      <AIAssistant />
      <GuideOverlay 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
        mode={isStudio ? 'studio' : 'academy'} 
      />
    </div>
  );
}
