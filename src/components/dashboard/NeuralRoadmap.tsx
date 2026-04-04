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
import { useParams, useNavigate } from 'react-router-dom';

const TypingText = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.02, duration: 0.01 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

interface NeuralRoadmapProps {
  activePathId: string;
  completedNodeIds: string[];
}

export default function NeuralRoadmap({ activePathId, completedNodeIds }: NeuralRoadmapProps) {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const path = MASTER_PLAN_DATA.find(p => p.id === activePathId) || MASTER_PLAN_DATA[0];
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  return (
    <div className="min-h-[calc(100dvh-5rem)] md:min-h-screen py-2 md:py-12 space-y-8 md:space-y-12">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12 flex-1">
        {/* Left Matrix: The Tree */}
        <div className="lg:col-span-2 space-y-10 md:space-y-16 relative">
           <div className="absolute left-[19px] md:left-[23px] top-6 md:top-8 bottom-6 md:bottom-8 w-px bg-gradient-to-b from-primary/40 via-white/5 to-transparent pointer-events-none" />
           
           {path.phases.map((phase, pIdx) => (
             <div key={phase.name} className="space-y-8 relative">
                <div className="flex items-center gap-4 md:gap-6 group">
                   <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors relative z-10 backdrop-blur-md">
                      <span className="text-[10px] md:text-xs font-black italic">0{pIdx + 1}</span>
                   </div>
                   <h3 className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-white/40">{t(phase.name)}</h3>
                </div>

                <div className="ml-12 lg:ml-16 flex flex-col md:grid md:grid-cols-2 gap-4">
                   {phase.nodes.map((node) => {
                     const isCompleted = completedNodeIds.includes(node.id);
                     const isSelected = selectedNode?.id === node.id;
                     
                     return (
                       <button
                         key={node.id}
                         onClick={() => setSelectedNode(node)}
                         className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all text-left relative overflow-hidden group ${
                           isCompleted 
                            ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' 
                            : isSelected ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                         }`}
                       >
                         {isCompleted && <div className="absolute top-0 right-0 p-4 text-primary"><CheckCircle2 size={16} /></div>}
                         
                         <div className="space-y-2 md:space-y-3 relative z-10">
                            <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] ${isCompleted ? 'text-primary' : 'text-white/20'}`}>Node_{node.id}</span>
                            <h4 className={`text-xs md:text-sm font-black uppercase tracking-tight italic ${isCompleted ? 'text-white' : 'text-white/60'}`}>{t(`node_${node.id}`, node.name)}</h4>
                            
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
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="sticky top-4 md:top-12 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl space-y-6 md:space-y-8"
               >
                  <div className="space-y-1 md:space-y-2 text-center lg:text-left">
                     <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-primary">{t('node_intelligence')}</span>
                     <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white italic"><TypingText text={t(`node_${selectedNode.id}`, selectedNode.name)} /></h3>
                  </div>

                  <p className="text-[10px] md:text-xs text-white/40 leading-relaxed font-medium italic">
                     <TypingText text={t(`node_${selectedNode.id}_desc`, selectedNode.description)} />
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

                  <button 
                     onClick={() => selectedNode.workshopId && navigate(`/aca/${lang || 'eng'}/course/${selectedNode.workshopId}`)}
                     className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs transition-all flex items-center justify-center gap-3 ${selectedNode.workshopId ? 'bg-primary text-bg-dark hover:scale-[1.02] shadow-[0_20px_50px_-20px_rgba(var(--primary-rgb),0.5)]' : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'}`}
                     disabled={!selectedNode.workshopId}
                  >
                     {selectedNode.workshopId ? t('roadmap_start_learning', 'Start_Learning') : t('roadmap_in_development', 'Module_In_Development')} <Sparkles size={14} className={selectedNode.workshopId ? '' : 'opacity-0'} />
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
