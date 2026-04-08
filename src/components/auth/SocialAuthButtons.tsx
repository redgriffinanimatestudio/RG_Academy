import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Github, Chrome, Zap, Linkedin, 
  Send, MessageSquare, Apple, X as XIcon,
  Globe, Fingerprint, ShieldCheck
} from 'lucide-react';
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

  const handleSocialResonance = async (provider: string) => {
    console.log(`[SocialAuth] Initiating resonance via ${provider}...`);
    // Only real providers go through socialAuth for now
    if (provider === 'google' || provider === 'github') {
        try {
            await socialAuth({ provider } as any);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(`[SocialAuth] Resonance failed for ${provider}:`, err);
        }
    } else {
        // UI Mock: Show toast or alert in future turns
        alert(`Social Resonance via ${provider.toUpperCase()} is on the roadmap. Protocol initializing...`);
    }
  };

  const providers = [
    { id: 'google', label: 'Google', icon: Chrome, color: 'text-red-400', glow: 'shadow-red-500/20' },
    { id: 'github', label: 'GitHub', icon: Github, color: 'text-white', glow: 'shadow-white/20' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-[#0077B5]', glow: 'shadow-blue-500/20' },
    { id: 'telegram', label: 'Telegram', icon: Send, color: 'text-[#229ED9]', glow: 'shadow-sky-500/20' },
    { id: 'discord', label: 'Discord', icon: MessageSquare, color: 'text-[#5865F2]', glow: 'shadow-indigo-500/20' },
    { id: 'apple', label: 'Apple', icon: Apple, color: 'text-white', glow: 'shadow-white/20' },
    { id: 'twitter', label: 'X', icon: XIcon, color: 'text-white', glow: 'shadow-white/10' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 🔮 Neural Divider */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"></div>
        </div>
        <span className="relative bg-bg-card px-8 text-[9px] font-black uppercase tracking-[0.6em] text-text-muted opacity-30 italic flex items-center gap-3">
            <ShieldCheck size={10} className="text-primary" />
            {t('social_sync_divider', 'NEURAL IDENTITY SYNC')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
        {providers.map((btn, idx) => (
          <motion.button
            key={btn.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05, y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialResonance(btn.id)}
            className={`group relative flex flex-col items-center justify-center gap-3 p-4 rounded-[1.8rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all shadow-xl ${btn.glow}`}
            title={`Sign in with ${btn.label}`}
          >
            {/* 🧿 Dynamic Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-current to-transparent transition-opacity rounded-[1.8rem] ${btn.color}`} />
            
            <div className="relative z-10 flex items-center justify-center p-2 rounded-xl bg-ink/20 group-hover:bg-ink/40 transition-colors">
                <btn.icon size={20} className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${btn.color}`} />
            </div>
            
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-ink relative z-10 opacity-60">
                {btn.label}
            </span>
            
            {/* 🧿 Status Indicator */}
            <div className="absolute top-3 right-3 size-1 rounded-full bg-primary/20 group-hover:bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all" />
          </motion.button>
        ))}
        
        {/* 🔐 More Options Placeholder */}
        <motion.button
            key="more-bio"
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: providers.length * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="group relative flex flex-col items-center justify-center gap-3 p-4 rounded-[1.8rem] bg-ink/10 border border-white/5 border-dashed hover:border-primary/40 transition-all"
        >
            <div className="p-2 rounded-xl bg-ink/20">
                <Fingerprint size={20} className="text-text-muted opacity-40 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-30 group-hover:opacity-100">
                BIO KEY
            </span>
        </motion.button>
      </div>
      
      {/* 🏷️ Protocol Footnote */}
      <div className="text-center">
        <p className="text-[8px] font-bold text-text-muted opacity-20 uppercase tracking-[0.4em] italic hover:opacity-40 transition-opacity cursor-default">
            Industrial Forge Identity Proxy v2.4a // AES-256 Encrypted
        </p>
      </div>
    </div>
  );
};
