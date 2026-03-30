import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Play, 
  Clock, 
  BarChart, 
  Users, 
  Star, 
  ChevronRight, 
  CheckCircle, 
  Lock,
  Globe,
  Award,
  Calendar,
  Shield,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { academyService, Course, Lesson } from '../services/academyService';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';
import EnrollmentStepper from '../components/academy/enrollment/EnrollmentStepper';

export default function CourseDetail() {
  const { t } = useTranslation();
  const { slug, lang } = useParams();
  const navigate = useNavigate();
  const { profile: user, loading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true); 
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  useEffect(() => {
    async function loadCourseData() {
      if (!slug) return;
      setPageLoading(true);
      try {
        const courseData = await academyService.getCourseBySlug(slug);
        if (courseData) {
          setCourse(courseData);
          const lessonsData = await academyService.getLessons(courseData.slug);
          setLessons(lessonsData);
          
          if (user?.id) {
            const enrollments = await academyService.getUserEnrollments(user.id);
            const enrolled = enrollments.some((e: any) => e.courseId === courseData.id);
            setIsEnrolled(enrolled);
          }
        }
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setPageLoading(false);
      }
    }

    if (!authLoading) {
      loadCourseData();
    }
  }, [slug, user?.id, authLoading]);

  const handleEnrollClick = () => {
    if (!user) {
      navigate(`/aca/${lang || 'eng'}/login`);
      return;
    }
    setShowEnrollModal(true);
  };

  const handleEnrollSuccess = () => {
    setIsEnrolled(true);
    setShowEnrollModal(false);
    navigate(`/learn/${lang || 'eng'}/${course?.slug}`);
  };

  if (authLoading || pageLoading) return <Preloader message="Loading Course..." size="lg" className="min-h-screen bg-[#050505]" />;

  if (!course) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] space-y-6">
      <h2 className="text-2xl font-black text-white uppercase">Course Not Found</h2>
      <Link to={`/aca/${lang}`} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase flex items-center gap-2">
        <ArrowLeft size={18} /> Back to Academy
      </Link>
    </div>
  );

  return (
    <div className="py-8 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <Globe size={14} />
              {t((course.category?.name || 'Category').toLowerCase().replace(' ', '_'))}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
              {course.title}
            </h1>
            <p className="text-xl text-white/60 font-medium leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="avatar size-12 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-white/20">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('by')}</p>
                  <p className="text-sm font-bold text-white">{course.lecturerName}</p>
                </div>
              </div>
              
              <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Star size={18} className="text-primary" fill="currentColor" />
                  <span className="text-white font-bold">4.9</span>
                  <span className="text-white/20">({reviews.length} {t('reviews')})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-video rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden relative group cursor-pointer">
            <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-2xl shadow-primary/40 transform transition-transform group-hover:scale-110">
                <Play size={40} fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Course Curriculum</h2>
            <div className="space-y-4">
              {lessons.length > 0 ? (
                <div className="p-8 rounded-3xl bg-zinc-900 border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Main Modules</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{lessons.length} Lessons</span>
                  </div>
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="size-8 bg-white/5 rounded-lg flex items-center justify-center text-white/20">
                            {lesson.isFree ? <Play size={14} className="text-primary" /> : <Lock size={14} />}
                          </div>
                          <span className={`text-sm font-medium ${lesson.isFree ? 'text-white' : 'text-white/40'}`}>{lesson.title}</span>
                        </div>
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">Curriculum being finalized...</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Requirements</h3>
              <ul className="space-y-3">
                {['Industry Standard Software', 'Basic understanding of 3D space', 'Passion for creation'].map((req, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/60 text-sm font-medium">
                    <div className="size-1.5 rounded-full bg-primary" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Who is this for?</h3>
              <ul className="space-y-3">
                {['Aspiring CGI Artists', 'Game Designers', 'Creative Professionals'].map((target, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/60 text-sm font-medium">
                    <div className="size-1.5 rounded-full bg-primary" />
                    {target}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is this course live or recorded?", a: "All lessons are pre-recorded high-quality videos that you can watch at your own pace." },
                { q: "Do I get a certificate?", a: "Yes! Upon completing 100% of the lessons, you will receive a verified certificate." }
              ].map((faq, i) => (
                <details key={i} className="group p-6 rounded-3xl bg-white/5 border border-white/5 cursor-pointer">
                  <summary className="flex items-center justify-between font-black uppercase tracking-tight text-sm list-none">
                    {faq.q}
                    <ChevronRight size={18} className="text-white/20 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-4 text-white/40 text-sm font-medium leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 p-8 rounded-[2.5rem] bg-white text-bg-dark space-y-8 shadow-2xl shadow-primary/10 border border-bg-dark/5">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Workshop Fee</span>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black">${course.price}</span>
                {course.price > 0 && <span className="text-lg font-bold opacity-40 line-through">$149.99</span>}
              </div>
            </div>

            <div className="space-y-4">
              {isEnrolled ? (
                <button 
                  onClick={() => navigate(`/learn/${lang || 'eng'}/${course.slug}`)}
                  className="w-full py-5 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                >
                  Continue Learning
                </button>
              ) : (
                <button 
                  onClick={handleEnrollClick}
                  className="w-full py-5 bg-bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                  {course.price === 0 ? 'Start Learning' : 'Enroll Now'}
                </button>
              )}
            </div>

            {showEnrollModal && course && (
              <EnrollmentStepper 
                course={course} 
                onSuccess={handleEnrollSuccess} 
                onClose={() => setShowEnrollModal(false)}
                accent="#fff" // Primary accent
              />
            )}

            <div className="pt-8 border-t border-bg-dark/5 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">This course includes:</p>
              <div className="space-y-4">
                {[
                  { icon: Clock, label: 'Lifetime Access' },
                  { icon: BarChart, label: t(course.level) + ' Level' },
                  { icon: Users, label: 'Community Support' },
                  { icon: Award, label: 'Certificate of completion' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon size={18} className="opacity-40" />
                    <span className="text-sm font-bold opacity-80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
