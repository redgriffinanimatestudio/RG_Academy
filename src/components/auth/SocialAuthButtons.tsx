import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Github, Chrome, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SocialAuthButtonsProps {
  className?: string;
  onSuccess?: () => void;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ 
  className = "", 
  onSuccess 
}) => {
  const { t } = useTranslation();
  const { socialAuth } = useAuth();

  const handleSocialResonance = async (provider: 'google' | 'github') => {
    console.log(`[SocialAuth] Initiating resonance via ${provider}...`);
    // Placeholder for real OAuth redirect or popup
    // In a real scenario, this would call the backend /auth/google etc.
    try {
      // simulate the auth call
      await socialAuth({ provider });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(`[SocialAuth] Resonance failed for ${provider}:`, err);
    }
  };

  const buttons = [
    { id: 'google', label: t('social_resonate_google', 'Resonate via Google'), icon: Chrome, color: 'hover:text-red-500' },
    { id: 'github', label: t('social_resonate_github', 'Resonate via GitHub'), icon: Github, color: 'hover:text-primary' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4 px-2">
        <div className="h-[1px] flex-1 bg-white/5" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 italic">{t('social_sync_divider', 'Aetheric Resonance Sync')}</span>
        <div className="h-[1px] flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {buttons.map((btn) => (
          <motion.button
            key={btn.id}
            type="button"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialResonance(btn.id as any)}
            className={`group relative flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all overflow-hidden ${btn.color}`}
          >
            {/* 🧿 Background Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-white/5 to-transparent transition-opacity" />
            
            <btn.icon size={18} className="relative z-10 transition-transform group-hover:rotate-12" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white relative z-10">{btn.label}</span>
            
            {/* ⚡ Neural Sparkle */}
            <Zap size={10} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 text-primary transition-all group-hover:scale-125" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
