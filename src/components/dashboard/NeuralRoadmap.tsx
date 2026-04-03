import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ChevronRight, 
  Zap, 
  Circle, 
  CheckCircle2, 
  Lock, 
  Map, 
  Clock, 
  Cpu, 
  CpuIcon,
  Compass,
  Sparkles
} from 'lucide-react';
import { MASTER_PLAN_DATA, SovereignPath, RoadmapNode } from '../../data/MasterPlanData';
import { useTranslation } from 'react-i18next';

interface NeuralRoadmapProps {
  activePathId: string;
  completedNodeIds: string[];
}

export default function NeuralRoadmap({ activePathId, completedNodeIds }: NeuralRoadmapProps) {
  const { t } = useTranslation();
  const path = MASTER_PLAN_DATA.find(p => p.id === activePathId) || MASTER_PLAN_DATA[0];
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <Map className="size-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Neural_Roadmap_v4.1</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">{t('master_plan_active_sovereignty')}.</h2>
         </div>
         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
            <path.icon className="size-6 text-primary" />
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-white">{path.name}</span>
               <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{t('master_plan_syncing')}</span>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Matrix: The Tree */}
        <div className="lg:col-span-2 space-y-16 relative">
           <div className="absolute left-[23px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-white/5 to-transparent pointer-events-none" />
           
           {path.phases.map((phase, pIdx) => (
             <div key={phase.name} className="space-y-8 relative">
                <div className="flex items-center gap-6 group">
                   <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors relative z-10 backdrop-blur-md">
                      <span className="text-xs font-black italic">0{pIdx + 1}</span>
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">{phase.name}</h3>
                </div>

                <div className="ml-12 lg:ml-16 flex flex-col md:grid md:grid-cols-2 gap-4">
                   {phase.nodes.map((node) => {
                     const isCompleted = completedNodeIds.includes(node.id);
                     const isSelected = selectedNode?.id === node.id;
                     
                     return (
                       <button
                         key={node.id}
                         onClick={() => setSelectedNode(node)}
                         className={`p-6 rounded-[2rem] border transition-all text-left relative overflow-hidden group ${
                           isCompleted 
                            ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' 
                            : isSelected ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                         }`}
                       >
                         {isCompleted && <div className="absolute top-0 right-0 p-4 text-primary"><CheckCircle2 size={16} /></div>}
                         
                         <div className="space-y-3 relative z-10">
                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] ${isCompleted ? 'text-primary' : 'text-white/20'}`}>Node_{node.id}</span>
                            <h4 className={`text-base md:text-sm font-black uppercase tracking-tight italic ${isCompleted ? 'text-white' : 'text-white/60'}`}>{node.name}</h4>
                            
                            <div className="flex items-center gap-4 opacity-40">
                               <div className="flex items-center gap-1">
                                  <Clock size={10} />
                                  <span className="text-[9px] font-black">{node.duration}</span>
                               </div>
                               <div className="flex items-center gap-1">
                                  <Cpu size={10} />
                                  <span className="text-[9px] font-black">{node.difficulty}</span>
                               </div>
                            </div>
                         </div>
                         {isSelected && <motion.div layoutId="node_glow" className="absolute inset-x-0 bottom-0 h-1 bg-primary" />}
                       </button>
                     );
                   })}
                </div>
             </div>
           ))}
        </div>

        {/* Right HUD: Node Intelligence */}
        <div className="lg:col-start-3">
           <AnimatePresence mode="wait">
             {selectedNode ? (
               <motion.div 
                 key={selectedNode.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="sticky top-12 p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl space-y-8"
               >
                  <div className="space-y-2">
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">{t('node_intelligence')}</span>
                     <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">{selectedNode.name}</h3>
                  </div>

                  <p className="text-xs text-white/40 leading-relaxed font-medium italic">
                     {selectedNode.description}
                  </p>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                     <div className="space-y-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Operational Software</span>
                        <div className="flex flex-wrap gap-2">
                           {selectedNode.software ? selectedNode.software.map(s => (
                             <span key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase text-white/60">{s}</span>
                           )) : (
                             <span className="text-[9px] font-black text-white/10 uppercase">Theoretical_Unit_Only</span>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                           <span className="block text-[8px] font-black text-white/20 uppercase mb-1">Time Yield</span>
                           <span className="text-xs font-black text-white">{selectedNode.duration}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                           <span className="block text-[8px] font-black text-white/20 uppercase mb-1">Threat Level</span>
                           <span className="text-xs font-black text-white uppercase">{selectedNode.difficulty}</span>
                        </div>
                     </div>
                  </div>

                  <button className="w-full h-16 bg-white text-bg-dark rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-primary transition-all flex items-center justify-center gap-3">
                     Synchronize_Node_0{Math.floor(Math.random() * 9) + 1} <Sparkles size={14} />
                  </button>
               </motion.div>
             ) : (
               <div className="sticky top-12 p-12 rounded-[3rem] border border-white/5 text-center space-y-6 opacity-20">
                  <div className="size-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto">
                     <Compass size={40} className="animate-spin-slow" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest">{t('node_select_pending')}</p>
                     <p className="text-[9px] font-medium italic">Pending Operational Focus</p>
                  </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
