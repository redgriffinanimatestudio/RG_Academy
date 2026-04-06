import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, Briefcase, Users, 
  Zap, Settings, Shield, BriefcaseIcon, 
  ChevronRight, ChevronLeft, Lock, Info, Sparkles, Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SubRole {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

interface PathBranch {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  subRoles: SubRole[];
}

const BRANCHES: PathBranch[] = [
  {
    id: 'student',
    title: 'Academy Path',
    icon: <GraduationCap size={24} />,
    description: 'Master the arts of digital synchronization and neural rendering.',
    color: '#ec4899', // Pink
    subRoles: [
      { id: 'artist', title: 'Artist/VFX', icon: <Zap size={14} />, color: '#ec4899' },
      { id: 'engineer', title: 'Engineer', icon: <Settings size={14} />, color: '#ec4899' },
      { id: 'executor', title: 'Pro Specialist', icon: <Shield size={14} />, color: '#ef4444' }
    ]
  },
  {
    id: 'client',
    title: 'Studio Path',
    icon: <BriefcaseIcon size={24} />,
    description: 'Commission industrial-grade assets and manage digital collectives.',
    color: '#3b82f6', // Blue
    subRoles: [
      { id: 'manager', title: 'Manager', icon: <Shield size={14} />, color: '#3b82f6' },
      { id: 'client_ceo', title: 'Client/CEO', icon: <Briefcase size={14} />, color: '#3b82f6' },
      { id: 'partner', title: 'Agency Partner', icon: <Briefcase size={14} />, color: '#fbbf24' }
    ]
  },
  {
    id: 'community',
    title: 'Community Sector',
    icon: <Users size={24} />,
    description: 'Moderate the collective and ensure ecosystem stability.',
    color: '#10b981', // Emerald
    subRoles: [
      { id: 'moderator', title: 'Moderator', icon: <Shield size={14} />, color: '#10b981' }
    ]
  }
];

interface IdentityGatewayProps {
  onSelect: (roleId: string) => void;
  selectedId?: string | null;
}

const IdentityGateway: React.FC<IdentityGatewayProps> = ({ onSelect, selectedId: externalSelectedId }) => {
  const { t } = useTranslation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(externalSelectedId || null);

  const handlePathSelect = (id: string) => {
    setSelectedPath(id);
    onSelect(id);
  };

  return (
    <div className="w-full relative py-12 px-4 sm:px-0">
      {/* --- DESKTOP VIEW: HORIZONTAL MULTIBRUNCH --- */}
      <div className="hidden lg:block relative h-[500px] w-full gateway-perspective overflow-visible">
        
        {/* SVG Background Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
          <defs>
            <filter id="glow-line">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {BRANCHES.map((branch, idx) => {
            const yPos = 20 + (idx * 30); // 20%, 50%, 80%
            const isHovered = hoveredPath === branch.id || selectedPath === branch.id;
            return (
              <g key={`connection-${branch.id}`}>
                {/* Horizontal Pulse Line */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isHovered ? 0.6 : 0.1,
                    stroke: branch.color,
                    strokeWidth: isHovered ? 3 : 1
                  }}
                  d={`M 150 ${250} C 300 250, 300 ${yPos * 5}, 450 ${yPos * 5}`}
                  fill="none"
                  className={isHovered ? "neural-line-pulse" : ""}
                  filter="url(#glow-line)"
                />
                
                {/* Sub-role connections */}
                {branch.subRoles.map((sub, sIdx) => {
                  const subY = (yPos * 5) + (sIdx - 1) * 60;
                  return (
                    <motion.path
                      key={`sub-conn-${sub.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: isHovered ? 0.3 : 0.05,
                        stroke: sub.color,
                        strokeWidth: 1
                      }}
                      d={`M 750 ${yPos * 5} L 850 ${subY}`}
                      fill="none"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* ROOT NODE: USER */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute left-[50px] top-[210px] z-20 flex flex-col items-center gap-4"
        >
          <div className="size-24 rounded-[2.5rem] bg-bg-dark border-2 border-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)] glass-pro-max">
             <User size={32} className="text-primary" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-ink opacity-40">Root Identifier</span>
        </motion.div>

        {/* BRANCH NODES: PATHS */}
        <div className="absolute left-[450px] inset-y-0 flex flex-col justify-around z-20 w-[300px]">
          {BRANCHES.map((branch) => (
            <motion.div
              key={branch.id}
              onMouseEnter={() => setHoveredPath(branch.id)}
              onMouseLeave={() => setHoveredPath(null)}
              onClick={() => handlePathSelect(branch.id)}
              className={`neural-card-3d p-6 rounded-[2.5rem] border transition-all cursor-pointer relative group glass-pro-max overflow-hidden ${selectedPath === branch.id ? 'border-primary ring-4 ring-primary/10' : 'border-white/5 hover:border-white/20'}`}
            >
              {/* Card Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000" style={{ background: `radial-gradient(circle at center, ${branch.color}50 0%, transparent 70%)` }} />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="size-14 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: branch.color }}>
                  {branch.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-ink">{branch.title}</h4>
                  <p className="text-[9px] font-bold text-text-muted mt-1 leading-tight opacity-60">{branch.description}</p>
                </div>
                {selectedPath === branch.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 size-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check size={14} className="text-white" strokeWidth={4} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* LEAF NODES: SUB-ROLES (GREYED OUT) */}
        <div className="absolute left-[850px] inset-y-0 flex flex-col justify-around z-10 w-[200px]">
          {BRANCHES.map((branch) => (
            <div key={`leaves-${branch.id}`} className="space-y-4">
              {branch.subRoles.map((sub) => (
                <motion.div
                  key={sub.id}
                  animate={{ opacity: (hoveredPath === branch.id || selectedPath === branch.id) ? 0.6 : 0.15 }}
                  className="flex items-center gap-3 grayscale group hover:grayscale-0 transition-all cursor-not-allowed"
                >
                  <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                    {sub.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60">{sub.title}</span>
                    <span className="text-[7px] font-bold text-red-500/40 uppercase tracking-tighter">Locked Sector</span>
                  </div>
                  <Lock size={10} className="text-white/10 ml-auto" />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* --- MOBILE VIEW: PROFESSIONAL SWIPE CAROUSEL --- */}
      <div className="lg:hidden w-full flex flex-col items-center">
        <div className="carousel-snap flex overflow-x-auto w-full gap-6 pb-8 snap-x snap-mandatory px-4">
          {BRANCHES.map((branch) => (
            <div key={`mob-${branch.id}`} className="carousel-item flex-none w-[85vw] snap-center">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePathSelect(branch.id)}
                className={`p-10 rounded-[3.5rem] border relative overflow-hidden glass-pro-max ${selectedPath === branch.id ? 'border-primary ring-8 ring-primary/5' : 'border-white/5'}`}
              >
                <div className="absolute top-0 right-0 size-40 opacity-[0.05] -translate-y-1/2 translate-x-1/2">
                  {branch.icon}
                </div>
                
                <div className="size-16 rounded-[1.8rem] flex items-center justify-center text-white mb-8 shadow-2xl" style={{ backgroundColor: branch.color }}>
                  {React.cloneElement(branch.icon as React.ReactElement<{ size: number }>, { size: 32 })}
                </div>

                <h3 className="text-2xl font-black uppercase tracking-widest text-ink mb-4">{branch.title}</h3>
                <p className="text-xs font-bold text-text-muted leading-relaxed mb-8 opacity-60">{branch.description}</p>

                <div className="space-y-3 pt-6 border-t border-white/5">
                   <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-4">Available Specializations:</p>
                   <div className="flex flex-wrap gap-2">
                     {branch.subRoles.map(sub => (
                       <div key={`sub-mob-${sub.id}`} className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 grayscale scale-90">
                         {sub.icon} <span className="text-[9px] font-black uppercase text-white/30">{sub.title}</span>
                       </div>
                     ))}
                   </div>
                </div>

                {selectedPath === branch.id && (
                  <div className="mt-8 py-4 bg-primary rounded-2xl flex items-center justify-center gap-3 animate-pulse">
                    <Check size={18} className="text-white" strokeWidth={4} />
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">Selected Profile</span>
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div className="flex gap-3 mt-4">
          {BRANCHES.map((b) => (
            <div key={`dot-${b.id}`} className={`size-1.5 rounded-full transition-all duration-500 ${selectedPath === b.id ? 'w-8 bg-primary' : 'bg-white/20'}`} />
          ))}
        </div>
        <p className="text-[10px] font-black uppercase text-text-muted mt-8 opacity-30 tracking-[0.4em] animate-pulse">Swipe to explore roles</p>
      </div>

      {/* Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-[0.03] z-0"
           style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
    </div>
  );
};

export default IdentityGateway;
