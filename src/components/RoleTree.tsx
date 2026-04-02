import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, Users, Info, Lock, Share2, Shield, Settings, Zap, Check } from 'lucide-react';

interface RoleNodeProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  color: string;
  onShowDetail: (id: string) => void;
  disabled?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

const RoleNode: React.FC<RoleNodeProps> = ({ title, icon, x, y, color, onShowDetail, id, disabled, isHighlighted, isSelected }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: isSelected ? 1.6 : (isHighlighted ? 1.05 : 1), 
      opacity: isSelected ? 1 : (isHighlighted ? 1 : (disabled ? 0.65 : 0.95)),
      zIndex: isSelected ? 100 : 20
    }}
    whileHover={!disabled && !isSelected ? { scale: 1.15 } : {}}
    className={`absolute -translate-x-1/2 -translate-y-1/2 group ${disabled ? 'cursor-not-allowed filter grayscale' : 'cursor-pointer'}`}
    style={{ left: `${x}%`, top: `${y}%` }}
    onClick={() => !disabled && !isSelected && onShowDetail(id)}
  >
    <div 
      className={`size-12 sm:size-20 rounded-[2.2rem] bg-[#0a0a0a]/95 backdrop-blur-3xl border-2 flex flex-col items-center justify-center transition-all duration-700 shadow-2xl ${!disabled || isHighlighted ? 'group-hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]' : ''} ${isSelected ? 'ring-8 ring-white/10' : ''}`}
      style={{ 
        borderColor: isSelected ? '#fff' : (isHighlighted ? color : (disabled ? '#333' : color)), 
        boxShadow: isSelected ? `0 0 80px rgba(255, 255, 255, 0.4)` : (isHighlighted ? `0 0 35px ${color}50` : (disabled ? 'none' : `0 0 25px ${color}20`)) 
      }}
    >
      <div style={{ color: isSelected ? '#000' : (isHighlighted ? color : (disabled ? '#666' : color)) }} className={`mb-0.5 z-10 ${isSelected ? 'bg-white p-2 rounded-full' : ''}`}>
        {isSelected ? (
           <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 8, stiffness: 200 }}>
              <Check size={32} strokeWidth={4} />
           </motion.div>
        ) : (
           React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 26 }) : icon
        )}
      </div>
      
      {/* Node Title Overlay */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center">
        <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isHighlighted ? 'text-white' : (disabled ? 'text-white/20' : 'text-white/40 group-hover:text-white')}`}>
          {title}
        </span>
        {disabled && !isHighlighted && <span className="text-[7px] font-black text-red-500/60 uppercase tracking-widest mt-0.5">Restricted</span>}
        {isHighlighted && disabled && <span className="text-[7px] font-black text-red-400 uppercase tracking-widest mt-0.5">Path Locked</span>}
      </div>

      {/* Lock/Info Badge */}
      <div className={`absolute -top-1 -right-1 size-5 rounded-lg border flex items-center justify-center transition-all ${disabled ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10 opacity-0 group-hover:opacity-100'}`}>
        {disabled ? <Lock size={8} className="text-red-500" /> : <Info size={10} className="text-white" />}
      </div>

      {/* Connection Glow */}
      {!disabled && (
        <div className="absolute inset-0 rounded-[1.8rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
             style={{ background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)` }} />
      )}
    </div>
  </motion.div>
);

const ConnectionLine: React.FC<{ 
  x1: number; y1: number; x2: number; y2: number; 
  color: string; disabled?: boolean; animate?: boolean;
  isHighlighted?: boolean;
}> = ({ x1, y1, x2, y2, color, disabled, animate = true, isHighlighted }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
    <defs>
      <filter id={`glow-${x1}-${y1}`}>
        <feGaussianBlur stdDeviation={isHighlighted ? "4" : "2"} result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: 1, 
        opacity: isHighlighted ? 0.8 : (disabled ? 0.05 : 0.2),
        strokeWidth: isHighlighted ? 3 : 1.5 
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
      stroke={isHighlighted ? color : (disabled ? '#222' : color)}
      strokeDasharray={isHighlighted ? "none" : (disabled ? "2 4" : "4 6")}
      filter={`url(#glow-${x1}-${y1})`}
    />
    {animate && !disabled && (
      <motion.circle
        r={isHighlighted ? "3" : "2"}
        fill={color}
        animate={{
          cx: [`${x1}%`, `${x2}%`],
          cy: [`${y1}%`, `${y2}%`],
          opacity: isHighlighted ? [0, 1, 0] : [0, 0.5, 0]
        }}
        transition={{
          duration: isHighlighted ? 2 : 4,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2
        }}
      />
    )}
  </svg>
);

export const RoleTree: React.FC<{ onShowDetail: (id: string) => void }> = ({ onShowDetail }) => {
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  const getLineage = (id: string | null): string[] => {
    if (!id) return [];
    const lineageMap: Record<string, string[]> = {
      user: ['user'],
      student: ['user', 'student'],
      client: ['user', 'client'],
      community: ['user', 'community'],
      artist: ['user', 'student', 'artist'],
      engineer: ['user', 'student', 'engineer'],
      manager: ['user', 'client', 'manager'],
      client_ceo: ['user', 'client', 'client_ceo'],
      executor: ['user', 'student', 'artist', 'executor'],
      partner: ['user', 'client', 'partner'],
      moderator: ['user', 'community', 'moderator']
    };
    return lineageMap[id] || [];
  };

  const highlightPath = getLineage(hoveredNode);
  const isHighlightedLine = (id1: string, id2: string) => {
    return highlightPath.includes(id1) && highlightPath.includes(id2);
  };

  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleNodeSelect = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    setTimeout(() => {
      onShowDetail(id);
    }, 1200);
  };

  return (
    <div className="relative w-full h-[520px] bg-[#050505]/60 rounded-[3.5rem] border border-white/5 overflow-hidden p-10 cursor-default">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* MATRIX DECOR */}
      <div className="absolute top-6 left-10 flex items-center gap-3 opacity-20">
        <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Grid Core Active</span>
      </div>

      <div className="absolute top-6 right-10 flex items-center gap-2 text-[8px] font-black uppercase text-white/10 tracking-[0.3em]">
        Evolution Matrix v2.0 <Share2 size={10} className="text-red-500/40" />
      </div>

      {/* CONNECTIONS (TOP TO BOTTOM) */}
      <ConnectionLine x1={50} y1={12} x2={25} y2={35} color="#ec4899" isHighlighted={isHighlightedLine('user', 'student')} />
      <ConnectionLine x1={50} y1={12} x2={75} y2={35} color="#3b82f6" isHighlighted={isHighlightedLine('user', 'client')} />
      <ConnectionLine x1={50} y1={12} x2={50} y2={42} color="#10b981" isHighlighted={isHighlightedLine('user', 'community')} />

      <ConnectionLine x1={25} y1={35} x2={12} y2={65} color="#ec4899" disabled isHighlighted={isHighlightedLine('student', 'artist')} />
      <ConnectionLine x1={25} y1={35} x2={38} y2={65} color="#ec4899" disabled isHighlighted={isHighlightedLine('student', 'engineer')} />
      <ConnectionLine x1={12} y1={65} x2={25} y2={88} color="#ef4444" disabled isHighlighted={isHighlightedLine('artist', 'executor')} />

      <ConnectionLine x1={75} y1={35} x2={62} y2={65} color="#3b82f6" disabled isHighlighted={isHighlightedLine('client', 'manager')} />
      <ConnectionLine x1={75} y1={35} x2={88} y2={65} color="#3b82f6" disabled isHighlighted={isHighlightedLine('client', 'client_ceo')} />
      <ConnectionLine x1={88} y1={65} x2={75} y2={88} color="#fbbf24" disabled isHighlighted={isHighlightedLine('client_ceo', 'partner')} />

      <ConnectionLine x1={50} y1={42} x2={50} y2={75} color="#10b981" disabled isHighlighted={isHighlightedLine('community', 'moderator')} />

      {/* NODES LAYER 0 - THE CORE */}
      <div onMouseEnter={() => setHoveredNode('user')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="user" title="Node: User" icon={<User />} x={50} y={12} color="#6366f1" onShowDetail={handleNodeSelect} isSelected={selectedId === 'user'} isHighlighted={highlightPath.includes('user')} />
      </div>

      {/* NODES LAYER 1 - INITIATION */}
      <div onMouseEnter={() => setHoveredNode('student')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="student" title="Academy Path" icon={<GraduationCap />} x={25} y={35} color="#ec4899" onShowDetail={handleNodeSelect} isSelected={selectedId === 'student'} isHighlighted={highlightPath.includes('student')} />
      </div>
      <div onMouseEnter={() => setHoveredNode('client')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="client" title="Studio Path" icon={<Briefcase />} x={75} y={35} color="#3b82f6" onShowDetail={handleNodeSelect} isSelected={selectedId === 'client'} isHighlighted={highlightPath.includes('client')} />
      </div>
      <div onMouseEnter={() => setHoveredNode('community')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="community" title="Community" icon={<Users />} x={50} y={42} color="#10b981" onShowDetail={handleNodeSelect} isSelected={selectedId === 'community'} isHighlighted={highlightPath.includes('community')} />
      </div>

      {/* NODES LAYER 2 - SPECIALIZATION (LOCKED) */}
      <div onMouseEnter={() => setHoveredNode('artist')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="artist" title="Artist/VFX" icon={<Zap />} x={12} y={65} color="#ec4899" onShowDetail={handleNodeSelect} disabled isSelected={selectedId === 'artist'} isHighlighted={highlightPath.includes('artist')} />
      </div>
      <div onMouseEnter={() => setHoveredNode('engineer')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="engineer" title="Engineer" icon={<Settings />} x={38} y={65} color="#ec4899" onShowDetail={handleNodeSelect} disabled isSelected={selectedId === 'engineer'} isHighlighted={highlightPath.includes('engineer')} />
      </div>
      <div onMouseEnter={() => setHoveredNode('manager')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="manager" title="Manager" icon={<Shield />} x={62} y={65} color="#3b82f6" onShowDetail={handleNodeSelect} disabled isSelected={selectedId === 'manager'} isHighlighted={highlightPath.includes('manager')} />
      </div>
      <div onMouseEnter={() => setHoveredNode('client_ceo')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="client_ceo" title="Client/CEO" icon={<Briefcase />} x={88} y={65} color="#3b82f6" onShowDetail={handleNodeSelect} disabled isSelected={selectedId === 'client_ceo'} isHighlighted={highlightPath.includes('client_ceo')} />
      </div>

      {/* NODES LAYER 3 - MASTERY (LOCKED) */}
      <div onMouseEnter={() => setHoveredNode('executor')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="executor" title="Pro Specialist" icon={<Shield />} x={25} y={88} color="#ef4444" onShowDetail={handleNodeSelect} disabled isSelected={selectedId === 'executor'} isHighlighted={highlightPath.includes('executor')} />
      </div>
      <div onMouseEnter={() => setHoveredNode('partner')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="partner" title="Agency Partner" icon={<Briefcase />} x={75} y={88} color="#fbbf24" onShowDetail={handleNodeSelect} disabled isSelected={selectedId === 'partner'} isHighlighted={highlightPath.includes('partner')} />
      </div>
      <div onMouseEnter={() => setHoveredNode('moderator')} onMouseLeave={() => setHoveredNode(null)}>
        <RoleNode id="moderator" title="Moderator" icon={<Shield />} x={50} y={75} color="#10b981" onShowDetail={handleNodeSelect} disabled isSelected={selectedId === 'moderator'} isHighlighted={highlightPath.includes('moderator')} />
      </div>

      {/* LAYER LABELS */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-24 opacity-[0.05] pointer-events-none">
        <span className="text-[14px] font-black uppercase rotate-90 tracking-[1em]">Core</span>
        <span className="text-[14px] font-black uppercase rotate-90 tracking-[1em]">Path</span>
        <span className="text-[14px] font-black uppercase rotate-90 tracking-[1em]">Spec</span>
        <span className="text-[14px] font-black uppercase rotate-90 tracking-[1em]">Rank</span>
      </div>
    </div>
  );
};
