import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Search, Filter, PlayCircle, Star, Users, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

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
    category: 'Animation'
  },
  {
    id: '2',
    slug: 'cinematic-vfx-houdini-destruction',
    title: 'Cinematic VFX: Houdini Destruction',
    lecturer: 'Sarah Chen',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png',
    rating: 4.8,
    reviews: 850,
    price: 129.99,
    students: 8200,
    duration: '32h 40m',
    levelKey: 'expert',
    thumbnail: 'https://picsum.photos/seed/houdini/800/600',
    category: 'VFX & Compositing'
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
    category: '3D Modeling'
  },
  {
    id: '4',
    slug: 'unreal-engine-5-real-time-lighting',
    title: 'Unreal Engine 5: Real-time Lighting',
    lecturer: 'Elena Vance',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-4.png',
    rating: 4.9,
    reviews: 3400,
    price: 79.99,
    students: 45000,
    duration: '18h 30m',
    levelKey: 'intermediate',
    thumbnail: 'https://picsum.photos/seed/ue5/800/600',
    category: 'Game Development'
  },
  {
    id: '5',
    slug: 'digital-sculpting-zbrush',
    title: 'Digital Sculpting with ZBrush',
    lecturer: 'David Miller',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-5.png',
    rating: 4.8,
    reviews: 1500,
    price: 69.99,
    students: 12000,
    duration: '28h 10m',
    levelKey: 'beginner',
    thumbnail: 'https://picsum.photos/seed/zbrush/800/600',
    category: '3D Modeling'
  },
  {
    id: '6',
    slug: '2d-animation-principles-cg',
    title: '2D Animation Principles for CG',
    lecturer: 'Yuki Tanaka',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-6.png',
    rating: 4.9,
    reviews: 980,
    price: 54.99,
    students: 7500,
    duration: '12h 45m',
    levelKey: 'beginner',
    thumbnail: 'https://picsum.photos/seed/2danim/800/600',
    category: 'Animation'
  }
];

const CATEGORIES = [
  'all_workshops',
  'modeling_3d',
  'animation',
  'vfx_compositing',
  'game_dev',
  'digital_art',
  'software_masterclass'
];

export default function Academy() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('all_workshops');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = MOCK_COURSES.filter(course => {
    const categoryKey = course.category === '3D Modeling' ? 'modeling_3d' :
                       course.category === 'Animation' ? 'animation' :
                       course.category === 'VFX & Compositing' ? 'vfx_compositing' :
                       course.category === 'Game Development' ? 'game_dev' :
                       course.category === 'Digital Art' ? 'digital_art' :
                       course.category === 'Software Masterclass' ? 'software_masterclass' : '';

    const matchesCategory = selectedCategory === 'all_workshops' || categoryKey === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 py-8">
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <GraduationCap size={14} />
              {t('academy_workshops')}
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white leading-none uppercase">
              {t('master_craft').split('.')[0]} <br />
              <span className="text-primary italic">{t('master_craft').split('.')[1] || 'CRAFT.'}</span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl font-medium">
              {t('academy_desc')}
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            <input
              type="text"
              placeholder={t('search_workshops')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-white placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/40 rounded-xl text-xs font-black uppercase tracking-widest mr-2 border border-white/5">
            <Filter size={14} />
            {t('filter')}
          </div>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === category
                  ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {t(category)}
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
                    {t(course.category === '3D Modeling' ? 'modeling_3d' :
                       course.category === 'Animation' ? 'animation' :
                       course.category === 'VFX & Compositing' ? 'vfx_compositing' :
                       course.category === 'Game Development' ? 'game_dev' :
                       course.category === 'Digital Art' ? 'digital_art' :
                       course.category === 'Software Masterclass' ? 'software_masterclass' : course.category)}
                  </div>
                </div>
                
                <div className="pt-6 space-y-4 text-left">
                  <h3 className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors line-clamp-2 uppercase">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="size-10 rounded-full border border-white/5">
                        <img src={course.lecturerAvatar} alt={course.lecturer} referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <p className="text-sm text-white/40 font-medium">{t('by')} {course.lecturer}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-white/20">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-primary" fill="currentColor" />
                      <span className="text-white">{course.rating}</span>
                      <span>({course.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md">
                      <span className="text-white">{t(course.levelKey)}</span>
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
