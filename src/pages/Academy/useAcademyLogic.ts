import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { academyService, Course } from '../../services/academyService';
import { useAuth } from '../../context/AuthContext';
import { useSynergyData } from '../../hooks/useSynergyData';

export function useAcademyLogic() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { profile, activeRole } = useAuth();
  const { data: synergyData, loading: synergyLoading } = useSynergyData();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all_workshops');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Industrial Role-Specific Telemetry
  const [studentProgress, setStudentProgress] = useState<any>(null);
  const [lecturerStats, setLecturerStats] = useState<any>(null);

  const [filters, setFilters] = useState({
    level: 'all',
    priceRange: [0, 1000],
    sortBy: 'popular'
  });

  const isLecturer = activeRole === 'lecturer' || activeRole === 'admin';
  const isStudent = activeRole === 'student' || activeRole === 'admin';

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

        // Fetch Personal Telemetry based on role
        if (isStudent) {
           const progress = await academyService.getStudentProgress();
           setStudentProgress(progress);
        }
        if (isLecturer) {
           const stats = await academyService.getLecturerSummary();
           setLecturerStats(stats);
        }

      } catch (error) {
        console.error("[Academy Logic] Data sync failure:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeRole]);

  const filteredCourses = useMemo(() => {
    const safeCourses = Array.isArray(courses) ? courses : [];
    return safeCourses.filter(course => {
      const matchesCategory = selectedCategory === 'all_workshops' || course.categoryId === selectedCategory;
      const matchesSearch = (course.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                           (course.lecturerName?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      const matchesPrice = course.price <= filters.priceRange[1];

      return matchesCategory && matchesSearch && matchesLevel && matchesPrice;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.price - b.price;
      if (filters.sortBy === 'price_high') return b.price - a.price;
      return 0;
    });
  }, [courses, selectedCategory, searchQuery, filters]);

  return {
    t, lang, profile, activeRole, synergyData, synergyLoading,
    categories, loading, selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery, showFilters, setShowFilters,
    currentSlide, setCurrentSlide, filters, setFilters,
    filteredCourses, isLecturer, isStudent, studentProgress, lecturerStats
  };
}
