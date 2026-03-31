import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield } from 'lucide-react';
import { 
  ACADEMY_CATEGORIES, 
  STUDIO_CATEGORIES, 
  COMMUNITY_CATEGORIES, 
  DASHBOARD_MENUS,
  SUPERADMIN_HUB
} from './Layout.constants';

export function useLayoutMetadata(profile: any, activeRole: string | null) {
  const location = useLocation();
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
    if (!profile || !activeRole) return null;
    
    // IF ADMIN: Show the Master Superadmin Hub with all roles nested
    if (profile.isAdmin && activeRole === 'admin') {
      const hub = SUPERADMIN_HUB[0];
      const expandedSubcategories = hub.subcategories.map(sub => {
        const roleKey = (sub as any).role;
        const roleMenu = DASHBOARD_MENUS[roleKey] ? DASHBOARD_MENUS[roleKey][0] : null;
        
        return {
          ...sub,
          // If we found a menu for this role, attach its subcategories for the 3rd level
          subcategories: roleMenu ? roleMenu.subcategories : []
        };
      });

      return {
        ...hub,
        isDashboard: true,
        subcategories: expandedSubcategories
      };
    }

    if (!DASHBOARD_MENUS[activeRole]) return null;
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

  return {
    isDashboardPage,
    isProfile,
    isStudio,
    isAcademy,
    isCommunity,
    modePrefix,
    modeColor,
    modeBg,
    sidebarCategories
  };
}
