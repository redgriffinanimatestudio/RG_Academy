import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, GraduationCap, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  t: (key: string) => string;
  lang: string | undefined;
  user: any;
  getDashboardLink: () => string;
  handleLoginRedirect: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ t, lang, user, handleLoginRedirect }) => {
  const [hoveredPath, setHoveredPath] = useState<'studio' | 'academy' | null>(null);
  const navigate = useNavigate();

  const paths = [
    {
      id: 'studio' as const,
      title: t('studio'),
      subtitle: 'Production & Solutions',
      desc: 'High-end CGI, Animation, and Digital Solutions for the modern industry.',
      icon: Sparkles,
      color: 'from-emerald-500/20 to-cyan-500/20',
      borderColor: 'border-emerald-500/30',
      bgImage: 'https://picsum.photos/seed/rg-studio-v4/1920/1080',
      link: `/studio/${lang || 'eng'}`
    },
    {
      id: 'academy' as const,
      title: t('academy'),
      subtitle: 'Mastery & Evolution',
      desc: 'Professional workshops led by industry veterans from around the globe.',
      icon: GraduationCap,
      color: 'from-blue-500/20 to-primary/20',
      borderColor: 'border-primary/30',
      bgImage: 'https://picsum.photos/seed/rg-academy-v4/1920/1080',
      link: `/aca/${lang || 'eng'}`
    }
  ];

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredPath || 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img 
              src={hoveredPath ? paths.find(p => p.id === hoveredPath)?.bgImage : 'https://picsum.photos/seed/rg-grid/1920/1080'} 
              className="w-full h-full object-cover grayscale"
              alt=""
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-bg-dark/95 backdrop-blur-sm" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-border-main bg-bg-card/50 backdrop-blur-md"
          >
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">{t('creative_ecosystem')}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-ink"
          >
            Which <span className="text-primary italic">Path</span> <br />
            Do you want to <span className="text-primary underline decoration-emerald-500/30 underline-offset-8">select?</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {paths.map((path, idx) => (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              onMouseEnter={() => setHoveredPath(path.id)}
              onMouseLeave={() => setHoveredPath(null)}
              onClick={() => navigate(path.link)}
              className={`relative h-[400px] md:h-[500px] group rounded-[3rem] border-2 ${path.borderColor} overflow-hidden bg-bg-card hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 active:scale-[0.98] text-left`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="size-16 rounded-2xl bg-bg-dark flex items-center justify-center text-primary border border-border-main group-hover:scale-110 transition-transform duration-500">
                    <path.icon size={32} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{path.subtitle}</div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-ink leading-none">{path.title}</h2>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-text-muted font-medium max-w-xs text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {path.desc}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="px-8 py-4 bg-ink text-bg-main rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group-hover:bg-primary group-hover:text-bg-dark transition-colors">
                      Enter Sector <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
            </motion.button>
          ))}
        </div>

        {/* Auth Quick Action */}
        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-4 pt-8"
          >
            <div className="h-[1px] w-24 bg-border-main" />
            <button 
              onClick={handleLoginRedirect}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted hover:text-primary transition-colors flex items-center gap-2 group"
            >
              Sync with Ecosystem <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(var(--border-main) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </section>
  );
};

export default React.memo(HeroSection);
