import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlayCircle, Star, Users, ChevronRight } from 'lucide-react';
import { Course } from '../../../services/academyService';

interface CourseCardProps {
  course: Course;
  lang: string | undefined;
  t: (key: string) => string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, lang, t }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group criativo-card"
    >
      <Link to={`/aca/${lang}/course/${course.slug}`}>
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-xl shadow-primary/40 transform scale-75 group-hover:scale-100 transition-transform duration-500">
              <PlayCircle size={32} fill="currentColor" />
            </div>
          </div>
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
            {course.categoryId}
          </div>
        </div>
        
        <div className="pt-6 space-y-4 text-left">
          <h3 className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors line-clamp-2 uppercase">
            {course.title}
          </h3>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="size-10 rounded-full border border-white/5">
                <img src={course.lecturerAvatar || "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"} alt={course.lecturerName} referrerPolicy="no-referrer" />
              </div>
            </div>
            <p className="text-sm text-white/40 font-medium">{t('by')} {course.lecturerName}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-white/20">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-primary" fill="currentColor" />
              <span className="text-white">{course.rating}</span>
              <span>({course.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{course.studentsCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md">
              <span className="text-white">{t(course.level)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('price')}</span>
              <span className="text-2xl font-black text-white">${course.price}</span>
            </div>
            <div className="bg-white/5 text-white p-3 rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-colors border border-white/5">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(CourseCard);
