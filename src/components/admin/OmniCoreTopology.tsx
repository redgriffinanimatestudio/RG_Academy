import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, GraduationCap, Briefcase, Activity, Server, Cpu } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'core' | 'dept' | 'entity';
  icon: React.ReactNode;
  x: number;
  y: number;
  status: 'online' | 'busy' | 'offline';
  load: number;
}

const NODES: Node[] = [
  { id: 'core', label: 'OmniCore L1', type: 'core', icon: <Cpu />, x: 400, y: 300, status: 'online', load: 14 },
  { id: 'academy', label: 'Academy Sector', type: 'dept', icon: <GraduationCap />, x: 200, y: 150, status: 'online', load: 42 },
  { id: 'studio', label: 'Studio Sector', type: 'dept', icon: <Briefcase />, x: 600, y: 150, status: 'online', load: 28 },
  { id: 'route', label: 'OmniRoute AI', type: 'core', icon: <Server />, x: 400, y: 100, status: 'online', load: 5 },
  { id: 'user_1', label: 'Active Pipeline: VFX', type: 'entity', icon: <Zap />, x: 150, y: 400, status: 'busy', load: 88 },
  { id: 'user_2', label: 'Active Pipeline: Dev', type: 'entity', icon: <Activity />, x: 650, y: 400, status: 'online', load: 12 }
];

const CONNECTIONS = [
  { from: 'core', to: 'academy' },
  { from: 'core', to: 'studio' },
  { from: 'core', to: 'route' },
  { from: 'academy', to: 'user_1' },
  { from: 'studio', to: 'user_2' }
];

const OmniCoreTopology: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const getNodeColor = (status: string) => {
    if (status === 'online') return 'text-primary';
    if (status === 'busy') return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full h-[600px] relative glass-pro-max rounded-[3rem] border border-white/5 overflow-hidden bg-bg-dark/50 backdrop-blur-2xl">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <svg className="w-full h-full absolute inset-0 z-0">
        <defs>
          <filter id="glow">
             <feGaussianBlur stdDeviation="3.5" result="blur" />
             <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connections */}
        {CONNECTIONS.map((conn, idx) => {
          const fromNode = NODES.find(n => n.id === conn.from)!;
          const toNode = NODES.find(n => n.id === conn.to)!;
          
          return (
            <g key={`conn-${idx}`}>
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                x1={fromNode.x} y1={fromNode.y}
                x2={toNode.x} y2={toNode.y}
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Pulsing Data Flow */}
              <motion.circle
                r="3"
                fill="var(--primary)"
                filter="url(#glow)"
                animate={{
                  cx: [fromNode.x, toNode.x],
                  cy: [fromNode.y, toNode.y],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node) => (
        <motion.div
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, zIndex: 50 }}
          onClick={() => setSelectedNode(node)}
          className={`
            absolute cursor-pointer flex flex-col items-center gap-2
            -translate-x-1/2 -translate-y-1/2
          `}
          style={{ left: node.x, top: node.y }}
        >
          <div className={`
             size-14 rounded-2xl bg-bg-dark border flex items-center justify-center transition-all duration-500
             ${selectedNode?.id === node.id ? 'border-primary ring-8 ring-primary/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-white/10 hover:border-white/30'}
             ${node.type === 'core' ? 'size-20 bg-primary/5 border-primary/20' : ''}
          `}>
             <span className={`${selectedNode?.id === node.id ? 'text-primary' : 'text-white/40'} ${node.type === 'core' ? 'text-primary scale-125' : ''}`}>
               {React.isValidElement(node.icon) ? React.cloneElement(node.icon as React.ReactElement<any>, { size: node.type === 'core' ? 32 : 24 }) : node.icon}
             </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">
              {node.label}
            </span>
            <div className={`text-[8px] font-bold uppercase tracking-tighter ${getNodeColor(node.status)}`}>
               {node.status} • {node.load}%
            </div>
          </div>
        </motion.div>
      ))}

      {/* Inspector Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute right-8 top-8 w-72 h-fit glass-pro-max border border-white/10 p-6 rounded-[2.5rem] space-y-6 z-50 pointer-events-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-tighter text-white">Node Inspector</h3>
              <button onClick={() => setSelectedNode(null)} className="text-white/20 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Identifier</span>
                <p className="text-sm font-black text-primary italic uppercase">{selectedNode.label}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-[8px] font-black uppercase text-white/20">Latency</span>
                  <p className="text-xs font-bold text-white">12ms</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-[8px] font-black uppercase text-white/20">Protocol</span>
                  <p className="text-xs font-bold text-white">OC-7</p>
                </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-[9px] font-black uppercase text-white/40">
                    <span>Processing Load</span>
                    <span>{selectedNode.load}%</span>
                 </div>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedNode.load}%` }}
                      className={`h-full ${selectedNode.load > 80 ? 'bg-red-500' : 'bg-primary'}`}
                    />
                 </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                 <button className="w-full py-3 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all">
                    Sync Node Data
                 </button>
                 <button className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all">
                    Reset Buffer
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Status HUD */}
      <div className="absolute bottom-8 left-8 flex items-center gap-6">
         <div className="flex items-center gap-3">
            <div className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Neural Sync: Active</span>
         </div>
         <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            Total Load: <span className="text-white">22.4%</span>
         </div>
      </div>
    </div>
  );
};

export default OmniCoreTopology;
