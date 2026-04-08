import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, Box, Shield, Zap, ChevronRight, Lock, CheckCircle2, Trophy, ArrowLeft, ArrowDown, Users, Settings, Activity, Target } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import roadmapData from '../../data/artist-roadmap.json';

export default function RoadmapPage() {
  const { lang = 'eng' } = useParams();
  const navigate = useNavigate();

  const getFacultyIcon = (id: string) => {
    if (id === 'archviz') return <Box size={24} />;
    if (id === 'animator') return <Users size={24} />;
    if (id === 'game_artist') return <Settings size={24} />;
    return <Box size={24} />;
  };

  const getFacultyColor = (id: string) => {
    if (id === 'archviz') return 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5';
    if (id === 'animator') return 'text-blue-500 border-blue-500/10 bg-blue-500/5';
    if (id === 'game_artist') return 'text-rose-500 border-rose-500/10 bg-rose-500/5';
    return 'text-primary border-primary/10 bg-primary/5';
  };

  const NodeCard = ({ node }: { node: any }) => (
    <Link to={`/aca/${lang}/course/${node.id}`} className="flex items-center gap-4 group cursor-pointer relative">
      <div className={`size-10 rounded-xl shrink-0 border flex items-center justify-center transition-all bg-black/40 z-10 ${node.status === 'completed' ? 'border-primary text-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/5 text-white/20 group-hover:border-white/20 group-hover:text-white/40'}`}>
        {node.status === 'completed' ? <CheckCircle2 size={16} /> : <Lock size={14} />}
      </div>
      <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between group-hover:bg-white/[0.04] group-hover:translate-x-1 active:scale-[0.98] cursor-pointer shadow-2xl relative overflow-hidden">
        {node.status === 'completed' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40" />}
        <div className="space-y-1 relative z-10">
          <span className={`text-[7px] font-black uppercase tracking-[0.4em] ${node.difficulty === 'expert' ? 'text-red-500/60' : 'text-white/20'}`}>
            {node.status === 'side_quest' ? 'Side Quest' : `Lvl: ${node.difficulty}`}
          </span>
          <h4 className="text-[11px] font-black text-white/80 uppercase tracking-widest italic group-hover:text-white transition-colors">{node.label}</h4>
        </div>
        <div className="text-[10px] font-bold text-white/10 italic group-hover:text-white/20 transition-colors relative z-10">{node.hours}h</div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-x-hidden font-sans pb-40 selection:bg-primary selection:text-bg-dark">
      {/* 🔮 Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 blur-[150px] rounded-full opacity-30" />
        <div className="absolute inset-0 opacity-[0.03] matrix-grid-bg" />
      </div>

      <div className="relative z-10 max-w-[1550px] mx-auto px-4 sm:px-8 py-10 sm:py-20 space-y-24">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="space-y-8">
            <button 
                onClick={() => navigate(`/aca/${lang}`)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-all group"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Academy Core
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.5em] text-[10px] italic">
                <Target size={18} className="animate-pulse" /> 
                System_Node: Trajectory_Visualizer v{roadmapData.version}
              </div>
              <h1 className="text-5xl sm:text-8xl font-black tracking-tighter text-white leading-[0.85] uppercase italic text-data-glow">
                Artist <span className="text-primary">Roadmap.</span> <br />
                <span className="text-white/20">Ultimate Edition.</span>
              </h1>
              <p className="max-w-2xl text-sm md:text-lg text-white/30 font-medium italic leading-relaxed border-l-2 border-white/5 pl-8">
                {roadmapData.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
             <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center min-w-[160px] gap-3 backdrop-blur-3xl">
                <span className="text-4xl font-black text-white italic tracking-tighter">03</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Active_Faculties</span>
             </div>
             <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center min-w-[160px] gap-3 backdrop-blur-3xl">
                <span className="text-4xl font-black text-primary italic tracking-tighter">04</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Sector_Semesters</span>
             </div>
             <div className="p-8 rounded-[2.5rem] bg-primary text-bg-dark flex flex-col items-center justify-center min-w-[160px] gap-3 shadow-[0_20px_60px_rgba(16,185,129,0.2)]">
                <Trophy size={28} strokeWidth={2.5} />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Mastery_Target</span>
             </div>
          </div>
        </header>

        {/* --- TREE VISUALIZATION --- */}
        <div className="flex flex-col items-center justify-center space-y-12 w-full mt-20">
          
          {/* SEMESTER 1 (Root) */}
          <div className="w-full max-w-3xl bg-white/[0.01] border border-white/5 rounded-[4rem] p-10 sm:p-16 relative shadow-2xl backdrop-blur-sm">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-white/20 z-10 shadow-2xl rotate-45">
               <Shield size={32} strokeWidth={1.5} className="-rotate-45" />
             </div>
             
             <div className="text-center mb-16 relative z-10">
               <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.4em] text-primary">{roadmapData.coreFoundation.duration}</span>
               <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter mt-6">{roadmapData.coreFoundation.title}</h2>
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] mt-3 italic">{roadmapData.coreFoundation.description}</p>
             </div>

             <div className="grid grid-cols-1 gap-5 relative z-10">
               {roadmapData.coreFoundation.nodes.map(node => <NodeCard key={node.id} node={node} />)}
             </div>

             <div className="mt-12 p-8 rounded-[2.5rem] bg-black border border-white/5 text-center group hover:border-primary/20 transition-all cursor-pointer">
               <span className="text-xs font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-primary transition-colors italic">{roadmapData.coreFoundation.exam.label}</span>
             </div>
          </div>

          <div className="flex flex-col items-center gap-2 opacity-20">
            <div className="w-[1px] h-20 bg-gradient-to-b from-primary to-transparent" />
            <ArrowDown size={32} className="text-primary" />
          </div>

          {/* BRANCHING POINT */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
               <Activity size={16} className="text-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic">Industrial_Diversification_Node</span>
            </div>
            <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter italic flex items-center justify-center gap-6">
              {roadmapData.branchingPoint.title}
            </h3>
            <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em] mt-3 italic">{roadmapData.branchingPoint.subtitle}</p>
          </div>

          {/* Branching Lines Visual */}
          <div className="h-20 w-px bg-white/5" />
          <div className="w-full max-w-6xl h-px bg-white/5 relative">
             <div className="absolute left-0 top-0 h-20 w-px bg-gradient-to-b from-white/5 to-transparent" />
             <div className="absolute right-0 top-0 h-20 w-px bg-gradient-to-b from-white/5 to-transparent" />
             <div className="absolute left-1/2 top-0 h-20 w-px bg-gradient-to-b from-white/5 to-transparent -translate-x-1/2" />
          </div>

          {/* 3 FACULTIES (Branches) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full max-w-[1600px] pt-12">
             {roadmapData.branchingPoint.faculties.map((faculty, i) => (
                <div key={faculty.id} className="flex flex-col items-center space-y-12">
                   {/* Faculty Header */}
                   <div className={`w-full p-10 rounded-[3rem] border flex flex-col items-center justify-center text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden group ${getFacultyColor(faculty.id)}`}>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                      <div className="mb-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">{getFacultyIcon(faculty.id)}</div>
                      <h4 className="text-xl font-black uppercase tracking-[0.2em] italic">{faculty.title}</h4>
                      <span className="text-[9px] font-black tracking-[0.5em] uppercase mt-3 opacity-40 italic">{faculty.duration}</span>
                   </div>

                   {/* Semesters in Faculty */}
                   <div className="w-full space-y-10 flex-1">
                      {faculty.semesters.map(semester => (
                         <div key={semester.id} className="w-full border border-white/5 rounded-[3rem] p-8 bg-white/[0.01] shadow-2xl backdrop-blur-sm relative group hover:border-white/10 transition-colors">
                            <div className="absolute top-6 right-8 text-[8px] font-black text-white/5 uppercase tracking-[0.4em] italic group-hover:text-white/10 transition-colors">Sector_ID: {semester.id}</div>
                            <div className="mb-10 text-center">
                               <h5 className="text-xs font-black text-white/60 uppercase tracking-[0.3em] italic">{semester.title}</h5>
                               <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mt-2 italic">{semester.subtitle}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                               {semester.nodes.map(node => <NodeCard key={node.id} node={node} />)}
                            </div>
                            {semester.exam && (
                              <div className="mt-8 p-5 rounded-3xl bg-black border border-white/5 text-center group/exam hover:border-primary/20 transition-all cursor-pointer">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-hover/exam:text-primary transition-colors italic">{semester.exam.label}</span>
                              </div>
                            )}
                         </div>
                      ))}
                   </div>
                </div>
             ))}
          </div>

          <div className="w-full max-w-6xl h-px bg-white/5 relative mt-16">
             <div className="absolute left-0 bottom-0 h-20 w-px bg-gradient-to-t from-white/5 to-transparent" />
             <div className="absolute right-0 bottom-0 h-20 w-px bg-gradient-to-t from-white/5 to-transparent" />
             <div className="absolute left-1/2 bottom-0 h-20 w-px bg-gradient-to-t from-white/5 to-transparent -translate-x-1/2" />
          </div>
          <div className="h-20 w-px bg-white/5" />
          <div className="flex flex-col items-center gap-2 opacity-20">
            <ArrowDown size={32} className="text-primary" />
            <div className="w-[1px] h-20 bg-gradient-to-t from-primary to-transparent" />
          </div>

          {/* SEMESTER 4 (Merging Point) */}
          <div className="w-full max-w-3xl bg-white/[0.01] border border-white/5 rounded-[4rem] p-10 sm:p-16 relative mt-12 shadow-2xl backdrop-blur-sm">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 rounded-3xl bg-primary border border-primary/20 flex items-center justify-center text-bg-dark shadow-[0_20px_60px_rgba(16,185,129,0.3)] z-10 rotate-45">
               <Trophy size={32} strokeWidth={2.5} className="-rotate-45" />
             </div>
             
             <div className="text-center mb-16 relative z-10">
               <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.4em] text-primary">{roadmapData.careerLaunch.duration}</span>
               <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter mt-6">{roadmapData.careerLaunch.title}</h2>
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] mt-3 italic">{roadmapData.careerLaunch.description}</p>
             </div>

             <div className="grid grid-cols-1 gap-5 relative z-10">
               {roadmapData.careerLaunch.nodes.map(node => <NodeCard key={node.id} node={node} />)}
             </div>

             <div className="mt-16 p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-white/5 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary/[0.02] animate-pulse" />
               <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic relative z-10 group-hover:text-primary transition-colors">{roadmapData.careerLaunch.graduation.title}</h3>
               <p className="text-primary/60 font-black uppercase tracking-[0.5em] text-[10px] mt-3 relative z-10">{roadmapData.careerLaunch.graduation.subtitle}</p>
               
               <div className="flex flex-wrap justify-center gap-4 mt-10 relative z-10">
                 {roadmapData.careerLaunch.graduation.paths.map((path, i) => (
                   <span key={i} className="px-6 py-3 rounded-2xl bg-black border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-white/20 transition-all cursor-default italic">
                     {path}
                   </span>
                 ))}
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
