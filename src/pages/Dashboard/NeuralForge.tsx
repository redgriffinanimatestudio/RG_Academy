import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Cpu, Zap, Activity, Terminal, Shield, 
  Settings, Save, Play, Search, Database, Globe,
  CheckCircle2, AlertTriangle, Loader2, Code, Share2
} from 'lucide-react';
import { edgeAgentService, ToolDefinition } from '../../services/edgeAgentService';
import toolRegistry from '../../data/toolRegistry.json';

export default function NeuralForge() {
  const [activeTools, setActiveTools] = useState<string[]>(['calculate_polycount_limit']);
  const [prompt, setPrompt] = useState('');
  const [logs, setLogs] = useState<{ type: 'user' | 'bot' | 'tool_call' | 'error', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [activeTab, setActiveTab] = useState<'console' | 'training'>('console');

  // Schema for Tools
  const tools = toolRegistry as ToolDefinition[];

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('http://localhost:1234/v1/models');
        if (res.ok) setConnectionStatus('online');
        else setConnectionStatus('offline');
      } catch {
        setConnectionStatus('offline');
      }
    };
    checkConnection();
  }, []);

  const handleRunAgent = async () => {
    if (!prompt.trim()) return;
    const userMsg = prompt;
    setPrompt('');
    setLogs(prev => [...prev, { type: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const selectedTools = tools.filter(t => activeTools.includes(t.name));
      const result = await edgeAgentService.callAgent(userMsg, selectedTools);

      if (result.type === 'tool_call') {
        setLogs(prev => [...prev, { type: 'tool_call', text: `AUTONOMOUS TOOL CALLED: ${result.data.name}(${JSON.stringify(result.data.arguments)})` }]);
        setLogs(prev => [...prev, { type: 'bot', text: "Protocol synchronized. Processing tool output..." }]);
      } else {
        setLogs(prev => [...prev, { type: 'bot', text: result.data }]);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, { type: 'error', text: err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-12 space-y-12 max-w-[1550px] mx-auto min-h-screen">
      
      {/* 🔮 Forge Header: Neural Status */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px] italic">
              <Brain size={16} strokeWidth={3} /> Neural_Forge_v5.4
           </div>
           <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
              Edge Agent <span className="text-primary">Engineering.</span>
           </h1>
           <p className="text-white/40 font-medium italic max-w-xl">
             Fine-tune and deploy industrial tool-calling agents using FunctionGemma (270M) & Unsloth protocols.
           </p>
        </div>

        <div className="flex gap-4">
           <div className={`px-6 py-4 rounded-3xl border flex items-center gap-3 transition-all ${connectionStatus === 'online' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              <div className={`size-2 rounded-full ${connectionStatus === 'online' ? 'bg-primary animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                 {connectionStatus === 'online' ? 'Node Connected' : 'Uplink Offline'}
              </span>
           </div>
           <button className="px-6 py-4 rounded-3xl bg-white/[0.03] border border-white/5 text-white/40 hover:text-white transition-all">
              <Settings size={18} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 🛠️ Agent Configurator Zone (Left) */}
        <div className="lg:col-span-4 space-y-8">
           {/* Section 1: Memory & Persona */}
           <div className="p-8 rounded-[2.5rem] glass-pro-max border border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40"><Cpu size={16} /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Agent_Persona_Sync</span>
              </div>
              <div className="space-y-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Core Identity</label>
                    <input type="text" defaultValue="Industrial CG Assistant" className="bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-primary transition-all" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">Logical Temperature</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.1" className="accent-primary h-2 bg-white/5 rounded-full" />
                 </div>
              </div>
           </div>

           {/* Section 2: Tool Integration Node */}
           <div className="p-8 rounded-[2.5rem] glass-pro-max border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40"><Zap size={16} /></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">Tool_Registry</span>
                </div>
                <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-2 py-1 rounded-md tracking-widest">{activeTools.length} Active</span>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                 {tools.map(tool => (
                   <button 
                     key={tool.name}
                     onClick={() => setActiveTools(prev => prev.includes(tool.name) ? prev.filter(t => t !== tool.name) : [...prev, tool.name])}
                     className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${activeTools.includes(tool.name) ? 'bg-primary/5 border-primary/20' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                   >
                      <div className="flex flex-col min-w-0">
                         <span className={`text-[10px] font-black uppercase truncate ${activeTools.includes(tool.name) ? 'text-primary' : 'text-white/40'}`}>{tool.name}</span>
                         <span className="text-[7px] font-black uppercase opacity-20 truncate">{tool.description}</span>
                      </div>
                      <div className={`size-4 rounded-full border flex items-center justify-center transition-all ${activeTools.includes(tool.name) ? 'bg-primary border-primary text-bg-dark' : 'border-white/10'}`}>
                         {activeTools.includes(tool.name) && <CheckCircle2 size={10} strokeWidth={3} />}
                      </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* 📟 Neural Console: Live Interaction (Right) */}
        <div className="lg:col-span-8 space-y-6">
           <div className="p-10 rounded-[3.5rem] bg-bg-dark/60 border border-white/5 relative overflow-hidden h-[700px] flex flex-col">
              {/* Console Ambience */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 pointer-events-none">
                 <Terminal size={400} className="text-white" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-6 mb-6 border-b border-white/5 pb-4 relative z-10">
                 <button 
                   onClick={() => setActiveTab('console')}
                   className={`text-[10px] font-black uppercase tracking-widest pb-4 relative ${activeTab === 'console' ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                 >
                    Live Terminal
                    {activeTab === 'console' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
                 </button>
                 <button 
                   onClick={() => setActiveTab('training')}
                   className={`text-[10px] font-black uppercase tracking-widest pb-4 relative ${activeTab === 'training' ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                 >
                    Training Protocol
                    {activeTab === 'training' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
                 </button>
              </div>

              {activeTab === 'console' ? (
                <>
                  {/* Logs Area */}
                  <div className="flex-1 overflow-y-auto space-y-6 px-4 no-scrollbar pb-10">
                     {logs.length === 0 && (
                       <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
                          <Terminal size={60} strokeWidth={1} className="text-primary" />
                          <div className="text-center space-y-2">
                             <p className="text-xs font-black uppercase tracking-[0.4em]">Neural Console Idle.</p>
                             <p className="text-[9px] font-black uppercase tracking-[0.2em]">Initiate query to verify tool-calling logic.</p>
                          </div>
                       </div>
                     )}
                     {logs.map((log, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, x: log.type === 'user' ? 20 : -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className={`flex flex-col ${log.type === 'user' ? 'items-end' : 'items-start'} gap-2`}
                       >
                         <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm leading-relaxed ${log.type === 'user' ? 'bg-primary text-bg-dark font-black' : log.type === 'tool_call' ? 'bg-white/10 border border-primary/20 text-primary font-mono text-[10px]' : log.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                            {log.type === 'tool_call' && <Activity size={12} className="mb-2" />}
                            {log.text}
                         </div>
                         <span className="text-[8px] font-black uppercase tracking-widest text-white/10 px-4">
                            {log.type === 'user' ? 'Specialist_Sync' : log.type === 'tool_call' ? 'Autonomous_Logic' : 'Agent_Response'}
                         </span>
                       </motion.div>
                     ))}
                     {isLoading && (
                       <div className="flex items-center gap-3 text-primary animate-pulse ml-4">
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">Computing_Logical_Trajectory...</span>
                       </div>
                     )}
                  </div>

                  {/* Input Area */}
                  <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
                     <div className="flex gap-4">
                        <div className="flex-1 relative group">
                           <input 
                             type="text" 
                             value={prompt}
                             onChange={(e) => setPrompt(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleRunAgent()}
                             placeholder="Synthesize industrial query (e.g. 'Calculate poly budget for mobile PC LOD 0')"
                             className="w-full bg-black/60 border border-white/10 rounded-[2rem] pl-8 pr-12 py-6 text-xs text-white focus:outline-none focus:border-primary transition-all shadow-2xl"
                           />
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 select-none pointer-events-none group-focus-within:text-primary transition-colors">
                              <Code size={18} />
                           </div>
                        </div>
                        <button 
                          onClick={handleRunAgent}
                          disabled={isLoading || !prompt.trim() || connectionStatus !== 'online'}
                          className="size-16 rounded-full bg-primary text-bg-dark flex items-center justify-center shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                        >
                           {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} fill="currentColor" />}
                        </button>
                     </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto pr-4 space-y-8 no-scrollbar relative z-10">
                   <div className="space-y-4">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">FunctionGemma Training Protocol</h3>
                      <p className="text-white/40 text-sm italic">5-Phase Pipeline for developing 270M parameter edge agents using Unsloth. Optimize your workflow for minimal token usage and maximum autonomy.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-6">
                      {[
                        { step: 1, title: 'Unsloth Initialization', desc: 'Deploy the optimized Google Colab notebook for FunctionGemma (270M). Configure your GPU environment (NVIDIA/AMD/Intel).', link: 'https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_(270M)-LMStudio.ipynb' },
                        { step: 2, title: 'LoRA Fine-Tuning Execution', desc: 'Inject tool-centric datasets. Execute low-rank adaptation focusing purely on JSON schema synthesis and <tool_call> trigger accuracy.' },
                        { step: 3, title: 'GGUF Matrix Conversion', desc: 'Compile the fine-tuned adapter into the core model. Export using Q8_0 or F16 quantization for edge deployment.' },
                        { step: 4, title: 'LM Studio Implantation', desc: 'Transfer the compiled .gguf payload to your local execution environment using the LM Studio CLI.', code: 'lms import <path/to/model.gguf>' },
                        { step: 5, title: 'Edge API Activation', desc: 'Initialize the local server node to establish the Neural Forge uplink. Your agent is now autonomous on port 1234.', code: 'lms load <model identifier>\nlms server start' }
                      ].map(stage => (
                        <div key={stage.step} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 text-primary/5 font-black text-8xl leading-none">{stage.step}</div>
                           <div className="relative z-10 space-y-3">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-3">
                                 <span className="size-5 rounded-full border border-primary flex items-center justify-center">{stage.step}</span>
                                 {stage.title}
                              </h4>
                              <p className="text-xs text-white/60 leading-relaxed max-w-[80%]">{stage.desc}</p>
                              {stage.code && (
                                <pre className="bg-black/50 p-4 rounded-xl border border-white/10 text-[10px] text-emerald-400 font-mono mt-4">
                                  {stage.code}
                                </pre>
                              )}
                              {stage.link && (
                                <a href={stage.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[9px] font-black uppercase text-white/50 hover:text-primary transition-colors mt-2">
                                   Access Colab Matrix <Globe size={10} />
                                </a>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
