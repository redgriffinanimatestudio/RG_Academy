import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { academyService, Course } from '../../services/academyService';
import { useAuth } from '../../context/AuthContext';
import Preloader from '../../components/Preloader';

// Modular Academy Components
import AcademyHero from '../../components/academy/AcademyHero';
import AcademyStats from '../../components/academy/AcademyStats';
import AcademyFilters from '../../components/academy/AcademyFilters';
import CourseCard from '../../components/academy/CourseCard';
import BecomeMentor from '../../components/academy/BecomeMentor';
import CurrentOpenings from '../../components/academy/CurrentOpenings';
import NeuralSearch from '../../components/academy/NeuralSearch';

export default function AcademyPage() {
  const { lang } = useParams();
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all_workshops');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    level: 'all',
    priceRange: [0, 200],
    duration: 'all',
    sortBy: 'popular'
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const userRoles = profile?.roles || [];
  const isLecturer = userRoles.includes('lecturer') || userRoles.includes('admin');
  const isStudent = userRoles.includes('student');
  const hasSynergySL = isLecturer && isStudent;

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const safeCourses = Array.isArray(courses) ? courses : [];

  const filteredCourses = safeCourses.filter(course => {
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

  if (loading) return <Preloader message="Loading Academy..." size="lg" />;

  return (
    <div className="relative min-h-screen">
      {/* 🔮 Neural Architecture Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 space-y-24 sm:space-y-32 py-12 pb-32">
        <AcademyStats 
          isLecturer={isLecturer} 
          isStudent={isStudent} 
          hasSynergySL={hasSynergySL} 
        />

        <AcademyHero />

        <div className="space-y-16">
          <AcademyFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            filters={filters}
            setFilters={setFilters}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 sm:gap-14">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} lang={lang} />
              ))}
            </AnimatePresence>
          </div>

          {filteredCourses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center space-y-6 border border-white/5 bg-white/[0.01] rounded-[4rem] border-dashed"
            >
              <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
                <Search size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter text-white/40">No Nodes Found.</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Refine selection parameters in matrix filters</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-32">
          <CurrentOpenings />
          <BecomeMentor />
        </div>

        <NeuralSearch 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>
    </div>
  );
}
