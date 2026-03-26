export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: any;
  link?: string;
}

const API_URL = '/api/notifications';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const response = await fetch(`${API_URL}/${userId}`);
    if (!response.ok) return [];
    const res = await response.json();
    return res.data.map((n: any) => ({
      ...n,
      read: n.isRead // mapping db isRead to read
    }));
  },

  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    // Basic implementation for now: fetch once
    this.getNotifications(userId).then(callback);
    
    // Return dummy unsubscribe
    return () => {};
  },

  async markAsRead(notificationId: string): Promise<void> {
    const token = localStorage.getItem('rg_token');
    await fetch(`${API_URL}/${notificationId}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async sendNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<string> {
    const token = localStorage.getItem('rg_token');
    const response = await fetch(`${API_URL}`, {
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
