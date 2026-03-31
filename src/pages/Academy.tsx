import React from 'react';
import { Search, Filter, GraduationCap, Video, Plus, BarChart3, BookOpen, Clock, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Preloader from '../components/Preloader';

// Hooks & Logic
import { useAcademyLogic } from './Academy/useAcademyLogic';

// Modular Components
import SynergySection from './Academy/components/SynergySection';
import FilterPanel from './Academy/components/FilterPanel';
import CourseCard from './Academy/components/CourseCard';

const HERO_SLIDES = [
  {
    title: 'Master Unreal Engine',
    accent: '5.4',
    desc: 'The most comprehensive path to professional VFX and Technical Art.',
    image: 'https://picsum.photos/seed/ue5/1200/600',
    tag: 'Premium'
  },
  {
    title: 'Character Design',
    accent: 'Foundations',
    desc: 'Learn industry-standard anatomy, sculpt and topology workflows.',
    image: 'https://picsum.photos/seed/sculpt/1200/600',
    tag: 'Best Seller'
  }
];

export default function Academy() {
  const {
    t, lang, activeRole, synergyData, synergyLoading,
    categories, loading, selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery, showFilters, setShowFilters,
    currentSlide, setCurrentSlide, filters, setFilters,
    filteredCourses, isLecturer, isStudent, studentProgress, lecturerStats
  } = useAcademyLogic();

  if (loading) return <Preloader message="Synchronizing Academy Hub..." size="lg" />;

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-12 animate-in fade-in duration-1000">
      {/* 1. Lecturer Synergy Block */}
      {isLecturer && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-1 border border-primary/20 bg-primary/5 rounded-[2.5rem] backdrop-blur-xl mb-12 overflow-hidden shadow-2xl shadow-primary/5 group"
        >
          <div className="p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-1000">
               <Video size={300} className="text-primary" />
            </div>
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="size-20 rounded-3xl bg-primary text-bg-dark flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] shrink-0">
                <Video size={32} />
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">Creator <span className="text-primary">Hub Node.</span></h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                  <div className="size-2 rounded-full bg-primary animate-pulse" />
                  Lecturer Telemetry: {lecturerStats?.coursesCount || 0} Workshops Active • {lecturerStats?.studentsCount || 0} Students Synchronized
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
              <button className="px-8 py-4 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center justify-center gap-3">
                <Plus size={16} /> New Workshop
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/60 hover:text-white flex items-center justify-center gap-3">
                <BarChart3 size={16} /> Analytics Node
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Global Synergy Section */}
      <SynergySection data={synergyData} loading={synergyLoading} activeRole={activeRole} />

      {/* 3. Student Progress Synergy Block */}
      {isStudent && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 p-10 sm:p-14 rounded-[3.5rem] bg-[#0a0a0a] border border-white/5 space-y-10 relative overflow-hidden group shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">Keep <span className="text-primary">Learning.</span></h3>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Last active learning trajectory node</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-4xl font-black text-primary italic tracking-tighter shadow-primary/20">
                  {studentProgress?.overallProgress || 84}<span className="text-[12px] uppercase text-white/20 ml-2 tracking-widest not-italic">%</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">↑ +5% Synchronized today</span>
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-8 p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 group-hover:border-primary/20 transition-all">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-lg shadow-primary/5">
                  <BookOpen size={28} />
                </div>
                <div className="flex-1 text-center lg:text-left min-w-0">
                  <div className="text-sm font-black text-white uppercase tracking-tight truncate italic">
                    {studentProgress?.lastCourse?.title || 'UE5.4: Advanced Niagara Dynamics'}
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 mt-2">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest truncate max-w-[200px]">
                       Lesson {studentProgress?.lastLesson?.order || 14}: {studentProgress?.lastLesson?.title || 'Fluid Particle Manipulation'}
                    </span>
                    <div className="size-1 bg-white/10 rounded-full" />
                    <span className="text-[9px] font-black text-primary uppercase animate-pulse italic">In progress</span>
                  </div>
                </div>
                <button className="w-full lg:w-auto px-10 py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95">
                  Resume Trajectory
                </button>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 size-80 bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-colors" />
          </div>

          <div className="lg:col-span-4 p-10 sm:p-14 rounded-[3.5rem] bg-white/[0.01] border border-white/5 space-y-10 shadow-2xl flex flex-col justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Global Stats Node</h4>
            <div className="space-y-8">
              {[
                { l: 'Workshops', v: studentProgress?.stats?.courses || '12', i: GraduationCap, color: 'text-primary' },
                { l: 'Total Sync Time', v: studentProgress?.stats?.hours || '148h', i: Clock, color: 'text-sky-400' },
                { l: 'Certificates', v: studentProgress?.stats?.certificates || '4', i: TrendingUp, color: 'text-emerald-400' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between group/stat">
                  <div className="flex items-center gap-4 text-white/40 group-hover/stat:text-white transition-colors">
                    <stat.i size={18} className={stat.color} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.l}</span>
                  </div>
                  <span className="text-sm font-black text-white uppercase italic tracking-tighter">{stat.v}</span>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-white/5 flex items-center gap-3">
               <Sparkles size={14} className="text-amber-500" />
               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Personal Lod sync active</span>
            </div>
          </div>
        </section>
      )}

      {/* Academy Premium Hero Slider */}
      <section className="relative h-[450px] sm:h-[550px] rounded-[4rem] overflow-hidden group shadow-2xl border border-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="absolute inset-0"
          >
            <img src={HERO_SLIDES[currentSlide].image} alt="" className="w-full h-full object-cover grayscale brightness-[0.4]" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 p-10 sm:p-20 flex flex-col justify-end space-y-6 sm:space-y-10">
          <div className="max-w-3xl space-y-4 sm:space-y-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              <span className="px-3 py-1 bg-primary text-bg-dark text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-primary/20">{HERO_SLIDES[currentSlide].tag}</span>
              <div className="h-px w-12 bg-white/20" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Specialist Node</span>
            </motion.div>
            <motion.h1 key={`h1-${currentSlide}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-6xl sm:text-8xl font-black tracking-tighter text-white leading-[0.8] uppercase italic">
              {HERO_SLIDES[currentSlide].title} <br /><span className="text-primary">{HERO_SLIDES[currentSlide].accent}.</span>
            </motion.h1>
            <motion.p key={`p-${currentSlide}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-white/60 font-medium max-w-xl leading-relaxed">{HERO_SLIDES[currentSlide].desc}</motion.p>
          </div>
          <div className="flex items-center gap-6 pt-6">
            {HERO_SLIDES.map((_, i) => (
              <button 
                key={i} onClick={() => setCurrentSlide(i)} 
                className={`h-1.5 transition-all duration-1000 rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] ${currentSlide === i ? 'w-20 bg-primary' : 'w-6 bg-white/10 hover:bg-white/30'}`} 
              />
            ))}
          </div>
        </div>
      </section>

      <header className="space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[11px] italic">
              <Zap size={16} /> {t('academy_workshops')}
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-white leading-none uppercase italic">
              Browse <span className="text-primary">Workshops.</span>
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[450px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
              <input
                type="text" placeholder={t('search_workshops')} value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/5 rounded-[2rem] focus:border-primary/40 focus:ring-[12px] focus:ring-primary/5 transition-all font-bold text-white placeholder:text-white/20 outline-none text-sm uppercase tracking-widest"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-10 rounded-[2rem] flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-[11px] transition-all border h-[72px] ${showFilters ? 'bg-primary text-bg-dark border-primary shadow-2xl shadow-primary/20' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
            >
              <Filter size={20} /> {t('filters')}
            </button>
          </div>
        </div>

        <FilterPanel showFilters={showFilters} filters={filters} setFilters={setFilters} />

        <div className="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mr-4 border border-white/5 italic">
            <Filter size={14} /> {t('category')}
          </div>
          <button
            onClick={() => setSelectedCategory('all_workshops')}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === 'all_workshops' ? 'bg-primary text-bg-dark border-primary shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            {t('all_workshops')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === cat.id ? 'bg-primary text-bg-dark border-primary shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'}`}
            >
              {t(cat.name)}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} lang={lang} t={t} />
          ))}
        </AnimatePresence>
      </div>

      <section className="bg-primary rounded-[4rem] p-16 sm:p-24 text-bg-dark flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-24 opacity-10 -translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-all duration-1000 rotate-12">
            <GraduationCap size={400} />
        </div>
        <div className="space-y-6 text-center lg:text-left relative z-10">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
             <div className="h-px w-10 bg-bg-dark/20" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">{t('become_mentor')}</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none">{t('become_mentor')} — <br/> Share your <span className="text-white">Genius.</span></h2>
          <p className="text-bg-dark/60 font-medium max-w-lg text-lg leading-relaxed">{t('mentor_desc')}</p>
        </div>
        <button className="bg-bg-dark text-white px-14 py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm hover:bg-black transition-all hover:scale-105 shadow-2xl shadow-black/20 active:scale-95 relative z-10">
          {t('start_teaching')}
        </button>
      </section>
    </div>
  );
}
