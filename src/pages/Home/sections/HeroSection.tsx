import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_SLIDES = [
  {
    title: 'We are Red Griffin',
    accent: 'Studio',
    desc: 'High-end CGI, Animation, and Digital Solutions for the modern industry.',
    image: 'https://picsum.photos/seed/studio-hero/1920/1080',
    link: '/studio'
  },
  {
    title: 'Master your',
    accent: 'Craft',
    desc: 'Professional workshops led by industry veterans from around the globe.',
    image: 'https://picsum.photos/seed/academy-hero/1920/1080',
    link: '/aca'
  }
];

interface HeroSectionProps {
  t: (key: string) => string;
  lang: string | undefined;
  user: any;
  getDashboardLink: () => string;
  handleLoginRedirect: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ t, lang, user, getDashboardLink, handleLoginRedirect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden rounded-[3rem] mx-4 mt-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_SLIDES[currentSlide].image} 
            alt="" 
            className="w-full h-full object-cover grayscale brightness-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24">
        <div className="max-w-4xl space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.4em] text-[10px]"
          >
            <div className="w-12 h-[1px] bg-primary" />
            {t('master_cg')}
          </motion.div>
          
          <motion.h1 
            key={`h1-${currentSlide}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase"
          >
            {HERO_SLIDES[currentSlide].title} <br />
            <span className="text-primary italic">{HERO_SLIDES[currentSlide].accent}.</span>
          </motion.h1>
          
          <motion.p 
            key={`p-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/50 max-w-xl font-medium leading-relaxed"
          >
            {HERO_SLIDES[currentSlide].desc}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4"
          >
            <Link to={`${HERO_SLIDES[currentSlide].link}/${lang || 'eng'}`} className="flex items-center gap-4 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-110 shadow-xl shadow-primary/20">
                <Play size={20} className="text-bg-dark fill-current ml-1 sm:size-24" />
              </div>
              <div className="text-left">
                <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/40">{t('about_us')}</div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">Start Experience</div>
              </div>
            </Link>

            {user ? (
              <Link 
                to={getDashboardLink()}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-bg-dark px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:scale-105 transition-all shadow-2xl shadow-primary/20 active:scale-95"
              >
                <LayoutDashboard size={16} />
                {t('my_dashboard')}
              </Link>
            ) : (
              <button 
                onClick={handleLoginRedirect}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-bg-dark px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-neutral-100 transition-all shadow-2xl active:scale-95"
              >
                <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
                {t('join_ecosystem')}
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Slider Navigation */}
      <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 flex items-center gap-4 scale-75 sm:scale-100">
        <div className="flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-primary' : 'w-4 bg-white/20 hover:bg-white/40'}`} 
            />
          ))}
        </div>
        <div className="h-8 w-[1px] bg-white/10 mx-2" />
        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
          0{currentSlide + 1} / 0{HERO_SLIDES.length}
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
