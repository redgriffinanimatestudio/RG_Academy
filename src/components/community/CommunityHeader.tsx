import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Zap, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CommunityHeaderProps {
  activeTab: 'discussions' | 'feed' | 'discovery';
  setActiveTab: (tab: 'discussions' | 'feed' | 'discovery') => void;
}

export default function CommunityHeader({ activeTab, setActiveTab }: CommunityHeaderProps) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'feed', label: 'Activity Feed', icon: Zap },
    { id: 'discovery', label: 'Find Specialists', icon: Search },
  ];

  return (
    <div className="text-center">
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
        className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase"
      >
        {t('connect_creatives')}
      </motion.h1>
      
      <div className="flex justify-center mt-12">
        <div className="p-1 bg-white/5 rounded-2xl border border-white/5 flex gap-2 overflow-x-auto no-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-500 text-bg-dark shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
