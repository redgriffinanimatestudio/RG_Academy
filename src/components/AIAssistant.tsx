import React, { useState } from 'react';
import { Brain, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getGeminiResponse } from '../services/geminiService';

export default function AIAssistant() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="fixed bottom-8 right-8 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-80 md:w-96 bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-4 bg-neutral-900 text-white flex items-center gap-2">
          <Brain size={20} className="text-indigo-400" />
          <h3 className="font-bold text-sm">{t('ai_assistant')}</h3>
        </div>
        
        <div className="p-4 h-64 overflow-y-auto bg-neutral-50 text-sm space-y-4">
          {response ? (
            <div className="bg-white p-3 rounded-2xl border border-neutral-100 text-neutral-700 leading-relaxed">
              {response}
            </div>
          ) : (
            <p className="text-neutral-400 text-center mt-12 italic">
              {t('ai_placeholder')}
            </p>
          )}
          {loading && (
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-neutral-400" size={24} />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-100 flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder={t('type_question')}
            className="flex-1 bg-neutral-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="p-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
