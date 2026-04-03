import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Zap, Box, Share2, Save, Play, Settings, RefreshCw, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NeuralStudio() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeWorkflow, setActiveWorkflow] = useState('Standard Diffusion');

  // Placeholder for ComfyUI URL
  const COMFY_URL = "https://rgacademy.space/ai-engine/comfy"; 

  const WORKFLOWS = [
    { name: 'Standard Diffusion', icon: Zap, status: 'ready' },
    { name: 'Neural Concept Art', icon: Box, status: 'ready' },
    { name: 'Motion Synthesis', icon: Layers, status: 'beta' },
    { name: 'Identity Sync', icon: Cpu, status: 'locked' }
  ];

  return (
    <div className="min-h-[calc(100vh-12rem)] mt-8 space-y-8">
      {/* 🔮 Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 rounded-[3rem] glass-pro-max border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
            <Cpu size={240} className="text-primary neural-pulse" />
        </div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="size-3 bg-primary rounded-full animate-pulse shadow-[0_0_12px_#00ff9d]" />
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Neural Core active</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Neural <span className="text-primary text-data-glow">Studio</span>
          </h1>
          <p className="text-white/40 font-bold max-w-xl leading-relaxed">
            Industrial identity synthesis engine powered by Red Griffin AI. Integrate ComfyUI workflows directly into your creative pipeline.
          </p>
        </div>

        <div className="flex gap-4 relative z-10">
            <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2 text-xs font-black uppercase">
                <Settings size={14} />
                Global Config
            </button>
            <button className="px-6 py-3 rounded-2xl bg-primary text-bg-dark hover:scale-105 transition-all flex items-center gap-2 text-xs font-black uppercase shadow-[0_0_30px_rgba(0,255,157,0.3)]">
                <Save size={14} />
                Snapshot session
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 📋 Workflow Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-[2.5rem] glass-pro-max border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Workflows</h3>
                    <RefreshCw size={14} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
                </div>
                
                <div className="space-y-2">
                    {WORKFLOWS.map((wf) => {
                        const Icon = wf.icon;
                        const isActive = activeWorkflow === wf.name;
                        return (
                            <button 
                                key={wf.name}
                                onClick={() => wf.status !== 'locked' && setActiveWorkflow(wf.name)}
                                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all group ${isActive ? 'bg-primary/10 border-primary/40 text-white' : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/10 hover:text-white'} ${wf.status === 'locked' ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={16} className={isActive ? 'text-primary' : 'group-hover:text-primary'} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">{wf.name}</span>
                                </div>
                                {isActive && <div className="size-1.5 bg-primary rounded-full shadow-[0_0_8px_#00ff9d]" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 relative overflow-hidden group">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Neural Synergy</h4>
                <p className="text-[11px] font-bold text-white/80 leading-relaxed mb-4">Export nodes directly to your Studio project pipeline with 100% metadata retention.</p>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-[9px] font-black uppercase text-white hover:text-primary transition-colors">
                        <Share2 size={12} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 text-[9px] font-black uppercase text-white hover:text-primary transition-colors">
                        <Play size={12} />
                        Simulator
                    </button>
                </div>
            </div>
        </div>

        {/* 🎬 Engine Container */}
        <div className="lg:col-span-3 min-h-[700px] rounded-[3rem] glass-pro-max border border-white/10 relative overflow-hidden bg-black/40 group">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-20 bg-bg-dark/80 backdrop-blur-xl">
                    <div className="relative">
                        <div className="size-20 rounded-full border-t-2 border-primary animate-spin" />
                        <Cpu className="absolute inset-0 m-auto text-primary neural-pulse" size={32} />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-black uppercase tracking-widest text-white italic">Synchronizing Neural Engine...</h3>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Contacting Red Griffin Compute nodes</p>
                    </div>
                    <button 
                         onClick={() => setIsLoading(false)}
                         className="mt-8 px-4 py-2 border border-white/10 rounded-full text-[8px] font-black uppercase text-white/20 hover:text-white transition-all"
                    >
                        Force Local Preview (Mock)
                    </button>
                </div>
            )}
            
            <iframe 
                src={COMFY_URL}
                className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity"
                onLoad={() => setIsLoading(false)}
                title="ComfyUI Engine"
            />

            {/* Empty state fallback if iframe fails/not supported */}
            {!isLoading && (
                 <div className="absolute bottom-8 right-8 flex gap-2">
                    <div className="p-3 bg-bg-dark/60 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black text-white/40">
                         Compute Usage: <span className="text-primary">2.4 GFLOPS</span>
                    </div>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
}
