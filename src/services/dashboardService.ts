export interface DashboardStats {
  totalUsers?: number;
  activeProjects?: number;
  revenue?: number;
  myCourses?: number;
  progress?: number;
}

const API_URL = '/api';

export const dashboardService = {
  // Get user-specific dashboard data
  async getUserData(userId: string): Promise<any> {
    const token = localStorage.getItem('rg_token');
    const response = await fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    const res = await response.json();
    return res.data;
  },

  // Get active projects (for Client/Executor)
  async getProjects(userId: string, role: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/v1/studio/projects`);
    if (!response.ok) return [];
    const res = await response.json();
    const projects = res.data || [];
    
    const field = role === 'client' ? 'clientId' : 'executorId';
    return projects.filter((p: any) => p[field] === userId);
  },

  // Admin: Get system-wide stats
  async getSystemStats(): Promise<DashboardStats> {
    const token = localStorage.getItem('rg_token');
    const response = await fetch(`${API_URL}/v1/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return {};
    const res = await response.json();
    return res.data as DashboardStats;
  },

  // Update user role (switch identity)
  async updateActiveRole(userId: string, role: string) {
    const token = localStorage.getItem('rg_token');
    await fetch(`${API_URL}/v1/admin/users/${userId}/role`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
  }
};
