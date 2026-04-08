import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  BookOpen, 
  Briefcase, 
  User, 
  Zap, 
  X,
  Command,
  ArrowRight
} from 'lucide-react';
import apiClient from '../../services/apiClient';

export default function GlobalSearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const searchResults = results && typeof results === 'object' ? results : null;
  const courses = Array.isArray(searchResults?.courses) ? searchResults.courses : [];
  const projects = Array.isArray(searchResults?.projects) ? searchResults.projects : [];
  const profiles = Array.isArray(searchResults?.profiles) ? searchResults.profiles : [];
  const services = Array.isArray(searchResults?.services) ? searchResults.services : [];

  // Keyboard Shortcuts (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        try {
          const [res, aiRes] = await Promise.all([
            apiClient.get(`/v1/search/universal?q=${query}`),
            apiClient.post(`/v1/ai/discover`, { q: query })
          ]);
          setResults(res.data.data);
          setAiInsight(aiRes.data.data.aiInsight);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults(null);
        setAiInsight(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl shadow-primary/20 flex flex-col overflow-hidden"
          >
            {/* Header / Input */}
            <div className="p-8 border-b border-white/5 flex items-center gap-6">
              <Search className="text-primary animate-pulse" size={24} />
              <input 
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across the Academy Matrix... (Cmd+K)"
                className="bg-transparent border-none outline-none text-xl font-medium text-white placeholder-white/20 w-full"
              />
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase text-white/40">
                <Command size={10} /> K
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar p-6 space-y-8">
              {loading && <div className="p-4 text-center text-white/20 animate-pulse uppercase text-[10px] font-black tracking-widest">Searching Deep Matrix...</div>}
              
              {!loading && !results && (
                <div className="p-12 text-center space-y-4">
                  <Terminal className="mx-auto text-white/5" size={48} />
                  <p className="text-white/40 text-sm italic font-medium">Start typing to discover courses, projects, or experts...</p>
                </div>
              )}

              {/* AI Discovery Insight */}
              {aiInsight && (
                <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl space-y-2 group hover:bg-primary/20 transition-all">
                  <div className="flex items-center gap-2 text-primary">
                    <Zap size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Discovery Insight</span>
                  </div>
                  <p className="text-sm font-medium text-white/80 leading-relaxed italic">"{aiInsight}"</p>
                </div>
              )}

              {/* Categorized Results */}
              {searchResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Column 1: Academy & Studio */}
                  <div className="space-y-8">
                    {courses.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                          <BookOpen size={12} /> Academy Courses
                        </h4>
                        <div className="grid gap-2">
                          {courses.map((c: any) => (
                            <button 
                              key={c.id} 
                              onClick={() => handleNavigate(`/aca/eng/course/${c.slug}`)}
                              className="w-full text-left p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center">
                                  {c.thumbnail ? <img src={c.thumbnail} className="w-full h-full object-cover" /> : <BookOpen size={16} />}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{c.title}</div>
                                  <div className="text-[10px] uppercase font-black text-white/20 tracking-widest">{c.category?.name} • {c.level}</div>
                                </div>
                              </div>
                              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {projects.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                          <Briefcase size={12} /> Studio Projects
                        </h4>
                        <div className="grid gap-2">
                          {projects.map((p: any) => (
                            <button 
                              key={p.id}
                              onClick={() => handleNavigate(`/stu/eng/project/${p.slug}`)}
                              className="w-full text-left p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center">
                                  <Briefcase size={16} />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white">{p.title}</div>
                                  <div className="text-[10px] uppercase font-black text-white/20 tracking-widest">By {p.client?.displayName}</div>
                                </div>
                              </div>
                              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Network & Services */}
                  <div className="space-y-8">
                    {profiles.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                          <User size={12} /> Experts & Talent
                        </h4>
                        <div className="grid gap-2">
                          {profiles.map((pr: any) => (
                            <button 
                              key={pr.id}
                              onClick={() => handleNavigate(`/stu/eng/profiles/${pr.displayName}`)}
                              className="w-full text-left p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-white/5 overflow-hidden">
                                  {pr.photoURL ? <img src={pr.photoURL} className="w-full h-full object-cover" /> : <User size={16} />}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white">{pr.displayName}</div>
                                  <div className="text-[10px] uppercase font-black text-white/20 tracking-widest">{pr.specialization}</div>
                                </div>
                              </div>
                              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {services.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                          <Zap size={12} /> Studio Services
                        </h4>
                        <div className="grid gap-2">
                          {services.map((s: any) => (
                            <button 
                              key={s.id}
                              onClick={() => handleNavigate(`/stu/eng/services/${s.id}`)}
                              className="w-full text-left p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center">
                                  <Zap size={16} />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white">{s.title}</div>
                                  <div className="text-[10px] uppercase font-black text-white/20 tracking-widest">{s.category}</div>
                                </div>
                              </div>
                              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><div className="w-4 h-4 bg-white/10 rounded flex items-center justify-center text-[8px] text-white">⏎</div> Select</span>
                <span className="flex items-center gap-2"><div className="w-4 h-4 bg-white/10 rounded flex items-center justify-center text-[8px] text-white">↑↓</div> Navigate</span>
              </div>
              <div className="flex items-center gap-1 opacity-40">
                <Command size={10} /> Search Matrix Engine 2.1
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
