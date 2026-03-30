import apiClient from './apiClient';
import { MIGRATION_CONFIG } from '../config/migration';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string; // info, success, warning, error
  isRead: boolean;
  createdAt: any;
  link?: string;
}

const API_BASE = '/notifications';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const fetchFromPostgres = async () => {
      try {
        const { data } = await apiClient.get(`${API_BASE}`);
        return (data.success && Array.isArray(data.data)) ? data.data : [];
      } catch (e) {
        return [];
      }
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_READ) {
      try {
        return await fetchFromPostgres();
      } catch (err) {
        console.error('[Migration] Notifications Read failed:', err);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api${API_BASE}/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return [];
    const res = await response.json();
    return (res.data || []).map((n: any) => ({
      ...n,
      isRead: n.isRead ?? n.read
    }));
  },

  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    this.getNotifications(userId).then(callback);
    const interval = setInterval(() => this.getNotifications(userId).then(callback), 10000);
    return () => clearInterval(interval);
  },

  async markAsRead(notificationId: string): Promise<void> {
    const markInPostgres = () => apiClient.patch(`${API_BASE}/${notificationId}/read`);
    
    const markInLegacy = async () => {
      const token = localStorage.getItem('auth_token');
      await fetch(`/api${API_BASE}/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_WRITE) {
      try {
        await markInPostgres();
        if (MIGRATION_CONFIG.DUAL_WRITE) {
          markInLegacy().catch(e => console.error('[Migration] Dual-Write NotifMarkRead failed:', e));
        }
        return;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    await markInLegacy();
  },

  async sendNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<string> {
    const sendInPostgres = async () => {
      const { data } = await apiClient.post(`${API_BASE}`, notification);
      return data.data.id;
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_WRITE) {
      try {
        const newId = await sendInPostgres();
        return newId;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api${API_BASE}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(notification)
    });
    const res = await response.json();
    return res.data.id;
  }
};
