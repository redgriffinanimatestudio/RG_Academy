import { UserRole, UserProfile } from './userService';

const API_URL = '/api';

export interface AuthResponse {
  token: string;
  user: any;
}

export const authService = {
  // Используем наш новый devLogin для входа admin/admin
  async login(login: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/dev/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const { data } = await response.json();
    
    // Сохраняем токен и данные
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('rg_user', JSON.stringify(data.user));
    localStorage.setItem('rg_auth_active', 'true');
    
    return data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('rg_user');
    localStorage.removeItem('rg_auth_active');
    localStorage.removeItem('rg_dev_user');
  },

  async getCurrentUser(): Promise<any | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const { data } = await response.json();
      return data;
    } catch (e) {
      console.error('Fetch user error:', e);
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
};
