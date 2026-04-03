import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Target, 
  Cpu, 
  Compass, 
  Sparkles, 
  Search,
  ArrowRight
} from 'lucide-react';
import { CG_DISCIPLINES, SOFTWARE_MAP, Discipline } from '../../data/RoadmapData';

export default function NeuralPathfinder() {
  const [step, setStep] = useState(0);
  const [vision, setVision] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [completed, setCompleted] = useState(false);

  const steps = [
    { title: 'Soul_Inquiry', subtitle: 'What is your vision for the digital realm?' },
    { title: 'Discipline_Matrix', subtitle: 'Where does your heart lie in the digital realm?' },
    { title: 'Toolset_Sync', subtitle: 'Aligning your craft with industry-standard software.' },
    { title: 'Final_Roadmap', subtitle: 'Your personalized sovereignty path is synchronized.' }
  ];

  const handleVisionSelect = (v: string) => {
    setVision(v);
    setStep(1);
  };

  const handleDisciplineSelect = (d: Discipline) => {
    setSelectedDiscipline(d);
    setStep(2);
  };

  const handleReset = () => {
    setStep(0);
    setVision(null);
    setSelectedDiscipline(null);
    setCompleted(false);
  };

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[#050505]">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent blur-[140px] opacity-20" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <header className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Neural_Pathfinding_Terminal_v3.5</span>
           </div>
           <div className="space-y-2">
              <h2 className="text-5xl font-black uppercase tracking-tighter text-white italic">Synchronize Your_Soul.</h2>
              <p className="text-white/20 font-medium italic max-w-2xl leading-relaxed">
                 The Matrix is complex. Let us map your internal aspirations to the industrial roadmaps of tomorrow. Step-by-step into your digital sovereignty.
              </p>
           </div>
        </header>

        <div className="p-12 lg:p-20 bg-[#080808]/80 border border-white/5 rounded-[4rem] backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden group">
           <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('/scanlines.png')] bg-repeat" />
           
           <div className="absolute top-0 right-0 p-12 text-primary/10 group-hover:scale-110 transition-transform duration-700">
              <Compass size={180} />
           </div>

           <div className="w-full max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div 
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Phase_01: Vision_Initialization</span>
                       <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic">What do you want to breathe life into?</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'hollywood', label: 'Hollywood Blockbusters', sub: 'Cinematic VFX & Storytelling' },
                        { id: 'metaverse', label: 'Metaverse Architectures', sub: 'ArchViz & Virtual Spaces' },
                        { id: 'gaming', label: 'Next-Gen Game Worlds', sub: 'Environment & Level Design' },
                        { id: 'brands', label: 'High-Stakes Brand Motion', sub: 'Motion Graphics & Neural Flow' }
                      ].map(v => (
                        <button 
                          key={v.id}
                          onClick={() => handleVisionSelect(v.id)}
                          className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-left transition-all hover:bg-white/[0.05] hover:border-primary/30 group"
                        >
                           <h4 className="text-xl font-black uppercase tracking-tight text-white italic group-hover:text-primary transition-colors">{v.label}</h4>
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2 italic">{v.sub}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Phase_02: Discipline_Matrix</span>
                       <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic">Where does your digital soul belong?</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {CG_DISCIPLINES.map(d => (
                         <button 
                           key={d.id}
                           onClick={() => handleDisciplineSelect(d)}
                           className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-left transition-all hover:bg-white/[0.05] hover:border-white/10 relative group overflow-hidden"
                         >
                            <d.icon className={`size-8 mb-6 ${d.color} transition-transform group-hover:scale-125`} />
                            <h4 className="text-lg font-black uppercase tracking-tight text-white italic">{d.name}</h4>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-3 leading-relaxed italic">{d.description}</p>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                               <Sparkles size={40} className={d.color} />
                            </div>
                         </button>
                       ))}
                    </div>
                    <button onClick={() => setStep(0)} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors flex items-center gap-2">
                       <ChevronLeft size={12} /> Back_ToVision
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Phase_03: Toolset_Synchronization</span>
                       <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic">Master the industry-standard matrix.</h3>
                    </div>
                    <div className="space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                             <div className="flex items-center gap-4">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Creative_Cloud_logo.svg" className="size-10" />
                                <h4 className="text-2xl font-black uppercase tracking-tighter text-white italic">Adobe Suite</h4>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {selectedDiscipline?.software.includes('After Effects') || selectedDiscipline?.software.includes('Ps') ? (
                                   SOFTWARE_MAP.adobe.products.map(p => (
                                     <span key={p.id} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40">{p.name}</span>
                                   ))
                                ) : (
                                   <span className="text-[9px] font-black uppercase text-white/10">Optimization_Optional</span>
                                )}
                             </div>
                          </div>
                          <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                             <div className="flex items-center gap-4">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/Autodesk_logo.svg" className="size-10 brightness-0 invert" />
                                <h4 className="text-2xl font-black uppercase tracking-tighter text-white italic">Autodesk Industrial</h4>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {SOFTWARE_MAP.autodesk.products.map(p => (
                                   <span key={p.id} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40">{p.name}</span>
                                ))}
                             </div>
                          </div>
                       </div>
                       
                       <button 
                          onClick={() => setStep(3)}
                          className="h-24 w-full bg-white text-bg-dark rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm hover:bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-[0_40px_100px_-20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4"
                        >
                          Generate_Sovereignty_Roadmap <ChevronRight size={20} />
                       </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-16 text-center"
                  >
                     <div className="space-y-4">
                        <Zap className="size-16 text-primary mx-auto animate-pulse" />
                        <h2 className="text-6xl font-black uppercase tracking-widest text-white italic">Path_Synchronized.</h2>
                        <p className="text-white/20 font-black uppercase tracking-[0.3em]">Operational Mastery Roadmap Prepared</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {selectedDiscipline?.levels.map((level, i) => (
                          <div key={level} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-6 hover:border-primary/20 transition-all group">
                             <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Checkpoint_0{i + 1}</span>
                             <h4 className="text-2xl font-black uppercase tracking-tighter text-white italic group-hover:text-primary transition-colors">{level}</h4>
                             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(i + 1) * 33}%` }} className="h-full bg-primary" />
                             </div>
                             <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Sync_Parity_Nominal</p>
                          </div>
                        ))}
                     </div>

                     <div className="flex items-center justify-center gap-6">
                        <button onClick={handleReset} className="h-20 px-12 bg-white/5 border border-white/10 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] text-white/40 hover:text-white hover:bg-white/10 transition-all">
                           Reset_Neural_Flow
                        </button>
                        <button className="h-20 px-16 bg-primary text-bg-dark rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:brightness-125 transition-all shadow-[0_30px_80px_-20px_rgba(var(--primary-rgb),0.5)] flex items-center gap-4">
                           Initiate_Mastery_Sequence <ArrowRight size={18} />
                        </button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Categories Matrix Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-12 opacity-40">
           {CG_DISCIPLINES.map(d => (
             <div key={d.id} className="text-center space-y-3">
                <div className="size-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto text-white/20">
                   <d.icon size={20} />
                </div>
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">{d.id}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
