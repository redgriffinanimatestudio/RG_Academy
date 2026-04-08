import React, { useState } from 'react';
import { Brain, Send, Loader2, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getGeminiResponse } from '../services/geminiService';

export default function AIAssistant() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await getGeminiResponse(prompt);
      setResponse(res || t('no_ai_response'));
    } catch (error: any) {
      console.error('[AI] Error:', error);
      const errorMsg = error?.message || '';
      if (errorMsg.includes('image') || errorMsg.includes('vision') || errorMsg.includes('image input')) {
        setResponse(t('ai_vision_error') || 'Image analysis is not available with the current AI model. Please try text-only queries.');
      } else {
        setResponse(t('ai_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-32 right-6 z-30">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 bg-primary text-bg-dark rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform border-4 border-bg-dark"
          >
            <Brain size={22} />
          </motion.button>
        ) : (
          <motion.div
            key="window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[calc(100vw-3rem)] sm:w-96 bg-zinc-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-primary text-bg-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain size={20} />
                <h3 className="font-black uppercase tracking-tighter text-sm">CG Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 h-80 overflow-y-auto bg-black/40 text-sm space-y-4 no-scrollbar">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-white/60 text-xs italic">
                {t('ai_placeholder')}
              </div>
              
              {response && (
                <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 text-white leading-relaxed">
                  <p className="font-bold text-[10px] text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Brain size={12} /> Red Griffin AI
                  </p>
                  {response}
                </div>
              )}
              
              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-zinc-900 flex gap-3">
              <input
                autoFocus
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder={t('type_question')}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
              />
              <button
                onClick={handleAsk}
                disabled={loading || !prompt.trim()}
                className="p-3 bg-primary text-bg-dark rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
