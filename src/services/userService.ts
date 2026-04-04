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
  | 'agency'
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
  isHr: boolean;
  isFinance: boolean;
  isSupport: boolean;
  isAdmin: boolean;
  balance: number; // Phase 6.2 Ledger
  isOnboarded?: boolean;
  bio?: string;
  country?: string | null;
  citizenship?: string | null;
  linkedInUrl?: string | null;
  telegramHandle?: string | null;
  portfolioUrl?: string | null;
  gender?: string | null;
  dateOfBirth?: string | Date | null;
  createdAt: any;
  updatedAt?: any;
}

const API_BASE = '/users';

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    if (MIGRATION_CONFIG.USE_PRODUCTION_READ) {
      try {
        const { data } = await apiClient.get(`${API_BASE}/${uid}`);
        return data.success ? data.data : data;
      } catch (err) {
        console.error('[Migration] ProductionDB User Profile Read failed:', err);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    // Legacy Fallback
    const response = await fetch(`/api${API_BASE}/${uid}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  },

  async updateProfile(uid: string, profileData: Partial<UserProfile>): Promise<void> {
    const updateInProductionDB = () => apiClient.patch(`${API_BASE}/${uid}`, profileData);
    
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

    if (MIGRATION_CONFIG.USE_PRODUCTION_WRITE) {
      try {
        await updateInProductionDB();
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
