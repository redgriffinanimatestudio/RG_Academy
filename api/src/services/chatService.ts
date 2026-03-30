import apiClient from './apiClient';
import { MIGRATION_CONFIG } from '../config/migration';

export interface ChatRoom {
  id: string;
  participants: string[];
  type: 'direct' | 'project' | 'group';
  refId?: string;
  lastMessage?: string;
  updatedAt: any;
  createdAt: any;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: any;
}

const API_BASE = '/chat';

export const chatService = {
  // 1. Получение списка комнат
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    const fetchFromPostgres = async () => {
      const { data } = await apiClient.get(`${API_BASE}/rooms`);
      return data.success ? data.data : data;
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_READ) {
      try {
        return await fetchFromPostgres();
      } catch (err) {
        console.error('[Migration] ChatRooms Read failed:', err);
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    // Legacy Fallback
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api${API_BASE}/rooms`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return [];
    const res = await response.json();
    return res.data || [];
  },

  // 2. Создание комнаты
  async createChatRoom(participants: string[], type: 'direct' | 'project' | 'group', refId?: string): Promise<string> {
    const createInPostgres = async () => {
      const { data } = await apiClient.post(`${API_BASE}/rooms`, { participants, type, refId });
      return data.data.id;
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_WRITE) {
      try {
        const newId = await createInPostgres();
        return newId;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ participants, type, refId }),
    });
    const res = await response.json();
    return res.data.id;
  },

  // 3. Отправка сообщения (Dual-Write)
  async sendMessage(roomId: string, senderId: string, text: string): Promise<void> {
    const sendInPostgres = () => apiClient.post(`${API_BASE}/rooms/${roomId}/messages`, { text });
    
    const sendInLegacy = async () => {
      const token = localStorage.getItem('auth_token');
      await fetch(`/api${API_BASE}/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text }),
      });
    };

    if (MIGRATION_CONFIG.USE_POSTGRES_WRITE) {
      try {
        await sendInPostgres();
        if (MIGRATION_CONFIG.DUAL_WRITE) {
          sendInLegacy().catch(e => console.error('[Migration] Dual-Write Message failed:', e));
        }
        return;
      } catch (err) {
        if (!MIGRATION_CONFIG.FAILOVER_TO_FIRESTORE) throw err;
      }
    }

    await sendInLegacy();
  },

  // 4. История сообщений (Hybrid)
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const { data } = await apiClient.get(`${API_BASE}/rooms/${roomId}/messages`);
      return data.success ? data.data : data;
    } catch (err) {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api${API_BASE}/rooms/${roomId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const res = await response.json();
      return res.data || [];
    }
  },

  // Специфично для чатов: объединяем реалтайм подписки
  subscribeToMessages(roomId: string, callback: (messages: ChatMessage[]) => void) {
    this.getMessages(roomId).then(callback);
    const interval = setInterval(() => this.getMessages(roomId).then(callback), 3000);
    return () => clearInterval(interval);
  },

  subscribeToChatRooms(userId: string, callback: (rooms: ChatRoom[]) => void) {
    this.getChatRooms(userId).then(callback);
    const interval = setInterval(() => this.getChatRooms(userId).then(callback), 5000);
    return () => clearInterval(interval);
  }
};
