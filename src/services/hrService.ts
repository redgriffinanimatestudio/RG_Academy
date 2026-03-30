import apiClient from './apiClient';

export const hrService = {
  async getOpenings(status = 'open'): Promise<any> {
    const response = await apiClient.get('/v1/hr/openings', {
      params: { status }
    });
    return response.data.success ? response.data.data : [];
  },

  async createOpening(data: any): Promise<any> {
    const response = await apiClient.post('/v1/hr/openings', data);
    return response.data.success ? response.data.data : null;
  },

  async getApplicants(openingId?: string): Promise<any> {
    const response = await apiClient.get('/v1/hr/applicants', {
      params: { openingId }
    });
    return response.data.success ? response.data.data : [];
  },

  async submitApplication(data: { openingId: string; coverLetter: string; resumeUrl?: string }): Promise<any> {
    const response = await apiClient.post('/v1/hr/apply', data);
    return response.data.success ? response.data.data : null;
  },

  async updateApplicantStatus(appId: string, status: string): Promise<any> {
    const response = await apiClient.patch(`/v1/hr/applicants/${appId}/status`, {
      status
    });
    return response.data.success ? response.data.data : null;
  }
};
