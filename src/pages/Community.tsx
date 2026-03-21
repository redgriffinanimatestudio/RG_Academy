import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useLocation } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Shield, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Zap,
  TrendingUp,
  Award,
  Plus,
  Heart,
  Search,
  Filter,
  UserPlus,
  UserMinus,
  MapPin,
  Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { networkingService, FeedEvent, SearchIndex } from '../services/networkingService';
import { userService } from '../services/userService';
import { auth } from '../firebase';

interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  timestamp: Date;
}

export default function Community() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const isStudio = location.pathname.includes('/studio/');
  const modePrefix = isStudio ? '/studio' : '/aca';

  const [activeTab, setActiveTab] = useState<'discussions' | 'feed' | 'discovery'>('discussions');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showDiscussionFilters, setShowDiscussionFilters] = useState(false);
  const [discussionFilters, setDiscussionFilters] = useState({
    category: 'all',
    sortBy: 'recent'
  });
  
  // Networking States
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [recommendations, setRecommendations] = useState<SearchIndex[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNetworkingData();
  }, []);

  const loadNetworkingData = async () => {
    const user = auth.currentUser;
    if (user) {
      const [feedData, recData, followingData] = await Promise.all([
        networkingService.getActivityFeed(user.uid),
        networkingService.getRecommendations(user.uid),
        networkingService.getFollowing(user.uid)
      ]);
      setFeed(feedData);
      setRecommendations(recData);
      setFollowing(followingData);
    }
  };

  const handleFollow = async (targetId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    if (following.includes(targetId)) {
      await networkingService.unfollow(user.uid, targetId);
      setFollowing(prev => prev.filter(id => id !== targetId));
      triggerAlert('info', 'networking', `Unfollowed user`);
    } else {
      await networkingService.follow(user.uid, targetId);
      setFollowing(prev => [...prev, targetId]);
      triggerAlert('success', 'networking', `Now following user`);
    }
  };

  const triggerAlert = (type: Alert['type'], titleKey: string, messageKey: string) => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: t(titleKey) || titleKey,
      message: t(messageKey) || messageKey,
      timestamp: new Date()
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 5));
  };

  const [discussions, setDiscussions] = useState([
    { id: '1', category: 'design', title: 'realistic_skin_shaders', author: 'artist_x', replies: 12, time: '2 hours_ago', type: 'design' },
    { id: '2', category: 'technical', title: 'optimizing_ue5', author: 'artist_x', replies: 8, time: '5 hours_ago', type: 'technical' },
    { id: '3', category: 'showcase', title: 'latest_env_project', author: 'artist_x', replies: 15, time: '1 day_ago', type: 'showcase' },
  ]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', category: 'design' });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim()) return;

    const post = {
      id: Math.random().toString(36).substr(2, 9),
      category: newPost.category,
      title: newPost.title,
      author: 'You',
      replies: 0,
      time: 'just_now',
      type: newPost.category
    };

    setDiscussions([post, ...discussions]);
    setNewPost({ title: '', category: 'design' });
    setShowCreatePost(false);
    triggerAlert('success', 'action_complete', 'Post created successfully!');
  };

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'error': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'system': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      default: return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'system': return <Shield className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const filteredDiscussions = discussions.filter(d => {
    const matchesCategory = discussionFilters.category === 'all' || d.category === discussionFilters.category;
    return matchesCategory;
  }).sort((a, b) => {
    if (discussionFilters.sortBy === 'replies') return b.replies - a.replies;
    return 0; // Default recent
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium mb-6"
          >
            <Users size={14} />
            {t('global_community')}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 uppercase"
          >
            {t('connect_creatives')}
          </motion.h1>
          
          <div className="flex justify-center mt-12">
            <div className="p-1 bg-white/5 rounded-2xl border border-white/5 flex gap-2">
              {[
                { id: 'discussions', label: 'Discussions', icon: MessageSquare },
                { id: 'feed', label: 'Activity Feed', icon: Zap },
                { id: 'discovery', label: 'Find Specialists', icon: Search },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-emerald-500 text-bg-dark shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'}`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'discussions' && (
                <motion.div 
                  key="discussions"
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  {/* Discussions Header & Search/Filter */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search discussions..." 
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border-none rounded-2xl text-sm font-medium text-white placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowDiscussionFilters(!showDiscussionFilters)}
                        className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showDiscussionFilters ? 'bg-emerald-500 text-bg-dark border-emerald-500' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
                      >
                        <Filter size={18} />
                        Filters
                      </button>
                      <button 
                        onClick={() => setShowCreatePost(true)}
                        className="px-6 py-4 rounded-2xl bg-white text-bg-dark font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-zinc-200 transition-all"
                      >
                        <Plus size={18} />
                        Start Topic
                      </button>
                    </div>
                  </div>

                  {/* Discussion Filters Panel */}
                  <AnimatePresence>
                    {showDiscussionFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Category</h4>
                            <div className="flex flex-wrap gap-2">
                              {['all', 'design', 'technical', 'showcase'].map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => setDiscussionFilters({ ...discussionFilters, category: cat })}
                                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${discussionFilters.category === cat ? 'bg-emerald-500 text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Sort By</h4>
                            <div className="flex gap-2">
                              {[
                                { id: 'recent', label: 'Most Recent' },
                                { id: 'replies', label: 'Most Active' }
                              ].map((sort) => (
                                <button
                                  key={sort.id}
                                  onClick={() => setDiscussionFilters({ ...discussionFilters, sortBy: sort.id })}
                                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${discussionFilters.sortBy === sort.id ? 'bg-emerald-500 text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}
                                >
                                  {sort.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                      <MessageSquare className="w-6 h-6 text-emerald-500" />
                      <h2 className="text-2xl font-bold uppercase tracking-tight">{t('recent_discussions')}</h2>
                    </div>

                    <div className="space-y-4">
                      {filteredDiscussions.map((discussion) => (
                        <div key={discussion.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/40 transition-colors cursor-pointer group">
                          {/* ... discussion item content ... */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400">{t(discussion.category)}</span>
                                <span className="text-xs text-zinc-500">{discussion.time}</span>
                              </div>
                              <h4 className="text-lg font-bold group-hover:text-emerald-400 transition-colors mb-2">{t(discussion.title)}</h4>
                              <p className="text-sm text-zinc-500">{t('started_by')} {discussion.author}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                              <img src={`https://picsum.photos/seed/${discussion.id}/100/100`} alt="" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'feed' && (
                <motion.div 
                  key="feed"
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Ecosystem Activity</h2>
                    {feed.length > 0 ? (
                      <div className="space-y-6">
                        {feed.map((event) => (
                          <div key={event.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                              {event.type === 'follow' ? <UserPlus size={20} /> : <Zap size={20} />}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-bold">{event.actorId} <span className="text-white/40 font-normal">{event.type.replace('_', ' ')}</span></p>
                              <p className="text-xs text-white/20 mt-1 uppercase tracking-widest font-black">Just now</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 space-y-4">
                        <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/20">
                          <Zap size={32} />
                        </div>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No activity yet. Follow people to see updates!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'discovery' && (
                <motion.div 
                  key="discovery"
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input
                      type="text"
                      placeholder="Search for specialists, roles, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-5 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map((spec) => (
                      <Link 
                        key={spec.userId} 
                        to={`${modePrefix}/${lang || 'eng'}/profile/${spec.userId}`}
                        className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-emerald-500/30 transition-all group block"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="size-16 rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                            <img src={`https://picsum.photos/seed/${spec.userId}/200/200`} alt="" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-black uppercase tracking-tight text-white truncate">{spec.userId}</h4>
                            <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">{spec.role}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleFollow(spec.userId); }}
                            className={`size-12 rounded-xl flex items-center justify-center transition-all ${following.includes(spec.userId) ? 'bg-white/5 text-white/40' : 'bg-emerald-500 text-bg-dark hover:scale-105'}`}
                          >
                            {following.includes(spec.userId) ? <UserMinus size={20} /> : <UserPlus size={20} />}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {spec.skills.map(skill => (
                            <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">{skill}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20">
                          <div className="flex items-center gap-2"><MapPin size={12} /> {spec.location}</div>
                          <div className="flex items-center gap-2 text-emerald-500">Available</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Networking Stats */}
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Your Network</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-2xl font-black text-white">{following.length}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Following</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-2xl font-black text-white">0</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Followers</div>
                </div>
              </div>
            </div>

            {/* Notifications List (Existing) */}
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <Bell className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold uppercase tracking-tight">{t('system_notifications')}</h2>
              </div>
              {/* ... existing alerts code ... */}
              <AnimatePresence initial={false}>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className={`p-4 rounded-2xl border mb-4 ${getAlertStyles(alert.type)}`}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
                        <p className="text-xs opacity-80 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


