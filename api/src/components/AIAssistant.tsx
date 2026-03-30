import React, { useState } from 'react';
import { Brain, Send, Loader2, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getGeminiResponse } from '../services/geminiService';

export default function AIAssistant() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await getGeminiResponse(prompt);
      setResponse(res || t('no_ai_response'));
    } catch (error) {
      console.error(error);
      setResponse(t('ai_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.button
            key="collapsed"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            onClick={() => setIsCollapsed(false)}
            className="group relative size-16 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 hover:scale-110 transition-transform border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Brain size={28} className="relative z-10 text-primary group-hover:scale-110 transition-transform" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 size-4 bg-primary rounded-full border-2 border-neutral-900 shadow-lg"
            />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            className="w-80 md:w-96 bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-neutral-900/50 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Brain size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    {t('ai_assistant')}
                    <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  </h3>
                  <p className="text-[8px] text-zinc-500 uppercase font-black tracking-tighter">Neural Engine Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCollapsed(true)}
                className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
              >
                <Minimize2 size={16} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-4 h-80 overflow-y-auto bg-transparent text-sm space-y-4 no-scrollbar">
              <AnimatePresence>
                {response ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 text-zinc-300 leading-relaxed relative group"
                  >
                    <Sparkles size={12} className="absolute top-3 right-3 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                    {response}
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-6">
                    <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-zinc-600">
                      <Brain size={24} />
                    </div>
                    <p className="text-zinc-500 text-[11px] font-bold uppercase leading-relaxed opacity-60">
                      {t('ai_placeholder')}
                    </p>
                  </div>
                )}
              </AnimatePresence>
              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              )}
            </div>

            {/* Footer Input */}
            <div className="p-4 bg-neutral-900/30 border-t border-white/5 flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder={t('type_question')}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
              <button
                onClick={handleAsk}
                disabled={loading || !prompt.trim()}
                className="p-3 bg-primary text-bg-dark rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-30 disabled:grayscale"
              >
                <Send size={18} className="font-black" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
