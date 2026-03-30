import { useState, useEffect, useRef } from 'react';
import { chatService, ChatRoom, ChatMessage } from '../../services/chatService';
import { userService, UserProfile } from '../../services/userService';

export function useChatManager(user: any) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<Record<string, UserProfile>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showNewChat, setShowNewChat] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [roomSearchQuery, setRoomSearchQuery] = useState('');
  const [searchResults, setSearchUserResults] = useState<UserProfile[]>([]);

  // 1. Fetch Rooms & Participants
  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      const uid = user.id || user.uid;
      const updatedRooms = await chatService.getChatRooms(uid);
      setRooms(updatedRooms);
      
      const allParticipantIds = Array.from(new Set(updatedRooms.flatMap(r => r.participants)));
      const profiles = await Promise.all(allParticipantIds.map(id => userService.getProfile(id)));
      const profileMap = profiles.reduce((acc, p) => p ? { ...acc, [p.id || p.uid]: p } : acc, {});
      setParticipants(prev => ({ ...prev, ...profileMap }));
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // 2. Filter Rooms
  const filteredRooms = rooms.filter(room => {
    const uid = user?.id || user?.uid;
    const partnerId = room.participants.find(p => p !== uid);
    const partner = partnerId ? participants[partnerId] : null;
    return partner?.displayName?.toLowerCase().includes(roomSearchQuery.toLowerCase()) || 
           room.lastMessage?.toLowerCase().includes(roomSearchQuery.toLowerCase());
  });

  // 3. Fetch Messages for Active Room
  useEffect(() => {
    if (!activeRoomId) return;

    const fetchMessages = () => {
      chatService.subscribeToMessages(activeRoomId, (updatedMessages) => {
        setMessages(updatedMessages);
      });
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeRoomId]);

  // 4. Scroll to Bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 5. User Search
  useEffect(() => {
    if (searchUserQuery.length > 2) {
      // Mock search or real API call
      userService.getProfile(searchUserQuery).then(result => {
        if (result) setSearchUserResults([result]);
        else setSearchUserResults([]);
      });
    } else {
      setSearchUserResults([]);
    }
  }, [searchUserQuery]);

  const handleCreateRoom = async (partnerId: string) => {
    const uid = user?.id || user?.uid;
    if (!uid) return;
    try {
      const roomId = await chatService.createChatRoom([uid, partnerId], 'direct');
      setActiveRoomId(roomId);
      setShowNewChat(false);
      setSearchUserQuery('');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = user?.id || user?.uid;
    if (!uid || !activeRoomId || !newMessage.trim()) return;

    try {
      await chatService.sendMessage(activeRoomId, uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    rooms, filteredRooms, activeRoomId, setActiveRoomId,
    messages, messagesEndRef, newMessage, setNewMessage,
    participants, showNewChat, setShowNewChat,
    searchUserQuery, setSearchUserQuery, roomSearchQuery, setRoomSearchQuery,
    searchResults, handleCreateRoom, handleSendMessage
  };
}
