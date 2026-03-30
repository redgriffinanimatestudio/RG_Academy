import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

interface TalentCardProps {
  person: any;
  lang: string | undefined;
}

export default function TalentCard({ person, lang }: TalentCardProps) {
  return (
    <Link 
      to={`/studio/${lang || 'eng'}/profile/${person.id}`}
      className="group flex items-center gap-4 p-5 rounded-[1.5rem] border border-white/5 bg-white/5 hover:border-primary/20 hover:bg-white/[0.08] card-glow transition-all cursor-pointer"
    >
      <div className="avatar">
        <div className="size-14 rounded-2xl shadow-lg shadow-black/40 border border-white/10 overflow-hidden ring-4 ring-white/[0.02]">
          <img 
            src={person.profile?.avatar || person.photoURL || `https://picsum.photos/seed/${person.id}/200/200`} 
            alt={person.displayName} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer" 
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-white group-hover:text-primary truncate tracking-tight uppercase transition-colors">{person.displayName}</h4>
        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest truncate mt-0.5">
          {person.profile?.skills?.[0]?.name || person.role || 'Specialist'}
        </p>
      </div>
      <div className="p-3 bg-white/5 text-white/20 rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-all shadow-xl group-hover:shadow-primary/20">
        <MessageSquare size={18} fill="currentColor" className="opacity-20 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
