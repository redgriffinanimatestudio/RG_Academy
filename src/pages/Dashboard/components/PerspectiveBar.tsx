import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, UserPlus, DollarSign, GraduationCap, Video, Target, LayoutDashboard, Box, Zap, LifeBuoy, Briefcase, Terminal
} from 'lucide-react';

interface PerspectiveBarProps {
  roles: string[];
  activeRole: string | null;
  onSwitch: (role: string) => void;
}

const ROLE_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  admin: { icon: Terminal, label: 'Master Admin', color: '#7f77dd' },
  hr: { icon: UserPlus, label: 'Talent Matrix', color: '#378add' },
  finance: { icon: DollarSign, label: 'Treasury', color: '#1d9e75' },
  student: { icon: GraduationCap, label: 'Learning', color: '#378add' },
  lecturer: { icon: Video, label: 'Instructor', color: '#7f77dd' },
  chief_manager: { icon: Target, label: 'Strategic', color: '#ef9f27' },
  manager: { icon: LayoutDashboard, label: 'Operational', color: '#1d9e75' },
  client: { icon: Box, label: 'Project', color: '#ef9f27' },
  executor: { icon: Zap, label: 'Freelance', color: '#e24b4a' },
  support: { icon: LifeBuoy, label: 'Support', color: '#ef4444' },
  agency: { icon: Briefcase, label: 'Agency', color: '#378add' },
};

export default function PerspectiveBar({ roles, activeRole, onSwitch }: PerspectiveBarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center w-full mb-12"
    >
      <div className="glass-industrial border border-white/10 rounded-full px-8 py-4 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-r border-white/10 pr-6 mr-2 italic">
          Perspective View
        </span>

        <div className="flex items-center gap-4 relative z-10">
          {roles.map((role) => {
            const config = ROLE_CONFIG[role] || { icon: Shield, label: role, color: '#fff' };
            const isActive = activeRole === role;
            const Icon = config.icon;

            return (
              <button
                key={role}
                onClick={() => onSwitch(role)}
                className={`group/btn relative flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-500 ${
                  isActive 
                  ? 'bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                  : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon 
                  size={18} 
                  style={{ color: isActive ? config.color : undefined }}
                  className={`transition-all duration-500 ${
                    isActive ? 'scale-110 drop-shadow-[0_0_8px_currentColor]' : 'text-white/30 group-hover/btn:text-white/60'
                  }`}
                />
                
                {isActive && (
                  <motion.span 
                    layoutId="activeRoleLabel"
                    className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap"
                  >
                    {config.label}
                  </motion.span>
                )}

                {/* Tooltip for non-active */}
                {!isActive && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 border border-white/10 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">{config.label}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
