import React, { useState } from 'react';
import { ChevronDown, CheckCircle, Circle, PlayCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration?: string;
}

interface ModuleProgressProps {
  module: {
    title: string;
    lessons: Lesson[];
    completedLessons?: string[];
  };
}

const ModuleProgress: React.FC<ModuleProgressProps> = ({ module }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedSet = new Set(module.completedLessons || []);
  const completedCount = module.lessons.filter((lesson) => completedSet.has(lesson.id)).length;
  const progressPercentage = module.lessons.length > 0 
    ? Math.round((completedCount / module.lessons.length) * 100) 
    : 0;

  return (
    <div className="w-full bg-bg-card rounded-[1.5rem] border border-border-main overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-bg Card/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-primary transition-all duration-500"
              style={{ height: `${progressPercentage}%`, bottom: 0, top: 'auto' }}
            />
            <CheckCircle size={18} className="relative z-10 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black tracking-tighter text-ink uppercase italic truncate">
              {module.title}
            </h4>
            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-40 mt-0.5">
              {completedCount}/{module.lessons.length} Lessons • {progressPercentage}%
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1">
            <div className="w-16 h-1.5 bg-bg-main rounded-full overflow-hidden border border-border-main">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 border-t border-border-main">
          <div className="pt-4 space-y-2">
            {module.lessons.map((lesson, index) => {
              const isCompleted = completedSet.has(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-bg-main/50 border border-border-main hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer"
                >
                  <div className={isCompleted ? 'text-primary' : 'text-text-muted opacity-30 group-hover:text-cyan-500 transition-colors'}>
                    {isCompleted ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Circle size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black tracking-tight truncate transition-colors ${
                      isCompleted ? 'text-ink' : 'text-text-muted opacity-60 group-hover:text-ink'
                    }`}>
                      <span className="text-text-muted opacity-30 mr-2">{index + 1}.</span>
                      {lesson.title}
                    </p>
                    {lesson.duration && (
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-30 mt-0.5">
                        {lesson.duration}
                      </p>
                    )}
                  </div>
                  <div className={`size-8 rounded-lg flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-bg-card text-text-muted opacity-30 group-hover:bg-cyan-500/10 group-hover:text-cyan-500'
                  }`}>
                    <PlayCircle size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModuleProgress);