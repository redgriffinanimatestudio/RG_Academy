import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, Box, Shield, Zap, ChevronRight, Lock, CheckCircle2, Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import roadmapData from '../../data/artist-roadmap.json';

export default function RoadmapPage() {
  const { lang = 'eng' } = useParams();
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState<string>(roadmapData.phases[0].id);

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-sans">
      {/* 🔮 Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-[1550px] mx-auto px-6 py-12 sm:py-20 space-y-20">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <button 
                onClick={() => navigate(`/aca/${lang}`)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors group mb-4"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Academy
            </button>
            <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.4em] text-[11px] italic">
              <Map size={18} strokeWidth={3} /> {roadmapData.version} Industrial Core
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white leading-[0.85] uppercase italic text-data-glow">
              Artist <span className="text-primary">Roadmap.</span> <br />
              <span className="text-white/20">Ultimate Edition.</span>
            </h1>
            <p className="max-w-xl text-lg text-white/40 font-medium italic leading-relaxed">
              {roadmapData.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
             <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center min-w-[140px] gap-2">
                <span className="text-3xl font-black text-white italic">05</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Phases</span>
             </div>
             <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center min-w-[140px] gap-2">
                <span className="text-3xl font-black text-primary italic">15</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Nodes</span>
             </div>
             <div className="p-6 rounded-[2.5rem] bg-primary text-bg-dark flex flex-col items-center justify-center min-w-[140px] gap-2 shadow-2xl shadow-primary/20">
                <Trophy size={24} strokeWidth={3} />
                <span className="text-[8px] font-black uppercase tracking-widest">Mastery</span>
             </div>
          </div>
        </header>

        {/* --- PHASE NAVIGATOR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
           {roadmapData.phases.map((phase) => (
             <button
               key={phase.id}
               onClick={() => setActivePhase(phase.id)}
               className={`p-8 rounded-[2rem] border transition-all duration-500 flex flex-col items-start gap-4 h-full relative overflow-hidden group ${activePhase === phase.id ? 'bg-primary border-primary shadow-2xl shadow-primary/10' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
             >
                <div className={`size-10 rounded-xl flex items-center justify-center border transition-colors ${activePhase === phase.id ? 'bg-bg-dark text-primary border-transparent' : 'bg-white/5 text-white/20 border-white/10 group-hover:text-white'}`}>
                   <Box size={20} />
                </div>
                <div className="text-left">
                   <h3 className={`text-[11px] font-black uppercase tracking-wider mb-1 ${activePhase === phase.id ? 'text-bg-dark' : 'text-white'}`}>{phase.title}</h3>
                   <p className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-40 leading-relaxed ${activePhase === phase.id ? 'text-bg-dark' : 'text-white'}`}>{phase.description}</p>
                </div>
                
                {activePhase === phase.id && (
                  <motion.div layoutId="phase-active" className="absolute top-0 right-0 p-4 text-bg-dark opacity-10">
                     <Sparkles size={100} />
                  </motion.div>
                )}
             </button>
           ))}
        </div>

        {/* --- CORE ROADMAP TREE --- */}
        <AnimatePresence mode="wait">
           <motion.div 
             key={activePhase}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="relative"
           >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                 {/* Left description Node */}
                 <div className="lg:col-span-4 space-y-8">
                    <div className="size-24 rounded-[2rem] bg-white text-bg-dark flex items-center justify-center shadow-2xl">
                       <Shield size={40} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-4">
                        <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Active_Trajectory_Phase</span>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                            {roadmapData.phases.find(p => p.id === activePhase)?.title.split(': ')[1]}
                        </h2>
                    </div>
                 </div>

                 {/* Tree Nodes List */}
                 <div className="lg:col-span-8 space-y-6 relative">
                    {/* Visual Tree Connector Line */}
                    <div className="absolute left-10 top-10 bottom-10 w-px bg-white/5 pointer-events-none" />

                    {roadmapData.phases.find(p => p.id === activePhase)?.nodes.map((node, i) => (
                       <motion.div 
                         key={node.id}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.1 }}
                         className="flex items-center gap-8 group"
                       >
                          <div className={`size-20 rounded-[2.5rem] shrink-0 border flex items-center justify-center transition-all bg-bg-dark z-10 ${node.status === 'completed' ? 'border-primary text-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]' : 'border-white/10 text-white/10 group-hover:border-white/30 group-hover:text-white/30'}`}>
                             {node.status === 'completed' ? <CheckCircle2 size={32} /> : <Lock size={24} />}
                          </div>
                          <div className="flex-1 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between group-hover:scale-[1.02] active:scale-95 cursor-pointer">
                             <div className="space-y-2">
                                <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${node.difficulty === 'expert' ? 'text-red-500' : 'text-white/20'}`}>
                                   Level: {node.difficulty}
                                </span>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest italic">{node.label}</h4>
                             </div>
                             <div className="size-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary transition-all">
                                <ChevronRight size={18} />
                             </div>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </div>

              {/* Decorative Forge Circle */}
              <div className="absolute -bottom-40 -right-40 size-[600px] border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute top-0 right-0 p-20 opacity-[0.03] select-none pointer-events-none">
                 <Zap size={400} className="text-primary" />
              </div>
           </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
