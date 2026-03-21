import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_COURSE = {
  id: '1',
  title: 'Mastering Character Rigging in Maya',
  sections: [
    {
      title: 'Section 1: Introduction',
      lessons: [
        { id: '1-1', title: 'Welcome to the Course', duration: '05:20', completed: true, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
        { id: '1-2', title: 'Maya Interface for Riggers', duration: '12:45', completed: true, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
        { id: '1-3', title: 'Naming Conventions', duration: '08:15', completed: false, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
      ]
    },
    {
      title: 'Section 2: Joints & Hierarchies',
      lessons: [
        { id: '2-1', title: 'Joint Tool Basics', duration: '15:30', completed: false, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
        { id: '2-2', title: 'Local Rotation Axes', duration: '22:10', completed: false, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
      ]
    }
  ]
};

export default function Learn() {
  const { slug, lang } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentLesson, setCurrentLesson] = useState(MOCK_COURSE.sections[0].lessons[2]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (videoRef.current && currentLesson.videoUrl) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentLesson.videoUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentLesson.videoUrl;
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

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-white/5 bg-black/40 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/aca/${lang}`} className="p-2 text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <h1 className="text-sm font-black uppercase tracking-tight text-white truncate max-w-md">
            {MOCK_COURSE.title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Your Progress</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[40%] h-full bg-primary" />
              </div>
              <span className="text-[10px] font-bold text-white">40%</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all">
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Player Section */}
        <div className="flex-1 bg-black flex flex-col">
          <div className="flex-1 relative group">
            <video 
              ref={videoRef}
              className="w-full h-full"
              onClick={togglePlay}
            />
            {/* Custom Controls Overlay (simplified) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">{currentLesson.title}</h2>
              </div>
              
              <div className="space-y-4">
                {/* Progress bar placeholder */}
                <div className="h-1 w-full bg-white/20 rounded-full cursor-pointer overflow-hidden">
                  <div className="w-1/3 h-full bg-primary" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>
                    <SkipBack size={20} className="text-white/40" />
                    <SkipForward size={20} className="text-white/40" />
                    <div className="flex items-center gap-2">
                      <Volume2 size={20} className="text-white" />
                      <div className="w-20 h-1 bg-white/20 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Settings size={20} className="text-white" />
                    <Maximize size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content Tabs */}
          <div className="h-48 border-t border-white/5 bg-black/40 p-8 shrink-0 overflow-y-auto no-scrollbar">
            <div className="max-w-4xl mx-auto flex gap-12">
              <div className="space-y-4 flex-1">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Lesson Overview</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  In this lesson, we cover the essential Maya tools for rigger, including joint placement, hierarchy management, and local rotation axes.
                </p>
              </div>
              <div className="w-64 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/20">Resources</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 cursor-pointer transition-all">
                    <FileText size={14} className="text-primary" /> Maya Scene Files.zip
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 cursor-pointer transition-all">
                    <MessageSquare size={14} className="text-primary" /> Lesson Q&A
                  </div>
                </div>
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
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-black uppercase tracking-tighter text-white">Course Content</h2>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {MOCK_COURSE.sections.map((section, sIdx) => (
                  <div key={sIdx} className="border-b border-white/5">
                    <div className="px-6 py-4 bg-black/20 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      {section.title}
                    </div>
                    <div className="py-2">
                      {section.lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-white/5 ${currentLesson.id === lesson.id ? 'bg-primary/10 border-r-2 border-primary' : ''}`}
                        >
                          <div className={`shrink-0 ${lesson.completed ? 'text-emerald-500' : 'text-white/10'}`}>
                            {lesson.completed ? <CheckCircle size={18} fill="currentColor" className="text-bg-dark" /> : <Circle size={18} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold truncate ${currentLesson.id === lesson.id ? 'text-primary' : 'text-white/60'}`}>
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Play size={10} className="text-white/20" />
                              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{lesson.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
