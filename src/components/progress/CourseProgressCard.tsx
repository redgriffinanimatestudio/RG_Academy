import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, PlayCircle, Clock } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface CourseProgress {
  title: string;
  thumbnail: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  slug?: string;
}

interface CourseProgressCardProps {
  course: CourseProgress;
}

const statusConfig = {
  'not-started': {
    label: 'Not Started',
    color: 'text-text-muted opacity-40',
    bg: 'bg-text-muted/10',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  'completed': {
    label: 'Completed',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
};

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ course }) => {
  const status = statusConfig[course.status];
  const slug = course.slug || 'default-slug';

  return (
    <div className="group relative overflow-hidden flex flex-col rounded-[2rem] p-5 bg-bg-card border border-border-main hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,245,212,0.1)]">
      <Link 
        to={`/learn/${slug}`}
        className="relative z-20 flex flex-col gap-4"
      >
        <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-white/5">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className={`px-2 py-1 ${status.bg} rounded-lg border border-white/10`}>
              <span className={`text-[8px] font-black uppercase tracking-widest ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-[0_0_20px_rgba(0,245,212,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-500">
              <PlayCircle size={20} fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-black tracking-tighter text-ink group-hover:text-primary transition-colors line-clamp-2 uppercase italic">
            {course.title}
          </h3>
          
          <div className="space-y-2">
            <ProgressBar percentage={course.progress} showLabel={false} color="primary" />
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-30 italic">
                {course.progress}% Complete
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-text-muted opacity-40 italic">
              <Clock size={12} />
              <span>Continue</span>
            </div>
            <div className="size-8 bg-bg-card rounded-xl flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-bg-dark transition-all border border-border-main group-hover:border-primary/50">
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute -bottom-8 -right-8 size-24 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-all duration-700" />
    </div>
  );
};

export default React.memo(CourseProgressCard);