import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { 
  Building2, Users, Gamepad2, Shield, Trophy, ChevronRight, 
  Map, Sparkles, Box, Lock, CheckCircle2, ChevronDown 
} from 'lucide-react';
import roadmapData from '../../data/artist-roadmap.json';

const TAB_ICONS: Record<string, React.ReactNode> = {
  sem_1: <Shield size={18} />,
  archviz: <Building2 size={18} />,
  animator: <Users size={18} />,
  game_artist: <Gamepad2 size={18} />,
  sem_4: <Trophy size={18} />
};

export const AcademyMegaMenu = () => {
  const { lang = 'eng' } = useParams();
  const [activeTab, setActiveTab] = useState('sem_1');
  const [isOpen, setIsOpen] = useState(false);

  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 300);
  };

  // Compile categories to display based on artist-roadmap.json
  const tabs = [
    { id: 'sem_1', title: roadmapData.coreFoundation.title.split(': ')[1], fullTitle: roadmapData.coreFoundation.title, desc: 'Общий фундамент' },
    ...roadmapData.branchingPoint.faculties.map(f => ({
      id: f.id,
      title: f.title.split(': ')[1],
      fullTitle: f.title,
      desc: f.duration
    })),
    { id: 'sem_4', title: roadmapData.careerLaunch.title.split(': ')[1], fullTitle: roadmapData.careerLaunch.title, desc: 'Портфолио и Рынок' }
  ];

  const getActiveTabContent = () => {
    if (activeTab === 'sem_1') return { semesters: [ { title: roadmapData.coreFoundation.title, nodes: roadmapData.coreFoundation.nodes } ] };
    if (activeTab === 'sem_4') return { semesters: [ { title: roadmapData.careerLaunch.title, nodes: roadmapData.careerLaunch.nodes } ] };
    const faculty = roadmapData.branchingPoint.faculties.find(f => f.id === activeTab);
    return faculty ? { semesters: faculty.semesters } : null;
  };

  const content = getActiveTabContent();

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <button className={`flex items-center gap-2 text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-colors ${isOpen ? 'text-emerald-600' : 'text-text-muted hover:text-ink'}`}>
        Academy <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute top-full left-0 mt-6 w-[900px] -translate-x-[40%]"
          >
             <div className="absolute -top-6 left-[40%] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-border-main" />
             <div className="bg-bg-dark border border-border-main rounded-[2.5rem] shadow-2xl overflow-hidden glass-pro-max flex min-h-[400px]">
               
               {/* LEFT TABS - Industrial Switcher */}
               <div className="w-[300px] bg-white/[0.02] border-r border-border-main p-6 flex flex-col gap-2 relative z-10">
                 <div className="flex items-center gap-3 text-emerald-500 mb-6 px-4">
                   <Map size={18} />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Curriculum V6.0</span>
                 </div>
                 
                 {tabs.map((tab) => {
                   const isActive = activeTab === tab.id;
                   return (
                     <button
                       key={tab.id}
                       onMouseEnter={() => setActiveTab(tab.id)}
                       className={`w-full text-left p-4 rounded-[1.5rem] flex items-center justify-between transition-all duration-300 group ${isActive ? 'bg-primary/10 border border-primary/20 shadow-lg' : 'border border-transparent hover:bg-white/[0.03]'}`}
                     >
                       <div className="flex items-center gap-3">
                         <div className={`size-8 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-primary text-bg-dark shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-white/40 group-hover:text-white/80'}`}>
                           {TAB_ICONS[tab.id]}
                         </div>
                         <div className="flex flex-col">
                           <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-ink'}`}>{tab.title}</span>
                           <span className="text-[8px] font-bold text-text-muted opacity-50 uppercase tracking-[0.2em]">{tab.desc}</span>
                         </div>
                       </div>
                       <ChevronRight size={14} className={`transition-all ${isActive ? 'text-primary opacity-100 translate-x-0' : 'text-text-muted opacity-0 -translate-x-2'}`} />
                     </button>
                   );
                 })}

                 <Link to={`/aca/${lang}/roadmap`} className="mt-auto mx-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-center text-[9px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all transition-colors flex items-center justify-center gap-2">
                   View Full Roadmap <Sparkles size={12} />
                 </Link>
               </div>

               {/* RIGHT CONTENT - Dynamic Grid */}
               <div className="w-[600px] p-10 bg-bg-card relative overflow-hidden flex flex-col">
                  {/* Backdrop Glow */}
                  <div className="absolute inset-0 bg-primary/5 opacity-30 mixing-blend-overlay pointer-events-none" />
                  
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="relative z-10 flex-1 space-y-8 h-full flex flex-col"
                    >
                      <h3 className="text-xl font-black text-ink uppercase tracking-tighter italic">
                        {tabs.find(t => t.id === activeTab)?.fullTitle}
                      </h3>

                      <div className="space-y-8 overflow-y-auto pr-4 custom-scrollbar flex-1">
                        {content?.semesters.map((sem, sIdx) => (
                          <div key={sIdx} className="space-y-4">
                            {activeTab !== 'sem_1' && activeTab !== 'sem_4' && (
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 border-b border-border-main pb-2">{sem.title}</h4>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              {sem.nodes.map(node => (
                                <Link 
                                  to={`/aca/${lang}/course/${node.id}`} 
                                  key={node.id} 
                                  onClick={() => setIsOpen(false)}
                                  className="p-4 rounded-2xl bg-white/[0.02] border border-border-main hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group flex flex-col gap-2 justify-between h-full"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className={`size-6 rounded-lg flex items-center justify-center border transition-colors ${node.status === 'completed' ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-white/20 group-hover:text-white/40'}`}>
                                      {node.status === 'completed' ? <CheckCircle2 size={12} /> : <Lock size={10} />}
                                    </div>
                                    <span className="text-[8px] font-bold uppercase text-white/30 tracking-widest">{node.hours}h</span>
                                  </div>
                                  <div>
                                    <p className="text-xs font-black text-ink uppercase leading-tight italic tracking-widest group-hover:text-primary transition-colors">{node.label}</p>
                                    <p className={`text-[8px] font-bold uppercase tracking-[0.2em] mt-1 ${node.difficulty === 'expert' ? 'text-red-500/80' : 'text-text-muted'}`}>Lvl: {node.difficulty}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
               </div>

             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
