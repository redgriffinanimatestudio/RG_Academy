import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Clock, Star, Zap, Award, Cpu, 
  TrendingUp, Briefcase, CheckCircle2, Rocket, 
  Shield, Box, ChevronRight, Activity, BookOpen,
  Map, Lightbulb, History, MessageSquare, Send, Sparkles, AlertCircle
} from 'lucide-react';
import { StatCard, SectionHeader, GlassCard } from '../../../components/dashboard/shared/DashboardUI';
import { academyService } from '../../../services/academyService';

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

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">
           Student <span className="text-primary">{activeView === 'overview' ? 'Nexus Hub' : activeView.replace('_', ' ')}</span>
        </h1>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-primary animate-ping" />
          Trajectory: Student-Node-Alpha-v5 • Status: Synchronized
        </p>
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
          {activeView === 'career_trajectory' && <TrajectoryModule techStack={techStack} />}
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
          <StatCard key={card.label} {...card} color={card.color.split('-')[0]} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          <SectionHeader title="Skill Symmetry Matrix" subtitle="Current proficiency levels across architectural nodes" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((skill: any, idx: number) => (
              <GlassCard key={idx} className="group hover:bg-white/[0.04] transition-all">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[12px] font-black text-white uppercase group-hover:text-primary transition-colors">{skill.name}</span>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest font-mono italic">Node Ver: 4.02</p>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase">
                      LOD {Math.round(skill.lod)}
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (skill.lod / 500) * 100)}%` }} className="h-full bg-primary" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <SectionHeader title="Latest Award" />
          {certs?.[0] ? (
             <GlassCard className="border-amber-500/20 bg-amber-500/5 !p-10 space-y-6">
                <Award size={48} className="text-amber-500 mx-auto" />
                <div className="text-center space-y-2">
                   <h4 className="text-sm font-black text-white uppercase italic">{certs[0].title}</h4>
                   <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Achieved {new Date(certs[0].createdAt).toLocaleDateString()}</p>
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
function TrajectoryModule({ techStack }: any) {
  return (
    <div className="space-y-12">
      <SectionHeader title="Neural Career Trajectory" subtitle="The algorithmic path to seniority in VFX & Technical Art" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {[
          { label: 'Foundations', status: 'completed', icon: BookOpen, desc: 'Intro to CG & Maya Basics' },
          { label: 'Technical Artist', status: 'current', icon: Map, desc: 'Unreal Engine Logic & Scripting' },
          { label: 'Lead Developer', status: 'locked', icon: Lock, desc: 'Advanced Pipeline Architecture' },
          { label: 'Director Hub', status: 'locked', icon: ShieldCheck, desc: 'Creative Vision & Leadership' }
        ].map((node, i) => (
          <GlassCard key={i} className={`relative overflow-hidden group ${node.status === 'current' ? 'border-primary shadow-2xl shadow-primary/10' : ''}`}>
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform`}>
               <node.icon size={120} />
            </div>
            <div className="relative z-10 space-y-6 pt-4 pb-2">
               <div className={`size-10 rounded-xl flex items-center justify-center border transition-all ${node.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : node.status === 'current' ? 'bg-primary/20 border-primary/40 text-primary animate-pulse' : 'bg-white/5 border-white/10 text-white/20'}`}>
                  <node.icon size={20} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-tight italic">{node.label}</h4>
                  <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed tracking-widest">{node.desc}</p>
               </div>
               <div className="pt-4 border-t border-white/5">
                 <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${node.status === 'completed' ? 'text-emerald-500' : node.status === 'current' ? 'text-primary' : 'text-white/10'}`}>
                    {node.status.toUpperCase()}
                 </span>
               </div>
            </div>
          </GlassCard>
        ))}
      </div>
      
      <GlassCard className="bg-[#0a0a0a] border-white/10 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5"><TrendingUp size={200} /></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Skill <span className="text-primary">Ecosystem.</span></h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">Your current trajectory is optimized for **Technical Environment Art**. To reach the next node, we recommend completing the "VDB Simulation" workshop.</p>
              <button className="px-10 py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">Analyze Potential</button>
           </div>
           <div className="space-y-6">
              {techStack.slice(0, 3).map((skill: any, i: number) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase text-white/40 italic">
                      <span>{skill.name}</span>
                      <span>Level {Math.floor(skill.lod / 100)}</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white/20" style={{ width: `${(skill.lod % 100)}%` }} />
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
          <GlassCard key={i} className="p-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500 border-white/5 hover:border-amber-500/20">
             <div className="relative aspect-[4/3] bg-zinc-900 flex items-center justify-center p-12 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <Award size={80} className="text-amber-500/20 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-6 left-0 right-0 px-6">
                   <div className="h-1 w-full bg-amber-500/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 shadow-[0_0_15px_#f59e0b]" style={{ width: '100%' }} />
                   </div>
                </div>
             </div>
             <div className="p-8 space-y-4">
                <h4 className="text-xs font-black text-white uppercase italic tracking-tight">{cert.title}</h4>
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{new Date(cert.createdAt).toLocaleDateString()}</span>
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
    <div className="lg:h-[700px] flex flex-col lg:flex-row gap-8">
      <div className="lg:w-[400px] shrink-0 space-y-6">
         <GlassCard className="h-full bg-primary/5 border-primary/20 flex flex-col justify-between p-10">
            <div className="space-y-6">
               <div className="size-16 bg-primary rounded-3xl flex items-center justify-center text-bg-dark shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]">
                  <Sparkles size={32} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">RG <span className="text-primary">Oracle.</span></h3>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">AI Trajectory Sync: ACTIVE</p>
               </div>
               <p className="text-[13px] text-zinc-400 font-medium leading-relaxed italic border-l-2 border-primary/20 pl-6 py-2">
                  "Hello, {user?.displayName || 'Seeker'}. I am the platform's collective intelligence. Ask me about your roadmap, technical roadblocks, or career optimization."
               </p>
            </div>
            <div className="space-y-4 pt-10">
               <div className="text-[9px] font-black uppercase tracking-widest text-primary/60 border border-primary/10 px-4 py-2 rounded-xl text-center">98% Architectural Accuracy</div>
               <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  <Activity size={14} /> View Data Insights
               </button>
            </div>
         </GlassCard>
      </div>

      <GlassCard className="flex-1 bg-[#0a0a0a] !p-0 flex flex-col overflow-hidden relative">
         <div className="flex-1 p-10 overflow-y-auto space-y-8 no-scrollbar">
            <div className="flex gap-6">
               <div className="size-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0"><Sparkles size={18} /></div>
               <div className="max-w-[70%] p-6 bg-primary/5 rounded-[2rem] rounded-tl-none border border-primary/10">
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">Platform analysis complete. I see you've recently finished **Maya Foundations**. Would you like to proceed to **Advanced Rigging** or explore **Unreal Material Editor** next?</p>
               </div>
            </div>
            <div className="flex gap-6 justify-end">
               <div className="max-w-[70%] p-6 bg-white/5 rounded-[2rem] rounded-tr-none border border-white/10">
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">Analyze my Unreal Engine skills and tell me what's missing for a Lead role.</p>
               </div>
               <div className="size-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white/40 shrink-0"><User size={18} /></div>
            </div>
         </div>

         <div className="p-8 bg-black/40 border-t border-white/5">
            <div className="relative">
               <input 
                 value={msg} onChange={(e) => setMsg(e.target.value)}
                 className="w-full bg-[#111] border border-white/10 rounded-[2rem] py-6 pl-8 pr-32 text-xs font-medium text-white placeholder:text-white/20 outline-none focus:border-primary/40 transition-all"
                 placeholder="Input node query..." 
               />
               <button className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">Send</button>
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
         <GlassCard key={i} className="group hover:bg-white/[0.03] transition-all flex flex-col md:flex-row items-center justify-between p-10 gap-8">
            <div className="flex items-center gap-8">
               <div className="size-16 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-white/10 group-hover:text-primary transition-all group-hover:scale-110">
                  <History size={24} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-lg font-black text-white uppercase tracking-tight italic group-hover:text-primary transition-colors">VFX Post-Production Node: Vol {i+1}</h4>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Completed Aug {12+i}, 2025</span>
                     <div className="size-1 bg-white/10 rounded-full" />
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic animate-pulse">Sync Confirmed</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <button className="flex-1 md:flex-none px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Review Hub</button>
               <button className="flex-1 md:flex-none px-8 py-3 bg-primary/10 border border-primary/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-bg-dark transition-all">View Certificate</button>
            </div>
         </GlassCard>
       ))}
    </div>
  );
}

function User({ size, className }: { size: number, className?: string }) { 
  return <Users size={size} className={className} />;
}
function Target({ size, className }: { size: number, className?: string }) { 
  return <Target size={size} className={className} />;
}
