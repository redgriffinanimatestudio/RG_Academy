import apiClient from './apiClient';
import { MIGRATION_CONFIG } from '../config/migration';

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
  profileData?: any; // Stores onboarding specifics
  createdAt: any;
  updatedAt?: any;
}

const API_BASE = '/users';

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const fetchFromPostgres = async () => {
      const { data } = await apiClient.get(`${API_BASE}/${uid}`);
      return data.success ? data.data : data;
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_READ) {
      try {
        return await fetchFromPostgres();
      } catch (err) {
        console.error('[Migration] User Profile Read failed:', err);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const response = await fetch(`/api${API_BASE}/${uid}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  },

  async updateProfile(uid: string, profileData: Partial<UserProfile>): Promise<void> {
    const updateInPostgres = () => apiClient.patch(`${API_BASE}/${uid}`, profileData);
    
    const updateInLegacy = async () => {
      const token = localStorage.getItem('auth_token');
      await fetch(`/api${API_BASE}/${uid}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_WRITE) {
      try {
        await updateInPostgres();
        if (MIGRATION_CONFIG.DUAL_WRITE) {
          updateInLegacy().catch(e => console.error('[Migration] Dual-Write User Profile failed:', e));
        }
        return;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    await updateInLegacy();
  }
};
