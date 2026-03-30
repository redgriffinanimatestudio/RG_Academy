import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ProfileTab } from '../useProfileLogic';

interface ProfileTabsNavProps {
  tabs: { id: ProfileTab; label: string; icon: LucideIcon }[];
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}

const ProfileTabsNav: React.FC<ProfileTabsNavProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-[2rem] overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === tab.id ? 'bg-white text-bg-dark shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default React.memo(ProfileTabsNav);
