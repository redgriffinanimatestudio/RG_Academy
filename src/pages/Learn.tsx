import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings, 
  Maximize, 
  Menu,
  ChevronLeft,
  CheckCircle,
  Circle,
  FileText,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { academyService, Course, Lesson, Enrollment } from '../services/academyService';


import Preloader from '../components/Preloader';

export default function Learn() {
  const { slug, lang } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'qa' | 'resources'>('overview');
  const [autoplay, setAutoplay] = useState(true);
  const [userNote, setUserNote] = useState('');

  useEffect(() => {
    if (!user && !loading) {
      navigate(`/login/${lang || 'eng'}`);
      return;
    }
    loadLearningData();
  }, [slug, user]);

  const loadLearningData = async () => {
    if (!slug || !user) return;
    setLoading(true);
    try {
      const courseData = await academyService.getCourseBySlug(slug);
      if (courseData) {
        setCourse(courseData);
        const [lessonsData, enrollmentData] = await Promise.all([
          academyService.getLessons(courseData.id),
          academyService.getEnrollment(user.uid, courseData.id)
        ]);
        
        setLessons(lessonsData);
        setEnrollment(enrollmentData);
        
        if (lessonsData.length > 0) {
          // Default to first lesson or first uncompleted lesson
          const firstUncompleted = lessonsData.find(l => !enrollmentData?.completedLessons.includes(l.id));
          setCurrentLesson(firstUncompleted || lessonsData[0]);
        }
      }
    } catch (error) {
      console.error("Error loading learning data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoRef.current && currentLesson?.videoUrl && currentLesson.type === 'video') {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentLesson.videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoplay) video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentLesson.videoUrl;
        if (autoplay) video.play();
      }
    }
  }, [currentLesson]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleLessonComplete = async (lessonId: string, completed: boolean) => {
    if (!user || !course) return;
    try {
      await academyService.updateLessonProgress(user.uid, course.id, lessonId, completed);
      const updatedEnrollment = await academyService.getEnrollment(user.uid, course.id);
      setEnrollment(updatedEnrollment);
      
      // Auto-advance if autoplay is on
      if (completed && autoplay) {
        const currentIndex = lessons.findIndex(l => l.id === lessonId);
        if (currentIndex < lessons.length - 1) {
          setCurrentLesson(lessons[currentIndex + 1]);
        }
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  if (loading) return <Preloader message="Loading Course..." size="lg" className="h-screen bg-bg-dark" />;

  if (!course || !currentLesson) return (
    <div className="h-screen bg-bg-dark flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-black text-white uppercase">Access Denied or Not Found</h2>
      <Link to={`/aca/${lang}`} className="criativo-btn">Return to Academy</Link>
    </div>
  );

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-white/5 bg-black/40 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/aca/${lang}/course/${course.slug}`} className="p-2 text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <h1 className="text-sm font-black uppercase tracking-tight text-white truncate max-w-md">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Autoplay</span>
            <button 
              onClick={() => setAutoplay(!autoplay)}
              className={`w-10 h-5 rounded-full transition-all relative ${autoplay ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 size-3 rounded-full bg-bg-dark transition-all ${autoplay ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Your Progress</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${enrollment?.progress || 0}%` }}
                  className="h-full bg-primary" 
                />
              </div>
              <span className="text-[10px] font-bold text-white">{enrollment?.progress || 0}%</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all">
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 bg-black flex flex-col overflow-hidden">
          <div className="flex-1 relative group bg-zinc-950">
            {currentLesson.type === 'video' ? (
              <>
                <video 
                  ref={videoRef}
                  className="w-full h-full"
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => handleLessonComplete(currentLesson.id, true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6 pointer-events-none">
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight">{currentLesson.title}</h2>
                  <div className="flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-6">
                      <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                      </button>
                      <SkipBack size={20} className="text-white/40 hover:text-white cursor-pointer" />
                      <SkipForward size={20} className="text-white/40 hover:text-white cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-6">
                      <Settings size={20} className="text-white/40 hover:text-white cursor-pointer" />
                      <Maximize size={20} className="text-white/40 hover:text-white cursor-pointer" />
                    </div>
                  </div>
                </div>
              </>
            ) : currentLesson.type === 'text' ? (
              <div className="h-full overflow-y-auto p-12 max-w-4xl mx-auto space-y-8 scrollbar-thin scrollbar-thumb-white/10">
                <div className="space-y-4">
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                    <BookOpen size={32} />
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tight text-white">{currentLesson.title}</h2>
                </div>
                <div className="prose prose-invert max-w-none text-white/60 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                <button 
                  onClick={() => handleLessonComplete(currentLesson.id, true)}
                  className={`mt-12 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                    enrollment?.completedLessons.includes(currentLesson.id) 
                    ? 'bg-emerald-500 text-bg-dark' 
                    : 'bg-primary text-bg-dark hover:scale-105 shadow-primary/20'
                  }`}
                >
                  {enrollment?.completedLessons.includes(currentLesson.id) ? 'Lesson Completed' : 'Mark as Completed'}
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8">
                <div className="size-24 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <HelpCircle size={48} />
                </div>
                <div className="space-y-4 max-w-md">
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white">Lesson Quiz</h2>
                  <p className="text-white/40 font-medium">Test your knowledge of "{currentLesson.title}" to proceed.</p>
                </div>
                <button className="px-10 py-5 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20">
                  Start Quiz
                </button>
              </div>
            )}
          </div>

          {/* Lesson Overview Footer Tabs */}
          <div className="h-64 border-t border-white/5 bg-black/40 flex flex-col shrink-0 overflow-hidden">
            <div className="flex border-b border-white/5 px-8">
              {[
                { id: 'overview', label: 'Overview', icon: Layout },
                { id: 'notes', label: 'Notes', icon: FileText },
                { id: 'qa', label: 'Community Q&A', icon: MessageSquare },
                { id: 'resources', label: 'Resources', icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-b-2 ${
                    activeTab === tab.id 
                    ? 'border-primary text-primary bg-white/5' 
                    : 'border-transparent text-white/40 hover:text-white'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="max-w-4xl">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">About this Lesson</h3>
                    <p className="text-sm text-white/40 leading-relaxed max-w-2xl">
                      {currentLesson.type === 'video' ? 'Watch this video to master character rigging techniques in Maya.' : 'Read this article carefully to understand the theoretical foundations.'}
                    </p>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">Your Personal Notes</h3>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Auto-saved to your profile</span>
                    </div>
                    <textarea 
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="Type your notes here... (e.g. 'Timestamp 05:20 - Remember to orient joints')"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none min-h-[100px]"
                    />
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">Discussion</h3>
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ask a Question</button>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                        <div className="size-10 rounded-xl bg-white/10 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">How do I fix joint flipping?</p>
                          <p className="text-xs text-white/40 mt-1">Elena Vance: Check your preferred angle settings in the IK solver attributes.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/20">Lesson Assets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 cursor-pointer transition-all border border-white/5">
                        <FileText size={14} className="text-primary" /> Project_Files_Maya_Scene.zip
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 cursor-pointer transition-all border border-white/5">
                        <BookOpen size={14} className="text-primary" /> Shortcuts_Cheat_Sheet.pdf
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Curriculum */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/5 bg-zinc-900 flex flex-col shrink-0"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-black uppercase tracking-tighter text-white">Curriculum</h2>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{lessons.length} Lessons</span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="py-2">
                  {lessons.map((lesson) => {
                    const isCompleted = enrollment?.completedLessons.includes(lesson.id);
                    const isActive = currentLesson.id === lesson.id;
                    
                    return (
                      <div 
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-white/5 ${isActive ? 'bg-primary/10 border-r-4 border-primary' : ''}`}
                      >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLessonComplete(lesson.id, !isCompleted);
                          }}
                          className={`shrink-0 transition-colors ${isCompleted ? 'text-emerald-500' : 'text-white/10 hover:text-white/30'}`}
                        >
                          {isCompleted ? <CheckCircle size={20} fill="currentColor" className="text-bg-dark" /> : <Circle size={20} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold truncate ${isActive ? 'text-primary' : 'text-white/60'}`}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/40">{lesson.type}</span>
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
