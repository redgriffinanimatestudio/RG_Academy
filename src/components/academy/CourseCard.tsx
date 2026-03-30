import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Star, Users, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Course } from '../../services/academyService';

const CourseCardSkeleton = () => (
  <div className="criativo-card flex flex-col gap-4 animate-pulse">
    <div className="aspect-video rounded-2xl bg-white/5" />
    <div className="space-y-3">
      <div className="h-6 w-3/4 bg-white/5 rounded-lg" />
      <div className="h-4 w-1/2 bg-white/5 rounded-md" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-white/5 rounded-lg" />
        <div className="h-8 w-20 bg-white/5 rounded-lg" />
      </div>
    </div>
  </div>
);

interface CourseCardProps {
  course: Course;
  lang: string | undefined;
}

export default function CourseCard({ course, lang }: CourseCardProps) {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="group criativo-card !p-0 overflow-hidden card-glow relative"
    >
      <Link to={`/aca/${lang}/course/${course.slug}`} className="block p-4 sm:p-5 lg:p-6">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/[0.02]">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton-loading" />
          )}
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.01] text-white/10 gap-2">
              <ImageIcon size={40} strokeWidth={1} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('preview_unavailable')}</span>
            </div>
          ) : (
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-2xl shadow-primary/40 transform scale-75 group-hover:scale-100 transition-transform duration-500">
              <PlayCircle size={32} fill="currentColor" />
            </div>
          </div>

          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <div className="px-2.5 py-1 glass-premium text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10 shadow-xl">
              {course.category?.name || course.categoryId}
            </div>
            {course.lod && (
              <div className="px-2.5 py-1 bg-primary text-bg-dark text-[9px] font-black uppercase tracking-widest rounded-lg shadow-xl shadow-primary/20">
                LOD {course.lod}
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-5 space-y-4 text-left">
          <h3 className="text-lg lg:text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors line-clamp-2 uppercase leading-tight">
            {course.title}
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl overflow-hidden border border-white/10 bg-white/5 ring-4 ring-white/[0.02]">
              <img 
                src={course.lecturerAvatar || "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"} 
                alt={course.lecturerName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20 leading-none mb-1">{t('instructor')}</span>
              <p className="text-[10px] lg:text-xs text-white/60 font-black uppercase tracking-wider leading-none">{course.lecturerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
              <Star size={12} className="text-primary" fill="currentColor" />
              <span className="text-white">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={12} />
              <span>{course.studentsCount.toLocaleString()}</span>
            </div>
            <div className="ml-auto px-2 py-1 glass-premium rounded-lg text-primary text-[8px]">
              {t(course.level)}
            </div>
          </div>

          {course.softwareStack && course.softwareStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {course.softwareStack.slice(0, 4).map((sw, i) => (
                <div key={i} className="px-2 py-0.5 bg-white/[0.03] rounded-md text-[7px] font-black uppercase tracking-tighter text-white/30 border border-white/5">
                  {sw.name}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20 leading-none mb-1">{t('investment')}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-primary">$</span>
                <span className="text-xl lg:text-2xl font-black text-white">{course.price}</span>
              </div>
            </div>
            <div className="size-10 lg:size-12 bg-white/5 text-white flex items-center justify-center rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-all duration-500 border border-white/5 group-hover:shadow-lg group-hover:shadow-primary/20">
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export { CourseCardSkeleton };
