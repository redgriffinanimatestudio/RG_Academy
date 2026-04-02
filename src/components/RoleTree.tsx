import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, Users, Info, Lock, Share2, Shield, Settings, Zap } from 'lucide-react';

interface RoleNodeProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  color: string;
  onShowDetail: (id: string) => void;
  disabled?: boolean;
}

const RoleNode: React.FC<RoleNodeProps> = ({ title, icon, x, y, color, onShowDetail, id, disabled }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: disabled ? 0.35 : 1 }}
    whileHover={!disabled ? { scale: 1.15 } : {}}
    className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 ${disabled ? 'cursor-not-allowed filter grayscale' : 'cursor-pointer'}`}
    style={{ left: `${x}%`, top: `${y}%` }}
    onClick={() => !disabled && onShowDetail(id)}
  >
    <div 
      className={`size-12 sm:size-16 rounded-[1.8rem] bg-[#0a0a0a]/90 backdrop-blur-xl border-2 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${!disabled ? 'group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]' : ''}`}
      style={{ borderColor: disabled ? '#222' : color, boxShadow: disabled ? 'none' : `0 0 25px ${color}15` }}
    >
      <div style={{ color: disabled ? '#444' : color }} className="mb-0.5">
        {React.cloneElement(icon as React.ReactElement, { size: 22 })}
      </div>
      
      {/* Node Title Overlay */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center">
        <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${disabled ? 'text-white/20' : 'text-white/40 group-hover:text-white'}`}>
          {title}
        </span>
        {disabled && <span className="text-[7px] font-black text-red-500/60 uppercase tracking-widest mt-0.5">Restricted</span>}
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

const ConnectionLine: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string, disabled?: boolean, animate?: boolean }> = ({ x1, y1, x2, y2, color, disabled, animate = true }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
    <defs>
      <filter id={`glow-${x1}-${y1}`}>
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: disabled ? 0.05 : 0.25 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
      stroke={disabled ? '#222' : color}
      strokeWidth="1.5"
      strokeDasharray={disabled ? "2 4" : "4 6"}
      filter={`url(#glow-${x1}-${y1})`}
    />
    {animate && !disabled && (
      <motion.circle
        r="2"
        fill={color}
        animate={{
          cx: [`${x1}%`, `${x2}%`],
          cy: [`${y1}%`, `${y2}%`],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2
        }}
      />
    )}
  </svg>
);

export const RoleTree: React.FC<{ onShowDetail: (id: string) => void }> = ({ onShowDetail }) => {
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
      {/* Root to Layer 1 */}
      <ConnectionLine x1={50} y1={12} x2={25} y2={35} color="#ec4899" /> {/* Academy */}
      <ConnectionLine x1={50} y1={12} x2={75} y2={35} color="#3b82f6" /> {/* Studio */}
      <ConnectionLine x1={50} y1={12} x2={50} y2={42} color="#10b981" /> {/* Community */}

      {/* Academy Branch */}
      <ConnectionLine x1={25} y1={35} x2={12} y2={65} color="#ec4899" disabled /> {/* Artist */}
      <ConnectionLine x1={25} y1={35} x2={38} y2={65} color="#ec4899" disabled /> {/* Engineer */}
      <ConnectionLine x1={25} y1={65} x2={25} y2={88} color="#ef4444" disabled /> {/* Pro Specialist */}

      {/* Studio Branch */}
      <ConnectionLine x1={75} y1={35} x2={62} y2={65} color="#3b82f6" disabled /> {/* Manager */}
      <ConnectionLine x1={75} y1={35} x2={88} y2={65} color="#3b82f6" disabled /> {/* Client CEO */}
      <ConnectionLine x1={75} y1={65} x2={75} y2={88} color="#fbbf24" disabled /> {/* Agency / Partner */}

      {/* Community Branch */}
      <ConnectionLine x1={50} y1={42} x2={50} y2={75} color="#10b981" disabled /> {/* Moderator */}

      {/* NODES LAYER 0 - THE CORE */}
      <RoleNode id="user" title="Node: User" icon={<User />} x={50} y={12} color="#6366f1" onShowDetail={onShowDetail} disabled />

      {/* NODES LAYER 1 - INITIATION */}
      <RoleNode id="student" title="Academy Path" icon={<GraduationCap />} x={25} y={35} color="#ec4899" onShowDetail={onShowDetail} />
      <RoleNode id="client" title="Studio Path" icon={<Briefcase />} x={75} y={35} color="#3b82f6" onShowDetail={onShowDetail} />
      <RoleNode id="community" title="Community" icon={<Users />} x={50} y={42} color="#10b981" onShowDetail={onShowDetail} />

      {/* NODES LAYER 2 - SPECIALIZATION (LOCKED) */}
      <RoleNode id="artist" title="Artist/VFX" icon={<Zap />} x={12} y={65} color="#ec4899" onShowDetail={onShowDetail} disabled />
      <RoleNode id="engineer" title="Engineer" icon={<Settings />} x={38} y={65} color="#ec4899" onShowDetail={onShowDetail} disabled />
      <RoleNode id="manager" title="Manager" icon={<Shield />} x={62} y={65} color="#3b82f6" onShowDetail={onShowDetail} disabled />
      <RoleNode id="client_ceo" title="Client/CEO" icon={<Briefcase />} x={88} y={65} color="#3b82f6" onShowDetail={onShowDetail} disabled />

      {/* NODES LAYER 3 - MASTERY (LOCKED) */}
      <RoleNode id="executor" title="Pro Specialist" icon={<Shield />} x={25} y={88} color="#ef4444" onShowDetail={onShowDetail} disabled />
      <RoleNode id="partner" title="Agency Partner" icon={<Briefcase />} x={75} y={88} color="#fbbf24" onShowDetail={onShowDetail} disabled />
      <RoleNode id="moderator" title="Moderator" icon={<Shield />} x={50} y={75} color="#10b981" onShowDetail={onShowDetail} disabled />

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
