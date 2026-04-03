import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_SLIDES = [
  {
    title: 'Master the',
    accent: 'Industrial Grid',
    desc: 'Join 42k+ specialists mastering architectural visualization, procedural VFX, and AI-driven design pipelines.',
    image: 'https://images.unsplash.com/photo-1635332306561-26792372e9fb?auto=format&fit=crop&q=80',
    tag: 'Operational'
  },
  {
    title: 'Accelerate with',
    accent: 'Neural Engine',
    desc: 'Harness the power of Unreal Engine 5.4 and ComfyUI workflows in our elite specialist workshops.',
    image: 'https://images.unsplash.com/photo-1614850523296-62c09930960d?auto=format&fit=crop&q=80',
    tag: 'Nexus Update'
  }
];

export default function AcademyHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="relative h-[400px] sm:h-[550px] rounded-[3rem] sm:rounded-[4.5rem] overflow-hidden group shadow-2xl shadow-primary/5 border border-white/5 mx-2 sm:mx-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={HERO_SLIDES[currentSlide].image} alt="" className="w-full h-full object-cover grayscale brightness-[0.35] contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
          
          {/* ⚡ Neural Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 p-8 sm:p-20 flex flex-col justify-end space-y-6 sm:space-y-10">
        <div className="max-w-3xl space-y-4 sm:space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 sm:gap-6"
          >
            <div className="px-3 py-1 bg-primary text-bg-dark text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-primary/20">
              {HERO_SLIDES[currentSlide].tag}
            </div>
            <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Node Sync Active</span>
            </div>
          </motion.div>
          
          <motion.h1 
            key={`h1-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl font-black tracking-tighter text-white leading-[0.85] uppercase italic"
          >
            {HERO_SLIDES[currentSlide].title} <br />
            <span className="text-primary drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]">{HERO_SLIDES[currentSlide].accent}.</span>
          </motion.h1>
          
          <motion.p 
            key={`p-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-xl text-white/50 font-medium max-w-xl leading-relaxed italic border-l-2 border-white/10 pl-8"
          >
            {HERO_SLIDES[currentSlide].desc}
          </motion.p>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 transition-all duration-700 rounded-full border border-white/10 ${currentSlide === i ? 'w-16 bg-primary shadow-[0_0_15px_#00f5d4]' : 'w-6 bg-white/10 hover:bg-white/20'}`} 
              />
            ))}
          </div>
          <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Module {currentSlide + 1} / {HERO_SLIDES.length}</div>
        </div>
      </div>
    </section>
  );
}
