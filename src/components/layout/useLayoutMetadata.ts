import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { 
  ACADEMY_CATEGORIES, 
  STUDIO_CATEGORIES, 
  COMMUNITY_CATEGORIES, 
  DASHBOARD_MENUS,
  SUPERADMIN_HUB,
  GUEST_CATEGORIES
} from './Layout.constants';

export function useLayoutMetadata(profile: any, activeRole: string | null) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  
  const isDashboardPage = path.includes('/dashboard') || path.includes('/admin') || path.includes('/chief-manager') || path.includes('/manager') || path.includes('/hr') || path.includes('/finance') || path.includes('/support') || path.includes('/lecturer') || path.includes('/client') || path.includes('/executor') || path.includes('/agency');
  const isProfile = path.includes('/profile/');
  const isStudio = path.includes('/studio/') && !isDashboardPage && !isProfile;
  const isAcademy = (path.includes('/aca/') || path.includes('/learn/')) && !isDashboardPage && !isProfile;
  const isCommunity = path.includes('/community') && !isDashboardPage && !isProfile;

  const modePrefix = isStudio ? '/studio' : '/aca';
  const modeColor = isDashboardPage ? (activeRole === 'admin' ? 'text-red-500' : 'text-primary') : (isStudio ? 'text-primary-hover' : 'text-primary');
  const modeBg = isDashboardPage ? (activeRole === 'admin' ? 'bg-red-500' : 'bg-primary') : (isStudio ? 'bg-primary-hover' : 'bg-primary');

  const baseCategories = isCommunity ? COMMUNITY_CATEGORIES : (isStudio ? STUDIO_CATEGORIES : ACADEMY_CATEGORIES);

  const navData = useMemo(() => {
    // If the user just logged in but role isn't set, default to student for visualization
    const effectiveRole = activeRole || (profile ? 'student' : null);
    
    if (!profile || !effectiveRole) {
      // Guest user: show limited categories for public access
      return { dashboardCategories: [], baseCategories: GUEST_CATEGORIES };
    }
    
    let dashboardCategories: any[] = [];

    // IF ADMIN: Show the Master Superadmin Hub with all roles nested
    if (profile.isAdmin && activeRole === 'admin') {
      const hub = SUPERADMIN_HUB[0];
      const expandedSubcategories = hub.subcategories.map((sub: any) => {
        const roleKey = sub.role;
        const roleMenu = DASHBOARD_MENUS[roleKey] ? DASHBOARD_MENUS[roleKey][0] : null;
        
        return {
          ...sub,
          subcategories: roleMenu ? roleMenu.subcategories : []
        };
      });

      dashboardCategories = [
        {
          ...hub,
          isDashboard: true,
          subcategories: expandedSubcategories
        }
      ];
    } else if (DASHBOARD_MENUS[effectiveRole]) {
      // IF ROLE: Map its dashboard structure
      const roleHub = DASHBOARD_MENUS[effectiveRole][0];
      dashboardCategories = [
        {
          ...roleHub,
          isDashboard: true,
          subcategories: roleHub.subcategories || []
        }
      ];
    }

    return { dashboardCategories, baseCategories };
  }, [profile, activeRole, baseCategories]);

  const { dashboardCategories } = navData;
  const sidebarCategories = isDashboardPage ? [...dashboardCategories, ...baseCategories] : baseCategories;

  return {
    isDashboardPage,
    isProfile,
    isStudio,
    isAcademy,
    isCommunity,
    modePrefix,
    modeColor,
    modeBg,
    sidebarCategories,
    dashboardCategories
  };
}
