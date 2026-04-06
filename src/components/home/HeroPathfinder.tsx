import React, { useState } from 'react';
import { Play, ChevronDown, Sparkles, Target, Zap, Search, Globe, Shield, X } from 'lucide-react';

interface HeroPathfinderProps {
  onDiscover: () => void;
  lang?: string;
  t: (key: string) => string;
}

export default function HeroPathfinder({ onDiscover, lang, t }: HeroPathfinderProps) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-20 px-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center space-y-12">
        {/* Badge & Vision */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">
            {lang === 'ru' ? 'Новая Эра CG-Продакшена' : 'New Era of CG Production'}
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {lang === 'ru' ? (
              <>Масштабируй Свой <span className="text-gradient-primary">Творческий Код</span></>
            ) : (
              <>Scale Your <span className="text-gradient-primary">Creative DNA</span></>
            )}
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {lang === 'ru' 
              ? 'Индустриальная архитектура для обучения, продакшена и карьерного роста в экосистеме Red Griffin. Синхронизируй свое видение с будущим.'
              : 'Industrial architecture for learning, production, and career trajectory in the Red Griffin Ecosystem. Synchronize your vision with the future.'}
          </p>
        </div>

        {/* Action Hub */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button 
            onClick={() => setShowVideo(true)}
            className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 text-primary fill-primary/20" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white/40 uppercase tracking-wider">{lang === 'ru' ? 'Смотреть Демо' : 'Watch Demo'}</div>
              <div className="text-sm font-semibold text-white">{lang === 'ru' ? 'Мир Red Griffin' : 'Inside Red Griffin'}</div>
            </div>
          </button>

          <button 
            onClick={onDiscover}
            className="px-10 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group"
          >
            <Search className="w-5 h-5" />
            {lang === 'ru' ? 'Выбрать Свой Путь' : 'Discover Your Path'}
          </button>
        </div>

        {/* Visual Cues */}
        <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-40 grayscale hover:grayscale-0 transition-all duration-500 delay-500">
          <div className="flex flex-col items-center gap-2">
            <Target className="w-6 h-6 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Career Trajectory</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">AI Integration</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Global Network</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-6 h-6 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Security Protocol</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20 hover:text-white/40 transition-colors animate-bounce">
            <span className="text-[8px] font-black uppercase tracking-[0.4em] rotate-180 [writing-mode:vertical-lr]">Scroll</span>
            <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowVideo(false)} />
          <div className="relative w-full max-w-5xl aspect-video glass-pro-max overflow-hidden animate-in zoom-in duration-500">
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-6 right-6 z-10 p-4 rounded-full bg-black/60 hover:bg-primary transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" // Placeholder video
              title="Red Griffin Ecosystem Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

// End of file
