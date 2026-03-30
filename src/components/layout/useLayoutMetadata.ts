import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield } from 'lucide-react';
import { 
  ACADEMY_CATEGORIES, 
  STUDIO_CATEGORIES, 
  COMMUNITY_CATEGORIES, 
  DASHBOARD_MENUS 
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
    
    // IF ADMIN: Aggregate ALL role menus for Superadmin "All-Access" view
    if (profile.isAdmin && activeRole === 'admin') {
      const allSubmenus: any[] = [];
      
      // 1. Add Original Admin Menu First
      if (DASHBOARD_MENUS['admin']) allSubmenus.push(...DASHBOARD_MENUS['admin']);
      
      // 2. Add "Perspective" submenus for all other roles
      const perspectiveRoles = ['hr', 'finance', 'student', 'lecturer', 'chief_manager', 'manager', 'client', 'executor', 'support'];
      perspectiveRoles.forEach(role => {
        if (DASHBOARD_MENUS[role] && role !== 'admin') {
          // Flatten subcategories and add prefix to distinguish perspectives
          DASHBOARD_MENUS[role].forEach(menu => {
            const roleName = role.replace('_', ' ').toUpperCase();
            allSubmenus.push({
              ...menu,
              name: `${roleName}: ${menu.name.replace('_', ' ')}`,
              isPerspective: true,
              perspectiveRole: role
            });
          });
        }
      });

      return {
        name: 'Superadmin Hub',
        icon: Shield,
        isDashboard: true,
        subcategories: allSubmenus
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
