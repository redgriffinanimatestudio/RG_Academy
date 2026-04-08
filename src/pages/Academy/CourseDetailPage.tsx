import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Lock, FileText, CheckCircle2, ChevronRight, LayoutDashboard, 
  Terminal, ArrowLeft, Clock, Zap, Star, AlertTriangle, Shield
} from 'lucide-react';
import roadmapData from '../../data/artist-roadmap.json';

// Helper to find a node by its ID anywhere in the roadmap data
const findCourseNode = (id: string) => {
  // Check Sem 1
  const sem1 = roadmapData.coreFoundation.nodes.find(n => n.id === id);
  if (sem1) return { ...sem1, category: roadmapData.coreFoundation.title };
  
  // Check Faculties (Sem 2 & 3)
  for (const faculty of roadmapData.branchingPoint.faculties) {
    for (const semester of faculty.semesters) {
      const semNode = semester.nodes.find(n => n.id === id);
      if (semNode) return { ...semNode, category: faculty.title, semester: semester.title };
    }
  }

  // Check Sem 4
  const sem4 = roadmapData.careerLaunch.nodes.find(n => n.id === id);
  if (sem4) return { ...sem4, category: roadmapData.careerLaunch.title };

  return null;
};

export default function CourseDetailPage() {
  const { lang = 'eng', nodeId } = useParams();
  const navigate = useNavigate();

  const node = useMemo(() => findCourseNode(nodeId || ''), [nodeId]);

  if (!node) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-8">
         <h1 className="text-4xl font-black text-white uppercase italic">404 NODE_MISSING</h1>
         <p className="text-white/40 mt-4">The requested curriculum node could not be synchronized.</p>
         <button onClick={() => navigate(`/aca/${lang}/roadmap`)} className="mt-8 px-8 py-3 bg-primary text-bg-dark font-black uppercase text-[10px] tracking-widest rounded-2xl">Return to Roadmap</button>
      </div>
    );
  }

  const isLocked = node.status === 'locked';
  const isCompleted = node.status === 'completed';

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-sans pb-40">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-[1550px] mx-auto px-4 sm:px-6 py-10">
        
        {/* Navigation Breadcrumbs */}
        <button 
            onClick={() => navigate(`/aca/${lang}/roadmap`)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors group mb-8"
        >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Trajectory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Course Content (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
             
             {/* Dynamic Header */}
             <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  <span>{node.category}</span>
                  {('semester' in node) && <><ChevronRight size={12} className="text-white/20"/> <span>{(node as any).semester}</span></>}
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase italic text-data-glow leading-[0.9]">
                  {node.label}
                </h1>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                   <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                     <Clock size={16} className="text-primary"/> {node.hours} Hours Protocol
                   </div>
                   <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                     <Zap size={16} className={node.difficulty === 'expert' ? 'text-red-500' : 'text-blue-500'}/> Lvl: {node.difficulty}
                   </div>
                   {isCompleted && (
                     <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                       <CheckCircle2 size={16} /> Matrix Completed
                     </div>
                   )}
                </div>
             </div>

             {/* Main Viewer Block */}
             <div className={`w-full aspect-video rounded-[3rem] border relative overflow-hidden flex flex-col items-center justify-center text-center p-8 transition-all ${isLocked ? 'bg-bg-dark border-white/5' : 'bg-bg-card border-white/10 shadow-2xl'}`}>
                {isLocked ? (
                  <>
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mixing-blend-overlay" />
                     <Lock size={64} className="text-white/10 mb-6 relative z-10" />
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-widest relative z-10">Node Locked</h3>
                     <p className="text-xs text-white/30 uppercase tracking-[0.2em] mt-2 max-w-sm relative z-10">Complete prerequisite protocols in your trajectory to access this industrial shard.</p>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50" />
                    <button className="size-24 rounded-full bg-primary flex items-center justify-center text-bg-dark hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)] relative z-10 group">
                       <Play size={40} className="ml-2 group-hover:drop-shadow-lg" fill="currentColor" />
                    </button>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-8 relative z-10">Initialize Training Sequence</p>
                  </>
                )}
             </div>

             {/* Course Context & Syllabus Mockup */}
             <div className="pt-12 space-y-6">
                <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                  <Terminal size={24} className="text-primary"/>
                  <h3 className="text-2xl font-black uppercase italic tracking-widest">Protocol Directory</h3>
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item, i) => (
                     <div key={item} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-6 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                        <div className="size-12 rounded-2xl bg-bg-dark flex items-center justify-center text-white/30 text-xs font-black group-hover:text-primary transition-colors border border-white/5">0{item}</div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-black uppercase tracking-widest ${isLocked ? 'text-white/40' : 'text-white'}`}>Section Data Sync {item}</h4>
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Foundational execution parameters</p>
                        </div>
                        <div className="text-[10px] font-bold text-white/20">45m</div>
                     </div>
                  ))}
                </div>
             </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             
             {/* Assessment Card */}
             <div className="p-8 rounded-[2.5rem] bg-gradient-to-tr from-white/5 to-white/[0.01] border border-white/10 relative overflow-hidden group">
                <Shield size={100} className="absolute -right-10 -top-10 text-white/5 group-hover:text-primary/10 transition-colors" />
                <h4 className="text-lg font-black uppercase tracking-widest text-white mb-2">Industrial Certification</h4>
                <p className="text-[10px] leading-relaxed font-bold text-white/40 uppercase tracking-widest mb-6 border-b border-white/10 pb-6">
                  Validate your structural knowledge upon completion of this terminal.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/60">
                    <span className="flex items-center gap-2"><Star size={14}/> Passing Threshold</span>
                    <span>85%</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/60">
                    <span className="flex items-center gap-2"><FileText size={14}/> Assessment Type</span>
                    <span>Practical Matrix</span>
                  </div>
                </div>
                <button disabled={isLocked} className="w-full h-14 bg-white disabled:opacity-50 disabled:bg-white/10 text-bg-dark disabled:text-white/30 mt-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-primary hover:shadow-2xl hover:shadow-primary/20">
                  {isLocked ? 'Locked' : 'Initialize Exam'}
                </button>
             </div>

             {/* Prerequisites Card */}
             <div className="p-8 rounded-[2.5rem] border border-white/5 bg-bg-dark">
                <div className="flex items-center gap-3 text-white mb-6">
                  <AlertTriangle size={20} className="text-orange-500" />
                  <h4 className="text-sm font-black uppercase tracking-widest">System Requirements</h4>
                </div>
                <ul className="space-y-4">
                   <li className="flex items-start gap-3">
                     <div className="size-1.5 bg-orange-500 rounded-full mt-2" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-relaxed">Prior completion of basic vector algebra nodes.</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <div className="size-1.5 bg-orange-500 rounded-full mt-2" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-relaxed">Synchronized local workstation with 16GB+ RAM.</span>
                   </li>
                </ul>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
