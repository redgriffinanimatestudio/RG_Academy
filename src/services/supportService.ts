import apiClient from './apiClient';

export const supportService = {
  async getReports(status?: string): Promise<any> {
    const response = await apiClient.get('/v1/support', {
      params: { status }
    });
    return response.data.success ? response.data.data : [];
  },

  async resolveReport(reportId: string, status: 'resolved' | 'dismissed'): Promise<any> {
    const response = await apiClient.patch(`/v1/support/${reportId}/resolve`, {
      status
    });
    return response.data.success ? response.data.data : null;
  },

  async deleteReport(reportId: string): Promise<any> {
    const response = await apiClient.delete(`/v1/support/${reportId}`);
    return response.data.success ? response.data.data : null;
  },

  async createReport(data: { reason: string; targetType?: string; targetId?: string }): Promise<any> {
    const response = await apiClient.post('/v1/support/create', data);
    return response.data.success ? response.data.data : null;
  }
};
