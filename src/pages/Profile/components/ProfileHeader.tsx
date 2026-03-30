import React from 'react';
import { MapPin, Briefcase, MessageSquare, Zap, ShieldCheck } from 'lucide-react';
import { Profile } from '../../../services/networkingService';

interface ProfileHeaderProps {
  profile: Profile;
  synergyBadges: any[];
  handleStartChat: () => void;
  isValidating: boolean;
  t: (key: string, def?: string) => string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, synergyBadges, handleStartChat, isValidating, t }) => {
  return (
    <div className="relative rounded-[3rem] bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl">
      <div className="h-48 bg-gradient-to-r from-primary/20 to-primary-hover/20 relative">
        <img src={`https://picsum.photos/seed/${profile.id}/1200/400`} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>
      
      <div className="px-10 pb-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-8">
        <div className="relative group">
          <div className="size-40 rounded-[2.5rem] overflow-hidden border-4 border-[#0a0a0a] shadow-2xl bg-[#111]">
            <img src={profile.avatar || profile.user.photoURL || `https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png`} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-2xl flex items-center justify-center text-bg-dark shadow-lg">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="flex-1 space-y-4 pb-4">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {synergyBadges.map(badge => (
                <span key={badge.id} className={`flex items-center gap-1.5 px-3 py-1 ${badge.color} text-bg-dark text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg`}>
                  <badge.icon size={10} />
                  {badge.label}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">{profile.user.displayName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
              <div className="flex items-center gap-2"><MapPin size={12} className="text-primary" /> {profile.location || 'Remote'}</div>
              <div className="flex items-center gap-2"><Briefcase size={12} className="text-primary" /> {profile.skills?.[0]?.name || 'Visual Specialist'}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pb-4">
          <button 
            onClick={handleStartChat}
            disabled={isValidating}
            className={`px-8 py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 ${isValidating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isValidating ? (
              <div className="size-3 border-2 border-bg-dark border-t-transparent animate-spin rounded-full" />
            ) : <MessageSquare size={14} />}
            {t('connect', 'Connect')}
          </button>
          <button 
            onClick={handleStartChat}
            disabled={isValidating}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all disabled:opacity-50"
          >
            <Zap size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileHeader);
