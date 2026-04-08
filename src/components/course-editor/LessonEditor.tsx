import React from 'react';
import {
  FileText,
  Video,
  Copy,
  Check,
  X
} from 'lucide-react';
import { Lesson } from '../../services/academyService';

interface LessonEditorProps {
  lesson: Lesson | null;
  onUpdateLesson: (lessonId: string, field: string, value: any) => void;
  activePanel: 'modules' | 'content' | 'settings';
}

const lessonTypes = [
  { id: 'video', label: 'Video', icon: Video },
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'quiz', label: 'Quiz', icon: Copy }
];

export default function LessonEditor({
  lesson,
  onUpdateLesson,
  activePanel
}: LessonEditorProps) {
  return (
    <div className={`
      flex-1 overflow-y-auto bg-[#060606]/50
      ${activePanel === 'content' ? 'block' : 'hidden lg:block'}
    `}>
      {lesson ? (
        <div className="p-6 lg:p-8 space-y-8 max-w-4xl">
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Lesson_Title</label>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => onUpdateLesson(lesson.id, 'title', e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xl font-black uppercase tracking-tight text-white placeholder-white/20"
              placeholder="LESSON_TITLE"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Lesson_Type</label>
            <div className="flex gap-3">
              {lessonTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => onUpdateLesson(lesson.id, 'type', type.id)}
                  className={`
                    flex-1 py-4 rounded-xl border text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all
                    ${lesson.type === type.id 
                      ? 'bg-primary/10 border-primary/30 text-primary' 
                      : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20'
                    }
                  `}
                >
                  <type.icon size={14} /> {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Video_URL</label>
            <input
              type="text"
              value={lesson.videoUrl || ''}
              onChange={(e) => onUpdateLesson(lesson.id, 'videoUrl', e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm font-black tracking-tight text-white placeholder-white/20"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Lesson_Content</label>
            <textarea
              value={lesson.content || ''}
              onChange={(e) => onUpdateLesson(lesson.id, 'content', e.target.value)}
              rows={12}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm font-black tracking-tight text-white placeholder-white/20 resize-none"
              placeholder="Enter lesson content..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Duration</label>
              <input
                type="text"
                value={lesson.duration || '0:00'}
                onChange={(e) => onUpdateLesson(lesson.id, 'duration', e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm font-black tracking-tight text-white placeholder-white/20"
                placeholder="0:00"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Free_Preview</label>
              <button
                onClick={() => onUpdateLesson(lesson.id, 'isFree', !lesson.isFree)}
                className={`
                  w-full h-[52px] rounded-xl border text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all
                  ${lesson.isFree 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-white/[0.02] border-white/10 text-white/40'
                  }
                `}
              >
                {lesson.isFree ? <Check size={14} /> : <X size={14} />}
                {lesson.isFree ? 'Free' : 'Locked'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <FileText size={48} className="mx-auto text-white/10" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Select_a_lesson_to_edit</p>
          </div>
        </div>
      )}
    </div>
  );
}