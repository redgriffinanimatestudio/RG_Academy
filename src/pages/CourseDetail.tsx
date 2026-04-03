import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Play,
  PlayCircle,
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
    <div className="relative min-h-screen">
      {/* 🔮 Neural Architecture Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent blur-[140px] opacity-40" />
      </div>

      <div className="relative z-10 py-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
          <div className="lg:col-span-3 space-y-20 sm:space-y-32">
            
            {/* Header Identity */}
            <div className="space-y-8">
              <Link to={`/aca/${lang}`} className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-white/10 transition-all group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back_ToNode_Directory
              </Link>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.5em] text-[10px]">
                  <Globe size={16} />
                  {t((course.category?.name || 'Category').toUpperCase().replace(' ', '_'))}_DOMAIN
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.85] italic">
                  {course.title.split(':').map((part, i) => (
                    <span key={i} className={i === 1 ? "text-primary block mt-2" : "block"}>{part}</span>
                  ))}
                </h1>
                <p className="text-xl sm:text-2xl text-white/40 font-medium leading-relaxed max-w-4xl border-l-2 border-white/10 pl-8 italic">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-10 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="avatar size-14 rounded-2xl border border-white/10 overflow-hidden bg-white/5 p-0.5 shadow-2xl">
                      <img src={course.lecturerAvatar || "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"} alt="" className="w-full h-full object-cover rounded-[1.1rem]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Authenticated_Lecturer</p>
                      <p className="text-lg font-black text-white italic">{course.lecturerName}</p>
                    </div>
                  </div>
                  
                  <div className="h-10 w-px bg-white/5 hidden md:block" />
                  
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Efficiency_Rating</span>
                       <div className="flex items-center gap-2">
                         <Star size={18} className="text-primary" fill="currentColor" />
                         <span className="text-xl font-black text-white tabular-nums tracking-tighter">4.9/5.0</span>
                       </div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Network_Peers</span>
                       <div className="flex items-center gap-2 text-white/60">
                         <Users size={18} />
                         <span className="text-xl font-black tabular-nums tracking-tighter">1,248+</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Node Preview */}
            <div className="aspect-video rounded-[3.5rem] sm:rounded-[5rem] bg-black border border-white/5 overflow-hidden relative group cursor-pointer shadow-2xl">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-40 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-24 sm:size-32 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-3xl transform transition-all duration-700 group-hover:scale-110">
                   <div className="size-16 sm:size-20 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)]">
                    <Play size={36} className="sm:size-48 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-12 left-12 flex items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-xl border border-white/10 backdrop-blur-xl">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Live_Node_Preview</span>
                 </div>
              </div>
            </div>

            {/* Curriculum Matrix */}
            <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white italic">Curriculum_Matrix.</h2>
                <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                   {lessons.length} Operational_Units
                </div>
              </div>
              
              <div className="space-y-4">
                {lessons.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {lessons.map((lesson, idx) => (
                      <motion.div 
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all group/unit"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`size-12 rounded-2xl flex items-center justify-center border transition-all ${lesson.isFree ? 'bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/10 text-white/20'}`}>
                            {lesson.isFree ? <PlayCircle size={20} fill="currentColor" /> : <Lock size={20} />}
                          </div>
                          <div className="space-y-1">
                             <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Node_{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                             <h4 className={`text-lg font-black uppercase tracking-tight transition-colors ${lesson.isFree ? 'text-white group-hover/unit:text-primary' : 'text-white/40'}`}>
                               {lesson.title}
                             </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg">
                             <Clock size={12} className="text-white/20" />
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{lesson.duration}</span>
                           </div>
                           {lesson.isFree && (
                             <button className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:brightness-125 transition-all underline underline-offset-8">Preview</button>
                           )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
                    <p className="text-white/20 font-black uppercase tracking-[0.5em] text-xs">Awaiting_Neural_Sync: Curriculum_Deployment pending...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Industrial Meta Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-12 rounded-[3.5rem] bg-[#080808] border border-white/5 space-y-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                   <Shield size={64} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">Operational_Requirements.</h3>
                <ul className="space-y-4 relative z-10">
                  {['Industry_Standard_Hardware', 'Matrix_Logic: Level 4 Auth', 'CGI_Synapse_Protocol_V2'].map((req, i) => (
                    <li key={req} className="flex items-center gap-4 text-white/40 text-[11px] font-black uppercase tracking-[0.2em] group/req">
                      <div className="size-2 rounded-full bg-primary/20 border border-primary/40 group-hover/req:scale-150 transition-transform" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors">
                   <Users size={64} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">Authorized_Personnel.</h3>
                <ul className="space-y-4 relative z-10">
                  {['High_Fidelity_3D_Artists', 'VFX_Technical_Directors', 'Unreal_Engine_Specialists'].map((target, i) => (
                    <li key={target} className="flex items-center gap-4 text-white/40 text-[11px] font-black uppercase tracking-[0.2em] group/req">
                      <div className="size-2 rounded-full bg-white/10 border border-white/20 group-hover/req:scale-150 transition-transform" />
                      {target}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Protocols FAQ */}
            <div className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Security_Protocols & FAQ.</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { q: "Is this course live or recorded?", a: "All high-fidelity modules are pre-deployed to our global edge nodes, available for 24/7 on-demand synchronization." },
                  { q: "Do I get a certificate?", a: "Negative. You receive a verified Digital Signature of Achievement, authenticated on the Red Griffin Neural Network." }
                ].map((faq, i) => (
                  <details key={i} className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 cursor-pointer hover:border-white/10 transition-all">
                    <summary className="flex items-center justify-between font-black uppercase tracking-[0.2em] text-[10px] list-none text-white/60 group-hover:text-white transition-colors">
                      {faq.q}
                      <ChevronRight size={18} className="text-white/20 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-6 text-white/30 text-sm font-medium leading-relaxed italic pl-6 border-l border-white/10">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Industrial Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-12 space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-[3rem] sm:rounded-[4rem] bg-white text-bg-dark space-y-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="space-y-3 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">Asset_Yield_Fee</span>
                  <div className="flex items-baseline gap-4">
                    <span className="text-[10px] font-black text-primary -translate-y-8">$</span>
                    <span className="text-7xl font-black tracking-tighter tabular-nums leading-none">{course.price ? course.price : 'FREE'}</span>
                    <div className="flex flex-col">
                       <span className="text-sm font-black opacity-20 line-through">$149.99</span>
                       <span className="text-[8px] font-black uppercase text-primary tracking-widest">-84% SYNC</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  {isEnrolled ? (
                    <button 
                      onClick={() => navigate(`/learn/${lang || 'eng'}/${course.slug}`)}
                      className="w-full py-6 bg-primary text-bg-dark rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
                    >
                      <Play size={14} fill="currentColor" /> Continue_Session
                    </button>
                  ) : (
                    <button 
                      onClick={handleEnrollClick}
                      className="w-full py-6 bg-bg-dark text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-black transition-all hover:scale-[1.05] active:scale-95 shadow-2xl shadow-black/20 flex items-center justify-center gap-3 group"
                    >
                      {course.price === 0 ? 'Initialize_Access' : 'Authorize_Purchase'}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  
                  <div className="text-center">
                     <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 italic">30-Day Money-Back Protocol</p>
                  </div>
                </div>

                <div className="pt-10 border-t border-bg-dark/5 space-y-6 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Unit_Module_Inclusions:</p>
                  <div className="space-y-5">
                    {[
                      { icon: Clock, label: 'Lifetime_Sync_Access', c: 'text-primary' },
                      { icon: BarChart, label: t(course.level).toUpperCase() + '_AUTH_LVL' },
                      { icon: Users, label: 'Peer_Network_Entry' },
                      { icon: Award, label: 'Digital_Synapse_Signature' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 group/item">
                        <div className="size-8 rounded-xl bg-bg-dark/5 flex items-center justify-center opacity-40 group-hover/item:opacity-100 transition-all">
                           <item.icon size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 group-hover/item:opacity-100 transition-all">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Matrix Status Card */}
              <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Node_Status</span>
                    <div className="flex items-center gap-2">
                       <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                       <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Operational</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-primary" />
                    </div>
                    <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                       <span>Yield_84.2%</span>
                       <span>Capacity_Nominal</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {showEnrollModal && course && (
          <EnrollmentStepper 
            course={course} 
            onSuccess={handleEnrollSuccess} 
            onClose={() => setShowEnrollModal(false)}
            accent="#fff"
          />
        )}
      </div>
    </div>
  );
}
