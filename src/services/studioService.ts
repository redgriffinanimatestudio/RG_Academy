import apiClient from './apiClient';

export interface StudioStats {
  activeGigs: number;
  totalEarned: number;
  rating: number;
  deadlineAccuracy: number;
  verifiedSkills: { name: string; lod: number }[];
}

export const studioService = {
  /**
   * Fetch aggregated professional telemetry for the Executor Hub
   */
  async getExecutorSummary(): Promise<any> {
    try {
      const { data } = await apiClient.get('/v1/studio/executor/summary');
      return data.success ? data.data : data;
    } catch (e) {
      console.error('[Studio Service] Executor summary failed:', e);
      throw e;
    }
  },

  /**
   * Sync Academy achievements with the Studio professional profile
   */
  async syncAcademyPortfolio(): Promise<any> {
    try {
      const { data } = await apiClient.post('/v1/studio/executor/sync-academy');
      return data.success;
    } catch (e) {
      console.error('[Studio Service] Portfolio sync failed:', e);
      throw e;
    }
  },

  /**
   * Fetch all studio projects (Client Perspective)
   */
  async getProjects(): Promise<any[]> {
    try {
      const { data } = await apiClient.get('/v1/studio/projects');
      return Array.isArray(data?.data) ? data.data : [];
    } catch (e) {
      console.error('[Studio Service] Get projects failed:', e);
      return [];
    }
  },

  /**
   * Fetch studio contracts (Filtered by role)
   */
  async getContracts(userId: string, role: string): Promise<any[]> {
    try {
      const { data } = await apiClient.get(`/v1/studio/contracts?role=${role}`);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (e) {
      console.error('[Studio Service] Get contracts failed:', e);
      return [];
    }
  },

  /**
   * Fetch active tasks for the current user
   */
  async getMyTasks(): Promise<any[]> {
    try {
      const { data } = await apiClient.get('/v1/studio/tasks');
      return Array.isArray(data?.data) ? data.data : [];
    } catch (e) {
      console.error('[Studio Service] Get tasks failed:', e);
      return [];
    }
  },

  /**
   * Update task status (Industrial Sync)
   */
  async updateTaskStatus(taskId: string, status: string): Promise<any> {
    try {
      const { data } = await apiClient.patch(`/v1/studio/tasks/${taskId}`, { status });
      return data.success;
    } catch (e) {
      console.error('[Studio Service] Task update failed:', e);
      throw e;
    }
  },

  /**
   * Release milestone payment (Escrow Vault)
   */
  async releaseMilestone(contractId: string, index: number): Promise<any> {
    try {
      const { data } = await apiClient.post(`/v1/studio/contracts/${contractId}/release/${index}`);
      return data.success;
    } catch (e) {
      console.error('[Studio Service] Milestone release failed:', e);
      throw e;
    }
  },

  async getTaskDetails(taskId: string): Promise<any> {
    try {
      const { data } = await apiClient.get(`/v1/studio/tasks/${taskId}`);
      return data.success ? data.data : null;
    } catch (e) {
      console.error('[Studio Service] Get task details failed:', e);
      return null;
    }
  }
};
