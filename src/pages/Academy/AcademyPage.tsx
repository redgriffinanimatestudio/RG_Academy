import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { academyService, Course } from '../../services/academyService';
import { useAuth } from '../../context/AuthContext';
import Preloader from '../../components/Preloader';

// Modular Academy Components
import AcademyHero from '../../components/academy/AcademyHero';
import AcademyStats from '../../components/academy/AcademyStats';
import AcademyFilters from '../../components/academy/AcademyFilters';
import CourseCard from '../../components/academy/CourseCard';
import BecomeMentor from '../../components/academy/BecomeMentor';

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
    <div className="space-y-16 py-8">
      <AcademyStats 
        isLecturer={isLecturer} 
        isStudent={isStudent} 
        hasSynergySL={hasSynergySL} 
      />

      <AcademyHero />

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} lang={lang} />
          ))}
        </AnimatePresence>
      </div>

      <BecomeMentor />
    </div>
  );
}
