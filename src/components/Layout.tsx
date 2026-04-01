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

// Optimization Hooks & Constants
import { LANGUAGES, ACADEMY_CATEGORIES, STUDIO_CATEGORIES } from './layout/Layout.constants';
import { useLayoutMetadata } from './layout/useLayoutMetadata';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, activeRole, setActiveRole, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useParams();
  const { t } = useTranslation();

  const { data: platformData } = usePlatform();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1200);

  const { 
    isDashboardPage, isStudio, isAcademy, isCommunity, 
    modePrefix, modeColor, modeBg, sidebarCategories 
  } = useLayoutMetadata(profile, activeRole || '');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) setIsSidebarCollapsed(true);
      else setIsSidebarCollapsed(false);

      // Close mobile menu if resized to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ academy: true, dashboards: true });
  const [showBanner, setShowBanner] = useState(true);
  
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
      navigate(`${modePrefix}/${lang || 'eng'}/topic/${sub.name}`);
    }
  };

  const mobileSections = React.useMemo(() => {
    const sections = [
      { id: 'academy', label: t('academy'), path: `/aca/${lang || 'eng'}`, icon: GraduationCap, active: isAcademy, categories: ACADEMY_CATEGORIES, color: 'text-primary' },
      { id: 'studio', label: t('studio'), path: `/studio/${lang || 'eng'}`, icon: Box, active: isStudio, categories: STUDIO_CATEGORIES, color: 'text-primary-hover' }
    ];

    if (isDashboardPage && sidebarCategories.length > 0) {
      // Inject Dashboard sections at the top for quick access
      sections.unshift({
        id: 'dashboards',
        label: t('dashboards'),
        path: `${modePrefix}/${lang || 'eng'}/dashboard`,
        icon: LayoutDashboard,
        active: true,
        categories: sidebarCategories,
        color: modeColor
      });
    }

    return sections;
  }, [lang, isAcademy, isStudio, isDashboardPage, sidebarCategories, modePrefix, modeColor, t]);


  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">Initializing...</div>;

  return (
    <div className={`min-h-screen font-sans text-white transition-colors duration-500 touch-manipulation`}>
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

      <main className="mx-auto max-w-[1920px] px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8">
          {(isAcademy || isStudio || isCommunity || isDashboardPage) && (
            <div className="hidden md:block shrink-0">
              <Sidebar 
                sidebarCategories={sidebarCategories} activeCatName={activeCatName} activeSubName={activeSubName}
                isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}
                handleSetCategory={handleSetCategory} handleSetSub={handleSetSub}
                modeColor={modeColor} isStudio={isStudio}
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
        modePrefix={modePrefix} modeColor={modeColor} modeBg={modeBg} 
        currentLang={LANGUAGES.find(l => l.code === (lang || 'eng')) || LANGUAGES[0]}
        onOpenLangMenu={() => {}}
      />
      <BottomNav />
      <AIAssistant />
    </div>
  );
}
