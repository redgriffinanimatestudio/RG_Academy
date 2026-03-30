import React from 'react';
import { Layers, GraduationCap } from 'lucide-react';
import { Profile } from '../../../services/networkingService';

interface PortfolioTabProps {
  profile: Profile;
  synergyBadges: any[];
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({ profile, synergyBadges }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profile.portfolio?.length ? profile.portfolio.map((item: any) => (
        <div key={item.id} className="group relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a0a0a]">
          <img src={item.mediaUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 space-y-2">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-lg">{item.category || 'Visual Art'}</span>
              {synergyBadges.some(b => b.synergy === 'le') && (
                <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
                  <graduationcap size={10} /> Teaching Logic
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h3>
          </div>
        </div>
      )) : (
        <div className="col-span-full py-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
          <Layers size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/20 font-black uppercase tracking-widest text-xs">No portfolio entries available</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(PortfolioTab);
