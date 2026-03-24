import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchIndex } from '../../services/networkingService';

interface SpecialistDiscoveryProps {
  recommendations: SearchIndex[];
  following: string[];
  handleFollow: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  modePrefix: string;
  lang: string | undefined;
}

export default function SpecialistDiscovery({
  recommendations, following, handleFollow, searchQuery, setSearchQuery, modePrefix, lang
}: SpecialistDiscoveryProps) {
  return (
    <motion.div 
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
          className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/5 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-white placeholder:text-white/20 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((spec) => (
          <div 
            key={spec.userId} 
            className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-emerald-500/30 transition-all group block"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link to={`${modePrefix}/${lang || 'eng'}/profile/${spec.userId}`} className="size-16 rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                <img src={`https://picsum.photos/seed/${spec.userId}/200/200`} alt="" referrerPolicy="no-referrer" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`${modePrefix}/${lang || 'eng'}/profile/${spec.userId}`}>
                  <h4 className="text-lg font-black uppercase tracking-tight text-white truncate hover:text-emerald-500 transition-colors">{spec.userId}</h4>
                </Link>
                <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">{spec.role}</p>
              </div>
              <button 
                onClick={() => handleFollow(spec.userId)}
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
          </div>
        ))}
      </div>
    </motion.div>
  );
}
