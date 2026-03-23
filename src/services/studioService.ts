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
    return response.json();
  },

  async getProject(slug: string): Promise<Project | null> {
    const response = await fetch(`${API_BASE}/projects/${slug}`);
    if (!response.ok) return null;
    return response.json();
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  // --- Contracts Module ---
  async getContracts(userId: string, role: 'client' | 'executor'): Promise<Contract[]> {
    const response = await fetch(`${API_BASE}/contracts?userId=${userId}&role=${role}`);
    if (!response.ok) throw new Error('Failed to fetch contracts');
    return response.json();
  },

  async updateContractMilestone(contractId: string, milestoneIdx: number, status: string): Promise<Contract> {
    const response = await fetch(`${API_BASE}/contracts/${contractId}/milestones/${milestoneIdx}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update milestone');
    return response.json();
  },

  // --- Services Module ---
  async getServices(category?: string): Promise<Service[]> {
    const params = new URLSearchParams(category ? { category } : {});
    const response = await fetch(`${API_BASE}/services?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  },

  async createService(service: Partial<Service>): Promise<Service> {
    const response = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    if (!response.ok) throw new Error('Failed to create service');
    return response.json();
  }
};
