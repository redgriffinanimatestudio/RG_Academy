import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Heart
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  timestamp: Date;
}

export default function Community() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const triggerAlert = (type: Alert['type'], titleKey: string, messageKey: string) => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: t(titleKey),
      message: t(messageKey),
      timestamp: new Date()
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 5));
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

  const stats = [
    { id: 'members', label: t('active_members'), value: '42k+', icon: Users },
    { id: 'teams', label: t('project_teams'), value: '1.2k', icon: Zap },
    { id: 'mentors', label: t('verified_mentors'), value: '850', icon: Shield },
    { id: 'tiers', label: t('artist_tiers'), value: '4', icon: Award },
  ];

  const notifications = [
    { id: 'notif-1', type: 'info', msg: t('new_course_added') },
    { id: 'notif-2', type: 'success', msg: t('project_completed') },
    { id: 'notif-3', type: 'warning', msg: t('maintenance_scheduled') },
  ];

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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-xl max-w-2xl mx-auto"
          >
            {t('community_desc')}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 text-center"
            >
              <stat.icon className="w-6 h-6 text-emerald-500 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Create Post Form */}
            <AnimatePresence>
              {showCreatePost && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 rounded-3xl bg-zinc-900 border border-emerald-500/30 mb-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold uppercase tracking-tight">{t('start_topic')}</h3>
                    <button onClick={() => setShowCreatePost(false)} className="text-zinc-500 hover:text-white">
                      <XCircle size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Category</label>
                      <select 
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
                      >
                        <option value="design">Design</option>
                        <option value="technical">Technical</option>
                        <option value="showcase">Showcase</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Topic Title</label>
                      <input 
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="What's on your mind?"
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-colors">
                      Post Topic
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Alerts Demo Section */}
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2 uppercase">{t('real_time_alerts')}</h2>
                  <p className="text-zinc-500 text-sm">{t('alerts_desc')}</p>
                </div>
                <Zap className="w-6 h-6 text-amber-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Standard Alerts */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">{t('standard_alerts')}</h3>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
                    {t('quick_alert_info')}
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                    {t('welcome_platform')}
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-400">
                    {t('transaction_success')}
                  </div>
                </div>

                {/* Interactive Triggers */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">{t('interactive_triggers')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => triggerAlert('system', 'platform_update', 'welcome_platform')} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold transition-colors">System</button>
                    <button onClick={() => triggerAlert('info', 'system_notice', 'stay_tuned')} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold transition-colors">Info</button>
                    <button onClick={() => triggerAlert('success', 'action_complete', 'transaction_success')} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold transition-colors">Success</button>
                    <button onClick={() => triggerAlert('warning', 'security_alert', 'attention_security')} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold transition-colors">Warning</button>
                    <button onClick={() => triggerAlert('error', 'system_error', 'unexpected_error')} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold transition-colors">Error</button>
                    <button onClick={() => triggerAlert('info', 'quick_tip', 'quick_alert_info')} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold transition-colors">Tip</button>
                  </div>
                </div>

                {/* Soft Alerts */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">{t('soft_alerts')}</h3>
                  <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/10 text-sky-400/60 text-xs flex items-center gap-2">
                    <Info size={14} /> {t('stay_tuned')}
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400/60 text-xs flex items-center gap-2">
                    <AlertTriangle size={14} /> {t('attention_security')}
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400/60 text-xs flex items-center gap-2">
                    <XCircle size={14} /> {t('unexpected_error')}
                  </div>
                </div>
              </div>
            </div>

            {/* Discussion Area */}
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-2xl font-bold uppercase tracking-tight">{t('recent_discussions')}</h2>
                </div>
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('start_topic')}
                </button>
              </div>

              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/40 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400">
                            {t(discussion.category)}
                          </span>
                          <span className="text-xs text-zinc-500">{discussion.time.includes('_') ? t(discussion.time) : discussion.time}</span>
                        </div>
                        <h4 className="text-lg font-bold group-hover:text-emerald-400 transition-colors mb-2">
                          {t(discussion.title)}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span className="flex items-center gap-1.5">
                            {t('started_by')} {discussion.author.includes('artist') ? t(discussion.author) : discussion.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            {discussion.replies} {t('replies')}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                        <img src={`https://picsum.photos/seed/${discussion.id}/100/100`} alt="User" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications List */}
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <Bell className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold uppercase tracking-tight">{t('system_notifications')}</h2>
              </div>

              <div className="space-y-4 mb-8">
                <AnimatePresence initial={false}>
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className={`p-4 rounded-2xl border ${getAlertStyles(alert.type)}`}
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
                          <p className="text-xs opacity-80 leading-relaxed">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {alerts.length === 0 && (
                  <div className="space-y-6">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="flex gap-3">
                        <div className={`w-1 h-auto rounded-full ${
                          notif.type === 'info' ? 'bg-sky-500' : 
                          notif.type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{notif.msg}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-black">5 {t('mins_ago')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Community Spotlight */}
            <div className="p-8 rounded-3xl bg-emerald-500 text-black">
              <TrendingUp className="w-8 h-8 mb-6" />
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">{t('community_spotlight')}</h3>
              <p className="text-black/80 text-sm leading-relaxed mb-6">
                {t('milestone_reached')}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">{t('join_movement')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


