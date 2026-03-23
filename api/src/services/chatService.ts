import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, serverTimestamp, addDoc, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

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

export const chatService = {
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatRoom));
  },

  async createChatRoom(participants: string[], type: 'direct' | 'project' | 'group'): Promise<string> {
    const docRef = await addDoc(collection(db, 'chatRooms'), {
      participants,
      type,
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async sendMessage(roomId: string, senderId: string, text: string): Promise<void> {
    const messageRef = collection(db, `chatRooms/${roomId}/messages`);
    await addDoc(messageRef, {
      senderId,
      text,
      createdAt: serverTimestamp(),
    });
    
    const roomRef = doc(db, 'chatRooms', roomId);
    await updateDoc(roomRef, {
      lastMessage: text,
      updatedAt: serverTimestamp(),
    });
  },

  subscribeToMessages(roomId: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, `chatRooms/${roomId}/messages`),
      orderBy('createdAt', 'asc'),
      limit(100)
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      callback(messages);
    });
  },

  subscribeToChatRooms(userId: string, callback: (rooms: ChatRoom[]) => void) {
    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatRoom));
      callback(rooms);
    });
  }
};
