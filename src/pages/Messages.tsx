import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { chatService, ChatRoom, ChatMessage } from '../services/chatService';
import { userService, UserProfile } from '../services/userService';
import { Send, Search, User, MoreVertical, Phone, Video, Info, Hash, MessageSquare, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Messages() {
  const { t } = useTranslation();
  const [user, loading] = useAuthState(auth);
  const { lang } = useParams();
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

  useEffect(() => {
    if (!user) return;

    const unsubscribe = chatService.subscribeToChatRooms(user.uid, async (updatedRooms) => {
      setRooms(updatedRooms);
      
      const allParticipantIds = Array.from(new Set(updatedRooms.flatMap(r => r.participants)));
      const profiles = await userService.getUsers(allParticipantIds);
      const profileMap = profiles.reduce((acc, p) => ({ ...acc, [p.uid]: p }), {});
      setParticipants(prev => ({ ...prev, ...profileMap }));
    });

    return () => unsubscribe();
  }, [user]);

  const filteredRooms = rooms.filter(room => {
    const partnerId = room.participants.find(p => p !== user?.uid);
    const partner = partnerId ? participants[partnerId] : null;
    return partner?.displayName?.toLowerCase().includes(roomSearchQuery.toLowerCase()) || 
           room.lastMessage?.toLowerCase().includes(roomSearchQuery.toLowerCase());
  });

  useEffect(() => {
    if (!activeRoomId) return;

    const unsubscribe = chatService.subscribeToMessages(activeRoomId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (searchUserQuery.length > 2) {
      userService.getUsers(['1', '2', '3']).then(results => {
        setSearchUserResults(results.filter(u => u.displayName?.toLowerCase().includes(searchUserQuery.toLowerCase())));
      });
    } else {
      setSearchUserResults([]);
    }
  }, [searchUserQuery]);

  const handleCreateRoom = async (partnerId: string) => {
    if (!user) return;
    try {
      const roomId = await chatService.createChatRoom([user.uid, partnerId], 'direct');
      setActiveRoomId(roomId);
      setShowNewChat(false);
      setSearchUserQuery('');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeRoomId || !newMessage.trim()) return;

    try {
      await chatService.sendMessage(activeRoomId, user.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  );

  if (!user) return <Navigate to={`/login/${lang || 'eng'}`} />;

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const otherParticipant = activeRoom?.participants.find(p => p !== user.uid);
  const activeChatPartner = otherParticipant ? participants[otherParticipant] : null;

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-bg-card rounded-[2.5rem] border border-white/5 overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">{t('messages_title')}</h2>
            <button 
              onClick={() => setShowNewChat(true)}
              className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              value={roomSearchQuery}
              onChange={(e) => setRoomSearchQuery(e.target.value)}
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-3 bg-white/5 border-none rounded-xl text-[11px] font-medium text-white placeholder:text-white/20 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredRooms.map((room) => {
            const partnerId = room.participants.find(p => p !== user.uid);
            const partner = partnerId ? participants[partnerId] : null;
            
            return (
              <div 
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-all border-b border-white/5 hover:bg-white/5 ${activeRoomId === room.id ? 'bg-white/5' : ''}`}
              >
                <div className="relative">
                  <div className="size-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                    {partner?.photoURL ? (
                      <img src={partner.photoURL} alt={partner.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={20} className="text-white/20" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-bg-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white truncate">
                      {partner?.displayName || t('loading')}
                    </h4>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                      {room.updatedAt?.toDate ? room.updatedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 truncate font-medium">
                    {room.lastMessage || t('no_rooms_desc')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black/10">
        {activeRoomId ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                  {activeChatPartner?.photoURL ? (
                    <img src={activeChatPartner.photoURL} alt={activeChatPartner.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={18} className="text-white/20" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">
                    {activeChatPartner?.displayName || t('loading')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{t('status_online')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-white/20 hover:text-white transition-colors"><Phone size={18} /></button>
                <button className="p-2 text-white/20 hover:text-white transition-colors"><Video size={18} /></button>
                <div className="w-[1px] h-4 bg-white/5 mx-2" />
                <button className="p-2 text-white/20 hover:text-white transition-colors"><Info size={18} /></button>
                <button className="p-2 text-white/20 hover:text-white transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {messages.map((msg) => {
                const isMe = msg.senderId === user.uid;
                const sender = participants[msg.senderId];
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex items-start gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="size-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {sender?.photoURL ? (
                        <img src={sender.photoURL} alt={sender.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User size={14} className="text-white/20" />
                      )}
                    </div>
                    <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl text-[11px] font-medium leading-relaxed ${
                        isMe ? 'bg-primary text-bg-dark rounded-tr-none' : 'bg-white/5 text-white rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20 px-1">
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('sending')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-white/5 bg-black/20">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('type_message')} 
                  className="w-full pl-6 pr-16 py-4 bg-white/5 border-none rounded-2xl text-[11px] font-medium text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-bg-dark rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="size-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-white/10">
              <MessageSquare size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{t('select_chat')}</h3>
              <p className="text-white/40 text-sm font-medium max-w-xs mx-auto">
                {t('select_chat_desc')}
              </p>
            </div>
            <button className="px-8 py-3 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all border border-white/5">
              {t('no_rooms')}
            </button>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-zinc-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white">New Message</h3>
                  <button onClick={() => setShowNewChat(false)} className="text-white/20 hover:text-white">
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    autoFocus
                    type="text" 
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    placeholder="Search users by name..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border-none rounded-2xl text-sm font-medium text-white focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                  {searchResults.map((u) => (
                    <button 
                      key={u.uid}
                      onClick={() => handleCreateRoom(u.uid)}
                      className="w-full p-4 flex items-center gap-4 rounded-2xl bg-white/5 hover:bg-primary hover:text-bg-dark transition-all group"
                    >
                      <div className="size-10 rounded-xl bg-white/10 overflow-hidden">
                        <img src={u.photoURL || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-black uppercase tracking-tight">{u.displayName}</div>
                        <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest group-hover:opacity-100 transition-opacity">Start Conversation</div>
                      </div>
                    </button>
                  ))}
                  {searchUserQuery.length > 2 && searchResults.length === 0 && (
                    <p className="text-center py-8 text-sm text-white/20 font-medium">No users found.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
