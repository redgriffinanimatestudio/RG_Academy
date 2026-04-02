import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, Users, ArrowRight, Info } from 'lucide-react';

interface RoleNodeProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  description: string;
  requirements?: string[];
  color: string;
  onShowDetail: (id: string) => void;
}

const RoleNode: React.FC<RoleNodeProps> = ({ title, icon, x, y, color, onShowDetail, id }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
    style={{ left: `${x}%`, top: `${y}%` }}
    onClick={() => onShowDetail(id)}
  >
    <div 
      className="size-14 rounded-2xl bg-[#0f0f0f] border-2 flex items-center justify-center transition-all duration-500 shadow-xl group-hover:shadow-2xl"
      style={{ borderColor: color, boxShadow: `0 0 20px ${color}20` }}
    >
      <div style={{ color }}>{icon}</div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
        {title}
      </div>
    </div>
    <div className="absolute -top-2 -right-2 size-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <Info size={10} className="text-white" />
    </div>
  </motion.div>
);

const ConnectionLine: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string }> = ({ x1, y1, x2, y2, color }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
      stroke={color}
      strokeWidth="2"
      strokeDasharray="4 4"
      className="opacity-20"
    />
  </svg>
);

export const RoleTree: React.FC<{ onShowDetail: (id: string) => void }> = ({ onShowDetail }) => {
  return (
    <div className="relative w-full h-[400px] bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden p-10">
      {/* Central Node */}
      <RoleNode 
        id="user" title="Node: User" icon={<User size={20} />} 
        x={50} y={50} color="#6366f1" 
        description="The entry point for all citizens."
        onShowDetail={onShowDetail}
      />

      {/* Level 1 Branches */}
      <ConnectionLine x1={50} y1={50} x2={25} y2={25} color="#ec4899" />
      <RoleNode 
        id="student" title="Academy Path" icon={<GraduationCap size={20} />} 
        x={25} y={25} color="#ec4899" 
        description="Learn CGI, Design, and Engineering."
        onShowDetail={onShowDetail}
      />

      <ConnectionLine x1={50} y1={50} x2={75} y2={25} color="#3b82f6" />
      <RoleNode 
        id="client" title="Studio Path" icon={<Briefcase size={20} />} 
        x={75} y={25} color="#3b82f6" 
        description="Hire world-class talent for your projects."
        onShowDetail={onShowDetail}
      />

      <ConnectionLine x1={50} y1={50} x2={50} y2={80} color="#10b981" />
      <RoleNode 
        id="executor" title="Pro Path" icon={<Users size={20} />} 
        x={50} y={80} color="#10b981" 
        description="Monetize your skills as a specialist."
        onShowDetail={onShowDetail}
      />

      {/* Evolution Indicators */}
      <div className="absolute top-4 right-8 flex items-center gap-2 text-[8px] font-black uppercase text-white/10 tracking-[0.3em]">
        Evolution Matrix v1.0 <Sparkles size={10} />
      </div>
    </div>
  );
};

const Sparkles: React.FC<{ size?: number, className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3 1.912 4.913L19 10l-5.088 2.087L12 17l-1.912-4.913L5 10l5.088-2.087L12 3Z" />
    <path d="m5 3 1.147 2.946L9 7 6.147 8.054 5 11 3.853 8.054 1 7l2.853-1.054L5 3Z" />
    <path d="m19 16 1.147 2.946L23 20l-2.853 1.054L19 23l-1.147-2.946L15 20l2.853-1.054L19 16Z" />
  </svg>
);
