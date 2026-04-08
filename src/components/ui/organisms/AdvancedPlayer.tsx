import React, { useEffect, useRef, useState, useMemo } from 'react';
import Hls from 'hls.js';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Settings, Maximize, Activity, Zap, MonitorPlay,
  Type, MessageSquarePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../atoms/Button';

interface AdvancedPlayerProps {
  url: string;
  title: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  onAddNote?: (timestamp: number) => void;
  initialPosition?: number;
  autoplay?: boolean;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const AdvancedPlayer: React.FC<AdvancedPlayerProps> = ({
  url,
  title,
  onProgress,
  onComplete,
  onAddNote,
  initialPosition = 0,
  autoplay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState<string>('auto');
  const [availableQualities, setAvailableQualities] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [buffer, setBuffer] = useState(0);

  // 1. Initialize Player
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (hlsRef.current) hlsRef.current.destroy();

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setAvailableQualities(hls.levels);
        video.currentTime = initialPosition;
        if (autoplay) video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        if (hls.autoLevelEnabled) setQuality('auto');
        else setQuality(data.level.toString());
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.currentTime = initialPosition;
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [url]);

  // 2. Event Listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      onProgress?.(video.currentTime, video.duration);
      
      // Calculate buffer
      if (video.buffered.length > 0) {
        setBuffer((video.buffered.end(0) / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  // 3. Formatting
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  return (
    <div ref={containerRef} className="relative group bg-black rounded-[2.5rem] overflow-hidden aspect-video shadow-[0_0_100px_rgba(0,0,0,0.8)]">
      
      {/* 📺 VIDEO ELEMENT */}
      <video 
        ref={videoRef}
        className="w-full h-full cursor-pointer"
        onClick={togglePlay}
      />

      {/* 🤖 HUD OVERLAYS */}
      <div className="absolute top-12 left-12 z-20 pointer-events-none space-y-4 opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3 px-4 py-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-3xl">
          <div className="size-1.5 rounded-full bg-primary animate-ping" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white italic">{title}</span>
        </div>
      </div>

      <div className="absolute top-12 right-12 z-20 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="px-5 py-3 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-3xl flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Status</span>
            <Activity size={14} className="text-primary mt-1" />
          </div>
          <div className="h-6 w-px bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Quality</span>
            <span className="text-[10px] font-mono text-white/60 uppercase">{quality === 'auto' ? 'Auto_Sync' : quality + 'P'}</span>
          </div>
        </div>
      </div>

      {/* 🎮 CINEMATIC CONTROLS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8 lg:p-12">
        <div className="space-y-8">
          
          {/* Progress Bar Matrix */}
          <div className="relative group/progress cursor-pointer h-1.5 hover:h-3 transition-all duration-300">
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute inset-0 bg-white/5 rounded-full" />
            <div className="absolute inset-y-0 left-0 bg-white/10 rounded-full transition-all" style={{ width: `${buffer}%` }} />
            <motion.div 
              className="absolute inset-y-0 left-0 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)]" 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={togglePlay}
                className="size-16 bg-white text-bg-dark rounded-2xl flex items-center justify-center shadow-2xl hover:bg-primary transition-colors"
              >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
              </motion.button>
              
              <div className="flex items-center gap-6">
                <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} className="text-white/40 hover:text-white transition-all"><SkipBack size={20} /></button>
                <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} className="text-white/40 hover:text-white transition-all"><SkipForward size={20} /></button>
              </div>

              <div className="h-8 w-px bg-white/10" />
              
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white tracking-widest tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">Matrix_Buffer: Stable</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <button 
                onClick={() => onAddNote?.(currentTime)}
                className="size-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/20 transition-all group"
                title="Add Node Note"
              >
                <MessageSquarePlus size={18} className="group-hover:scale-110" />
              </button>

              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-6">
                <div className="relative">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`size-12 rounded-xl flex items-center justify-center transition-all ${showSettings ? 'bg-primary text-bg-dark' : 'text-white/40 hover:text-white'}`}
                  >
                    <Settings size={20} className={showSettings ? 'animate-spin-slow' : ''} />
                  </button>

                  <AnimatePresence>
                    {showSettings && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-16 right-0 w-48 bg-[#0a0a0a]/95 border border-white/10 rounded-2xl p-4 backdrop-blur-2xl shadow-2xl z-50 space-y-6"
                      >
                        <div className="space-y-3">
                          <span className="text-[8px] font-black uppercase text-white/20 tracking-widest block">Speed_Matrix</span>
                          <div className="grid grid-cols-3 gap-2">
                            {PLAYBACK_SPEEDS.map(s => (
                              <button 
                                key={s}
                                onClick={() => {
                                  setPlaybackSpeed(s);
                                  if (videoRef.current) videoRef.current.playbackRate = s;
                                }}
                                className={`text-[9px] font-black p-2 rounded-lg border transition-all ${playbackSpeed === s ? 'bg-primary border-primary text-bg-dark' : 'border-white/5 text-white/40 hover:border-white/20'}`}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="space-y-3">
                          <span className="text-[8px] font-black uppercase text-white/20 tracking-widest block">Neural_Bitrate</span>
                          <div className="space-y-1">
                            <button 
                              onClick={() => {
                                if (hlsRef.current) hlsRef.current.currentLevel = -1;
                                setQuality('auto');
                              }}
                              className={`w-full text-left text-[9px] font-black p-2 rounded-lg transition-all ${quality === 'auto' ? 'text-primary bg-primary/10' : 'text-white/40 hover:text-white'}`}
                            >
                              AUTO_SYNC
                            </button>
                            {availableQualities.map((level, i) => (
                              <button 
                                key={i}
                                onClick={() => {
                                  if (hlsRef.current) hlsRef.current.currentLevel = i;
                                  setQuality(level.height.toString());
                                }}
                                className={`w-full text-left text-[9px] font-black p-2 rounded-lg transition-all ${quality === level.height.toString() ? 'text-primary bg-primary/10' : 'text-white/40 hover:text-white'}`}
                              >
                                {level.height}P_DYN
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button 
                  onClick={() => {
                    if (containerRef.current?.requestFullscreen) {
                      if (!document.fullscreenElement) containerRef.current.requestFullscreen();
                      else document.exitFullscreen();
                    }
                  }}
                  className="size-12 rounded-xl text-white/40 hover:text-white transition-all flex items-center justify-center"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPlayer;
