const API_BASE = '/api/v1/studio';

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  location?: string;
  skills: { name: string }[];
  portfolio: any[];
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
    const response = await fetch(`${API_BASE}/profiles/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateProfile(profileData: Partial<Profile> & { userId: string }): Promise<Profile> {
    const response = await fetch(`${API_BASE}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  // --- Connections Module ---
  async follow(followerId: string, followingId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId, followingId }),
    });
    if (!response.ok) throw new Error('Failed to follow user');
  },

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/connections`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId, followingId }),
    });
    if (!response.ok) throw new Error('Failed to unfollow user');
  },

  async getActivityFeed(userId: string): Promise<FeedEvent[]> {
    const response = await fetch(`${API_BASE}/feed/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch feed');
    return response.json();
  },

  async getFollowing(userId: string): Promise<string[]> {
    // This is a stub, usually should be an API call
    return [];
  },

  // --- Discovery Module ---
  async searchProfiles(query: string, skill?: string): Promise<any[]> {
    const params = new URLSearchParams({ query, ...(skill ? { skill } : {}) });
    const response = await fetch(`${API_BASE}/discovery/search?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to search profiles');

    const result = await response.json();
    // Backend returns paginated response: { success: true, data: [...], pagination: {...} }
    if (Array.isArray(result.data)) {
      return result.data;
    }

    // Fallback for old payload shapes
    if (Array.isArray(result)) {
      return result;
    }

    return [];
  },

  async getRecommendations(userId: string): Promise<SearchIndex[]> {
    // This is a stub, usually should be an API call
    return [];
  }
};
