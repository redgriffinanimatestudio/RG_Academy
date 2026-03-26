const API_BASE = '/api/v1/studio';

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
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`${API_BASE}/projects?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    const result = await response.json();
    return result.success ? result.data : [];
  },

  async getProject(slug: string): Promise<Project | null> {
    const response = await fetch(`${API_BASE}/projects/${slug}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    const result = await response.json();
    return result.data;
  },

  // --- Contracts Module ---
  async getContracts(userId: string, role: 'client' | 'executor'): Promise<Contract[]> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/contracts?userId=${userId}&role=${role}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch contracts');
    const result = await response.json();
    return result.success ? result.data : [];
  },

  async releaseMilestone(contractId: string, index: number): Promise<Contract> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}/contracts/${contractId}/milestones/${index}/release`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to release milestone');
    const result = await response.json();
    return result.data;
  },

  // --- Services Module ---
  async getServices(category?: string): Promise<Service[]> {
    const params = new URLSearchParams(category ? { category } : {});
    const response = await fetch(`${API_BASE}/services?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    const result = await response.json();
    return result.success ? result.data : [];
  }
};
