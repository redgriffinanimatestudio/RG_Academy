import apiClient from './apiClient';

/**
 * Agency Service V2.0 (msitarzewski Node)
 * Industrial Telemetry for Talent Representation
 */
export interface AgencySummary {
  agent: {
    name: string;
    rank: string;
    specialization: string;
    verified: boolean;
  };
  stats: {
    totalTalent: number;
    activeContracts: number;
    totalEarnings: number;
    performanceIndex: number;
  };
}

export const agencyService = {
  /**
   * Fetch master agent telemetry
   */
  async getSummary(): Promise<AgencySummary> {
    try {
      const { data } = await apiClient.get('/v1/agency/summary');
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[Agency Service] Summary fetch failed:', e);
      throw e;
    }
  },

  /**
   * Fetch talent roster matrix
   */
  async getRoster(): Promise<any[]> {
    try {
      const { data } = await apiClient.get('/v1/agency/roster');
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[Agency Service] Roster fetch failed:', e);
      return [];
    }
  }
};
