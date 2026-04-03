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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-[#0a0a0a] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-white/5 relative transition-all hover:border-primary/40 hover:shadow-[0_0_80px_rgba(var(--primary-rgb),0.1)]"
    >
      <Link to={`/aca/${lang}/course/${course.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
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
              className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1 ${imageLoaded ? 'opacity-70 contrast-125 saturate-150' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          )}
          
          {/* Node Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[6px]">
             <div className="size-24 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-3xl">
               <div className="size-16 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-[0_0_40px_rgba(var(--primary-rgb),0.6)] transform scale-75 group-hover:scale-100 transition-transform duration-500">
                  <PlayCircle size={32} fill="currentColor" />
               </div>
             </div>
          </div>

          <div className="absolute top-8 left-8 flex flex-wrap gap-3">
            <div className="px-4 py-1.5 glass-premium text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-xl border border-white/10 backdrop-blur-3xl shadow-2xl">
              {course.category?.name || course.categoryId}
            </div>
            {course.lod && (
              <div className="px-4 py-1.5 bg-primary text-bg-dark text-[9px] font-black uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-primary/30 animate-pulse">
                LOD_{course.lod}_SYNC
              </div>
            )}
          </div>
        </div>
        
        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl lg:text-3xl font-black tracking-tighter text-white group-hover:text-primary transition-all line-clamp-2 uppercase italic leading-[0.9] group-hover:-translate-y-1">
              {course.title}
            </h3>
            <div className="flex items-center gap-3">
               <div className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_#00f5d4]" />
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Operational_Access_Active</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-[1.5rem] overflow-hidden border border-white/10 bg-white/5 p-0.5 group-hover:border-primary/40 transition-colors">
                <img 
                  src={course.lecturerAvatar || "https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"} 
                  alt={course.lecturerName} 
                  className="w-full h-full object-cover rounded-[1.2rem]"
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 leading-none">Authorization_Lvl_4</span>
                <p className="text-[12px] text-white/60 font-black uppercase tracking-wider leading-none italic">{course.lecturerName}</p>
              </div>
            </div>
            <div className="px-4 py-2 glass-premium rounded-xl text-primary text-[9px] font-black border border-primary/20 backdrop-blur-xl">
              {t(course.level)}
            </div>
          </div>

          <div className="flex items-center gap-10 pt-2 pb-2">
            <div className="flex flex-col">
               <span className="text-[8px] font-black uppercase tracking-widest text-white/10 mb-2">Efficiency</span>
               <div className="flex items-center gap-2">
                 <Star size={16} className="text-primary" fill="currentColor" />
                 <span className="text-sm font-black text-white tabular-nums tracking-tighter">{course.rating}</span>
               </div>
            </div>
            <div className="flex flex-col">
               <span className="text-[8px] font-black uppercase tracking-widest text-white/10 mb-2">Network_Size</span>
               <div className="flex items-center gap-2">
                 <Users size={16} className="text-white/20" />
                 <span className="text-sm font-black text-white/60 tabular-nums uppercase tracking-tighter">{course.studentsCount.toLocaleString()}</span>
               </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Assessment_Yield</span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black text-primary">$</span>
                <span className="text-3xl font-black text-white tracking-widest tabular-nums">{course.price}</span>
              </div>
            </div>
            <button className="relative group/btn flex items-center justify-center">
               <div className="absolute -inset-4 bg-primary/10 rounded-full scale-0 group-hover/btn:scale-100 transition-transform duration-500 blur-xl opacity-50" />
               <div className="size-16 bg-white/5 text-white flex items-center justify-center rounded-[1.8rem] group-hover/btn:bg-primary group-hover/btn:text-bg-dark transition-all duration-700 border border-white/10 group-hover/btn:border-primary group-hover/btn:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                  <ChevronRight size={28} className="group-hover/btn:translate-x-1.5 transition-transform" />
               </div>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export { CourseCardSkeleton };
