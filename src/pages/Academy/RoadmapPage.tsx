import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, Box, Shield, Zap, ChevronRight, Lock, CheckCircle2, Trophy, ArrowLeft, ArrowDown, Users, Settings } from 'lucide-react';
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
    if (id === 'archviz') return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
    if (id === 'animator') return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
    if (id === 'game_artist') return 'text-rose-500 border-rose-500/20 bg-rose-500/10';
    return 'text-primary border-primary/20 bg-primary/10';
  };

  const NodeCard = ({ node }: { node: any }) => (
    <Link to={`/aca/${lang}/course/${node.id}`} className="flex items-center gap-4 group cursor-pointer">
      <div className={`size-10 rounded-[1rem] shrink-0 border flex items-center justify-center transition-all bg-bg-card z-10 ${node.status === 'completed' ? 'border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]' : 'border-border-main text-text-muted opacity-40 group-hover:border-ink/20 group-hover:opacity-80'}`}>
        {node.status === 'completed' ? <CheckCircle2 size={16} /> : <Lock size={14} />}
      </div>
      <div className="flex-1 p-4 rounded-[1.5rem] bg-bg-card border border-border-main hover:border-primary/20 transition-all flex items-center justify-between group-hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm">
        <div className="space-y-1">
          <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${node.difficulty === 'expert' ? 'text-red-500' : 'text-text-muted'}`}>
            {node.status === 'side_quest' ? 'Side Quest' : `Lvl: ${node.difficulty}`}
          </span>
          <h4 className="text-xs font-black text-ink uppercase tracking-widest italic">{node.label}</h4>
        </div>
        <div className="text-[10px] font-bold text-text-muted italic">{node.hours}h</div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-bg-main relative overflow-x-hidden font-sans pb-40 transition-colors duration-500">
      {/* 🔮 Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-[1550px] mx-auto px-4 sm:px-6 py-10 sm:py-20 space-y-16">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <button 
                onClick={() => navigate(`/aca/${lang}`)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-primary transition-colors group mb-4"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Academy
            </button>
            <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.4em] text-[11px] italic">
              <Map size={18} strokeWidth={3} /> {roadmapData.version} Industrial Core
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-ink leading-[0.85] uppercase italic text-data-glow">
              Artist <span className="text-primary">Roadmap.</span> <br />
              <span className="text-text-muted">Ultimate Edition.</span>
            </h1>
            <p className="max-w-xl text-sm text-text-muted font-medium italic leading-relaxed">
              {roadmapData.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
             <div className="p-6 rounded-[2.5rem] bg-bg-card border border-border-main flex flex-col items-center justify-center min-w-[140px] gap-2 shadow-sm">
                <span className="text-3xl font-black text-ink italic">03</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Faculties</span>
             </div>
             <div className="p-6 rounded-[2.5rem] bg-bg-card border border-border-main flex flex-col items-center justify-center min-w-[140px] gap-2 shadow-sm">
                <span className="text-3xl font-black text-primary italic">04</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Semesters</span>
             </div>
             <div className="p-6 rounded-[2.5rem] bg-primary text-white flex flex-col items-center justify-center min-w-[140px] gap-2 shadow-2xl shadow-primary/20">
                <Trophy size={24} strokeWidth={3} />
                <span className="text-[8px] font-black uppercase tracking-widest">Mastery</span>
             </div>
          </div>
        </header>

        {/* --- TREE VISUALIZATION --- */}
        <div className="flex flex-col items-center justify-center space-y-8 w-full mt-20">
          
          {/* SEMESTER 1 (Root) */}
          <div className="w-full max-w-2xl bg-bg-card border border-border-main rounded-[3rem] p-8 sm:p-12 relative shadow-xl">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full bg-bg-main border border-border-main flex items-center justify-center text-text-muted z-10 shadow-sm">
               <Shield size={24} />
             </div>
             
             <div className="text-center mb-10">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{roadmapData.coreFoundation.duration}</span>
               <h2 className="text-2xl font-black text-ink uppercase italic tracking-widest mt-2">{roadmapData.coreFoundation.title}</h2>
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">{roadmapData.coreFoundation.description}</p>
             </div>

             <div className="space-y-4 relative">
               {roadmapData.coreFoundation.nodes.map(node => <NodeCard key={node.id} node={node} />)}
             </div>

             <div className="mt-8 p-6 rounded-[2rem] bg-bg-main border border-border-main text-center">
               <span className="text-sm font-black uppercase tracking-[0.2em] text-ink">{roadmapData.coreFoundation.exam.label}</span>
             </div>
          </div>

          <ArrowDown size={32} className="text-text-muted opacity-40" />

          {/* BRANCHING POINT */}
          <div className="text-center">
            <h3 className="text-3xl font-black text-ink uppercase tracking-tighter italic flex items-center justify-center gap-4">
              <Sparkles className="text-primary" /> {roadmapData.branchingPoint.title} <Sparkles className="text-primary" />
            </h3>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mt-3">{roadmapData.branchingPoint.subtitle}</p>
          </div>

          <div className="h-16 w-px bg-border-main" />
          <div className="w-full max-w-6xl h-px bg-border-main relative">
             <div className="absolute left-0 top-0 h-16 w-px bg-border-main" />
             <div className="absolute right-0 top-0 h-16 w-px bg-border-main" />
             <div className="absolute left-1/2 top-0 h-16 w-px bg-border-main -translate-x-1/2" />
          </div>

          {/* 3 FACULTIES (Branches) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl pt-4">
             {roadmapData.branchingPoint.faculties.map((faculty, i) => (
                <div key={faculty.id} className="flex flex-col items-center">
                   {/* Faculty Header */}
                   <div className={`w-full p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center ${getFacultyColor(faculty.id)} mb-8`}>
                      <div className="mb-4">{getFacultyIcon(faculty.id)}</div>
                      <h4 className="text-lg font-black uppercase tracking-widest">{faculty.title}</h4>
                      <span className="text-[9px] font-black tracking-[0.4em] uppercase mt-2 opacity-60">{faculty.duration}</span>
                   </div>

                   {/* Semesters in Faculty */}
                   <div className="w-full space-y-8 flex-1">
                      {faculty.semesters.map(semester => (
                         <div key={semester.id} className="w-full border border-border-main rounded-[2.5rem] p-6 bg-bg-card shadow-lg">
                            <div className="mb-6 text-center">
                               <h5 className="text-[11px] font-black text-ink uppercase tracking-widest">{semester.title}</h5>
                               <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">{semester.subtitle}</p>
                            </div>
                            <div className="space-y-4">
                               {semester.nodes.map(node => <NodeCard key={node.id} node={node} />)}
                            </div>
                            {semester.exam && (
                              <div className="mt-6 p-4 rounded-3xl bg-bg-main border border-border-main text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ink">{semester.exam.label}</span>
                              </div>
                            )}
                         </div>
                      ))}
                   </div>
                </div>
             ))}
          </div>

          <div className="w-full max-w-6xl h-px bg-border-main relative mt-8">
             <div className="absolute left-0 bottom-0 h-16 w-px bg-border-main" />
             <div className="absolute right-0 bottom-0 h-16 w-px bg-border-main" />
             <div className="absolute left-1/2 bottom-0 h-16 w-px bg-border-main -translate-x-1/2" />
          </div>
          <div className="h-16 w-px bg-border-main" />
          <ArrowDown size={32} className="text-text-muted opacity-40" />

          {/* SEMESTER 4 (Merging Point) */}
          <div className="w-full max-w-2xl bg-bg-card border border-border-main rounded-[3rem] p-8 sm:p-12 relative mt-4 shadow-xl">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full bg-primary border border-primary/20 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] z-10">
               <Trophy size={24} strokeWidth={3} />
             </div>
             
             <div className="text-center mb-10">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{roadmapData.careerLaunch.duration}</span>
               <h2 className="text-2xl font-black text-ink uppercase italic tracking-widest mt-2">{roadmapData.careerLaunch.title}</h2>
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">{roadmapData.careerLaunch.description}</p>
             </div>

             <div className="space-y-4">
               {roadmapData.careerLaunch.nodes.map(node => <NodeCard key={node.id} node={node} />)}
             </div>

             <div className="mt-12 p-8 rounded-[2.5rem] bg-gradient-to-tr from-primary/10 to-transparent border border-primary/20 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/5 animate-pulse" />
               <h3 className="text-3xl font-black uppercase tracking-tighter text-ink italic relative z-10">{roadmapData.careerLaunch.graduation.title}</h3>
               <p className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mt-2 relative z-10">{roadmapData.careerLaunch.graduation.subtitle}</p>
               
               <div className="flex flex-wrap justify-center gap-4 mt-8 relative z-10">
                 {roadmapData.careerLaunch.graduation.paths.map((path, i) => (
                   <span key={i} className="px-4 py-2 rounded-xl bg-bg-card border border-border-main text-[10px] font-black uppercase tracking-widest text-ink shadow-sm">
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
