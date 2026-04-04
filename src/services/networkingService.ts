import apiClient from './apiClient';
import { MIGRATION_CONFIG } from '../config/migration';

const API_V1 = '/v1/studio';

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  location?: string;
  country?: string | null;
  citizenship?: string | null;
  linkedInUrl?: string | null;
  telegramHandle?: string | null;
  portfolioUrl?: string | null;
  gender?: string | null;
  dateOfBirth?: string | Date | null;
  skills: { name: string }[];
  portfolio: any[];
  roles: string[];
  user: {
    displayName: string;
    photoURL?: string;
  };
}

export interface Connection {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export type FeedEventType = 
  | 'follow' 
  | 'mention' 
  | 'portfolio_view' 
  | 'new_connection' 
  | 'project_posted' 
  | 'course_completed';

export interface FeedEvent {
  id: string;
  actorId: string;
  actor: {
    displayName: string;
    photoURL?: string;
  };
  type: FeedEventType;
  refId: string;
  payload: any;
  createdAt: string;
}

export interface SearchIndex {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  role?: string;
  location?: string;
  skills: string[];
}

export const networkingService = {
  // --- Profiles Module ---
  async getProfile(userId: string): Promise<Profile> {
    const fetchFromProductionDB = async () => {
      const { data } = await apiClient.get(`${API_V1}/profiles/${userId}`);
      return data.success ? data.data : data;
    };

    if (MIGRATION_CONFIG.USE_PRODUCTION_READ) {
      try {
        return await fetchFromProductionDB();
      } catch (err) {
        console.error('[Migration] Profile Read failed:', err);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    // Legacy Fallback
    const response = await fetch(`${API_V1}/profiles/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateProfile(profileData: Partial<Profile> & { userId: string }): Promise<Profile> {
    const updateInProductionDB = async () => {
      const { data } = await apiClient.post(`${API_V1}/profiles`, profileData);
      return data.success ? data.data : data;
    };

    const updateInLegacy = async () => {
      const response = await fetch(`${API_V1}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    };

    if (MIGRATION_CONFIG.USE_PRODUCTION_WRITE) {
      try {
        const updated = await updateInProductionDB();
        if (MIGRATION_CONFIG.DUAL_WRITE) {
          updateInLegacy().catch(e => console.error('[Migration] Dual-Write Profile failed:', e));
        }
        return updated;
      } catch (err) {
        if (MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) return await updateInLegacy();
        throw err;
      }
    }

    return await updateInLegacy();
  },

  // --- Connections Module ---
  async follow(followerId: string, followingId: string): Promise<void> {
    const actionInProductionDB = () => apiClient.post(`${API_V1}/connections`, { followerId, followingId });
    const actionInLegacy = () => fetch(`${API_V1}/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId, followingId }),
    });

    if (MIGRATION_CONFIG.USE_PRODUCTION_WRITE) {
      try {
        await actionInProductionDB();
        if (MIGRATION_CONFIG.DUAL_WRITE) {
          actionInLegacy().catch(e => console.error('[Migration] Dual-Write Follow failed:', e));
        }
        return;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const response = await actionInLegacy();
    if (!response.ok) throw new Error('Failed to follow user');
  },

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const actionInProductionDB = () => apiClient.delete(`${API_V1}/connections`, { data: { followerId, followingId } });
    const actionInLegacy = () => fetch(`${API_V1}/connections`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId, followingId }),
    });

    if (MIGRATION_CONFIG.USE_PRODUCTION_WRITE) {
      try {
        await actionInProductionDB();
        if (MIGRATION_CONFIG.DUAL_WRITE) {
          actionInLegacy().catch(e => console.error('[Migration] Dual-Write Unfollow failed:', e));
        }
        return;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const response = await actionInLegacy();
    if (!response.ok) throw new Error('Failed to unfollow user');
  },

  async getActivityFeed(userId: string): Promise<FeedEvent[]> {
    try {
      const { data } = await apiClient.get(`${API_V1}/feed/${userId}`);
      return data.success ? data.data : data;
    } catch (err) {
      const response = await fetch(`${API_V1}/feed/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch feed');
      return response.json();
    }
  },

  async getFollowing(userId: string): Promise<string[]> {
    return []; // Placeholder
  },

  // --- Discovery Module ---
  async searchProfiles(query: string, skill?: string): Promise<any[]> {
    const params = { query, skill };
    
    const searchFromProductionDB = async () => {
      const { data } = await apiClient.get(`${API_V1}/discovery/search`, { params });
      return data.success ? data.data : data;
    };

    try {
      const result = await searchFromProductionDB();
      return Array.isArray(result) ? result : (result.data || []);
    } catch (err) {
      const urlParams = new URLSearchParams({ query, ...(skill ? { skill } : {}) });
      const response = await fetch(`${API_V1}/discovery/search?${urlParams.toString()}`);
      if (!response.ok) throw new Error('Failed to search profiles');
      const result = await response.json();
      return result.data || result;
    }
  },

  async getRecommendations(userId: string): Promise<SearchIndex[]> {
    return []; // Placeholder
  },

  async validateChatAccess(targetUserId: string, token: string): Promise<{ canMessage: boolean; error?: string; code?: string }> {
    try {
      const { data } = await apiClient.get(`/v1/studio/validate/chat/${targetUserId}`);
      return data.success ? data.data : data;
    } catch (err) {
      const response = await fetch(`${API_V1}/validate/chat/${targetUserId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      return result.data || result;
    }
  }
};
