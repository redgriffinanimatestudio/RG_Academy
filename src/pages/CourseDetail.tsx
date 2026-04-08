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
  ArrowLeft,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { academyService, Course, Lesson } from '../services/academyService';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';
import EnrollmentStepper from '../components/academy/enrollment/EnrollmentStepper';
import { IndustrialAccordion } from '../components/common/IndustrialAccordion';

export default function CourseDetail() {
  const { t } = useTranslation();
  const { slug, lang } = useParams();
  const navigate = useNavigate();
  const { profile: user, loading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<any[]>([]);
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
          
          // Load curriculum hierarchy
          const curriculum = await academyService.getCourseCurriculum(courseData.slug);
          setModules(curriculum);
          
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

  // Transform curriculum for IndustrialAccordion
  const accordionItems = modules.map((module, idx) => ({
    id: module.id,
    title: module.title,
    subtitle: `Sector_Node_${idx + 1 < 10 ? `0${idx + 1}` : idx + 1}`,
    badge: `${module.lessons?.length || 0} Units`,
    content: (
      <div className="space-y-3">
        {module.lessons?.map((lesson: any, lIdx: number) => (
          <div key={lesson.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 group/lesson hover:border-primary/20 transition-all">
            <div className="flex items-center gap-4">
              <div className={`size-10 rounded-xl flex items-center justify-center border ${lesson.isFree ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]' : 'bg-white/5 border-white/10 text-white/10'}`}>
                {lesson.isFree ? <PlayCircle size={16} fill="currentColor" /> : <Lock size={16} />}
              </div>
              <div className="space-y-0.5">
                <span className="text-[7px] font-black uppercase text-white/20 tracking-widest">Unit_{lIdx + 1}</span>
                <h5 className="text-[13px] font-black uppercase tracking-tight text-white/80 group-hover/lesson:text-white transition-colors">{lesson.title}</h5>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{lesson.duration}</span>
               {lesson.isFree && <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Preview</button>}
            </div>
          </div>
        ))}
      </div>
    )
  }));

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

  if (authLoading || pageLoading) return <Preloader message="INIT_INDUSTRIAL_DETAILS..." size="lg" className="min-h-screen bg-[#050505]" />;

  if (!course) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] space-y-6">
      <h2 className="text-2xl font-black text-white uppercase">Course Not Found</h2>
      <Link to={`/aca/${lang}`} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase flex items-center gap-2 hover:bg-white/10">
        <ArrowLeft size={18} /> Back to Academy
      </Link>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* 🔮 Neural Architecture Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-primary/10 to-transparent blur-[160px] opacity-40" />
      </div>

      <div className="relative z-10 py-12 pb-32 max-w-screen-2xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8 space-y-20 sm:space-y-32">
            
            {/* Header Identity */}
            <div className="space-y-10">
              <Link to={`/aca/${lang}`} className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-white/10 transition-all group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back_ToNode_Directory
              </Link>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.5em] text-[10px]">
                  <Globe size={16} />
                  {t((course.category?.name || 'Category').toUpperCase().replace(' ', '_'))}_DOMAIN
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.85] italic">
                  {course.title.split(':').map((part: string, i: number) => (
                    <span key={i} className={i === 1 ? "text-primary block mt-4" : "block"}>{part}</span>
                  ))}
                </h1>
                <p className="text-xl sm:text-2xl text-white/30 font-medium leading-[1.8] max-w-4xl border-l-2 border-white/5 pl-10 italic">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-12 pt-10">
                  <div className="flex items-center gap-5">
                    <div className="avatar size-16 rounded-[1.5rem] border border-white/10 overflow-hidden bg-white/5 p-0.5 shadow-2xl">
                      <img src={course.lecturerAvatar || "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"} alt="" className="w-full h-full object-cover rounded-[1.4rem]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Lead_Instructional_Node</p>
                      <p className="text-xl font-black text-white italic">{course.lecturerName}</p>
                    </div>
                  </div>
                  
                  <div className="h-12 w-px bg-white/5 hidden md:block" />
                  
                  <div className="flex items-center gap-12 text-white/60">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Efficiency_Index</span>
                       <div className="flex items-center gap-2">
                         <Star size={20} className="text-primary" fill="currentColor" />
                         <span className="text-2xl font-black text-white tabular-nums tracking-tighter">4.9/5.0</span>
                       </div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Neural_Peers</span>
                       <div className="flex items-center gap-2">
                         <Users size={20} />
                         <span className="text-2xl font-black text-white tabular-nums tracking-tighter">1,248+</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Node Preview */}
            <div className="aspect-video rounded-[4rem] sm:rounded-[6rem] bg-black border border-white/5 overflow-hidden relative group cursor-pointer shadow-2xl">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
              <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-50 transition-all duration-[1.5s] group-hover:scale-105 group-hover:rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-28 sm:size-40 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-3xl transform transition-all duration-700 group-hover:scale-110">
                   <div className="size-20 sm:size-24 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)] group-hover:shadow-[0_0_100px_rgba(var(--primary-rgb),0.6)]">
                    <Play size={48} className="ml-1.5" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-16 right-16 flex items-center gap-4">
                 <div className="flex items-center gap-3 px-6 py-3 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Live_Sync_Ready</span>
                 </div>
              </div>
            </div>

            {/* Curriculum Matrix [ACCORDION VERSION] */}
            <div className="space-y-16">
              <div className="flex items-center justify-between border-b border-white/5 pb-10">
                <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white italic">Curriculum_Matrix.</h2>
                <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">
                   {lessons.length} Operational_Units
                </div>
              </div>
              
              <IndustrialAccordion items={accordionItems} />
            </div>

            {/* Industrial Meta Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-16 rounded-[4rem] bg-[#080808] border border-white/10 space-y-10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-12 text-primary/10 group-hover:text-primary/20 transition-colors">
                   <Shield size={80} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">Operational_Requirements.</h3>
                <ul className="grid grid-cols-1 gap-6 relative z-10">
                  {['Industry_Standard_Hardware', 'Matrix_Logic: Level 4 Auth', 'CGI_Synapse_Protocol_V4', 'High_Speed_Neural_Sync'].map((req, i) => (
                    <li key={req} className="flex items-center gap-5 text-white/40 text-[12px] font-black uppercase tracking-[0.3em] group/req">
                      <div className="size-2.5 rounded-full bg-primary/20 border border-primary/40 group-hover/req:scale-150 transition-transform" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-16 rounded-[4rem] bg-white/[0.02] border border-white/10 space-y-10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
                   <Users size={80} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">Target_Personnel.</h3>
                <ul className="grid grid-cols-1 gap-6 relative z-10">
                  {['High_Fidelity_3D_Artists', 'VFX_Technical_Directors', 'Unreal_Engine_Specialists', 'Procedural_Logic_Architects'].map((target, i) => (
                    <li key={target} className="flex items-center gap-5 text-white/40 text-[12px] font-black uppercase tracking-[0.3em] group/req">
                      <div className="size-2.5 rounded-full bg-white/10 border border-white/20 group-hover/req:scale-150 transition-transform" />
                      {target}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Protocols FAQ */}
            <div className="space-y-16">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">Security_Protocols & FAQ.</h2>
              <IndustrialAccordion 
                allowMultiple
                items={[
                  { 
                    id: 'faq1', 
                    title: "Is this course live or recorded?", 
                    subtitle: "PROTOCOL_01",
                    content: "All high-fidelity modules are pre-deployed to our global edge nodes, available for 24/7 on-demand synchronization. No latency, just instant mastery." 
                  },
                  { 
                    id: 'faq2', 
                    title: "Do I get a certificate?", 
                    subtitle: "PROTOCOL_02",
                    content: "Negative. You receive a verified Digital Signature of Achievement, authenticated on the Red Griffin Neural Network and viewable on your global profile." 
                  }
                ]} 
              />
            </div>
          </div>

          {/* Industrial Action Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-12 space-y-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-[4rem] bg-white text-bg-dark space-y-12 shadow-[0_60px_150px_rgba(0,0,0,0.6)] border border-white/20 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 italic">Asset_Yield_Fee</span>
                  <div className="flex items-baseline gap-5">
                    <span className="text-[12px] font-black text-primary -translate-y-10">$</span>
                    <span className="text-8xl font-black tracking-tighter tabular-nums leading-none">{course.price ? course.price : 'FREE'}</span>
                    <div className="flex flex-col">
                       <span className="text-lg font-black opacity-20 line-through">$149.99</span>
                       <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">-84% SYNC</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 relative z-10">
                  {isEnrolled ? (
                    <button 
                      onClick={() => navigate(`/learn/${lang || 'eng'}/${course.slug}`)}
                      className="w-full py-8 bg-primary text-bg-dark rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 group"
                    >
                      <Play size={16} fill="currentColor" /> Continue_Session
                    </button>
                  ) : (
                    <button 
                      onClick={handleEnrollClick}
                      className="w-full py-8 bg-bg-dark text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/30 flex items-center justify-center gap-4 group"
                    >
                      {course.price === 0 ? 'Initialize_Access' : 'Authorize_Purchase'}
                      <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  )}
                  
                  <div className="text-center">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 italic">30-Day Money-Back Protocol</p>
                  </div>
                </div>

                <div className="pt-12 border-t border-bg-dark/5 space-y-8 relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-30">Unit_Module_Inclusions:</p>
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { icon: Clock, label: 'Lifetime_Sync_Access'},
                      { icon: BarChart, label: t(course.level).toUpperCase() + '_AUTH_LVL' },
                      { icon: Users, label: 'Peer_Network_Entry' },
                      { icon: Award, label: 'Neural_Synapse_Signature' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-5 group/item">
                        <div className="size-12 rounded-2xl bg-bg-dark/5 flex items-center justify-center opacity-30 group-hover/item:opacity-100 transition-all border border-transparent group-hover/item:border-bg-dark/10 group-hover/item:bg-white shadow-inner group-hover/item:shadow-xl group-hover/item:-translate-y-1 duration-500">
                           <item.icon size={20} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-50 group-hover/item:opacity-100 transition-all">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 🚀 Operational Yield Estimator [NEW MODULE] */}
              <div className="p-12 rounded-[4rem] bg-black/60 border border-white/10 backdrop-blur-3xl space-y-10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="flex items-center justify-between relative z-10">
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Yield_Forecast</span>
                     <Zap size={16} className="text-primary animate-pulse" fill="currentColor" />
                  </div>

                  <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between">
                         <span className="text-[11px] font-black uppercase tracking-widest text-white/60">Estimated_Earnings</span>
                         <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">+$1,240</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[11px] font-black uppercase tracking-widest text-white/60">Neural_Tokens</span>
                         <span className="text-2xl font-black text-white tabular-nums tracking-tighter">+5,400</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-primary shadow-[0_0_15px_#00f5d4]" />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 text-center italic">Calculated based on industry ROI benchmarks</p>
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
