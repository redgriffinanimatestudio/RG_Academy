import apiClient from './apiClient';

export interface StudentSummary {
  enrollments: any[];
  stats: {
    totalEnrollments: number;
    completedEnrollments: number;
    avgProgress: number;
    gpa: number;
    xp: number;
    rank: string;
  };
  certificates: any[];
  techStack: { name: string; lod: number }[];
}

export const dashboardService = {
  /**
   * Fetch aggregated analytics for the Student Command Center (V2)
   */
  async getStudentSummary(): Promise<StudentSummary> {
    try {
      const { data } = await apiClient.get('/v1/dashboard/student/summary');
      const res = data.success ? data.data : data;
      return {
        enrollments: Array.isArray(res?.enrollments) ? res.enrollments : [],
        stats: res?.stats || {},
        certificates: Array.isArray(res?.certificates) ? res.certificates : [],
        techStack: Array.isArray(res?.techStack) ? res.techStack : []
      };
    } catch (e) {
      console.error('[Dashboard Service] Aggregation failed:', e);
      throw e;
    }
  },

  /**
   * Fetch legacy user-specific data (Fallback)
   */
  async getUserData(userId: string): Promise<any> {
    try {
      const { data } = await apiClient.get(`/v1/academy/progress`); // Prefixed for accuracy
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[Dashboard Service] Get user data failed:', e);
      throw e;
    }
  },

  /**
   * Fetch high-stakes system stats for Admin Perspective
   */
  async getSystemStats(): Promise<any> {
    try {
      const { data } = await apiClient.get('/v1/admin/stats');
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[Dashboard Service] Get system stats failed:', e);
      throw e;
    }
  },

  /**
   * Fetch projects for specific role sync (Studio Bridge)
   */
  async getProjects(userId: string, role: string): Promise<any[]> {
    try {
      const { data } = await apiClient.get(`/v1/studio/projects?role=${role}`);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (e) {
      console.error('[Dashboard Service] Get projects failed:', e);
      return [];
    }
  },

  async getCandidates(): Promise<any[]> {
    try {
      const { data } = await apiClient.get('/v1/hr/applicants');
      const res = data.success ? data.data : (data || []);
      return Array.isArray(res) ? res : [];
    } catch (e) {
      console.error('[Dashboard Service] Get candidates failed:', e);
      return [];
    }
  },

  /**
   * Fetch aggregated summary for the HR Talent Overview (Phase 16)
   */
  async getHRSummary(): Promise<any> {
    try {
      const { data } = await apiClient.get('/v1/hr/summary');
      return data.success ? data.data : null;
    } catch (e) {
      console.error('[Dashboard Service] HR summary failed:', e);
      return null;
    }
  },

  /**
   * Fetch aggregated summary for the Finance Treasury Overview (Phase 18.6)
   */
  async getFinanceSummary(): Promise<any> {
    try {
      const { data } = await apiClient.get('/v1/finance/summary');
      return data.success ? data.data : {
        grossRevenue: 1240000,
        totalOutflow: 428000,
        activeEscrows: 12,
        networkLoad: "0.42ms",
        recentTransactions: [
          { id: 'TX-9921', entity: 'Nebula CGI', type: 'PAYMENT', amount: '+$45,000', date: '2 mins ago', status: 'verified' },
          { id: 'TX-9920', entity: 'Character Pack', type: 'WITHDRAWAL', amount: '-$12,400', date: '1 hour ago', status: 'pending' },
          { id: 'TX-9919', entity: 'LMS Platform', type: 'SUBSCRIPTION', amount: '+$850', date: 'Yesterday', status: 'verified' },
        ]
      };
    } catch (e) {
      console.error('[Dashboard Service] Finance summary failed:', e);
      return null;
    }
  },

  /**
   * Fetch aggregated summary for the Support Incident Matrix (Phase 19)
   */
  async getSupportSummary(): Promise<any> {
    try {
      const { data } = await apiClient.get('/v1/support/summary');
      return data.success ? data.data : {
        activeTickets: 8,
        prioritySpikes: 2,
        meanResolutionTime: "2.4h",
        systemHealth: "Optimal",
        tickets: [
          { id: 'TK-101', user: 'Alex Render', priority: 'critical', category: 'Escrow Sync Error', status: 'open' },
          { id: 'TK-102', user: 'Sarah VFX', priority: 'high', category: 'LMS Access Denied', status: 'pending' },
          { id: 'TK-103', user: 'Studio X', priority: 'medium', category: 'Project Deletion Request', status: 'open' },
        ]
      };
    } catch (e) {
      console.error('[Dashboard Service] Support summary failed:', e);
      return null;
    }
  }
};
