import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  Layout,
  Zap,
  ChevronDown,
  MonitorPlay,
  ClipboardList,
  Plus,
  MonitorCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { academyService, Course, Lesson, Module } from '../services/academyService';
import { reviewService, Annotation } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function Learn() {
  const { slug, lang } = useParams();
  const navigate = useNavigate();
  const { profile: user, loading: authLoading } = useAuth();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastSyncTimeRef = useRef<number>(0);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<any | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'qa' | 'resources' | 'critique'>('overview');
  const [autoplay, setAutoplay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoQuality, setVideoQuality] = useState<string>('auto');
  const [availableQualities, setAvailableQualities] = useState<any[]>([]);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // 1. Initial Data Loading
  useEffect(() => {
    if (!user && !loading && !authLoading) {
      navigate(`/aca/${lang || 'eng'}/login`);
      return;
    }
    loadLearningEnvironment();
  }, [slug, user, authLoading]);

  const loadLearningEnvironment = async () => {
    if (!slug || !user) return;
    setLoading(true);
    try {
      // Load course and hierarchical curriculum
      const courseData = await academyService.getCourseBySlug(slug);
      if (courseData) {
        setCourse(courseData);
        const curriculum = await academyService.getCourseCurriculum(courseData.slug);
        setModules(curriculum);

        // Map lessons for lookup
        const allLessons = curriculum.flatMap(m => m.lessons);
        
        // Load enrollment and resume progress
        const enrollments = await academyService.getUserEnrollments(user.id);
        const enrollmentData = enrollments.find((e: any) => e.courseId === courseData.id);
        setEnrollment(enrollmentData);
        
        if (allLessons.length > 0) {
          let completedIds: string[] = [];
          try {
            completedIds = enrollmentData?.completedLessons ? (typeof enrollmentData.completedLessons === 'string' ? JSON.parse(enrollmentData.completedLessons) : enrollmentData.completedLessons) : [];
          } catch (e) {
            console.warn("Progress parse failed, using empty array");
          }
          const firstUncompleted = allLessons.find(l => !completedIds.includes(l.id));
          const targetLesson = firstUncompleted || allLessons[0];
          setCurrentLesson(targetLesson);

          // Expand the module for the current lesson
          if (targetLesson.moduleId) {
            setExpandedModules(prev => ({ ...prev, [targetLesson.moduleId!]: true }));
          }
        }
      }
    } catch (error) {
      console.error("LMS initialization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Video Engine & Playback Sync
  useEffect(() => {
    if (videoRef.current && currentLesson?.videoUrl && currentLesson.type === 'video') {
      const video = videoRef.current;
      
      // Cleanup previous Hls instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const initPlayer = async () => {
        // Load last position
        const savedPosition = enrollment ? await academyService.getPlaybackPosition(enrollment.id, currentLesson.id) : 0;

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 60
          });
          hlsRef.current = hls;
          hls.loadSource(currentLesson.videoUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setAvailableQualities(hls.levels);
            video.currentTime = savedPosition;
            if (autoplay) video.play().catch(() => {});
          });

          hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            if (hls.autoLevelEnabled) setVideoQuality('auto');
            else setVideoQuality(data.level.toString());
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = currentLesson.videoUrl;
          video.currentTime = savedPosition;
          if (autoplay) video.play().catch(() => {});
        }
      };

      initPlayer();
    }
  }, [currentLesson]);

  // 3. Real-time Progress Tracking (Every 10 seconds)
  useEffect(() => {
    if (!videoRef.current || !enrollment || !currentLesson || currentLesson.type !== 'video') return;

    const interval = setInterval(async () => {
      const video = videoRef.current;
      if (!video || !isPlaying) return;

      const currentTime = video.currentTime;
      // Only sync if moved at least 5 seconds from last sync
      if (Math.abs(currentTime - lastSyncTimeRef.current) > 5) {
        await academyService.savePlaybackPosition(enrollment.id, currentLesson.id, currentTime);
        lastSyncTimeRef.current = currentTime;

        // Auto-complete logic (95% rule)
        const progress = (currentTime / (video.duration || 1)) * 100;
        const completedList = Array.isArray(enrollment.completedLessons) ? enrollment.completedLessons : (typeof enrollment.completedLessons === 'string' ? JSON.parse(enrollment.completedLessons) : []);
        if (progress > 95 && !completedList.includes(currentLesson.id)) {
          handleLessonComplete(currentLesson.id, true);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, currentLesson, enrollment]);

  // 4. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current || document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;

      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'l':
          videoRef.current.currentTime += 10;
          break;
        case 'j':
          videoRef.current.currentTime -= 10;
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          videoRef.current.muted = !videoRef.current.muted;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleLessonComplete = async (lessonId: string, completed: boolean) => {
    if (!user || !course) return;
    try {
      await academyService.updateLessonProgress(user.id, course.id, lessonId, completed);
      const updatedEnrollments = await academyService.getUserEnrollments(user.id);
      const updatedEnrollment = updatedEnrollments.find((e: any) => e.courseId === course.id);
      setEnrollment(updatedEnrollment);
      
      if (completed && autoplay) {
        // Advance to next lesson in hierarchical order
        const allLessons = modules.flatMap(m => m.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === lessonId);
        if (currentIndex < allLessons.length - 1) {
          setCurrentLesson(allLessons[currentIndex + 1]);
        }
      }
    } catch (error) {
      console.error("Progress sync failure:", error);
    }
  };

  if (loading) return <Preloader message="Initializing Industrial LMS Node..." size="lg" className="h-screen bg-bg-dark" />;

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden select-none">
      {/* Top Header: Vault Interface */}
      <header className="h-16 border-b border-white/5 bg-black/60 flex items-center justify-between px-6 shrink-0 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <Link to={`/aca/${lang}/course/${course?.slug}`} className="p-2 text-white/40 hover:text-white transition-all hover:bg-white/5 rounded-xl">
            <ChevronLeft size={20} />
          </Link>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <div className="flex flex-col">
            <h1 className="text-xs font-black uppercase tracking-tight text-white truncate max-w-[150px] md:max-w-xs">
              {course?.title}
            </h1>
            <p className="text-[8px] font-black uppercase tracking-widest text-primary animate-pulse flex items-center gap-2">
              <span className="size-1 rounded-full bg-primary" /> Session Active: Red Griffin Terminal 01
            </p>
          </div>
          <div className="hidden xl:flex items-center gap-6 ml-8 px-6 py-2 bg-white/[0.05] border border-white/5 rounded-2xl">
            <div className="space-y-0.5">
              <span className="text-[7px] font-black uppercase tracking-widest text-white/20 block">Neural Latency</span>
              <span className="text-[10px] font-mono text-primary">24ms</span>
            </div>
            <div className="h-4 w-px bg-white/5" />
            <div className="space-y-0.5">
              <span className="text-[7px] font-black uppercase tracking-widest text-white/20 block">Node Sync</span>
              <span className="text-[10px] font-mono text-white/60 uppercase">Nominal</span>
            </div>
            <div className="h-4 w-px bg-white/5" />
            <div className="space-y-0.5">
              <span className="text-[7px] font-black uppercase tracking-widest text-white/20 block">Active Peers</span>
              <span className="text-[10px] font-mono text-white/60">12</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Sync Progress</span>
            <div className="flex items-center gap-3">
              <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${enrollment?.progress || 0}%` }} className="h-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
              </div>
              <span className="text-[10px] font-black text-white">{enrollment?.progress || 0}%</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 bg-white/5 rounded-[1rem] text-white hover:bg-white/10 transition-all border border-white/10">
            <Menu size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Playback Core Area */}
        <div className="flex-1 bg-black flex flex-col overflow-hidden relative" ref={containerRef}>
          <div className="flex-1 relative group bg-zinc-950 flex items-center justify-center">
            {currentLesson?.type === 'video' ? (
              <>
                <video 
                  ref={videoRef}
                  className="max-h-full max-w-full aspect-video"
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => handleLessonComplete(currentLesson.id, true)}
                />
                
                {/* Custom Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-8 pointer-events-none">
                  <div className="flex items-center justify-between pointer-events-auto">
                    <span className="px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-[9px] font-black uppercase text-white tracking-widest backdrop-blur-md">
                      {currentLesson.title}
                    </span>
                    <div className="flex items-center gap-3">
                      <select 
                        value={playbackSpeed}
                        onChange={(e) => {
                          const speed = parseFloat(e.target.value);
                          setPlaybackSpeed(speed);
                          if (videoRef.current) videoRef.current.playbackRate = speed;
                        }}
                        className="bg-black/80 text-[9px] font-black uppercase border border-white/10 rounded-lg px-2 py-1 outline-none appearance-none cursor-pointer hover:bg-white/10 text-white"
                      >
                        {PLAYBACK_SPEEDS.map(s => <option key={s} value={s}>{s}x</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-8">
                      <button onClick={togglePlay} className="text-white hover:text-primary transition-all scale-100 active:scale-95">
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                      </button>
                      <div className="flex items-center gap-4">
                        <SkipBack size={20} className="text-white/40 hover:text-white cursor-pointer active:scale-90 transition-all" onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} />
                        <SkipForward size={20} className="text-white/40 hover:text-white cursor-pointer active:scale-90 transition-all" onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Settings size={20} className="text-white/40 hover:text-white cursor-pointer hover:rotate-45 transition-all" />
                      <Maximize size={20} className="text-white/40 hover:text-white cursor-pointer hover:scale-110 transition-all" onClick={toggleFullscreen} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 max-w-4xl w-full h-full overflow-y-auto no-scrollbar">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                  <div className="flex items-center gap-6">
                    <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <BookOpen size={40} />
                    </div>
                    <div>
                      <h2 className="text-5xl font-black uppercase tracking-tighter text-white">{currentLesson?.title}</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-black uppercase text-white/40 border border-white/10 tracking-widest">Theoretical Module</span>
                        <div className="size-1 rounded-full bg-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none text-white/50 leading-[2] text-lg font-medium selection:bg-primary selection:text-bg-dark" dangerouslySetInnerHTML={{ __html: currentLesson?.content || '' }} />
                  <button 
                    onClick={() => handleLessonComplete(currentLesson!.id, true)}
                    className="group relative px-10 py-5 bg-white text-bg-dark rounded-2xl font-black uppercase tracking-widest text-[10px] overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <span className="relative z-10 transition-all group-hover:tracking-[0.2em]">
                      {(() => {
                        const completedList = Array.isArray(enrollment?.completedLessons) ? enrollment.completedLessons : (typeof enrollment?.completedLessons === 'string' ? JSON.parse(enrollment.completedLessons) : []);
                        return completedList.includes(currentLesson?.id) ? 'Recap Completed' : 'Finalize Module';
                      })()}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 group-hover:h-full transition-all duration-300" />
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Persistent Control Dock */}
          <div className="h-48 border-t border-white/5 bg-black/40 flex flex-col shrink-0 overflow-hidden backdrop-blur-xl">
            <div className="flex border-b border-white/5 px-8">
              {[
                { id: 'overview', label: 'Synopsis', icon: Layout },
                { id: 'notes', label: 'Vault Notes', icon: FileText },
                { id: 'qa', label: 'Ecosystem Q&A', icon: MessageSquare },
                { id: 'resources', label: 'Assets', icon: BookOpen },
                { id: 'critique', label: 'Visual Review', icon: MonitorPlay },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-5 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-b-2 relative ${
                    activeTab === tab.id 
                    ? 'border-primary text-white bg-white/5' 
                    : 'border-transparent text-white/30 hover:text-white'
                  }`}
                >
                  <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : 'opacity-40'} />
                  {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="tab-glow" className="absolute inset-0 bg-primary/5 -z-10" />}
                </button>
              ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10">
              <div className="max-w-4xl">
                {activeTab === 'overview' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white">Objective Analysis</span>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed font-medium">
                      Industrial node: {currentLesson?.title}. Focused on performance parity and architectural integrity.
                    </p>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <textarea 
                      placeholder="Capture high-stakes insights. Auto-sync enabled."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 text-sm text-white focus:border-primary/50 transition-all outline-none min-h-[120px] resize-none font-medium placeholder:text-white/10"
                    />
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 p-8 border border-white/5 rounded-3xl bg-white/[0.01]">
                    <div className="text-center space-y-2">
                       <MessageSquare size={24} className="mx-auto text-primary opacity-40" />
                       <div className="text-[10px] font-black uppercase tracking-widest text-white/40">No active discussions for this node.</div>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer">
                       <div className="flex items-center gap-3">
                         <BookOpen size={16} className="text-primary" />
                         <span className="text-[10px] font-black uppercase text-white/60">Source_Files.zip</span>
                       </div>
                       <Zap size={14} className="text-white/20 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                )}

                {activeTab === 'critique' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <MonitorPlay size={16} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-tighter text-white">Visual Feedback Engine</span>
                        </div>
                        <p className="text-xs text-white/40">Submit your work for frame-accurate, (x, y) spatial critique.</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/review/${lang}/${course?.id}/${currentLesson?.id}`)}
                        className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,54,54,0.3)]"
                      >
                        Enter Review Terminal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div 
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-4 group cursor-pointer border-dashed border-white/10"
                      >
                        <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:shadow-[0_0_30px_rgba(255,54,54,0.3)] transition-all">
                          <Plus size={32} />
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Upload Interaction</span>
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1">v02_production_sequence</p>
                        </div>
                      </motion.div>
                      
                      <div className="p-2 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 group relative overflow-hidden">
                         <div className="aspect-video bg-white/5 rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                            <img src="https://images.unsplash.com/photo-1620121692029-d088224efc74?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <div className="px-6 py-4 flex items-center justify-between">
                            <div className="space-y-1">
                               <span className="text-[10px] font-black uppercase tracking-tight text-white">v01_initial_lighting</span>
                               <span className="text-[8px] font-black uppercase tracking-widest text-primary block">3 Annotations Node</span>
                            </div>
                            <button className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
                               <MonitorPlay size={14} />
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Curated Curriculum */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/5 bg-[#0a0a0a] flex flex-col shrink-0 relative z-30"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-white">Curriculum Map</h2>
                  <p className="text-[8px] font-black uppercase text-white/20 mt-1 tracking-widest">{modules.length} Modules Assigned</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-primary text-[9px] font-black uppercase tracking-widest">Mastery</div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar py-6">
                <div className="space-y-4 px-4">
                  {modules.length === 0 ? (
                    <div className="p-8 text-center space-y-4 border border-white/5 bg-white/[0.01] rounded-[2rem] border-dashed">
                      <Zap size={24} className="mx-auto text-primary/40 animate-pulse" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Neural Sync Required</span>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Run SYNC_CORE.bat to align core</p>
                      </div>
                    </div>
                  ) : modules.map((module, mIdx) => (
                    <div key={module.id} className="space-y-2">
                      <button 
                        onClick={() => setExpandedModules(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                        className="w-full flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <span className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:text-primary transition-colors">{mIdx + 1}</span>
                          <span className="text-[10px] font-black uppercase tracking-tight text-white/60 group-hover:text-white transition-colors text-left">{module.title}</span>
                        </div>
                        <ChevronDown size={14} className={`text-white/20 transition-transform duration-300 ${expandedModules[module.id] ? 'rotate-180 text-primary' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {expandedModules[module.id] && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-1 pl-4"
                          >
                            {module.lessons.map((lesson) => {
                              const completedList = Array.isArray(enrollment?.completedLessons) ? enrollment.completedLessons : (typeof enrollment?.completedLessons === 'string' ? JSON.parse(enrollment.completedLessons) : []);
                              const isCompleted = completedList.includes(lesson.id);
                              const isActive = currentLesson?.id === lesson.id;
                              
                              return (
                                <div 
                                  key={lesson.id}
                                  onClick={() => setCurrentLesson(lesson)}
                                  className={`px-5 py-3.5 flex items-center gap-4 cursor-pointer transition-all rounded-xl relative overflow-hidden group/lesson ${isActive ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                                >
                                  {isActive && <motion.div layoutId="active-lesson-glow" className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(255,255,255,0.5)]" />}
                                  
                                  <div className={`shrink-0 transition-all ${isCompleted ? 'text-primary' : 'text-white/10 group-hover/lesson:text-white/30'}`}>
                                    {isCompleted ? <MonitorCheck size={18} /> : <Circle size={18} />}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`text-[10px] font-black uppercase tracking-tight truncate ${isActive ? 'text-white' : 'text-white/40 group-hover/lesson:text-white/60'}`}>
                                      {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1.5 opacity-60">
                                      <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[7px] font-black uppercase tracking-widest text-white/40">{lesson.type}</span>
                                      <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">{lesson.duration}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
