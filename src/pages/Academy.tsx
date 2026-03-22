import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Search, Filter, PlayCircle, Star, Users, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { academyService, Course } from '../services/academyService';

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

export default function Academy() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all_workshops');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Advanced Filter States
  const [filters, setFilters] = useState({
    level: 'all',
    priceRange: [0, 200],
    duration: 'all',
    sortBy: 'popular'
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [fetchedCourses, fetchedCategories] = await Promise.all([
          academyService.getCourses(),
          academyService.getCategories()
        ]);
        setCourses(fetchedCourses);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch academy data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all_workshops' || course.categoryId === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.lecturerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = filters.level === 'all' || course.level === filters.level;
    const matchesPrice = course.price <= filters.priceRange[1];

    return matchesCategory && matchesSearch && matchesLevel && matchesPrice;
  }).sort((a, b) => {
    if (filters.sortBy === 'price_low') return a.price - b.price;
    if (filters.sortBy === 'price_high') return b.price - a.price;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-8">
      {/* Academy Premium Hero Slider */}
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

      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <GraduationCap size={14} />
              {t('academy_workshops')}
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
                  type="text"
                  placeholder={t('search_workshops')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-white placeholder:text-white/20 outline-none"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
              >
                <Filter size={18} />
                {t('filters')}
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Skill Level</h4>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFilters({ ...filters, level: lvl })}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.level === lvl ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Max Price: ${filters.priceRange[1]}</h4>
                  <input 
                    type="range" 
                    min="0" 
                    max="200" 
                    step="10"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                    className="w-full accent-primary bg-white/10 rounded-lg appearance-none h-1"
                  />
                  <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                    <span>$0</span>
                    <span>$200+</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Sort By</h4>
                  <select 
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary cursor-pointer appearance-none"
                  >
                    <option value="popular" className="bg-bg-card text-white">Most Popular</option>
                    <option value="rating" className="bg-bg-card text-white">Highest Rated</option>
                    <option value="price_low" className="bg-bg-card text-white">Price: Low to High</option>
                    <option value="price_high" className="bg-bg-card text-white">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/40 rounded-xl text-xs font-black uppercase tracking-widest mr-2 border border-white/5">
            <Filter size={14} />
            {t('category')}
          </div>
          <button
            onClick={() => setSelectedCategory('all_workshops')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              selectedCategory === 'all_workshops'
                ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('all_workshops')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {t(cat.name)}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={course.id}
              className="group criativo-card"
            >
              <Link to={`/aca/${lang}/course/${course.slug}`}>
                <div className="relative aspect-video overflow-hidden rounded-2xl">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-xl shadow-primary/40 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <PlayCircle size={32} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {course.categoryId}
                  </div>
                </div>
                
                <div className="pt-6 space-y-4 text-left">
                  <h3 className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors line-clamp-2 uppercase">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="size-10 rounded-full border border-white/5">
                        <img src={course.lecturerAvatar || "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"} alt={course.lecturerName} referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <p className="text-sm text-white/40 font-medium">{t('by')} {course.lecturerName}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-white/20">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-primary" fill="currentColor" />
                      <span className="text-white">{course.rating}</span>
                      <span>({course.reviewsCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      <span>{course.studentsCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md">
                      <span className="text-white">{t(course.level)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('price')}</span>
                      <span className="text-2xl font-black text-white">${course.price}</span>
                    </div>
                    <div className="bg-white/5 text-white p-3 rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-colors border border-white/5">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <section className="bg-primary rounded-[2.5rem] p-12 text-bg-dark flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-4xl font-black tracking-tighter uppercase">{t('become_mentor')}</h2>
          <p className="text-bg-dark/60 font-medium max-w-md">
            {t('mentor_desc')}
          </p>
        </div>
        <button className="bg-bg-dark text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:scale-105 shadow-xl shadow-black/10">
          {t('start_teaching')}
        </button>
      </section>
    </div>
  );
}
