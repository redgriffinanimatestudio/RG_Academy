import React from 'react';
import { Search, Filter, GraduationCap, Video, Plus, BarChart3, BookOpen, Clock, TrendingUp } from 'lucide-react';
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
    filteredCourses, isLecturer, isStudent
  } = useAcademyLogic();

  if (loading) return <Preloader message="Loading Academy..." size="lg" />;

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8">
      {/* 1. Lecturer Synergy Block */}
      {isLecturer && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-1 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl sm:rounded-[2.5rem] backdrop-blur-xl mb-8 sm:mb-12 overflow-hidden"
        >
          <div className="p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10 shrink-0">
                <Video size={24} className="sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-xl font-black uppercase tracking-tight text-white truncate">Creator Hub</h3>
                <p className="text-[9px] sm:text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 truncate">
                  Manage your workshops, students and revenue stream
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                <Plus size={14} /> New Workshop
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                <BarChart3 size={14} /> Analytics
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Global Synergy Section */}
      <SynergySection data={synergyData} loading={synergyLoading} activeRole={activeRole} />

      {/* 3. Student Progress Synergy Block */}
      {isStudent && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-6 sm:space-y-8 relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white italic">Keep Learning.</h3>
                <p className="text-[9px] sm:text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">Your last active workshop session</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-black text-xl sm:text-2xl tracking-tighter">
                84<span className="text-[9px] sm:text-[10px] uppercase text-white/20 ml-1 mt-1 sm:mt-2 tracking-widest">% done</span>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="size-12 sm:size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shrink-0"><BookOpen size={20} className="sm:w-6 sm:h-6" /></div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="text-[11px] sm:text-xs font-black text-white uppercase tracking-tight truncate">UE5.4: Advanced Niagara Dynamics</div>
                  <div className="text-[8px] sm:text-[9px] text-white/40 uppercase font-bold mt-1 truncate">Lesson 14: Fluid Particle Manipulation</div>
                </div>
                <button className="w-full sm:w-auto px-6 py-2.5 bg-primary text-bg-dark rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Resume</button>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 size-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors" />
          </div>

          <div className="p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/20">Learning Stats</h4>
            <div className="space-y-4">
              {[
                { l: 'Workshops', v: '12', i: GraduationCap },
                { l: 'Hours Studied', v: '148h', i: Clock },
                { l: 'Certificates', v: '4', i: TrendingUp }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/40"><stat.i size={14} /><span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">{stat.l}</span></div>
                  <span className="text-[11px] sm:text-xs font-black text-white uppercase">{stat.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Academy Premium Hero Slider */}
      <section className="relative h-[350px] sm:h-[450px] rounded-2xl sm:rounded-[3rem] overflow-hidden group shadow-2xl shadow-primary/5 border border-white/5">
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

        <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end space-y-4 sm:space-y-6">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-primary text-bg-dark text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded">{HERO_SLIDES[currentSlide].tag}</span>
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Specialist Workshop</span>
            </motion.div>
            <motion.h1 key={`h1-${currentSlide}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black tracking-tighter text-white leading-none uppercase">
              {HERO_SLIDES[currentSlide].title} <br /><span className="text-primary italic">{HERO_SLIDES[currentSlide].accent}.</span>
            </motion.h1>
            <motion.p key={`p-${currentSlide}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-white/60 font-medium max-w-lg">{HERO_SLIDES[currentSlide].desc}</motion.p>
          </div>
          <div className="flex items-center gap-4 pt-4">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-primary' : 'w-4 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
        </div>
      </section>

      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <GraduationCap size={14} /> {t('academy_workshops')}
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-white leading-none uppercase">
              Browse <span className="text-primary italic">Workshops.</span>
            </h2>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                <input
                  type="text" placeholder={t('search_workshops')} value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-white placeholder:text-white/20 outline-none"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
              >
                <Filter size={18} /> {t('filters')}
              </button>
            </div>
          </div>
        </div>

        <FilterPanel showFilters={showFilters} filters={filters} setFilters={setFilters} />

        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/40 rounded-xl text-xs font-black uppercase tracking-widest mr-2 border border-white/5">
            <Filter size={14} /> {t('category')}
          </div>
          <button
            onClick={() => setSelectedCategory('all_workshops')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === 'all_workshops' ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            {t('all_workshops')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === cat.id ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'}`}
            >
              {t(cat.name)}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} lang={lang} t={t} />
          ))}
        </AnimatePresence>
      </div>

      <section className="bg-primary rounded-[2.5rem] p-12 text-bg-dark flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-4xl font-black tracking-tighter uppercase">{t('become_mentor')}</h2>
          <p className="text-bg-dark/60 font-medium max-w-md">{t('mentor_desc')}</p>
        </div>
        <button className="bg-bg-dark text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:scale-105 shadow-xl shadow-black/10">
          {t('start_teaching')}
        </button>
      </section>
    </div>
  );
}
