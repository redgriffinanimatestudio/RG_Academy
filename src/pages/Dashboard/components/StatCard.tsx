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
      className={`relative group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 space-y-6 overflow-hidden transition-all duration-500 card-glow ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000" style={{ background: accent }} />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-white/40 transition-colors uppercase leading-none">{label}</div>
          <Icon size={20} style={{ color: accent }} className="opacity-20 group-hover:opacity-100 transition-all duration-500" />
        </div>
        <div className="px-3 py-1 glass-premium rounded-lg text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-colors">
          Telemetry
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        <div className="text-5xl font-black text-white tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: accent }}>
          <div className="size-1 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: accent }} />
          {sub}
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatCard);
