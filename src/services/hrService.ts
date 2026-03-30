import apiClient from './apiClient';

/**
 * HR Service V2.2 (Industrial Protocol)
 * Synchronized for Talent Matrix & Legacy Staff Nodes
 */
export interface HRSummary {
  stats: {
    totalOpenings: number;
    totalApplicants: number;
    activeTalentPool: number;
    recruitmentHealth: number;
  };
  funnels: { name: string; value: number }[];
}

export const hrService = {
  /**
   * Fetch all industrial job openings
   */
  async getOpenings(): Promise<any[]> {
    try {
      const { data } = await apiClient.get('/v1/hr/openings');
      return data.success ? data.data : (data || []);
    } catch (e) {
      console.error('[HR Service] Openings fetch failed:', e);
      return [];
    }
  },

  /**
   * Create a new industrial job opening
   */
  async createOpening(payload: any): Promise<any> {
    try {
      const { data } = await apiClient.post('/v1/hr/openings', payload);
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[HR Service] Create opening failed:', e);
      throw e;
    }
  },

  /**
   * Fetch high-fidelity HR telemetry (Talent Matrix V2)
   */
  async getSummary(): Promise<HRSummary> {
    try {
      const { data } = await apiClient.get('/v1/hr/summary');
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[HR Service] Summary fetch failed:', e);
      throw e;
    }
  },

  /**
   * Fetch interactive candidate list
   */
  async getApplicants(openingId?: string): Promise<any[]> {
    try {
      const { data } = await apiClient.get(`/v1/hr/applicants${openingId ? `?openingId=${openingId}` : ''}`);
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[HR Service] Applicants fetch failed:', e);
      throw e;
    }
  },

  /**
   * Update candidate status in real-time
   */
  async updateStatus(appId: string, status: string): Promise<any> {
    try {
      const { data } = await apiClient.patch(`/v1/hr/applicants/${appId}/status`, { status });
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[HR Service] Status update failed:', e);
      throw e;
    }
  },

  /**
   * Legacy Alias for updateStatus
   */
  async updateApplicantStatus(appId: string, status: string): Promise<any> {
    return this.updateStatus(appId, status);
  }
};
