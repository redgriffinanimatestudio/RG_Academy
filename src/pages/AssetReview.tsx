import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  X, 
  Plus, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Maximize, 
  ChevronRight, 
  Layers, 
  Eye, 
  Edit3,
  Send,
  Trash2,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewService, Annotation, ReviewSession } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';

export default function AssetReview() {
  const { lang, projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { profile: user } = useAuth();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mode, setMode] = useState<'view' | 'annotate'>('annotate');
  const [activePin, setActivePin] = useState<{ x: number, y: number } | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // 1. Initialize Review Session
  useEffect(() => {
    loadSession();
  }, [projectId, taskId]);

  const loadSession = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      // For demo/dev purposes, we'll use a placeholder URL if not provided
      const res = await reviewService.getOrCreateSession({
        projectId,
        taskId,
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', // Replace with real asset URL
        mediaType: 'image'
      });
      setSession(res);
      setAnnotations(res.annotations);
    } catch (err) {
      console.error("Failed to load review session:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Asset Interaction (Placing Pins)
  const handleAssetClick = (e: React.MouseEvent) => {
    if (mode !== 'annotate' || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setActivePin({ x, y });
    setSelectedAnnotationId(null);
  };

  // 3. Submit Annotation
  const submitAnnotation = async () => {
    if (!activePin || !commentText.trim() || !session) return;
    
    try {
      const timestamp = session.mediaType === 'video' ? videoRef.current?.currentTime : undefined;
      const res = await reviewService.addAnnotation({
        sessionId: session.id,
        type: 'point',
        data: { x: activePin.x, y: activePin.y, text: commentText },
        timestamp
      });
      
      setAnnotations([...annotations, res]);
      setActivePin(null);
      setCommentText('');
    } catch (err) {
      console.error("Failed to save annotation:", err);
    }
  };

  // 4. Seek to Annotation (Video)
  const handleAnnotationSelect = (ann: Annotation) => {
    setSelectedAnnotationId(ann.id);
    const data = JSON.parse(ann.data);
    if (ann.timestamp !== undefined && videoRef.current) {
      videoRef.current.currentTime = ann.timestamp;
    }
  };

  if (loading) return <Preloader message="Initializing Industrial Review Node..." size="lg" className="h-screen bg-bg-dark" />;

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden select-none">
      {/* Top Protocol Header */}
      <header className="h-16 border-b border-white/5 bg-black/40 flex items-center justify-between px-6 shrink-0 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-4">
          <Link to={`/${lang}/dashboard`} className="p-2 text-white/40 hover:text-white transition-all">
            <X size={20} />
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
               {session?.mediaType === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
             </div>
             <div>
               <h1 className="text-xs font-black uppercase tracking-tight text-white">Review Terminal: {projectId}</h1>
               <div className="flex items-center gap-2 text-[8px] font-black uppercase text-white/20 tracking-widest">
                 <Clock size={10} className="text-primary" /> Session Active · {annotations.length} Nodes Synchronized
               </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex gap-1">
             <button 
               onClick={() => setMode('view')}
               className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'view' ? 'bg-white text-bg-dark' : 'text-white/40 hover:text-white'}`}
             >
               <Eye size={12} /> View
             </button>
             <button 
               onClick={() => setMode('annotate')}
               className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'annotate' ? 'bg-white text-bg-dark' : 'text-white/40 hover:text-white'}`}
             >
               <Edit3 size={12} /> Mark Up
             </button>
           </div>
           <button className="p-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-all border border-primary/20 shadow-[0_0_20px_rgba(255,54,54,0.1)]">
             <CheckCircle size={20} />
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Review Stage */}
        <div className="flex-1 bg-black/40 relative flex flex-col items-center justify-center overflow-hidden p-8">
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           
           <div 
             ref={containerRef}
             onClick={handleAssetClick}
             className="relative max-h-full max-w-full shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 rounded-2xl overflow-hidden cursor-crosshair group"
           >
             {session?.mediaType === 'video' ? (
               <video 
                 ref={videoRef}
                 src={session.mediaUrl}
                 className="max-h-full max-w-full"
                 onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                 controls={mode === 'view'}
               />
             ) : (
               <img 
                 src={session?.mediaUrl} 
                 alt="Asset" 
                 className="max-h-full max-w-full object-contain"
               />
             )}

             {/* Annotation Markup Layer */}
             <div className="absolute inset-0 pointer-events-none">
                {annotations.map((ann, idx) => {
                  const data = JSON.parse(ann.data);
                  const isVisible = session?.mediaType !== 'video' || Math.abs((ann.timestamp || 0) - currentTime) < 2;
                  
                  return (
                    <motion.div
                      key={ann.id}
                      initial={{ scale: 0 }} animate={{ scale: isVisible ? 1 : 0.5, opacity: isVisible ? 1 : 0.2 }}
                      style={{ left: `${data.x * 100}%`, top: `${data.y * 100}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 size-8 rounded-full flex items-center justify-center text-[10px] font-black pointer-events-auto cursor-pointer transition-all border-2 ${
                        selectedAnnotationId === ann.id ? 'bg-primary border-white scale-125 z-30' : 'bg-black/60 border-primary text-primary hover:scale-110 z-20'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnnotationSelect(ann);
                      }}
                    >
                      {idx + 1}
                    </motion.div>
                  );
                })}

                {/* Local Temp Pin */}
                {activePin && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ left: `${activePin.x * 100}%`, top: `${activePin.y * 100}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 size-8 bg-white text-bg-dark rounded-full flex items-center justify-center text-[10px] font-black border-2 border-primary z-40 shadow-[0_0_20px_rgba(255,54,54,0.5)]"
                  >
                    <Plus size={14} strokeWidth={4} />
                  </motion.div>
                )}
             </div>
           </div>

           {/* Video Control Overlays */}
           {session?.mediaType === 'video' && mode === 'annotate' && (
             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl flex items-center gap-8 shadow-2xl">
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest italic font-mono">
                    {new Date(currentTime * 1000).toISOString().substr(14, 5)} / {videoRef.current ? new Date(videoRef.current.duration * 1000).toISOString().substr(14, 5) : '00:00'}
                  </span>
               </div>
               <div className="h-6 w-px bg-white/10" />
               <div className="flex items-center gap-2">
                 <div className="size-2 bg-primary rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Timestamp Pinning Active</span>
               </div>
             </div>
           )}
        </div>

        {/* Feedback Sidebar: The Comment Matrix */}
        <aside className="w-[450px] border-l border-white/5 bg-[#0a0a0a] flex flex-col shrink-0">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
             <div className="flex items-center gap-3">
               <MessageSquare size={20} className="text-primary" />
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Feedback Matrix</h2>
             </div>
             <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{annotations.length} Entries</span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar py-6 space-y-4 px-6">
            <AnimatePresence>
              {activePin && (
                 <motion.div 
                   initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }}
                   className="p-6 rounded-[2rem] bg-primary/10 border border-primary/30 shadow-[0_20px_50px_rgba(255,54,54,0.1)] space-y-4"
                 >
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] font-black uppercase tracking-widest text-primary">New Annotation Node</div>
                      <button onClick={() => setActivePin(null)} className="text-white/20 hover:text-white"><X size={14} /></button>
                    </div>
                    <textarea 
                      autoFocus
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Input industrial feedback logic..."
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-white focus:border-primary transition-all outline-none min-h-[100px] resize-none"
                    />
                    <button 
                      onClick={submitAnnotation}
                      className="w-full py-4 bg-primary text-bg-dark rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      Commit Observation <Send size={14} />
                    </button>
                 </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {annotations.slice().reverse().map((ann, idx) => {
                const data = JSON.parse(ann.data);
                const isSelected = selectedAnnotationId === ann.id;
                
                return (
                  <motion.div 
                    key={ann.id}
                    layout
                    onClick={() => handleAnnotationSelect(ann)}
                    className={`p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer group ${
                      isSelected ? 'bg-white text-bg-dark border-white scale-102 shadow-2xl' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                       <div className={`size-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                         isSelected ? 'bg-bg-dark text-white' : 'bg-white/5 text-primary'
                       }`}>
                         {annotations.length - idx}
                       </div>
                       <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-bg-dark/40' : 'text-white/20'}`}>
                               {ann.author.displayName}
                            </span>
                            {ann.timestamp !== undefined && (
                              <div className={`flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${isSelected ? 'bg-bg-dark/10 text-bg-dark' : 'bg-white/5 text-white/40'}`}>
                                <Clock size={10} /> {new Date(ann.timestamp * 1000).toISOString().substr(14, 5)}
                              </div>
                            )}
                          </div>
                          <p className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-bg-dark' : 'text-white/60'}`}>
                            {data.text}
                          </p>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
