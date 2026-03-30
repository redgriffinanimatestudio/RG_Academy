import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Brain, MessageSquare, Shield, Zap, Sparkles, Coffee, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../services/apiClient';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AISimulationModalProps {
  onClose: () => void;
  type?: string; // handshake, technical, review
}

const PERSONAS = [
  { id: 'HollywoodShark', name: 'The Shark', role: 'VFX Producer', icon: <AlertTriangle size={18} />, color: 'primary', description: 'Demanding, skeptical, results-oriented.' },
  { id: 'FriendlyMentor', name: 'The Mentor', role: 'CGI Supervisor', icon: <Coffee size={18} />, color: 'emerald-400', description: 'Supportive, educational, professional.' },
  { id: 'CareerCounselor', name: 'The Architect', role: 'Career Expert', icon: <Brain size={18} />, color: 'blue-400', description: 'Strategic, analytical, industrial.' }
];

const AISimulationModal: React.FC<AISimulationModalProps> = ({ onClose, type = 'handshake' }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'persona' | 'chat'>('persona');
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startSimulation = async (persona: typeof PERSONAS[0]) => {
    setSelectedPersona(persona);
    setLoading(true);
    try {
      const res = await apiClient.post('/v1/ai/simulate/start', { type, persona: persona.id });
      if (res.data.success) {
        setSimulationId(res.data.data.id);
        const intro = persona.id === 'HollywoodShark' 
          ? "Show me your bid. Why should I hire YOU instead of an offshore studio?"
          : "Welcome! Let's talk about your professional goals. How can I help you grow today?";
        setMessages([{ role: 'assistant', content: intro }]);
        setStep('chat');
      }
    } catch (err) {
      console.error("Simulation initialization failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !simulationId || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post('/v1/ai/simulate/chat', { simulationId, message: userMsg });
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      }
    } catch (err) {
      console.error("Chat failure:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl h-[85vh] bg-[#0a0a0a] rounded-[3.5rem] border border-white/5 overflow-hidden flex flex-col shadow-[0_0_150px_rgba(255,54,54,0.15)]"
      >
        {/* Header */}
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
           <div className="flex items-center gap-6">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,54,54,0.2)]">
                <Brain size={32} />
              </div>
              <div className="space-y-1">
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('ai_simulation_active')}</div>
                 <h2 className="text-3xl font-black uppercase tracking-tight text-white">{step === 'persona' ? 'Select Matrix Persona' : selectedPersona.role}</h2>
              </div>
           </div>
           <button onClick={onClose} className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:rotate-90 transition-all text-white/40 hover:text-white">
             <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 'persona' ? (
             <div className="p-10 lg:p-20 flex flex-col items-center justify-center h-full gap-12 text-center">
                <div className="max-w-2xl space-y-4">
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter">Choose Your Challenge</h3>
                  <p className="text-white/40 text-sm font-medium">Simulation handshakes verified by the Grid AI. Selecting accurate personas increases the Matrix synchronization score.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                   {PERSONAS.map(p => (
                     <motion.button
                       key={p.id}
                       whileHover={{ y: -10, scale: 1.02 }}
                       onClick={() => startSimulation(p)}
                       className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all text-left space-y-6 group overflow-hidden relative"
                     >
                        <div className={`absolute inset-0 bg-${p.color}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className={`size-14 rounded-2xl flex items-center justify-center text-${p.color} bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-bg-dark transition-all`}>
                          {p.icon}
                        </div>
                        <div className="space-y-2 relative z-10">
                          <h4 className="text-xl font-black uppercase">{p.name}</h4>
                          <div className="text-[10px] font-black uppercase tracking-widest text-primary italic">{p.role}</div>
                          <p className="text-white/40 text-[11px] font-medium leading-relaxed">{p.description}</p>
                        </div>
                     </motion.button>
                   ))}
                </div>
             </div>
          ) : (
            <div className="flex-1 flex flex-col bg-black/40">
               {/* Chat Messages */}
               <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-8 rounded-[2rem] ${msg.role === 'user' ? 'bg-primary text-bg-dark font-bold' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                         <div className="flex items-center gap-3 mb-4 opacity-40">
                            {msg.role === 'user' ? <User size={14} /> : <Zap size={14} className="text-primary" />}
                            <span className="text-[9px] font-black uppercase tracking-widest">{msg.role === 'user' ? 'You' : selectedPersona.name}</span>
                         </div>
                         <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                       <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center gap-3">
                          <div className="size-2 rounded-full bg-primary animate-bounce delay-0" />
                          <div className="size-2 rounded-full bg-primary animate-bounce delay-150" />
                          <div className="size-2 rounded-full bg-primary animate-bounce delay-300" />
                          <span className="text-[9px] font-black uppercase text-white/20 ml-2 tracking-widest">Processing Handshake...</span>
                       </div>
                    </div>
                  )}
               </div>

               {/* Input Area */}
               <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                  <div className="max-w-4xl mx-auto relative group">
                    <input 
                      placeholder="Type your response to the simulation..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-8 px-10 text-white focus:border-primary/40 focus:bg-white/[0.05] transition-all outline-none pr-32 font-medium"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      className="absolute right-4 top-4 bottom-4 px-10 bg-primary text-bg-dark rounded-2xl font-black uppercase text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:grayscale"
                    >
                      SEND <Send size={18} />
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AISimulationModal;
