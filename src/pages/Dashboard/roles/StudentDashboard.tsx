import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Clock, Star, Zap, Award, Cpu, 
  TrendingUp, Briefcase, CheckCircle2, Rocket, 
  Shield, Box, ChevronRight, Activity, BookOpen,
  Lightbulb, History, MessageSquare, Send, Sparkles, AlertCircle,
  ShieldCheck, Users, Target, Lock, UserCheck, Compass
} from 'lucide-react';
import { StatCard, SectionHeader, GlassCard } from '../../../components/dashboard/shared/DashboardUI';
import { academyService } from '../../../services/academyService';
import NeuralRoadmap from '../../../components/dashboard/NeuralRoadmap';
import { executeSkill } from '../../../services/ai';

interface StudentDashboardProps {
  data?: any;
  user?: any;
  lang?: string;
  accent?: string;
  view?: string;
}

export default function StudentDashboard({ 
  data, 
  user, 
  lang = 'eng', 
  view = 'overview' 
}: StudentDashboardProps) {
  const stats = data?.stats;
  const techStack = data?.techStack || [];
  const activePipelines = data?.activePipelines || [];
  const certifications = data?.certifications || [];

  // Normalize mapping for view strings from Layout metadata
  const activeView = view === 'student' ? 'overview' : (view.includes('nexus') ? 'overview' : view);

  // --- AI TRAJECTORY LOGIC ---
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (activeView === 'career_trajectory' && !aiAnalysis && techStack.length > 0) {
      const runAnalysis = async () => {
        setAiLoading(true);
        try {
          const result = await executeSkill('trajectoryAnalysis', {
            techStack: techStack.map((s: any) => ({ name: s.name, lod: s.lod })),
            currentRank: 'Specialist', // Placeholder from UI
            goal: 'Senior Technical Artist' // Placeholder from UI
          });
          setAiAnalysis(result);
        } catch (error) {
          console.error("AI Analysis failed:", error);
        } finally {
          setAiLoading(false);
        }
      };
      runAnalysis();
    }
  }, [activeView, techStack]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
      <header className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00f5d4]" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Neural Sync Active</span>
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Latency: 14ms</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter text-ink italic leading-[0.8] drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.05)]">
               Student <span className="text-primary truncate">{activeView === 'overview' ? 'Nexus Hub' : activeView.replace('_', ' ')}</span>
            </h1>

            <div className="flex flex-wrap gap-6 items-center pt-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Protocol Version</span>
                <span className="text-xs font-bold text-ink uppercase italic">Alpha v5.37</span>
              </div>
              <div className="h-8 w-[1px] bg-border-main" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Global Rank</span>
                <span className="text-xs font-bold text-emerald-500 uppercase italic">Top 3% Specialist</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <GlassCard variant="premium" className="!p-8 border-primary/20 relative group/matrix overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/matrix:opacity-20 transition-opacity">
                  <Target size={120} />
               </div>
               <div className="flex items-center gap-6 relative z-10">
                  <div className="size-20 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(0,245,212,0.2)]">
                     <Cpu size={40} className="neural-pulse" />
                  </div>
                  <div className="space-y-2 flex-1">
                     <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black text-text-muted uppercase tracking-widest italic">Evolution Progress</span>
                         <span className="text-xs font-black text-ink uppercase italic">Level 24</span>
                      </div>
                      <div className="h-2 w-full bg-border-main rounded-full overflow-hidden border border-border-main">
                         <motion.div initial={{ width: 0 }} animate={{ width: '74%' }} className="h-full bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_15px_#00f5d4]" />
                      </div>
                      <div className="flex justify-between text-[8px] font-black text-primary/60 uppercase tracking-[0.2em] italic">
                         <span>XP: 14,200 / 20,000</span>
                         <span>Next Node: Architect</span>
                      </div>
                  </div>
               </div>
            </GlassCard>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeView}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.4 }}
        >
          {activeView === 'overview' && <OverviewModule stats={stats} techStack={techStack} pipelines={activePipelines} certs={certifications} />}
          {activeView === 'career_trajectory' && <TrajectoryModule techStack={techStack} aiAnalysis={aiAnalysis} aiLoading={aiLoading} />}
          {activeView === 'master_plan_roadmap' && <NeuralRoadmap activePathId={user?.chosenPathId || 'generalist'} completedNodeIds={[]} />}
          {activeView === 'certificate_vault' && <VaultModule certs={certifications} />}
          {activeView === 'ai_mentor_node' && <AIMentorModule user={user} />}
          {activeView === 'workshop_archive' && <ArchiveModule />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 📡 DASHBOARD OVERVIEW: LEARNING NEXUS
function OverviewModule({ stats, techStack, pipelines, certs }: any) {
  const mainStats = [
    { label: 'Neural Sync', value: '98.4%', icon: Activity, color: 'primary', trend: '+0.2%' },
    { label: 'Skill XP', value: stats?.xp || '250', icon: Zap, color: 'amber-400', trend: '+50 today' },
    { label: 'Rank Index', value: stats?.rank || '01', icon: Target, color: 'sky-400', trend: 'Top 5%' },
    { label: 'Credits', value: stats?.gpa || '5.0', icon: Star, color: 'emerald-400', trend: 'Max' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((card) => (
          <StatCard key={card.label} {...card} color={card.color.split('-')[0]} trend={card.trend as any} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          <SectionHeader title="Skill Symmetry Matrix" subtitle="Current proficiency levels across architectural nodes" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((skill: any, idx: number) => (
              <div key={idx} className="neural-panel p-8 group hover:bg-white/[0.02] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                  <Cpu size={80} />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[12px] font-black text-ink uppercase group-hover:text-primary transition-colors tracking-tighter">{skill.name}</span>
                      <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest font-mono italic">Node.Architecture.v7</p>
                    </div>
                    <div className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-lg text-[10px] font-black text-primary uppercase">
                      LOD {Math.round(skill.lod)}
                    </div>
                  </div>
                  <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (skill.lod / 500) * 100)}%` }} className="h-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <SectionHeader title="Latest Award" />
          {certs?.[0] ? (
             <GlassCard className="border-amber-500/20 bg-amber-500/5 !p-10 space-y-6">
                <Award size={48} className="text-amber-500 mx-auto" />
                <div className="text-center space-y-2">
                   <h4 className="text-sm font-black text-ink uppercase italic">{certs[0].title}</h4>
                   <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Achieved {new Date(certs[0].createdAt).toLocaleDateString()}</p>
                </div>
             </GlassCard>
          ) : (
            <GlassCard className="text-center py-20 opacity-10">
               <Shield size={32} className="mx-auto mb-4" />
               <p className="text-[9px] font-black uppercase tracking-widest">No awards detected</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

// 🗺️ TRAJECTORY: CAREER MAP
function TrajectoryModule({ techStack, aiAnalysis, aiLoading }: any) {
  return (
    <div className="space-y-12">
      <SectionHeader title="Professional Career Trajectory" subtitle="The algorithmic path to seniority in VFX & Technical Art" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {[
          { label: 'Foundations', status: 'completed', icon: BookOpen, desc: 'Intro to CG & Maya Basics' },
          { label: 'Technical Artist', status: 'current', icon: Compass, desc: 'Unreal Engine Logic & Scripting' },
          { label: 'Lead Developer', status: 'locked', icon: Box, desc: 'Advanced Pipeline Architecture' },
          { label: 'Director Hub', status: 'locked', icon: ShieldCheck, desc: 'Creative Vision & Leadership' }
        ].map((node, i) => (
          <div key={i} className={`neural-panel p-8 relative overflow-hidden group trajectory-pulse ${node.status === 'current' ? 'border-primary/40 shadow-2xl shadow-primary/5' : ''}`}>
            <div className={`absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 group-hover:scale-110 transition-transform`}>
               <node.icon size={120} />
            </div>
            <div className="relative z-10 space-y-6 pt-4 pb-2">
               <div className={`size-10 rounded-xl flex items-center justify-center border transition-all ${node.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : node.status === 'current' ? 'bg-primary/20 border-primary/40 text-primary animate-pulse' : 'bg-white/5 border-white/10 text-text-muted'}`}>
                  <node.icon size={20} />
               </div>
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-ink uppercase tracking-tight italic">{node.label}</h4>
                  <p className="text-[9px] text-text-muted font-bold uppercase leading-relaxed tracking-widest">{node.desc}</p>
               </div>
               <div className="pt-4 border-t border-border-main">
                 <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${node.status === 'completed' ? 'text-emerald-500' : node.status === 'current' ? 'text-primary' : 'text-text-muted'}`}>
                    {node.status.toUpperCase()}
                 </span>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <GlassCard className="bg-bg-main border-border-main p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5"><TrendingUp size={200} /></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-ink">Skill <span className="text-primary">Matrix.</span></h3>
              {aiLoading ? (
                <div className="space-y-4 py-8">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-primary animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Analyzing Skill Matrix...</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
                    <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="h-full w-1/3 bg-primary" />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-1000">
                  <p className="text-text-muted text-sm leading-relaxed font-medium">
                    {aiAnalysis?.insight || `Analysis of your career trajectory indicates a high compatibility with Technical Environment Art workflows.`}
                  </p>
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-ink italic">Gap Analysis Detected</span>
                    </div>
                    <p className="text-xs text-ink/70 font-bold uppercase">{aiAnalysis?.delta || "Material Shader Logic Optimization"}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black uppercase text-text-muted tracking-[0.3em]">Recommended Module:</span>
                    <div className="text-lg font-black text-primary uppercase italic">{aiAnalysis?.recommendation || "VDB Simulation Workshop"}</div>
                  </div>
                </div>
              )}
              <button className={`px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 ${aiLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                {aiLoading ? 'Reasoning...' : 'Analyze Potential'}
              </button>
           </div>
           <div className="space-y-6">
              {techStack.slice(0, 3).map((skill: any, i: number) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase text-text-muted italic">
                      <span>{skill.name}</span>
                      <span>Level {Math.floor(skill.lod / 100)}</span>
                   </div>
                   <div className="h-1 w-full bg-border-main rounded-full overflow-hidden">
                      <div className="h-full bg-primary/20" style={{ width: `${(skill.lod % 100)}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </GlassCard>
    </div>
  );
}

// 🛡️ VAULT: CERTIFICATES & CREDENTIALS
function VaultModule({ certs }: any) {
  return (
    <div className="space-y-12">
      <SectionHeader title="Certificate Vault" subtitle="Verifiable blockchain-backed credentials and workshop achievements" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certs.length > 0 ? certs.map((cert: any, i: number) => (
          <GlassCard key={i} className="p-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500 border-border-main hover:border-amber-500/20">
             <div className="relative aspect-[4/3] bg-bg-main flex items-center justify-center p-12 overflow-hidden border-b border-border-main">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <Award size={80} className="text-amber-500/20 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-6 left-0 right-0 px-6">
                   <div className="h-1 w-full bg-amber-500/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 shadow-[0_0_15px_#f59e0b]" style={{ width: '100%' }} />
                   </div>
                </div>
             </div>
             <div className="p-8 space-y-4">
                <h4 className="text-xs font-black text-ink uppercase italic tracking-tight">{cert.title}</h4>
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{new Date(cert.createdAt).toLocaleDateString()}</span>
                   <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest px-3 py-1 bg-amber-500/5 rounded-lg border border-amber-500/10">Grade: {cert.grade}%</span>
                </div>
             </div>
          </GlassCard>
        )) : (
          <div className="col-span-full py-40 text-center space-y-6 opacity-10 grayscale">
             <Shield size={64} className="mx-auto" />
             <p className="text-[12px] font-black uppercase tracking-[0.4em] italic leading-relaxed">No Achievement Nodes <br/> Detected in Vault</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🤖 AI MENTOR: RED GRIFFIN BRAIN
function AIMentorModule({ user }: any) {
  const [msg, setMsg] = useState('');
  
  return (
    <div className="lg:h-[750px] flex flex-col lg:flex-row gap-8">
      <div className="lg:w-[420px] shrink-0 space-y-6">
         <GlassCard className="h-full bg-primary/5 border-primary/20 flex flex-col justify-between p-12 relative overflow-hidden group">
            {/* 🧿 Background Glow */}
            <div className="absolute -top-24 -left-24 size-64 bg-primary/10 blur-[80px] rounded-full" />
            
            <div className="space-y-8 relative z-10">
               <div className="size-20 bg-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(0,245,212,0.4)] transition-transform group-hover:scale-110">
                  <Sparkles size={38} className="animate-pulse" />
               </div>
               <div className="space-y-3">
                  <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-ink">Red <span className="text-primary">Oracle.</span></h3>
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    AI Intelligence Node v7.2
                  </p>
               </div>
               <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20 italic">
                <p className="text-[14px] text-ink leading-relaxed font-medium">
                    "Greetings, {user?.displayName || 'Citizen'}. Analysis of your neural trajectory indicates a 94% compatibility with Senior VFX workflows. How shall we optimize today?"
                </p>
               </div>
             <div className="space-y-4 pt-12 relative z-10">
               <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-4 bg-bg-card rounded-2xl border border-border-main text-center">
                     <span className="block text-text-muted text-[8px] font-black uppercase tracking-widest mb-1">Knowledge Nodes</span>
                     <span className="block text-ink font-black italic">14.2k</span>
                  </div>
                  <div className="p-4 bg-bg-card rounded-2xl border border-border-main text-center">
                     <span className="block text-text-muted text-[8px] font-black uppercase tracking-widest mb-1">Global Precision</span>
                     <span className="block text-primary font-black italic">99.8%</span>
                  </div>
               </div>
               <button className="w-full py-5 bg-bg-card border border-border-main rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-ink hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group/btn">
                  <Activity size={16} className="group-hover/btn:text-primary transition-colors" /> View Full Analytics
               </button>
            </div>
            </div>
         </GlassCard>
      </div>

      <GlassCard className="flex-1 bg-bg-card !p-0 flex flex-col overflow-hidden relative border border-border-main shadow-card">
         {/* 📟 Terminal Overlay */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
         
         <div className="flex-1 p-12 overflow-y-auto space-y-10 no-scrollbar relative z-10 font-mono">
            {/* AI Response */}
            <div className="flex gap-8">
               <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(0,245,212,0.2)]">
                  <Cpu size={22} />
               </div>
               <div className="max-w-[85%] space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Oracle Node</span>
                    <div className="h-[1px] flex-1 bg-primary/20" />
                  </div>
                  <div className="p-8 bg-primary/5 rounded-[2.5rem] rounded-tl-none border border-primary/10">
                    <p className="text-[14px] text-ink leading-relaxed">System scan complete. I've detected a significant performance delta in your **Material Shader** nodes. We are missing **Ray-Traced Refraction** mastery. Shall we initialize Training Phase 3?</p>
                  </div>
               </div>
            </div>

            {/* User Response */}
            <div className="flex gap-8 justify-end">
               <div className="max-w-[80%] space-y-4 text-right">
                  <div className="flex items-center gap-3 justify-end">
                    <div className="h-[1px] flex-1 bg-border-main" />
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Authorized User</span>
                  </div>
                  <div className="p-8 bg-border-main rounded-[2.5rem] rounded-tr-none border border-border-main">
                    <p className="text-[14px] text-ink leading-relaxed font-mono">Initialize Training Node: Ray-Traced Optix v4. Check potential bottlenecks.</p>
                  </div>
               </div>
               <div className="size-12 rounded-2xl bg-bg-main border border-border-main flex items-center justify-center text-text-muted shrink-0">
                  <UserCheck size={22} />
               </div>
            </div>
         </div>

         <div className="p-10 bg-bg-card border-t border-border-main relative z-30">
            <div className="relative group/input">
               <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-text-muted group-focus-within/input:text-primary transition-colors">
                  <Send size={18} />
               </div>
               <input 
                 value={msg} onChange={(e) => setMsg(e.target.value)}
                 className="w-full bg-bg-main border border-border-main rounded-[2.2rem] py-7 pl-16 pr-36 text-sm font-medium text-ink placeholder:text-text-muted outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
                 placeholder="Input node identity query..." 
               />
               <button className="absolute right-4 top-1/2 -translate-y-1/2 px-10 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95">Execute</button>
            </div>
         </div>
      </GlassCard>
    </div>
  );
}

// 📦 ARCHIVE: COMPLETED NODES
function ArchiveModule() {
  return (
    <div className="space-y-12">
       <SectionHeader title="Workshop Archive" subtitle="History of all synchronized learning nodes and completed trajectories" />
       {[1, 2, 3].map((_, i) => (
          <GlassCard key={i} className="group hover:bg-primary/5 transition-all flex flex-col md:flex-row items-center justify-between p-10 gap-8">
             <div className="flex items-center gap-8">
                <div className="size-16 rounded-[2rem] bg-bg-card border border-border-main flex items-center justify-center text-text-muted group-hover:text-primary transition-all group-hover:scale-110">
                   <History size={24} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-lg font-black text-ink uppercase tracking-tight italic group-hover:text-primary transition-colors">VFX Post-Production Node: Vol {i+1}</h4>
                   <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Completed Aug {12+i}, 2025</span>
                      <div className="size-1 bg-border-main rounded-full" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic animate-pulse">Sync Confirmed</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-8 py-3 bg-bg-card border border-border-main rounded-2xl text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-ink transition-all">Review Hub</button>
                <button className="flex-1 md:flex-none px-8 py-3 bg-primary/10 border border-primary/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">View Certificate</button>
             </div>
          </GlassCard>
       ))}
    </div>
  );
}

