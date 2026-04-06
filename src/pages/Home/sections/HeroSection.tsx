import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, ChevronRight, Monitor, GraduationCap, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  t: (key: string) => string;
  lang: string | undefined;
  user?: any;
  onDiscover: () => void;
}

export default function HeroSection({ t, lang, user, onDiscover }: HeroSectionProps) {
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-32">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635830322729-673ad6552e8f?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/50 via-bg-dark to-bg-dark" />
        {/* Animated Scanlines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[length:100%_4px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto text-center space-y-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-xl"
        >
          <Sparkles size={14} className="text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">Industrial Sovereignty v2.5</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.82] text-ink selection:bg-primary selection:text-white">
            Experience <br />
            The <span className="text-primary italic">Academy.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted font-medium leading-relaxed opacity-60">
            The unified platform for High-End CG Production, Strategic Career Development, and Professional Mastery.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12"
        >
          {user ? (
            <button 
              onClick={() => navigate(`/aca/${lang || 'eng'}/dashboard`)}
              className="group px-12 py-6 bg-primary text-bg-dark rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-4"
            >
              Enter Dashboard <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={onDiscover}
              className="group px-12 py-6 bg-primary text-bg-dark rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-4"
            >
              Discover Your Journey <ChevronDown size={18} className="animate-bounce" />
            </button>
          )}
          
          <button 
            onClick={() => setShowVideo(true)}
            className="group px-12 py-6 bg-bg-card border border-border-main text-ink rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-border-main transition-all flex items-center gap-4"
          >
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-bg-dark transition-colors">
                <Play size={14} fill="currentColor" />
            </div>
            Watch Performance
          </button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-12 bg-bg-dark/95 backdrop-blur-2xl"
            >
                <div className="relative w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <button 
                        onClick={() => setShowVideo(false)}
                        className="absolute top-8 right-8 z-20 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-xl"
                    >
                        <X size={24} />
                    </button>
                    <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="Red Griffin Demo Roll"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-primary/30"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
