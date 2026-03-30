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
  // 1. Get Notifications (High-Fidelity Unified Read)
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data } = await apiClient.get(`${API_BASE}`);
      return data.success ? data.data : (Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[Finance Hub] Notifications Read failed:', e);
      return [];
    }
  },

  // 2. Subscription (Polling fallback)
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    this.getNotifications(userId).then(callback);
    const interval = setInterval(() => this.getNotifications(userId).then(callback), 10000);
    return () => clearInterval(interval);
  },

  // 3. Mark as Read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`${API_BASE}/${notificationId}/read`);
    } catch (err) {
      console.error('[Finance Hub] MarkRead failed:', err);
    }
  },

  // 4. Send Notification
  async sendNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<string> {
    try {
      const { data } = await apiClient.post(`${API_BASE}`, notification);
      return data.data.id;
    } catch (err) {
      console.error('[Finance Hub] Send Notification failed:', err);
      throw err;
    }
  }
};
