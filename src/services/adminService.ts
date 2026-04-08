import apiClient from './apiClient';
import { UserRole } from './userService';

export type Permission = 
  | 'view_users' | 'manage_roles' | 'suspend_user' | 'delete_user' | 'warn_user' | 'export_user'
  | 'view_courses' | 'unpublish_course' | 'delete_course' | 'view_flagged' | 'handle_reports' | 'approve_services' | 'manage_featured' | 'update_policy'
  | 'view_revenue' | 'view_transactions' | 'view_payouts' | 'initiate_refund' | 'view_stripe_balance' | 'manage_commission'
  | 'view_analytics' | 'generate_reports'
  | 'manage_team' | 'view_audit_log'
  | 'manage_promo' | 'broadcast_notifications' | 'system_settings' | 'manage_seo';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  chief_manager: [
    'view_users', 'manage_roles', 'suspend_user', 'delete_user', 'warn_user', 'export_user',
    'view_courses', 'unpublish_course', 'delete_course', 'view_flagged', 'handle_reports', 'approve_services', 'manage_featured', 'update_policy',
    'view_revenue', 'view_transactions', 'view_payouts', 'initiate_refund', 'view_stripe_balance', 'manage_commission',
    'view_analytics', 'generate_reports',
    'manage_team', 'view_audit_log',
    'manage_promo', 'broadcast_notifications', 'system_settings', 'manage_seo'
  ],
  manager: [
    'view_users', 'suspend_user', 'warn_user',
    'view_courses', 'unpublish_course', 'delete_course', 'view_flagged', 'handle_reports', 'approve_services', 'manage_featured',
    'view_analytics', 'generate_reports',
    'view_audit_log',
    'manage_promo', 'broadcast_notifications', 'manage_seo'
  ],
  moderator: [
    'view_users', 'suspend_user', 'warn_user',
    'view_courses', 'unpublish_course', 'delete_course', 'view_flagged', 'handle_reports', 'approve_services'
  ],
  admin: [
    // Legacy admin gets everything for now
    'view_users', 'manage_roles', 'suspend_user', 'delete_user', 'warn_user', 'export_user',
    'view_courses', 'unpublish_course', 'delete_course', 'view_flagged', 'handle_reports', 'approve_services', 'manage_featured', 'update_policy',
    'view_revenue', 'view_transactions', 'view_payouts', 'initiate_refund', 'view_stripe_balance', 'manage_commission',
    'view_analytics', 'generate_reports',
    'manage_team', 'view_audit_log',
    'manage_promo', 'broadcast_notifications', 'system_settings', 'manage_seo'
  ],
  student: [],
  lecturer: [],
  client: [],
  executor: [],
  hr: [
    'view_users',
    'manage_roles'
  ],
  finance: [
    'view_users'
  ],
  support: [
    'view_users'
  ],
  agency: [
    'view_users'
  ]
};

export const adminService = {
  hasPermission(roles: UserRole[], permission: Permission): boolean {
    return roles.some(role => ROLE_PERMISSIONS[role]?.includes(permission));
  },

  canAccessModule(roles: UserRole[], module: 'users' | 'content' | 'finance' | 'analytics' | 'team' | 'system'): boolean {
    const perms = ROLE_PERMISSIONS;
    const userPerms = roles.flatMap(role => perms[role] || []);
    
    switch (module) {
      case 'users': return userPerms.some(p => p.includes('_user') || p === 'view_users');
      case 'content': return userPerms.some(p => p.includes('_course') || p.includes('_services') || p === 'view_flagged');
      case 'finance': return userPerms.some(p => p.includes('view_revenue') || p.includes('refund'));
      case 'analytics': return userPerms.some(p => p.includes('analytics'));
      case 'team': return userPerms.some(p => p.includes('team') || p.includes('audit_log'));
      case 'system': return userPerms.some(p => p.includes('system') || p.includes('promo'));
      default: return false;
    }
  },

  isAdmin(roles: UserRole[]): boolean {
    return roles.some(role => ['admin', 'manager', 'moderator', 'chief_manager'].includes(role));
  },

  async getStats(): Promise<any> {
    const { data } = await apiClient.get('/v1/admin/stats');
    return data.success ? data.data : data;
  },

  async getUsers(page = 1, search = '', role = ''): Promise<any> {
    const { data } = await apiClient.get(`/v1/admin/users`, {
      params: { page, search, role }
    });
    return data.success ? { users: data.data, total: data.meta?.total } : data;
  },

  async updateUserRole(userId: string, role: string, roles: string[]): Promise<any> {
    const { data } = await apiClient.patch(`/v1/admin/users/${userId}/role`, { role, roles });
    return data.success ? data.data : data;
  },

  async createUser(userData: any): Promise<any> {
    const { data } = await apiClient.post('/v1/admin/users', userData);
    return data.success ? data.data : data;
  },

  async updateUser(userId: string, userData: any): Promise<any> {
    const { data } = await apiClient.put(`/v1/admin/users/${userId}`, userData);
    return data.success ? data.data : data;
  },

  async getCourses(page = 1, status = ''): Promise<any> {
    const { data } = await apiClient.get(`/v1/admin/courses`, {
      params: { page, status }
    });
    return data.success ? { courses: data.data, total: data.meta?.total } : data;
  },

  async updateCourseStatus(courseId: string, status: string): Promise<any> {
    const { data } = await apiClient.patch(`/v1/admin/courses/${courseId}/status`, { status });
    return data.success ? data.data : data;
  },

  async getChiefSummary(): Promise<any> {
    const { data } = await apiClient.get('/v1/admin/chief-summary');
    return data.success ? data.data : data;
  },

  async getOmniStats(): Promise<any> {
    const { data } = await apiClient.get('/v1/admin/omni/stats');
    return data.success ? data.data : data;
  },

  async getOmniLogs(): Promise<any> {
    const { data } = await apiClient.get('/v1/admin/omni/logs');
    return data.success ? data.data : data;
  }
};
