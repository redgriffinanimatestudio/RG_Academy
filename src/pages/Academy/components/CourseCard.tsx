import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlayCircle, Star, Users, ChevronRight, Sparkles } from 'lucide-react';
import { Course } from '../../../services/academyService';

interface CourseCardProps {
  course: Course;
  lang: string | undefined;
  t: (key: string) => string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, lang, t }) => {
  // 3D TILT LOGIC
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-pro-max group relative overflow-hidden flex flex-col h-full rounded-[2.5rem] p-6 hover:shadow-[0_0_50px_rgba(0,245,212,0.15)] transition-all duration-500"
    >
      <Link to={`/aca/${lang}/course/${course.slug}`} className="relative z-20 flex flex-col h-full space-y-6" style={{ transform: "translateZ(40px)" }}>
        <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-white/5 metallic-glow">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.8] group-hover:brightness-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-[0_0_30px_rgba(0,245,212,0.6)] transform scale-75 group-hover:scale-100 transition-transform duration-700">
              <PlayCircle size={32} fill="currentColor" />
            </div>
          </div>
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg border border-white/10 neural-pulse">
            {course.categoryId}
          </div>
        </div>
        
        <div className="flex-1 space-y-4 text-left">
          <h3 className="text-2xl font-black tracking-tighter text-ink group-hover:text-primary transition-colors line-clamp-2 uppercase italic text-data-glow">
            {course.title}
          </h3>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full border border-primary/20 overflow-hidden shadow-lg shadow-primary/5 p-0.5">
              <img src={course.lecturerAvatar || "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"} alt={course.lecturerName} referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-full" />
            </div>
            <p className="text-[10px] text-text-muted opacity-40 font-black uppercase tracking-widest italic">{t('by')} <span className="text-ink">{course.lecturerName}</span></p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.1em] text-text-muted opacity-20">
            <div className="flex items-center gap-1.5 group/stat">
              <Star size={14} className="text-primary neural-pulse" fill="currentColor" />
              <span className="text-text-muted">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{course.studentsCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-bg-card border border-border-main rounded-lg">
              <span className="text-text-muted opacity-60">{t(course.level)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border-main">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-20 mb-1">{t('sync_price')}</span>
              <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-black text-ink italic tracking-tighter text-data-glow">${course.price}</span>
                 <span className="text-[8px] font-bold text-text-muted opacity-20">USD</span>
              </div>
            </div>
            <div className="metallic-glow size-14 bg-bg-card text-text-muted rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-bg-dark transition-all border border-border-main group-hover:shadow-[0_0_20px_rgba(0,245,212,0.4)]">
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>

      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 size-40 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-1000" />
    </motion.div>
  );
};

export default React.memo(CourseCard);
