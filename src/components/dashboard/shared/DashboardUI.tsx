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
    whileHover={{ y: -10 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-10 rounded-[3rem] bg-bg-card backdrop-blur-3xl border border-border-main space-y-4 group/stat hover:border-primary/20 transition-all duration-500 shadow-main relative overflow-hidden ${className}`}
  >
    {/* ⚡ Neural Energy Pulse */}
    <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent animate-pulse" />
    </div>

    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
        <Icon size={120} style={{ color }} />
    </div>
    
    <div className="flex items-center justify-between relative z-10">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted group-hover:text-ink transition-colors italic">{label}</div>
        {trend === 'positive' && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                <div className="size-1 rounded-full bg-primary animate-pulse" />
                <span className="text-[8px] font-black text-primary uppercase tracking-widest">Symmetry High</span>
            </div>
        )}
    </div>
    
    <div className="text-5xl font-black text-ink tracking-tighter italic text-glow drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] relative z-10">
        {value}
    </div>
    
    {sub && (
      <div className="flex items-center gap-2 text-[9px] font-bold text-text-muted/40 uppercase tracking-widest italic pt-2 group-hover:text-ink/60 transition-colors relative z-10">
          <div className="size-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color }} /> {sub}
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
        <div className="h-[1px] w-12 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 italic">Node Overview</span>
      </div>
      <h2 className="text-5xl font-black uppercase tracking-tighter text-ink italic leading-none lg:text-7xl drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.05)]">{title}</h2>
      {subtitle && (
        <div className="text-text-muted text-[11px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-3 italic">
          <div className="size-1.5 rounded-full bg-primary/40 animate-pulse shadow-[0_0_8px_#00f5d4]" />
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
        p-10 rounded-[3.5rem] border border-border-main shadow-card relative overflow-hidden group
        ${variant === 'dark' ? 'bg-bg-main/90' : (variant === 'premium' ? 'bg-primary/5 backdrop-blur-3xl' : 'bg-bg-card backdrop-blur-2xl')} 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* 🔮 Matrix Grid Overlay (Premium Only) */}
      {isPremium && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      )}
      
      {/* 🌈 Hover Glow Effect */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
