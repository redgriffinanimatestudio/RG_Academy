import React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
  FileVideo,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Module, Lesson } from '../../services/academyService';

interface ModuleListProps {
  modules: Module[];
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  expandedModules: Set<string>;
  onSelectModule: (moduleId: string) => void;
  onToggleModule: (moduleId: string) => void;
  onModuleTitleChange: (moduleId: string, title: string) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
  onDeleteModule: (moduleId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onReorderLessons: (moduleId: string, oldIndex: number, newIndex: number) => void;
  activePanel: 'modules' | 'content' | 'settings';
}

export default function ModuleList({
  modules,
  selectedModuleId,
  selectedLessonId,
  expandedModules,
  onSelectModule,
  onToggleModule,
  onModuleTitleChange,
  onAddModule,
  onAddLesson,
  onDeleteModule,
  onDeleteLesson,
  onSelectLesson,
  onReorderLessons,
  activePanel
}: ModuleListProps) {
  return (
    <div className={`
      w-full lg:w-80 xl:w-96 flex-shrink-0 border-r border-white/5 bg-[#050505]/50 backdrop-blur-xl overflow-y-auto
      ${activePanel === 'modules' || activePanel === 'content' ? 'block' : 'hidden lg:block'}
    `}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Course_Modules</h2>
          <button
            onClick={onAddModule}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-primary hover:border-primary/30 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {modules.map((module) => (
              <motion.div
                key={module.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  rounded-2xl border overflow-hidden transition-all
                  ${selectedModuleId === module.id ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5'}
                `}
              >
                <button
                  onClick={() => {
                    onToggleModule(module.id);
                    onSelectModule(module.id);
                  }}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical size={14} className="text-white/20" />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => onModuleTitleChange(module.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-transparent text-sm font-black uppercase tracking-tight text-white/80 placeholder-white/20 border-none outline-none focus:ring-0"
                      />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                        {module.lessons?.length || 0} Lessons
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedModules.has(module.id) ? (
                      <ChevronDown size={14} className="text-white/20" />
                    ) : (
                      <ChevronRight size={14} className="text-white/20" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedModules.has(module.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5"
                    >
                      <div className="p-3 space-y-2">
                        <Reorder.Group
                          axis="y"
                          values={module.lessons || []}
                          onReorder={(newOrder) => {
                            const oldIdx = (module.lessons || []).findIndex(l => l.id === selectedLessonId);
                            const newIdx = newOrder.findIndex(l => l.id === selectedLessonId);
                            if (oldIdx !== newIdx) {
                              onReorderLessons(module.id, oldIdx, newIdx);
                            }
                          }}
                          className="space-y-2"
                        >
                          {(module.lessons || []).map((lesson) => (
                            <Reorder.Item
                              key={lesson.id}
                              value={lesson}
                              className={`
                                p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2
                                ${selectedLessonId === lesson.id 
                                  ? 'bg-primary/10 border-primary/30' 
                                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                }
                              `}
                              onClick={() => onSelectLesson(lesson.id)}
                            >
                              <GripVertical size={12} className="text-white/20" />
                              {lesson.type === 'video' ? (
                                <Video size={12} className="text-primary" />
                              ) : (
                                <FileText size={12} className="text-white/40" />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-black uppercase tracking-tight text-white/80 truncate block">
                                  {lesson.title}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteLesson(lesson.id);
                                }}
                                className="p-1 text-white/20 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                        
                        <button
                          onClick={() => onAddLesson(module.id)}
                          className="w-full p-3 rounded-xl border border-dashed border-white/10 text-[9px] font-black uppercase tracking-widest text-white/20 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={12} /> Add Lesson
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-white/5 p-3 flex justify-end">
                  <button
                    onClick={() => onDeleteModule(module.id)}
                    className="p-2 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {modules.length === 0 && (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
              <Layers size={24} className="mx-auto text-white/10 mb-3" />
              <p className="text-[9px] font-black uppercase tracking-widest text-white/20">No_modules_initialized</p>
              <button
                onClick={onAddModule}
                className="mt-4 h-10 px-6 bg-primary text-bg-dark rounded-full text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <Plus size={14} className="mr-2" /> Initialize_First_Module
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}