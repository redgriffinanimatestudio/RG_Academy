import apiClient from './apiClient';
import { MIGRATION_CONFIG } from '../config/migration';

const API_V1 = '/v1/studio';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  clientId: string;
  executorId?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  urgency: 'urgent' | 'normal';
  budget: number;
  tags: string[];
  client: {
    displayName: string;
    photoURL?: string;
  };
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  executorId: string;
  executor: {
    displayName: string;
    photoURL?: string;
  };
  price: number;
  category: string;
  tags: string[];
  rating: number;
  createdAt: string;
}

export interface Contract {
  id: string;
  projectId: string;
  clientId: string;
  executorId: string;
  amount: number;
  status: 'active' | 'completed' | 'disputed' | 'cancelled';
  milestones: {
    title: string;
    amount: number;
    status: 'pending' | 'released' | 'disputed';
  }[];
  createdAt: any;
}

export const studioService = {
  // --- Projects Module ---
  async getProjects(filters?: { status?: string, urgency?: string }): Promise<Project[]> {
    const fetchFromPostgres = async () => {
      const { data } = await apiClient.get(`${API_V1}/projects`, { params: filters });
      return data.success ? data.data : [];
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_READ) {
      try {
        return await fetchFromPostgres();
      } catch (err) {
        console.error('[Migration] Projects Read failed:', err);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const params = new URLSearchParams(filters as any);
    const response = await fetch(`${API_V1}/projects?${params.toString()}`);
    const result = await response.json();
    return result.success ? result.data : [];
  },

  async getProject(slug: string): Promise<Project | null> {
    if (MIGRATION_CONFIG.USE_POSTGRES_READ) {
      try {
        const { data } = await apiClient.get(`${API_V1}/projects/${slug}`);
        return data.success ? data.data : null;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const response = await fetch(`${API_V1}/projects/${slug}`);
    const result = await response.json();
    return result.success ? result.data : null;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const createInPostgres = async () => {
      const { data } = await apiClient.post(`${API_V1}/projects`, project);
      return data.data;
    };

    const createInLegacy = async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_V1}/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project),
      });
      const result = await response.json();
      return result.data;
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_WRITE) {
      try {
        const newProject = await createInPostgres();
        if (MIGRATION_CONFIG.DUAL_WRITE) {
          createInLegacy().catch(e => console.error('[Migration] Dual-Write Project failed:', e));
        }
        return newProject;
      } catch (err) {
        if (MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) return await createInLegacy();
        throw err;
      }
    }

    return await createInLegacy();
  },

  // --- Contracts Module ---
  async getContracts(userId: string, role: 'client' | 'executor'): Promise<Contract[]> {
    if (MIGRATION_CONFIG.USE_POSTGRES_READ) {
      try {
        const { data } = await apiClient.get(`${API_V1}/contracts`, { params: { userId, role } });
        return data.success ? data.data : [];
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_V1}/contracts?userId=${userId}&role=${role}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    return result.success ? result.data : [];
  },

  async releaseMilestone(contractId: string, index: number): Promise<Contract> {
    const releaseInPostgres = async () => {
      const { data } = await apiClient.post(`${API_V1}/contracts/${contractId}/milestones/${index}/release`);
      return data.data;
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_WRITE) {
      try {
        const updated = await releaseInPostgres();
        return updated;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_V1}/contracts/${contractId}/milestones/${index}/release`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    return result.data;
  },

  // --- Services Module ---
  async getServices(category?: string): Promise<Service[]> {
    try {
      const { data } = await apiClient.get(`${API_V1}/services`, { params: { category } });
      return data.success ? data.data : [];
    } catch (err) {
      const params = new URLSearchParams(category ? { category } : {});
      const response = await fetch(`${API_V1}/services?${params.toString()}`);
      const result = await response.json();
      return result.success ? result.data : [];
    }
  }
};
