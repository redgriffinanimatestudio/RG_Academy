import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Pen, MousePointer2, MapPin, MessageSquare, 
  Trash2, Save, Layers, Download, CheckCircle,
  Maximize2, Share2, ZoomIn, Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../../services/apiClient';

interface Annotation {
  id?: string;
  type: 'point' | 'rect' | 'draw';
  data: string; // JSON {x, y, color, content}
  author?: { displayName: string };
  createdAt?: string;
}

interface ReviewRoomProps {
  sessionId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  onClose: () => void;
}

const ReviewRoom: React.FC<ReviewRoomProps> = ({ sessionId, mediaUrl, mediaType, onClose }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [tool, setTool] = useState<'select' | 'pen' | 'pin' | 'rect'>('pen');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);

  // Fetch Session Data
  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/v1/review/sessions/${sessionId}`);
      setAnnotations(res.data.data.annotations || []);
    } catch (e) {
      console.error("Failed to fetch session:", e);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Canvas Drawing Logic
  const startDrawing = (e: React.MouseEvent) => {
    if (tool !== 'pen') return;
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setCurrentPath([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || tool !== 'pen') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      setCurrentPath(prev => [...prev, newPos]);
      
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#ff3636';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        const last = currentPath[currentPath.length - 1];
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(newPos.x, newPos.y);
        ctx.stroke();
      }
    }
  };

  const endDrawing = async () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath.length > 1) {
      await saveAnnotation('draw', { path: currentPath, color: '#ff3636' });
    }
    setCurrentPath([]);
  };

  const saveAnnotation = async (type: string, data: any) => {
    try {
      const res = await apiClient.post(`/v1/review/sessions/${sessionId}/annotations`, {
        type,
        data
      });
      setAnnotations(prev => [...prev, res.data.data]);
    } catch (e) {
      console.error("Failed to save annotation:", e);
    }
  };

  const handleCanvasClick = async (e: React.MouseEvent) => {
    if (tool !== 'pin') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const text = prompt("Enter annotation note:");
      if (text) {
        await saveAnnotation('point', { x, y, text });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#050505] overflow-hidden">
      {/* Sidebar - Annotation History */}
      <div className="w-80 border-r border-white/5 bg-[#0a0a0a] flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers size={18} className="text-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Review Feedback</h3>
          </div>
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded border border-primary/20">LIVE</span>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
          <AnimatePresence>
            {annotations.map((ann, idx) => (
              <motion.div 
                key={ann.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeAnnotation === ann.id ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
                onClick={() => setActiveAnnotation(ann.id || null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black text-white italic">
                      {ann.author?.displayName?.[0] || 'U'}
                    </div>
                    <span className="text-[9px] font-black uppercase text-white/60">{ann.author?.displayName || 'Anonymous'}</span>
                  </div>
                  <span className="text-[8px] font-bold text-white/20">{new Date(ann.createdAt || '').toLocaleTimeString()}</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed italic">
                  {ann.type === 'draw' ? 'Sketch correction' : JSON.parse(ann.data).text || 'Point interest'}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/40">
           <button onClick={fetchSession} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center gap-2">
             <Save size={14} /> Synced at {new Date().toLocaleTimeString()}
           </button>
        </div>
      </div>

      {/* Main Review Area */}
      <div className="flex-1 flex flex-col relative" ref={containerRef}>
        {/* Toolbar */}
        <div className="h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5">
             {[
               { id: 'select', i: MousePointer2, l: 'Select' },
               { id: 'pen', i: Pen, l: 'Annotate' },
               { id: 'pin', i: MapPin, l: 'Mark Point' },
               { id: 'rect', i: Maximize2, l: 'Select Area' }
             ].map(t_item => (
               <button 
                 key={t_item.id}
                 onClick={() => setTool(t_item.id as any)}
                 className={`size-12 rounded-xl flex items-center justify-center transition-all ${tool === t_item.id ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20 scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                 title={t_item.l}
               >
                 <t_item.i size={20} />
               </button>
             ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
               <ZoomIn size={14} /> 100% Zoom
            </div>
            <div className="h-8 w-px bg-white/5 mx-2" />
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-bg-dark text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
              <CheckCircle size={16} /> Approve Frame
            </button>
            <button onClick={onClose} className="size-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)] p-20 cursor-crosshair">
          <div className="relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 rounded-xl overflow-hidden group">
             {mediaType === 'image' ? (
               <img src={mediaUrl} alt="Review Asset" className="max-w-full max-h-[80vh] select-none" draggable={false} />
             ) : (
               <video src={mediaUrl} className="max-w-full max-h-[80vh]" controls />
             )}
             
             {/* Interaction Canvas */}
             <canvas 
               ref={canvasRef}
               width={1200}
               height={800}
               onMouseDown={startDrawing}
               onMouseMove={draw}
               onMouseUp={endDrawing}
               onClick={handleCanvasClick}
               className="absolute inset-0 z-10 w-full h-full"
             />

             {/* Annotation Overlay (Pins) */}
             <div className="absolute inset-0 pointer-events-none z-20">
               {annotations.filter(a => a.type === 'point').map((ann, i) => {
                 const { x, y, text } = JSON.parse(ann.data);
                 return (
                   <motion.div 
                     key={i}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     style={{ left: `${x}%`, top: `${y}%` }}
                     className="absolute pointer-events-auto group/pin"
                   >
                     <div className="size-8 -translate-x-1/2 -translate-y-1/2 bg-primary flex items-center justify-center rounded-full border-4 border-black shadow-xl cursor-help">
                       <MapPin size={14} className="text-bg-dark" />
                       <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 p-4 bg-zinc-900 border border-white/10 rounded-2xl opacity-0 group-hover/pin:opacity-100 transition-opacity shadow-2xl z-30 pointer-events-none">
                         <div className="text-[8px] font-black uppercase text-primary mb-1">Observation #{i+1}</div>
                         <p className="text-[10px] text-white font-bold leading-tight italic">{text}</p>
                       </div>
                     </div>
                   </motion.div>
                 );
               })}
             </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-10 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between px-8">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/20">
               <Info size={12} /> Mode: Collaborative Visual Feedback (CVI)
             </div>
             <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-emerald-500">
               <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Asset Synchronized
             </div>
           </div>
           <div className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">
             Grid Protocol V6.0 Studio Module
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewRoom;
