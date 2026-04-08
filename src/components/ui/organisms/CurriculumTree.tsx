import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PlayCircle, FileText, CheckCircle2, Lock, Zap } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: string;
  isFree: boolean;
  completed?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CurriculumTreeProps {
  modules: Module[];
  currentLessonId?: string;
  onLessonSelect?: (lesson: Lesson) => void;
  completedLessonIds?: string[];
}

const CurriculumTree: React.FC<CurriculumTreeProps> = ({
  modules,
  currentLessonId,
  onLessonSelect,
  completedLessonIds = [],
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand the module containing current lesson by default
    const initial: Record<string, boolean> = {};
    modules.forEach(m => {
      if (m.lessons.some(l => l.id === currentLessonId)) initial[m.id] = true;
    });
    return initial;
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {modules.map((module, mIdx) => (
        <div key={module.id} className="space-y-3">
          {/* 📂 MODULE HEADER */}
          <button 
            onClick={() => toggleModule(module.id)}
            className={`
              w-full flex items-center justify-between p-6 rounded-[2rem] transition-all border
              ${expandedModules[module.id] ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-transparent hover:bg-white/[0.01]'}
            `}
          >
            <div className="flex items-center gap-6">
              <span className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20 tracking-tighter italic">
                {mIdx + 1 < 10 ? `0${mIdx + 1}` : mIdx + 1}
              </span>
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 block mb-1">
                  {module.title}
                </span>
                <span className="text-[7px] font-bold text-white/20 uppercase tracking-[0.3em]">
                  {module.lessons.length} Sectorized Nodes
                </span>
              </div>
            </div>
            <ChevronDown 
              size={14} 
              className={`text-white/20 transition-transform duration-500 ${expandedModules[module.id] ? 'rotate-180 text-primary' : ''}`} 
            />
          </button>

          {/* 📜 LESSON LIST */}
          <AnimatePresence>
            {expandedModules[module.id] && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2 pl-6"
              >
                {module.lessons.map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isActive = currentLessonId === lesson.id;
                  
                  return (
                    <motion.div 
                      key={lesson.id}
                      onClick={() => onLessonSelect?.(lesson)}
                      whileHover={{ x: 4 }}
                      className={`
                        px-8 py-5 flex items-center gap-6 cursor-pointer transition-all rounded-2xl relative overflow-hidden group/lesson
                        ${isActive ? 'bg-primary/5' : 'hover:bg-white/[0.02]'}
                      `}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_#00f5d4]" />}
                      
                      <div className={`shrink-0 transition-all ${isCompleted ? 'text-primary' : 'text-white/10 group-hover/lesson:text-white/30'}`}>
                        {isCompleted ? <CheckCircle2 size={18} /> : (lesson.isFree ? <PlayCircle size={18} /> : <Lock size={18} />)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.1em] truncate ${isActive ? 'text-white' : 'text-white/40 group-hover/lesson:text-white/60'}`}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black uppercase tracking-[0.3em] text-white/10">{lesson.type}</span>
                          <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">{lesson.duration}</span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <Zap size={14} fill="currentColor" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default CurriculumTree;
