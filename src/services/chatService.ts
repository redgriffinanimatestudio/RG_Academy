export interface ChatRoom {
  id: string;
  participants: string[];
  type: 'direct' | 'project' | 'group';
  lastMessage?: string;
  updatedAt: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}

const API_URL = '/api/chat';

export const chatService = {
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    const token = localStorage.getItem('rg_token');
    const response = await fetch(`${API_URL}/rooms`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return [];
    const res = await response.json();
    return res.data || [];
  },

  async createChatRoom(participants: string[], type: 'direct' | 'project' | 'group'): Promise<string> {
    const token = localStorage.getItem('rg_token');
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ participants, type }),
    });
    const res = await response.json();
    return res.data.id;
  },

  async sendMessage(roomId: string, senderId: string, text: string): Promise<void> {
    const token = localStorage.getItem('rg_token');
    await fetch(`${API_URL}/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text }),
    });
  },

  subscribeToMessages(roomId: string, callback: (messages: ChatMessage[]) => void) {
    // Basic implementation: fetch once
    const token = localStorage.getItem('rg_token');
    fetch(`${API_URL}/rooms/${roomId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(res => callback(res.data || []));
    
    return () => {}; // Dummy unsubscribe
  },

  subscribeToChatRooms(userId: string, callback: (rooms: ChatRoom[]) => void) {
    this.getChatRooms(userId).then(callback);
    return () => {}; // Dummy unsubscribe
  }
};
