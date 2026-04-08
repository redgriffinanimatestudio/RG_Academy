import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Lock, FileText, CheckCircle2, ChevronRight, LayoutDashboard, 
  Terminal, ArrowLeft, Clock, Zap, Star, AlertTriangle, Shield, Activity, Share2
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] matrix-grid-bg" />
         <div className="relative z-10 space-y-6">
            <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">404 <span className="text-primary">NODE_MISSING</span></h1>
            <p className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-black">The requested curriculum node could not be synchronized.</p>
            <button 
               onClick={() => navigate(`/aca/${lang}/roadmap`)} 
               className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-primary hover:text-bg-dark transition-all"
            >
               Return to Trajectory
            </button>
         </div>
      </div>
    );
  }

  const isLocked = node.status === 'locked';
  const isCompleted = node.status === 'completed';

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-sans pb-40 selection:bg-primary selection:text-bg-dark">
      {/* 🔮 Industrial Architecture Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 blur-[200px] rounded-full opacity-30" />
        <div className="absolute inset-0 opacity-[0.02] matrix-grid-bg" />
      </div>

      <div className="relative z-10 max-w-[1550px] mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between">
            <button 
                onClick={() => navigate(`/aca/${lang}/roadmap`)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-all group"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Trajectory
            </button>
            <div className="flex items-center gap-4">
               <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                  <Share2 size={16} />
               </button>
               <div className="px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                  <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Node_Active</span>
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Main Course Content (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-12">
             
             {/* Dynamic Header */}
             <div className="space-y-6">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 italic">
                  <Activity size={16} className="text-primary" />
                  <span>{node.category}</span>
                  {('semester' in node) && <><ChevronRight size={14} className="text-white/10"/> <span className="text-white/40">{(node as any).semester}</span></>}
                </div>
                <h1 className="text-5xl sm:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85] text-data-glow">
                  {node.label}
                </h1>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                   <div className="px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60 backdrop-blur-3xl">
                     <Clock size={16} className="text-primary"/> {node.hours} Hours Sync
                   </div>
                   <div className="px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60 backdrop-blur-3xl">
                     <Zap size={16} className={node.difficulty === 'expert' ? 'text-red-500' : 'text-primary'}/> Lvl: {node.difficulty}
                   </div>
                   {isCompleted && (
                     <div className="px-5 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                       <CheckCircle2 size={16} /> Matrix_Synched
                     </div>
                   )}
                </div>
             </div>

             {/* Main Viewer / Hero Block */}
             <div className={`w-full aspect-video rounded-[4rem] border relative overflow-hidden flex flex-col items-center justify-center text-center p-10 transition-all duration-700 group shadow-2xl ${isLocked ? 'bg-black border-white/5' : 'bg-white/[0.01] border-white/10'}`}>
                {isLocked ? (
                  <>
                     <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-60 z-10" />
                     <div className="absolute inset-0 opacity-[0.03] matrix-grid-bg" />
                     <Lock size={80} strokeWidth={1} className="text-white/10 mb-8 relative z-20 group-hover:scale-110 transition-transform duration-700" />
                     <h3 className="text-3xl font-black text-white/40 uppercase italic tracking-tighter relative z-20">Node_Locked</h3>
                     <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mt-4 max-w-sm relative z-20 leading-relaxed italic">Complete prerequisite protocols in your trajectory to access this industrial shard.</p>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
                    <div className="absolute inset-0 opacity-[0.02] matrix-grid-bg group-hover:opacity-[0.05] transition-opacity" />
                    <motion.button 
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.9 }}
                       className="size-32 rounded-[2.5rem] bg-white text-bg-dark flex items-center justify-center hover:bg-primary transition-all shadow-[0_0_80px_rgba(16,185,129,0.3)] relative z-20 group/btn"
                    >
                       <Play size={48} className="ml-2 group-hover/btn:drop-shadow-2xl transition-all" fill="currentColor" />
                    </motion.button>
                    <div className="mt-10 space-y-2 relative z-20">
                       <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary group-hover:text-white transition-colors">Initialize_Sync_Sequence</p>
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10 italic">Secure Industrial Relay Active</p>
                    </div>
                  </>
                )}
             </div>

             {/* Course Context & Syllabus */}
             <div className="pt-8 space-y-10">
                <div className="flex items-center gap-5 text-white border-b border-white/5 pb-8">
                  <Terminal size={28} className="text-primary" strokeWidth={2.5}/>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">Curriculum_Matrix</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Architectural Foundations & Scale Protocols",
                    "Advanced Mesh Topology Optimization",
                    "PBR Material Logic & Surface Accuracy",
                    "Industrial Lighting & Cinematic Composition",
                    "Final Render Output & Post-Processing"
                  ].map((label, i) => (
                     <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 flex items-center gap-8 hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer group relative overflow-hidden">
                        {isLocked && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10" />}
                        <div className="size-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-white/20 text-xs font-black group-hover:text-primary group-hover:border-primary/20 transition-all italic">0{i+1}</div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-black uppercase tracking-widest ${isLocked ? 'text-white/20' : 'text-white/70 group-hover:text-white transition-colors'}`}>{label}</h4>
                          <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.3em] mt-2 italic group-hover:text-white/20 transition-colors">Foundational execution parameters :: Phase {i+1}.0</p>
                        </div>
                        <div className="text-[10px] font-black text-white/10 italic group-hover:text-primary transition-colors">2.5h Sync</div>
                     </div>
                  ))}
                </div>
             </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8 sticky top-32">
             
             {/* Assessment Card */}
             <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 relative overflow-hidden group shadow-2xl backdrop-blur-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <Shield size={120} strokeWidth={1} className="absolute -right-16 -top-16 text-white/5 group-hover:text-primary/10 transition-all duration-700 rotate-12" />
                
                <h4 className="text-xl font-black uppercase tracking-widest text-white mb-3 italic">Certification</h4>
                <p className="text-[10px] leading-relaxed font-bold text-white/30 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-8 italic">
                  Validate your structural knowledge upon completion of this curriculum node.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span className="flex items-center gap-3"><Star size={16} className="text-primary"/> Mastery_Threshold</span>
                    <span className="text-white">85%</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span className="flex items-center gap-3"><FileText size={16} className="text-primary"/> Protocol_Type</span>
                    <span className="text-white">Practical_Matrix</span>
                  </div>
                </div>

                <motion.button 
                   whileHover={!isLocked ? { scale: 1.02 } : {}}
                   whileTap={!isLocked ? { scale: 0.98 } : {}}
                   disabled={isLocked} 
                   className="w-full h-16 bg-white disabled:opacity-20 disabled:bg-white/5 text-bg-dark disabled:text-white/20 mt-10 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-primary hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
                >
                  {isLocked ? 'Locked' : 'Initialize_Exam'}
                </motion.button>
             </div>

             {/* Prerequisites Card */}
             <div className="p-10 rounded-[3rem] border border-white/5 bg-black/40 backdrop-blur-2xl space-y-8">
                <div className="flex items-center gap-4 text-white">
                  <AlertTriangle size={24} className="text-primary animate-pulse" />
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] italic">System_Requirements</h4>
                </div>
                <div className="space-y-6">
                   <div className="flex items-start gap-4">
                     <div className="size-1.5 bg-primary rounded-full mt-2 shadow-[0_0_10px_#00f5d4]" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 leading-relaxed italic">Prior completion of basic vector algebra nodes.</span>
                   </div>
                   <div className="flex items-start gap-4">
                     <div className="size-1.5 bg-primary rounded-full mt-2 shadow-[0_0_10px_#00f5d4]" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 leading-relaxed italic">Synchronized local workstation with 16GB+ RAM.</span>
                   </div>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
