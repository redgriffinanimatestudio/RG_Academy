import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
  accent: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon: Icon, accent, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#111] border border-white/5 rounded-[2rem] p-6 space-y-4 hover:border-white/10 transition-all shadow-xl group ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{label}</div>
        <Icon size={18} style={{ color: accent }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{sub}</div>
    </div>
  );
};

export default React.memo(StatCard);
