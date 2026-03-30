import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NoDataPlaceholderProps {
  icon: LucideIcon;
  message: string;
  link?: string;
  linkText?: string;
}

const NoDataPlaceholder: React.FC<NoDataPlaceholderProps> = ({ icon: Icon, message, link, linkText }) => {
  return (
    <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] space-y-6">
      <Icon size={48} className="mx-auto text-white/10" />
      <p className="text-white/20 font-black uppercase tracking-widest text-xs max-w-xs mx-auto">{message}</p>
      {link && <Link to={link} className="inline-block px-8 py-3 bg-white text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">{linkText}</Link>}
    </div>
  );
};

export default React.memo(NoDataPlaceholder);
