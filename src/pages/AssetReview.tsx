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
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewService, Annotation, ReviewSession } from '../services/reviewService';
import { studioService } from '../services/studioService';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';

export default function AssetReview() {
  const { lang, projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { profile: user, activeRole } = useAuth();
  
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

  const canApprove = useMemo(() => {
    return ['client', 'manager', 'chief_manager', 'admin'].includes(activeRole || '');
  }, [activeRole]);

  // 1. Initialize Review Session
  useEffect(() => {
    loadSession();
  }, [projectId, taskId]);

  const loadSession = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      let mediaUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80';
      let mediaType: 'image' | 'video' = 'image';

      // Industrial Sync: Fetch actual task details if ID is provided
      if (taskId) {
        const task = await studioService.getTaskDetails(taskId);
        if (task?.submissionUrl) {
          mediaUrl = task.submissionUrl;
          mediaType = task.submissionType || 'video';
        }
      }

      const res = await reviewService.getOrCreateSession({
        projectId,
        taskId,
        mediaUrl,
        mediaType
      });
      
      setSession(res);
      setAnnotations(res.annotations);
    } catch (err) {
      console.error("[Review Node] Session initialization failure:", err);
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
      console.error("[Review Node] Annotation commit failure:", err);
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

  const handleCompleteReview = async () => {
     if (!session || !canApprove) return;
     if (!window.confirm("Authorize final asset approval and close review node?")) return;
     
     try {
       await reviewService.closeSession(session.id);
       navigate(`/${lang}/dashboard`);
     } catch (err) {
       console.error("[Review Node] Finalization failure:", err);
     }
  };

  if (loading) return <Preloader message="Synchronizing Industrial Review Node..." size="lg" className="h-screen bg-bg-dark" />;

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden select-none">
      {/* Top Protocol Header */}
      <header className="h-20 border-b border-white/5 bg-black/40 flex items-center justify-between px-8 shrink-0 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-6">
          <Link to={`/${lang}/dashboard`} className="p-2.5 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all border border-white/5">
            <X size={20} />
          </Link>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex items-center gap-4">
             <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
               {session?.mediaType === 'video' ? <Video size={20} /> : <ImageIcon size={20} />}
             </div>
             <div>
               <h1 className="text-sm font-black uppercase tracking-tight text-white italic">Review Terminal: <span className="text-primary">{projectId?.slice(-8).toUpperCase()}</span></h1>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mt-1">
                 <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Session Synchronized • {annotations.length} Nodes Active
               </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex gap-1">
             <button 
               onClick={() => setMode('view')}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'view' ? 'bg-white text-bg-dark shadow-xl' : 'text-white/40 hover:text-white'}`}
             >
               <Eye size={14} /> View mode
             </button>
             <button 
               onClick={() => setMode('annotate')}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'annotate' ? 'bg-white text-bg-dark shadow-xl' : 'text-white/40 hover:text-white'}`}
             >
               <Edit3 size={14} /> Mark Up
             </button>
           </div>
           
           {canApprove && (
             <button 
               onClick={handleCompleteReview}
               className="flex items-center gap-3 px-8 py-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-bg-dark transition-all border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] text-[10px] font-black uppercase tracking-widest active:scale-95"
             >
               <CheckCircle size={18} /> Finalize & Approve
             </button>
           )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Review Stage */}
        <div className="flex-1 bg-black/60 relative flex flex-col items-center justify-center overflow-hidden p-12">
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           
           <div 
             ref={containerRef}
             onClick={handleAssetClick}
             className="relative max-h-full max-w-full shadow-[0_50px_150px_rgba(0,0,0,0.8)] border border-white/5 rounded-3xl overflow-hidden cursor-crosshair group bg-black"
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
                      initial={{ scale: 0 }} 
                      animate={{ scale: isVisible ? 1 : 0.4, opacity: isVisible ? 1 : 0.15 }}
                      style={{ left: `${data.x * 100}%`, top: `${data.y * 100}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 size-10 rounded-full flex items-center justify-center text-[11px] font-black pointer-events-auto cursor-pointer transition-all border-2 shadow-2xl ${
                        selectedAnnotationId === ann.id 
                          ? 'bg-primary border-white scale-125 z-30 shadow-[0_0_30px_#ff3636]' 
                          : 'bg-black/80 border-primary text-primary hover:scale-110 z-20'
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
                    className="absolute -translate-x-1/2 -translate-y-1/2 size-10 bg-white text-bg-dark rounded-full flex items-center justify-center text-[12px] font-black border-2 border-primary z-40 shadow-[0_0_40px_rgba(255,54,54,0.6)]"
                  >
                    <Plus size={18} strokeWidth={4} />
                  </motion.div>
                )}
             </div>
           </div>

           {/* Video Control Overlays */}
           {session?.mediaType === 'video' && mode === 'annotate' && (
             <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-10 py-5 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center gap-10 shadow-2xl">
               <div className="flex items-center gap-6">
                  <span className="text-xs font-black text-primary uppercase tracking-[0.3em] font-mono italic">
                    {new Date(currentTime * 1000).toISOString().substr(14, 5)} <span className="text-white/20 mx-2">/</span> {videoRef.current ? new Date(videoRef.current.duration * 1000).toISOString().substr(14, 5) : '00:00'}
                  </span>
               </div>
               <div className="h-8 w-px bg-white/10" />
               <div className="flex items-center gap-3 text-emerald-500">
                 <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                 <span className="text-[10px] font-black uppercase tracking-widest italic font-mono">Timestamp Locking Active</span>
               </div>
             </div>
           )}
        </div>

        {/* Feedback Sidebar: The Comment Matrix */}
        <aside className="w-[500px] border-l border-white/5 bg-[#0a0a0a] flex flex-col shrink-0 relative">
          <div className="absolute inset-0 bg-primary/2 pointer-events-none" />
          
          <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/40 relative z-10">
             <div className="flex items-center gap-4">
               <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                 <MessageSquare size={20} className="text-primary" />
               </div>
               <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">Feedback Matrix</h2>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Audit Protocol V4.2</p>
               </div>
             </div>
             <span className="text-[10px] font-black text-white/20 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg">{annotations.length} Nodes</span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar py-8 space-y-6 px-8 relative z-10">
            <AnimatePresence>
              {activePin && (
                 <motion.div 
                   initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }}
                   className="p-8 rounded-[2.5rem] bg-primary/[0.03] border border-primary/20 shadow-[0_20px_60px_rgba(255,54,54,0.1)] space-y-6"
                 >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="size-2 rounded-full bg-primary animate-pulse" />
                         <div className="text-[10px] font-black uppercase tracking-widest text-primary italic">New Annotation Node</div>
                      </div>
                      <button onClick={() => setActivePin(null)} className="text-white/20 hover:text-white transition-colors"><X size={16} /></button>
                    </div>
                    <textarea 
                      autoFocus
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Input industrial feedback logic..."
                      className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] p-6 text-sm text-white focus:border-primary transition-all outline-none min-h-[120px] resize-none font-medium leading-relaxed"
                    />
                    <button 
                      onClick={submitAnnotation}
                      className="w-full py-5 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 shadow-xl shadow-primary/20"
                    >
                      Commit Observation <Send size={16} />
                    </button>
                 </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              {annotations.length > 0 ? annotations.slice().reverse().map((ann, idx) => {
                const data = JSON.parse(ann.data);
                const isSelected = selectedAnnotationId === ann.id;
                
                return (
                  <motion.div 
                    key={ann.id}
                    layout
                    onClick={() => handleAnnotationSelect(ann)}
                    className={`p-8 rounded-[2.5rem] border transition-all duration-700 cursor-pointer group relative overflow-hidden ${
                      isSelected 
                        ? 'bg-white text-bg-dark border-white scale-102 shadow-[0_40px_100px_rgba(255,255,255,0.1)]' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-6 relative z-10">
                       <div className={`size-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 transition-all duration-500 ${
                         isSelected ? 'bg-bg-dark text-white' : 'bg-white/5 text-primary'
                       }`}>
                         {annotations.length - idx}
                       </div>
                       <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className={`size-8 rounded-full overflow-hidden border-2 transition-colors ${isSelected ? 'border-bg-dark/10' : 'border-white/10'}`}>
                                  <img src={ann.author.photoURL || `https://ui-avatars.com/api/?name=${ann.author.displayName}&background=random`} className="size-full object-cover" />
                               </div>
                               <span className={`text-[10px] font-black uppercase tracking-widest italic ${isSelected ? 'text-bg-dark/60' : 'text-white/30'}`}>
                                  {ann.author.displayName}
                               </span>
                            </div>
                            {ann.timestamp !== undefined && (
                              <div className={`flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1 rounded-xl transition-all ${isSelected ? 'bg-bg-dark/5 text-bg-dark' : 'bg-white/5 text-white/40'}`}>
                                <Clock size={12} /> {new Date(ann.timestamp * 1000).toISOString().substr(14, 5)}
                              </div>
                            )}
                          </div>
                          <p className={`text-[13px] font-medium leading-relaxed italic ${isSelected ? 'text-bg-dark' : 'text-white/60'}`}>
                            {data.text}
                          </p>
                       </div>
                    </div>
                  </motion.div>
                );
              }) : !activePin && (
                <div className="py-20 text-center space-y-6 opacity-10">
                   <AlertCircle size={64} className="mx-auto" />
                   <p className="text-[12px] font-black uppercase tracking-[0.4em] italic">Feedback Matrix <br/> Awaiting Connection</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-8 bg-black/40 border-t border-white/5 relative z-10">
             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-primary" /> End-to-End Encrypted</span>
                <span>Audit: v1.0.4</span>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
