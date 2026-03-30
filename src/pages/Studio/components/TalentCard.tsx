import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

interface TalentCardProps {
  person: any;
  lang: string | undefined;
}

const TalentCard: React.FC<TalentCardProps> = ({ person, lang }) => {
  return (
    <Link 
      to={`/studio/${lang || 'eng'}/profile/${person.id}`}
      className="group flex items-center gap-4 p-5 rounded-[1.5rem] border border-white/5 bg-white/5 hover:border-primary/20 transition-all cursor-pointer"
    >
      <div className="avatar">
        <div className="size-14 rounded-2xl shadow-lg shadow-black/20 border border-white/5">
          <img src={person.profile?.avatar || person.photoURL || `https://picsum.photos/seed/${person.id}/200/200`} alt={person.displayName} referrerPolicy="no-referrer" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-white truncate tracking-tight uppercase text-left">{person.displayName}</h4>
        <p className="text-xs text-white/40 font-medium truncate text-left">
          {person.profile?.skills?.[0]?.name || person.role || 'Specialist'}
        </p>
      </div>
      <div className="p-3 bg-white/5 text-white/20 rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-all">
        <MessageSquare size={18} />
      </div>
    </Link>
  );
};

export default React.memo(TalentCard);
