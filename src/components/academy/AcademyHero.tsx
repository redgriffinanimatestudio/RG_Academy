import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_SLIDES = [
  {
    title: 'Elevate your',
    accent: 'Digital Art',
    desc: 'Join 42k+ artists mastering character design, environment art, and VFX.',
    image: 'https://picsum.photos/seed/aca-hero1/1920/1080',
    tag: 'Trending'
  },
  {
    title: 'Master real-time',
    accent: 'Rendering',
    desc: 'Unlock the full potential of Unreal Engine 5.4 with our expert-led workshops.',
    image: 'https://picsum.photos/seed/aca-hero2/1920/1080',
    tag: 'New Workshop'
  }
];

export default function AcademyHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="relative h-[450px] rounded-[3rem] overflow-hidden group shadow-2xl shadow-primary/5 border border-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={HERO_SLIDES[currentSlide].image} alt="" className="w-full h-full object-cover grayscale brightness-[0.4]" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 p-12 flex flex-col justify-end space-y-6">
        <div className="max-w-2xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="px-2 py-0.5 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded">
              {HERO_SLIDES[currentSlide].tag}
            </span>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Specialist Workshop</span>
          </motion.div>
          
          <motion.h1 
            key={`h1-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tighter text-white leading-none uppercase"
          >
            {HERO_SLIDES[currentSlide].title} <br />
            <span className="text-primary italic">{HERO_SLIDES[currentSlide].accent}.</span>
          </motion.h1>
          <motion.p 
            key={`p-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-white/60 font-medium max-w-lg"
          >
            {HERO_SLIDES[currentSlide].desc}
          </motion.p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-primary' : 'w-4 bg-white/20 hover:bg-white/40'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
