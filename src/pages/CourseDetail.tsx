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
import { academyService, Course, Lesson, Review } from '../services/academyService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function CourseDetail() {
  const { t } = useTranslation();
  const { slug, lang } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [slug, user]);

  const loadCourseData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const courseData = await academyService.getCourseBySlug(slug);
      if (courseData) {
        setCourse(courseData);
        const [lessonsData, reviewsData, enrollment] = await Promise.all([
          academyService.getLessons(courseData.id),
          academyService.getReviews(courseData.id),
          user ? academyService.getEnrollment(user.uid, courseData.id) : Promise.resolve(null)
        ]);
        setLessons(lessonsData);
        setReviews(reviewsData);
        setIsEnrolled(!!enrollment);
      }
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate(`/login/${lang || 'eng'}`);
      return;
    }
    if (!course) return;
    
    try {
      await academyService.enrollInCourse(user.uid, course.id);
      setIsEnrolled(true);
      navigate(`/learn/${lang || 'eng'}/${course.slug}`);
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg-dark">
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  );

  if (!course) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-dark space-y-6">
      <h2 className="text-2xl font-black text-white uppercase">Course Not Found</h2>
      <Link to={`/aca/${lang}`} className="criativo-btn flex items-center gap-2">
        <ArrowLeft size={18} /> Back to Academy
      </Link>
    </div>
  );

  return (
    <div className="py-8 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
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

          {/* Video Preview */}
          <div className="aspect-video rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden relative group cursor-pointer">
            <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-2xl shadow-primary/40 transform transition-transform group-hover:scale-110">
                <Play size={40} fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Curriculum */}
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
                    {lessons.map((lesson, lIdx) => (
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

          {/* Requirements & Target Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Requirements</h3>
              <ul className="space-y-3">
                {['Autodesk Maya 2024+', 'Basic understanding of 3D space', 'Wacom tablet recommended'].map((req, i) => (
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
                {['Aspiring Character Technical Directors', '3D Animators wanting to rig', 'Game Dev students'].map((target, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/60 text-sm font-medium">
                    <div className="size-1.5 rounded-full bg-primary" />
                    {target}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is this course live or recorded?", a: "All lessons are pre-recorded high-quality videos that you can watch at your own pace." },
                { q: "Do I get a certificate?", a: "Yes! Upon completing 100% of the lessons and quizzes, you will receive a verified blockchain certificate." },
                { q: "Can I ask questions to the mentor?", a: "Absolutely. Our Community Q&A section is active, and Elena personally reviews student submissions weekly." }
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

          {/* Reviews Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">Student Reviews</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Star size={16} className="text-primary" fill="currentColor" />
                <span className="text-sm font-black text-white">4.9/5.0</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'text-primary' : 'text-white/10'} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Mar 2026</span>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed italic">"{review.comment}"</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <div className="size-6 rounded-full bg-white/10" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Student Artist</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-12 text-center bg-white/5 rounded-3xl border border-white/5">
                  <MessageCircle size={32} className="mx-auto text-white/10 mb-4" />
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">No reviews yet for this workshop.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Card */}
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
                  onClick={handleEnroll}
                  className="w-full py-5 bg-bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                  {course.price === 0 ? 'Start Learning' : 'Enroll Now'}
                </button>
              )}
              <p className="text-center text-[8px] font-black opacity-40 uppercase tracking-widest">
                {course.price === 0 ? 'Open Source Workshop' : '30-Day Money-Back Guarantee'}
              </p>
            </div>

            <div className="pt-8 border-t border-bg-dark/5 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">This course includes:</p>
              <div className="space-y-4">
                {[
                  { icon: Clock, label: 'Lifetime Access' },
                  { icon: BarChart, label: t(course.level) + ' Level' },
                  { icon: Users, label: 'Community Support' },
                  { icon: Globe, label: 'EN / RU Content' },
                  { icon: Award, label: 'Certificate of completion' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon size={18} className="opacity-40" />
                    <span className="text-sm font-bold opacity-80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg-dark/5 space-y-4 border border-bg-dark/5">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-tight">Secure Platform</span>
              </div>
              <div className="flex gap-2 opacity-20 grayscale">
                <div className="h-6 w-10 bg-bg-dark rounded" />
                <div className="h-6 w-10 bg-bg-dark rounded" />
                <div className="h-6 w-10 bg-bg-dark rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
