import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Zap, ArrowRight, Command, Database, Users, Layout } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { academyService, Course } from '../../services/academyService';

interface NeuralSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NeuralSearch({ isOpen, onClose }: NeuralSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const { lang } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // This logic is placeholder for parent to handle
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const allCourses = await academyService.getCourses();
        const filtered = allCourses.filter(c => 
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.lecturerName.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        setResults(filtered);
      } catch (err) {
        console.error("Search sync failure:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleResultClick = (slug: string) => {
    navigate(`/aca/${lang || 'eng'}/course/${slug}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32 px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-3xl bg-[#080808] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden relative"
          >
            {/* Neural Scanline */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px)', backgroundSize: '100% 4px' }} />
            
            <div className="p-8 border-b border-white/5 flex items-center gap-6 relative z-10">
              <Search className={loading ? "text-primary animate-pulse" : "text-white/20"} size={24} />
              <input 
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Initialize_Neural_Search..."
                className="flex-1 bg-transparent border-none outline-none text-xl sm:text-2xl font-black uppercase tracking-tighter text-white placeholder:text-white/5"
              />
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-white/20 uppercase tracking-widest">
                <Command size={12} /> K
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-6 relative z-10">
              {query.length < 2 ? (
                <div className="py-12 text-center space-y-6">
                   <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
                     <Database size={32} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Awaiting_Instructions</p>
                      <h3 className="text-sm font-black text-white/40 uppercase tracking-widest italic">Search nodes, instructors, or matrix modules.</h3>
                   </div>
                   <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                      {['3D Animation', 'VFX', 'Unreal Engine', 'Lighting'].map(tag => (
                        <button key={tag} onClick={() => setQuery(tag)} className="px-5 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-primary hover:border-primary/20 transition-all">
                          {tag}
                        </button>
                      ))}
                   </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                   <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 px-4">{results.length} Nodes Synchronized</p>
                   {results.map((course, idx) => (
                     <motion.div 
                       key={course.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: idx * 0.05 }}
                       onClick={() => handleResultClick(course.slug)}
                       className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.05] transition-all group cursor-pointer flex items-center justify-between"
                     >
                       <div className="flex items-center gap-6">
                          <div className="size-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                             <img src={course.thumbnail} className="w-full h-full object-cover opacity-40 group-hover:opacity-100" />
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">{course.category?.name || 'NODE'}</span>
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">ID: {course.id.slice(0, 8)}</span>
                             </div>
                             <h4 className="text-xl font-black uppercase tracking-tight text-white italic group-hover:text-primary transition-colors">{course.title}</h4>
                             <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">By {course.lecturerName}</p>
                          </div>
                       </div>
                       <ArrowRight size={20} className="text-white/10 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                     </motion.div>
                   ))}
                </div>
              ) : !loading && (
                <div className="py-20 text-center space-y-4">
                   <Zap size={40} className="mx-auto text-primary animate-pulse" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Zero_Parity_Found: Node_Mismatch</p>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-white/20 relative z-10">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2"><Layout size={12} fill="currentColor" /> Select_Node</div>
                  <div className="flex items-center gap-2"><Zap size={12} fill="currentColor" /> Quick_Sync</div>
               </div>
               <div className="flex items-center gap-2">
                  ESC to Cancel
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
