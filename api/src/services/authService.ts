import apiClient from './apiClient';
import { MIGRATION_CONFIG } from '../config/migration';

const API_URL = '/api';

export interface AuthResponse {
  token: string;
  user: any;
}

export const authService = {
  async login(login: string, password: string): Promise<AuthResponse> {
    try {
      const { data: apiResponse } = await apiClient.post('/dev/auth', { login, password });
      const { data } = apiResponse;
      
      this.saveSession(data.token, data.user);
      
      if (MIGRATION_CONFIG.DUAL_WRITE) {
        localStorage.setItem('rg_user_legacy', JSON.stringify(data.user));
      }
      
      return data;
    } catch (e: any) {
      const message = e.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  },

  async getCurrentUser(): Promise<any | null> {
    const token = this.getToken();
    if (!token) return null;

    if (MIGRATION_CONFIG.USE_PRODUCTION_READ) {
      try {
        const { data } = await apiClient.get('/me');
        return data; 
      } catch (e) {
        console.error('[Migration] ProductionDB read failed:', e);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw e;
      }
    }

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data;
    } catch (e) {
      return null;
    }
  },

  async syncUser(userData: any): Promise<void> {
    if (MIGRATION_CONFIG.USE_PRODUCTION_WRITE) {
      try {
        await apiClient.post('/sync', userData);
      } catch (e) {
        console.error('[Migration] Sync to ProductionDB failed:', e);
      }
    }
  },

  async register(data: { email: string, displayName: string, role: string, phone?: string, provider?: string }): Promise<AuthResponse> {
    try {
      const { data: apiResponse } = await apiClient.post('/register', data);
      const { data: result } = apiResponse;
      this.saveSession(result.token, result.user);
      return result;
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Registration failed');
    }
  },

  async socialAuth(data: { email: string, displayName: string, photoURL: string, provider: string, remoteId: string }): Promise<AuthResponse> {
    try {
      const { data: apiResponse } = await apiClient.post('/social-auth', data);
      const { data: result } = apiResponse;
      this.saveSession(result.token, result.user);
      return result;
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Social auth failed');
    }
  },

  saveSession(token: string, user: any) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('rg_user', JSON.stringify(user));
    localStorage.setItem('rg_auth_active', 'true');
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('rg_user');
    localStorage.removeItem('rg_auth_active');
    localStorage.removeItem('rg_dev_user');
    localStorage.removeItem('rg_user_legacy');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
};
