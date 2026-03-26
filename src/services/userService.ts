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
  id: string;
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: string; // Current active role
  primaryRole: string; // Original primary role
  roles: UserRole[]; // List of all available roles
  isStudent: boolean;
  isLecturer: boolean;
  isClient: boolean;
  isExecutor: boolean;
  isAdmin: boolean;
  bio?: string;
  createdAt: any;
  updatedAt?: any;
}

const API_URL = '/api';

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const response = await fetch(`${API_URL}/users/${uid}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  },

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const token = localStorage.getItem('auth_token');
    await fetch(`${API_URL}/users/${uid}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  }
};
