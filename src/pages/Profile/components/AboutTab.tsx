import React from 'react';
import { Profile } from '../../../services/networkingService';

interface AboutTabProps {
  profile: Profile;
  t: (key: string, def?: string) => string;
}

const AboutTab: React.FC<AboutTabProps> = ({ profile, t }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">{t('biography', 'Biography')}</h2>
          <p className="text-lg text-white/60 font-medium leading-relaxed">{profile.bio || t('default_bio', 'Professional CG Specialist in the Red Griffin Ecosystem.')}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: t('completion', 'Completion'), value: '98%', color: 'text-emerald-500' },
            { label: t('response', 'Response'), value: '< 2h', color: 'text-sky-500' },
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5">
              <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight">{t('expertise', 'Expertise')}</h2>
          <div className="flex flex-wrap gap-2">
            {['Unreal Engine', 'Maya', 'Houdini', 'ZBrush', 'Substance'].map(skill => (
              <span key={skill} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AboutTab);
