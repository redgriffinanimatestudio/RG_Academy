import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Rocket, Sparkles } from 'lucide-react';
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
import NeuralPathfinder from '../../components/academy/NeuralPathfinder';
import NeuralRoadmap from '../../components/dashboard/NeuralRoadmap';

export default function AcademyPage() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
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
  const [activePathId, setActivePathId] = useState<string | null>(null);

  const isAuthenticated = !!user;
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
        
        // If user is logged in, use their saved path if it exists
        if (profile?.chosenPathId) {
          setActivePathId(profile.chosenPathId);
        }
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
  }, [profile?.chosenPathId]);
  
  const handlePathComplete = async (id: string) => {
    setActivePathId(id);
    if (isAuthenticated) {
      try {
        await academyService.updateUserPath(id);
      } catch (err) {
        console.error("Failed to synchronize soul path:", err);
      }
    }
  };

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

  if (loading) return <Preloader message="Loading Academy Ecosystem..." size="lg" />;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔮 Industrial Architecture Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent blur-[150px] opacity-20" />
      </div>

      <div className="relative z-10 space-y-20 py-12 pb-32">
        
        {/* --- DYNAMIC HEADER SECTION --- */}
        <AnimatePresence mode="wait">
          {isAuthenticated ? (
            <motion.div 
              key="auth-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 sm:px-8"
            >
              <AcademyStats 
                isLecturer={isLecturer} 
                isStudent={isStudent} 
                hasSynergySL={hasSynergySL} 
              />
            </motion.div>
          ) : (
            <motion.div 
              key="guest-header"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <AcademyHero />
              <div className="flex justify-center -mt-20 relative z-20">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/${lang}/login`)}
                  className="px-12 py-5 bg-primary text-bg-dark font-black uppercase tracking-[0.3em] rounded-full shadow-[0_20px_40px_rgba(0,255,157,0.3)] flex items-center gap-4 group transition-all"
                >
                  <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
                  Apply to Program
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- NEURAL PATH / ROADMAP SECTION --- */}
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-1 rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent">
            <div className="bg-bg-dark/80 backdrop-blur-3xl rounded-[3.3rem] p-10 border border-white/5">
              <AnimatePresence mode="wait">
                 {!activePathId ? (
                    <motion.div
                       key="pathfinder"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className="space-y-10"
                     >
                        <div className="text-center space-y-3">
                          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Find Your <span className="text-primary italic">Trajectory</span></h2>
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em]">Neural Mapping Algorithm v2.0</p>
                        </div>
                        <NeuralPathfinder onComplete={handlePathComplete} />
                     </motion.div>
                 ) : (
                    <motion.div
                       key="roadmap"
                       initial={{ opacity: 0, scale: 1.02 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="space-y-12"
                    >
                       <div className="flex items-center justify-between px-6">
                          <div className="flex items-center gap-4">
                            <Sparkles size={20} className="text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-widest text-white">Active Specialization</h2>
                          </div>
                          <button 
                             onClick={() => setActivePathId(null)}
                             className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-colors flex items-center gap-2"
                          >
                             Reset Trajectory
                          </button>
                       </div>
                       <NeuralRoadmap 
                          activePathId={activePathId} 
                          completedNodeIds={[]} 
                          isGuest={!isAuthenticated}
                       />
                    </motion.div>
                 )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- COURSE MARKETPLACE --- */}
        <div className="space-y-16 pt-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Industrial <span className="text-primary">Catalog</span></h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.6em]">Professional Certification Workshops</p>
          </div>

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

          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 sm:gap-14">
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
        </div>

        {/* --- INDUSTRIAL FOOTER SECTIONS --- */}
        {!isAuthenticated && (
          <div className="space-y-32 pt-20">
            <CurrentOpenings />
            <BecomeMentor />
          </div>
        )}

        <NeuralSearch 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>
    </div>
  );
}
