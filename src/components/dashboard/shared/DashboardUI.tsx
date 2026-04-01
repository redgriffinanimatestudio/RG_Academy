import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
  trend?: 'positive' | 'negative' | 'neutral' | 'stable';
  color?: string;
  className?: string;
}

export const StatCard = ({ label, value, icon: Icon, sub, trend, color = '#378add', className = '' }: StatCardProps) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-10 rounded-[3rem] glass-industrial border border-white/5 space-y-4 group/stat hover:border-white/20 transition-all duration-500 shadow-2xl relative overflow-hidden ${className}`}
  >
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
        <Icon size={120} style={{ color }} />
    </div>
    
    <div className="flex items-center justify-between relative z-10">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors italic">{label}</div>
        {trend === 'positive' && <div className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shadow-sm shadow-emerald-500/10">↑ THRUST_LOG</div>}
    </div>
    
    <div className="text-5xl font-black text-white tracking-tighter italic text-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{value}</div>
    
    {sub && (
      <div className="flex items-center gap-2 text-[9px] font-bold text-white/10 uppercase tracking-widest italic pt-2 group-hover:text-white/30 transition-colors">
          <div className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} /> {sub}
      </div>
    )}
  </motion.div>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
    <header className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-[1px] w-12 bg-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 italic">Node Overview</span>
      </div>
      <h2 className="text-5xl font-black uppercase tracking-tighter text-white italic leading-none lg:text-6xl">{title}</h2>
      {subtitle && (
        <div className="text-white/20 text-[11px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-3 italic">
          <div className="size-1.5 rounded-full bg-primary/40 animate-pulse" />
          {subtitle}
        </div>
      )}
    </header>
    {action}
  </div>
);

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'glass' | 'premium';
  style?: React.CSSProperties;
  whileHover?: any;
  whileTap?: any;
  onClick?: () => void;
}

export const GlassCard = ({ children, className = '', variant = 'glass', style, whileHover, whileTap, onClick }: GlassCardProps) => {
  const isPremium = variant === 'premium';
  
  return (
    <motion.div 
      style={style}
      whileHover={whileHover || (onClick ? { scale: 1.01 } : undefined)}
      whileTap={whileTap || (onClick ? { scale: 0.98 } : undefined)}
      onClick={onClick}
      className={`
        p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group
        ${variant === 'dark' ? 'bg-[#050505]' : (variant === 'premium' ? 'glass-industrial matrix-grid-bg' : 'bg-white/[0.02]')} 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {isPremium && (
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
