import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { networkingService, FeedEvent, SearchIndex } from '../../services/networkingService';
import { useAuth } from '../../context/AuthContext';

// Modular Community Components
import CommunityHeader from '../../components/community/CommunityHeader';
import DiscussionsList from '../../components/community/DiscussionsList';
import ActivityFeed from '../../components/community/ActivityFeed';
import SpecialistDiscovery from '../../components/community/SpecialistDiscovery';
import CommunitySidebar from '../../components/community/CommunitySidebar';

interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  timestamp: Date;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const isStudio = location.pathname.includes('/studio/');
  const modePrefix = isStudio ? '/studio' : '/aca';

  const [activeTab, setActiveTab] = useState<'discussions' | 'feed' | 'discovery'>('discussions');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showDiscussionFilters, setShowDiscussionFilters] = useState(false);
  const [discussionFilters, setDiscussionFilters] = useState({ category: 'all', sortBy: 'recent' });

  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [recommendations, setRecommendations] = useState<SearchIndex[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNetworkingData();
  }, [user]);

  const loadNetworkingData = async () => {
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

  const [discussions] = useState([
    { id: '1', category: 'design', title: 'realistic_skin_shaders', author: 'artist_x', replies: 12, time: '2 hours_ago' },
    { id: '2', category: 'technical', title: 'optimizing_ue5', author: 'artist_x', replies: 8, time: '5 hours_ago' },
    { id: '3', category: 'showcase', title: 'latest_env_project', author: 'artist_x', replies: 15, time: '1 day_ago' },
  ]);

  const filteredDiscussions = discussions.filter(d => discussionFilters.category === 'all' || d.category === discussionFilters.category);

  return (
    <div className="space-y-12 py-8">
      <CommunityHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'discussions' && (
              <DiscussionsList 
                discussions={filteredDiscussions}
                showFilters={showDiscussionFilters}
                setShowFilters={setShowDiscussionFilters}
                filters={discussionFilters}
                setFilters={setDiscussionFilters}
                onCreatePost={() => {}}
              />
            )}
            {activeTab === 'feed' && <ActivityFeed feed={feed} />}
            {activeTab === 'discovery' && (
              <SpecialistDiscovery 
                recommendations={recommendations}
                following={following}
                handleFollow={handleFollow}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                modePrefix={modePrefix}
                lang={lang}
              />
            )}
          </AnimatePresence>
        </div>

        <CommunitySidebar 
          followingCount={following.length}
          followersCount={0}
          alerts={alerts}
        />
      </div>
    </div>
  );
}
