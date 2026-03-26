export type UserRole = 
  | 'student' 
  | 'lecturer' 
  | 'client' 
  | 'executor' 
  | 'admin' 
  | 'manager' 
  | 'moderator' 
  | 'chief_manager'
  | 'hr'
  | 'finance'
  | 'support';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  roles: UserRole[];
  bio?: string;
  createdAt: any;
  updatedAt?: any;
  isAdmin?: boolean;
}

const API_URL = '/api';

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const response = await fetch(`${API_URL}/users/${uid}`);
    if (!response.ok) return null;
    const dbRes = await response.json();
    const dbUser = dbRes.data;
    
    let roles: UserRole[] = [];
    try {
      roles = dbUser.roles ? JSON.parse(dbUser.roles) : [dbUser.role || 'student'];
    } catch(e) {
      roles = [dbUser.role || 'student'];
    }

    return {
      uid: dbUser.id,
      email: dbUser.email,
      displayName: dbUser.displayName,
      photoURL: dbUser.photoURL,
      roles: roles,
      createdAt: dbUser.createdAt,
    };
  },

  async createProfile(uid: string, email: string, displayName: string | null, photoURL: string | null): Promise<void> {
    // Usually handled by backend sync, but if needed:
    await fetch(`${API_URL}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remoteId: uid, email, displayName, photoURL })
    });
  },

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const token = localStorage.getItem('rg_token');
    await fetch(`${API_URL}/users/${uid}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  },

  async getUsers(uids: string[]): Promise<UserProfile[]> {
    const profiles: UserProfile[] = [];
    for (const uid of uids) {
      const profile = await this.getProfile(uid);
      if (profile) profiles.push(profile);
    }
    return profiles;
  }
};
