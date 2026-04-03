import apiClient from './apiClient';
import { MIGRATION_CONFIG } from '../config/migration';

const API_URL = '/api';

export interface AuthResponse {
  token: string;
  user: any;
}

// Заглушка для legacy Firestore (пока не удалена полностью)
const legacyFirestore = {
  async getUser(id: string) {
    console.warn('[Migration] Calling Legacy Firestore GetUser');
    const stored = localStorage.getItem('rg_user_legacy');
    return stored ? JSON.parse(stored) : null;
  }
};

export const authService = {
  // 1. Вход: Всегда через основной сервер (ProductionDB)
  async login(login: string, password: string): Promise<AuthResponse> {
    try {
      const { data: apiResponse } = await apiClient.post('/auth/login', { login, password });
      const { data } = apiResponse;
      
      this.saveSession(data.token, data.user);
      
      // Dual-Write: Если нужно синхронизировать со старой системой
      if (MIGRATION_CONFIG.DUAL_WRITE) {
        localStorage.setItem('rg_user_legacy', JSON.stringify(data.user));
      }
      
      return data;
    } catch (e: any) {
      const message = e.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  },

  // 2. ProductionDB Read (Primary)
  async getCurrentUser(): Promise<any | null> {
    try {
      const response = await apiClient.get('/auth/me');
      // Handle standard response wrapper { success: true, data: user }
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return response.data; // Return top-level if no wrapper
    } catch (e: any) {
      console.error('[AUTH] User verification failed:', e.message);
      return null;
    }
  },

  // 3. Синхронизация: Для наполнения новой БД из внешних источников (OAuth/Firebase)
  async syncUser(userData: any): Promise<void> {
    if (MIGRATION_CONFIG.USE_PRODUCTION_WRITE) {
      try {
        await apiClient.post('/auth/sync', userData);
      } catch (e) {
        console.error('[Migration] Sync to ProductionDB failed:', e);
      }
    }
  },

  async register(data: { email: string, displayName: string, role: string, phone?: string, provider?: string, password?: string }): Promise<AuthResponse> {
    try {
      const { data: apiResponse } = await apiClient.post('/auth/register', data);
      const { data: result } = apiResponse;
      this.saveSession(result.token, result.user);
      return result;
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Registration failed');
    }
  },

  async socialAuth(data: { email: string, displayName: string, photoURL: string, provider: string, remoteId: string }): Promise<AuthResponse> {
    try {
      const { data: apiResponse } = await apiClient.post('/auth/social-auth', data);
      const { data: result } = apiResponse;
      this.saveSession(result.token, result.user);
      return result;
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Social auth failed');
    }
  },

  async onboard(data: any): Promise<AuthResponse> {
    try {
      const { data: apiResponse } = await apiClient.post('/auth/onboarding', data);
      const { data: result } = apiResponse;
      // Result contains updated user info, save it
      this.saveSession(localStorage.getItem('auth_token') || '', result.user);
      return result;
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Onboarding failed');
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
