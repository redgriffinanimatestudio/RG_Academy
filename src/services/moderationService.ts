import apiClient from './apiClient';

export interface Report {
  id: string;
  reporterId: string;
  reporter: {
    displayName: string;
  };
  targetType: string;
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export const moderationService = {
  async getReports(status?: string): Promise<Report[]> {
    const { data } = await apiClient.get('/v1/moderation/reports', {
      params: { status }
    });
    return data.success ? data.data : (data || []);
  },

  async resolveReport(id: string, status: 'resolved' | 'dismissed'): Promise<void> {
    await apiClient.post(`/v1/moderation/reports/${id}/resolve`, { status });
  },

  async createReport(report: Omit<Report, 'id' | 'status' | 'createdAt' | 'reporter'>): Promise<Report> {
    const { data } = await apiClient.post('/v1/moderation/reports', report);
    return data.success ? data.data : data;
  },

  async getSystemStats(): Promise<any> {
    const { data } = await apiClient.get('/v1/moderation/system-stats');
    return data.success ? data.data : data;
  }
};
