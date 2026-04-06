import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  Zap, 
  ChevronRight, 
  Brain, 
  Shield, 
  Award, 
  Terminal,
  Activity,
  Milestone,
  BookOpen,
  Briefcase,
  Lock,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';

interface TrajectoryNode {
  id: string;
  title: string;
  type: 'learning' | 'milestone' | 'project' | 'assessment';
  status: 'completed' | 'in-progress' | 'locked';
  requirement: string;
  link?: string;
  dependencies: string[];
}

interface TrajectoryData {
  title: string;
  description: string;
  readiness: number;
  nodes: TrajectoryNode[];
  targetSkills: { skill: string; current: number; target: number }[];
  aiInsight: string;
}

const NODE_ICONS = {
  learning: BookOpen,
  milestone: Milestone,
  project: Briefcase,
  assessment: Shield
};

export default function TrajectoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  
  const [data, setData] = useState<TrajectoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    fetchTrajectory();
  }, []);

  const fetchTrajectory = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/v1/ai/trajectory');
      if (res.data.success) {
        setData(res.data.data);
        // Find first in-progress node
        const currentGoal = res.data.data.nodes.find((n: any) => n.status === 'in-progress');
        if (currentGoal) setActiveNode(currentGoal.id);
      }
    } catch (err) {
      console.error("Trajectory generation failure:", err);
    } finally {
      setLoading(false);
    }
  };

  // Custom Radar Chart Component for Industrial Skills Mapping
  const SkillsRadar = ({ skills }: { skills: any[] }) => {
    const size = 300;
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / skills.length;

    const points = skills.map((s, i) => {
      const r = (s.current / 10) * radius;
      const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');

    const targetPoints = skills.map((s, i) => {
      const r = (s.target / 10) * radius;
      const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative size-[300px] group">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-2xl">
          {/* Background Circles */}
          {[0.2, 0.4, 0.6, 0.8, 1].map(scale => (
            <circle 
              key={scale}
              cx={center} cy={center} r={radius * scale} 
              fill="none" stroke="currentColor" strokeWidth="1" 
              className="text-white/5" 
            />
          ))}
          {/* Axis Labels */}
          {skills.map((s, i) => {
            const x = center + (radius + 20) * Math.cos(i * angleStep - Math.PI / 2);
            const y = center + (radius + 20) * Math.sin(i * angleStep - Math.PI / 2);
            return (
              <text 
                key={i} x={x} y={y} 
                fontSize="8" fontWeight="900" 
                textAnchor="middle" 
                className="fill-white/20 uppercase tracking-widest"
              >
                {s.skill}
              </text>
            );
          })}
          {/* Target Area */}
          <polygon 
            points={targetPoints} 
            fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"
            className="text-primary/20" 
          />
          {/* Current Area */}
          <motion.polygon 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            points={points} 
            fill="currentColor" fillOpacity="0.1" 
            stroke="currentColor" strokeWidth="3"
            className="text-primary" 
          />
        </svg>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center gap-8 relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-t from-primary/10 to-transparent blur-3xl" />
      <div className="space-y-4 text-center relative z-10">
        <div className="size-32 rounded-full border-[3px] border-primary/20 border-b-primary animate-spin shadow-[0_0_80px_rgba(255,54,54,0.4)] mx-auto" />
        <div className="text-[12px] font-black uppercase tracking-[0.8em] text-primary animate-pulse mt-8">Calculating Sentient Growth Matrix...</div>
        <p className="text-[10px] font-black text-ink/20 uppercase tracking-widest">Integrating Session Telemetry & AI Pathfinding</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 lg:p-20 overflow-hidden relative">
      {/* Sentient Background Matrix */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[100vh] bg-[radial-gradient(circle_at_50%_0%,rgba(255,54,54,0.1),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Dynamic Connection Grid (Subtle) */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* Header: Executive Growth Command */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
          <div className="space-y-8 max-w-2xl">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4">
              <div className="size-10 rounded-[1.2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Brain size={20} />
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Pathfinder v1.5 [Sentient Mode Active]</div>
            </motion.div>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
              <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
                {data?.title || 'GROWTH VECTOR'}
              </h1>
              <div className="flex items-center gap-4 text-ink/30 text-lg font-medium italic">
                <ChevronRight size={20} className="text-primary" />
                {data?.description}
              </div>
            </motion.div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-border-main/20 border-l-primary border-l-4">
              <p className="text-sm font-bold text-ink/60 leading-relaxed uppercase tracking-tighter">
                <Sparkles size={14} className="inline mr-2 text-primary" />
                {data?.aiInsight}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center lg:items-end justify-center">
            <div className="relative group">
              <div className="size-64 lg:size-80 rounded-full flex items-center justify-center relative bg-black/60 border border-border-main/20 backdrop-blur-3xl shadow-[0_0_100px_rgba(255,54,54,0.1)]">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary/50 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border-b-2 border-primary/20 animate-[spin_15s_linear_infinite_reverse]" />
                
                <div className="text-center relative z-10">
                   <div className="text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    {data?.readiness}
                    <span className="text-4xl text-primary">%</span>
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Matrix Readiness</div>
                </div>
              </div>
              {/* Status Pips */}
              <div className="absolute -top-4 -right-4 bg-[#0a0a0a] border border-border-main/40 px-6 py-4 rounded-full flex items-center gap-4 shadow-2xl backdrop-blur-xl">
                 <div className="size-3 bg-primary animate-pulse rounded-full shadow-[0_0_10px_#ff3636]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Growth Matrix: Interactive Node Graph */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity size={24} className="text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-widest">{t('roadmap_visualization')}</h2>
            </div>
            <button 
              onClick={fetchTrajectory}
              className="px-6 py-3 bg-ink/5 border border-border-main/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <RefreshCw size={14} /> Refresh Matrix
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.nodes.map((node, idx) => {
              const Icon = NODE_ICONS[node.type] || Target;
              const isActive = activeNode === node.id;
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => node.status !== 'locked' && setActiveNode(node.id)}
                  className={`relative p-8 rounded-[2.5rem] border-[1.5px] transition-all duration-500 cursor-pointer group lg:min-h-[320px] flex flex-col justify-between ${
                    isActive 
                      ? 'bg-primary/10 border-primary shadow-[0_0_50px_rgba(255,54,54,0.2)]' 
                      : node.status === 'completed'
                      ? 'bg-white/[0.03] border-border-main/40 opacity-60 grayscale-[0.5]'
                      : node.status === 'locked'
                      ? 'bg-white/[0.01] border-border-main/20 opacity-40 cursor-not-allowed'
                      : 'bg-white/[0.02] border-border-main/20 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${
                        isActive ? 'bg-primary text-bg-dark scale-110 rotate-3 shadow-[0_0_30px_#ff3636]' : 'bg-ink/5 text-ink/40'
                      }`}>
                         <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">ID {idx + 1}</div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className={`text-xl font-black uppercase tracking-tight leading-none ${isActive ? 'text-white' : 'text-ink/40'}`}>
                        {node.title}
                      </h3>
                      <p className={`text-xs font-medium leading-relaxed ${isActive ? 'text-ink/60' : 'text-ink/20'}`}>
                        {node.requirement}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border-main/20 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        {node.status === 'completed' && <div className="px-3 py-1 bg-primary/20 text-primary text-[8px] font-black uppercase rounded-lg">Verified</div>}
                        {node.status === 'in-progress' && <div className="px-3 py-1 bg-white/10 text-white text-[8px] font-black uppercase rounded-lg animate-pulse">In Progress</div>}
                        {node.status === 'locked' && <Lock size={12} className="text-white/10" />}
                     </div>
                     {node.link && node.status !== 'locked' && (
                       <button 
                        onClick={() => navigate(node.link!)}
                        className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-primary hover:underline' : 'text-ink/20'}`}
                       >
                         Jump To Node <ChevronRight size={12} className="inline ml-1" />
                       </button>
                     )}
                  </div>

                  {/* High-Energy Pulse for Active Node */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-pulse"
                      className="absolute inset-0 rounded-[2.5rem] border-2 border-primary opacity-50"
                      animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Industrial Skills Matrix Overlay */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12 lg:p-20 rounded-[4rem] bg-white/[0.01] border border-border-main/20 backdrop-blur-3xl overflow-hidden relative group">
           <div className="absolute inset-0 bg-primary/2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
             <div className="size-[500px] rounded-full bg-primary/5 blur-[120px]" />
           </div>
           
           <div className="space-y-12 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary text-[11px] font-black uppercase tracking-[0.5em]">
                  <Target size={18} /> Matrix Capability Spectrum
                </div>
                <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                  SENTIENT<br />SKILLS<br />RADAR
                </h2>
                <p className="text-ink/40 text-lg font-medium leading-[1.8] max-w-md italic">
                  Visualizing the divergence between your current neural signature and the specialist target profile.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {data?.targetSkills.slice(0, 4).map(skill => (
                  <div key={skill.skill} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ink/20">{skill.skill}</span>
                      <span className="text-[12px] font-black text-primary">{Math.round((skill.current/skill.target)*100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-ink/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.current/skill.target)*100}%` }}
                        className="h-full bg-primary/80 shadow-[0_0_10px_rgba(255,54,54,0.4)]" 
                      />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="flex items-center justify-center relative z-10">
             <SkillsRadar skills={data?.targetSkills || []} />
           </div>
        </div>

        {/* Simulation Gateway Node */}
        <div className="relative p-1 rounded-[5rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-primary opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
          <div className="bg-[#0a0a0a] rounded-[4.9rem] p-16 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
             <div className="space-y-8 max-w-xl">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                  <Shield size={14} /> Final Assessment Terminal
                </div>
                <h3 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                  SIMULATION<br />HANDSHAKE
                </h3>
                <p className="text-ink/30 text-xl font-medium leading-relaxed">
                  The matrix requires proof of mastery. Interface with a synthetic project lead to finalize your specialized trajectory.
                </p>
             </div>
             
             <button className="px-16 py-10 bg-white text-bg-dark rounded-[3.5rem] font-black uppercase tracking-[0.6em] text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,255,255,0.1)] hover:shadow-primary/20 flex items-center gap-6 group">
                Enter Void Space <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
             </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation Hints */}
      <footer className="mt-20 py-10 border-t border-border-main/20 flex items-center justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
        <div className="flex items-center gap-3"><BookOpen size={14} /> Documentation</div>
        <div className="flex items-center gap-3"><Target size={14} /> Objectives</div>
        <div className="flex items-center gap-3"><Shield size={14} /> Certification</div>
      </footer>
    </div>
  );
}
