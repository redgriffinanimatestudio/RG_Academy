import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  PlayCircle, 
  Star, 
  Users, 
  ChevronRight, 
  BookOpen,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

const MOCK_COURSES = [
  {
    id: '1',
    slug: 'mastering-character-rigging-maya',
    title: 'Mastering Character Rigging in Maya',
    lecturer: 'Alex Rivera',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
    rating: 4.9,
    reviews: 1240,
    price: 89.99,
    students: 15420,
    duration: '24h 15m',
    levelKey: 'advanced',
    thumbnail: 'https://picsum.photos/seed/rigging/800/600',
    category: 'Animation',
    topics: ['Character Modeling', 'Retopology']
  },
  {
    id: '3',
    slug: 'environment-art-aaa-games',
    title: 'Environment Art for AAA Games',
    lecturer: 'Marcus Thorne',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png',
    rating: 4.7,
    reviews: 2100,
    price: 94.99,
    students: 22100,
    duration: '45h 20m',
    levelKey: 'intermediate',
    thumbnail: 'https://picsum.photos/seed/envart/800/600',
    category: '3D Modeling',
    topics: ['Modular Environments', 'World Building']
  }
];

const HERO_SLIDES = [
  {
    title: 'Master the Human Form',
    desc: 'Deep dive into muscular systems and structural landmarks with world-class sculptors.',
    image: 'https://picsum.photos/seed/anatomy1/1200/600',
    tag: 'Advanced Sculpting'
  },
  {
    title: 'Dynamic Posing & Flow',
    desc: 'Learn to capture movement and weight in your character designs.',
    image: 'https://picsum.photos/seed/anatomy2/1200/600',
    tag: 'Character Design'
  }
];

export default function TopicPage() {
  const { t } = useTranslation();
  const { lang, topicSlug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Advanced Filter States
  const [filters, setFilters] = useState({
    level: 'all',
    priceRange: [0, 200],
    duration: 'all'
  });

  const topicName = topicSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Topic';

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filters.level === 'all' || course.levelKey === filters.level;
    const matchesPrice = course.price <= filters.priceRange[1];
    const matchesDuration = filters.duration === 'all' || 
      (filters.duration === 'short' && parseInt(course.duration) < 10) ||
      (filters.duration === 'long' && parseInt(course.duration) >= 10);
      
    return matchesSearch && matchesLevel && matchesPrice && matchesDuration;
  });

  return (
    <div className="space-y-20 py-8">
      {/* Dynamic Hero Slider */}
      <section className="relative h-[500px] rounded-[3rem] overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img src={HERO_SLIDES[currentSlide].image} alt="" className="w-full h-full object-cover grayscale brightness-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 p-12 flex flex-col justify-end space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="px-3 py-1 bg-primary text-bg-dark text-[9px] font-black uppercase tracking-widest rounded-lg">
              {HERO_SLIDES[currentSlide].tag}
            </span>
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-[9px] font-black text-ink/40 uppercase tracking-[0.3em]">{topicName} Series</span>
          </motion.div>

          <div className="max-w-2xl space-y-4">
            <motion.h1 
              key={`h1-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-black tracking-tighter text-white leading-none uppercase"
            >
              {HERO_SLIDES[currentSlide].title.split(' ')[0]} <br />
              <span className="text-primary italic">{HERO_SLIDES[currentSlide].title.split(' ').slice(1).join(' ')}</span>
            </motion.h1>
            <motion.p 
              key={`p-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-ink/60 font-medium"
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

        <Link 
          to={`/aca/${lang || 'eng'}`} 
          className="absolute top-8 left-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-ink/60 hover:text-white transition-all bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-border-main/40"
        >
          <ArrowLeft size={14} />
          {t('all_workshops')}
        </Link>
      </section>

      {/* Advanced Search & Filtering Bar */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Curated Collection</h2>
            <p className="text-xs font-bold text-ink/20 uppercase tracking-[0.2em]">{filteredCourses.length} Workshops Available</p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" size={20} />
                <input
                  type="text"
                  placeholder={t('search_workshops')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-ink/5 border border-border-main/20 rounded-2xl focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-white placeholder:text-ink/20 outline-none"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20' : 'bg-ink/5 text-ink/40 border-border-main/20 hover:border-white/20'}`}
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
              <div className="p-8 rounded-[2.5rem] bg-ink/5 border border-border-main/20 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Skill Level</h4>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFilters({ ...filters, level: lvl })}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.level === lvl ? 'bg-primary text-bg-dark' : 'bg-ink/5 text-ink/40 hover:text-white'}`}
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
                    className="w-full accent-primary bg-ink/10 rounded-lg appearance-none h-1"
                  />
                  <div className="flex justify-between text-[8px] font-black text-ink/20 uppercase tracking-widest">
                    <span>$0</span>
                    <span>$200+</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Duration</h4>
                  <select 
                    value={filters.duration}
                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    className="w-full bg-ink/5 border border-border-main/40 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-ink/60 focus:outline-none focus:border-primary cursor-pointer appearance-none"
                  >
                    <option value="all" className="bg-bg-card text-white">Any Duration</option>
                    <option value="short" className="bg-bg-card text-white">Short (&lt; 10 hours)</option>
                    <option value="long" className="bg-bg-card text-white">Long (10+ hours)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Main Course Grid */}
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
                </div>
                
                <div className="pt-6 space-y-4 text-left">
                  <h3 className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors line-clamp-2 uppercase leading-tight">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="size-10 rounded-full border border-border-main/20">
                        <img src={course.lecturerAvatar} alt={course.lecturer} referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <p className="text-sm text-ink/40 font-medium">{t('by')} {course.lecturer}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-ink/20">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-primary" fill="currentColor" />
                      <span className="text-white">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-ink/5 rounded-md">
                      <span className="text-white uppercase text-[8px] tracking-widest">{t(course.levelKey)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-main/20">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ink/20">{t('price')}</span>
                      <span className="text-2xl font-black text-white">${course.price}</span>
                    </div>
                    <div className="bg-ink/5 text-white p-3 rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-colors border border-border-main/20">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Newsletter / CTA Section */}
      <section className="bg-ink/5 border border-border-main/20 rounded-[3rem] p-16 flex flex-col items-center text-center space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="size-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-2xl shadow-primary/5">
          <GraduationCap size={48} />
        </div>
        <div className="space-y-4 max-w-2xl relative z-10">
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">Elevate your <br /><span className="text-primary italic">Craft.</span></h2>
          <p className="text-xl text-ink/40 font-medium leading-relaxed">
            Our academy is constantly expanding. Subscribe to get notified about new workshops in {topicName} 
            and exclusive mentorship opportunities.
          </p>
        </div>
        <div className="flex w-full max-w-md gap-4 relative z-10">
          <input 
            type="email" 
            placeholder="Enter your professional email" 
            className="flex-1 bg-ink/5 border border-border-main/40 rounded-2xl p-5 text-white placeholder:text-ink/20 font-medium focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
          />
          <button className="bg-primary text-bg-dark px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20">
            Join Waitlist
          </button>
        </div>
      </section>
    </div>
  );
}
