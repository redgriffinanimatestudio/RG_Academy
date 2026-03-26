import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export const StatCard = ({ label, value, icon: Icon, trend, color = 'primary' }: StatCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group transition-all hover:bg-white/[0.08]"
  >
    <div>
      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest group-hover:text-white/40 transition-colors">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-3xl font-black text-white">{value}</p>
        {trend && <span className="text-[10px] font-bold text-emerald-500">{trend}</span>}
      </div>
    </div>
    <div className={`p-4 rounded-2xl bg-${color}/10 text-${color} group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
  </motion.div>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-8">
    <header>
      <h2 className="text-xl font-black uppercase tracking-tight text-white italic">{title}</h2>
      {subtitle && <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">{subtitle}</p>}
    </header>
    {action}
  </div>
);

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'glass';
}

export const GlassCard = ({ children, className = '', variant = 'glass' }: GlassCardProps) => (
  <div className={`
    p-8 rounded-[2.5rem] border border-white/5 
    ${variant === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white/[0.02]'} 
    ${className}
  `}>
    {children}
  </div>
);
