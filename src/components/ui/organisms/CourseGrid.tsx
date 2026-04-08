import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCard, { CourseCardProps } from '../molecules/CourseCard';
import Skeleton from '../atoms/Skeleton';

interface CourseGridProps {
  courses: CourseCardProps[];
  loading?: boolean;
  skeletonCount?: number;
}

const CourseGrid: React.FC<CourseGridProps> = ({ 
  courses, 
  loading = false, 
  skeletonCount = 8 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      <AnimatePresence mode="popLayout">
        {loading ? (
          // 🦴 SKELETON STATE
          Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={`skel-${i}`} className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 space-y-8 animate-pulse">
               <Skeleton className="aspect-[16/10] w-full mb-8" />
               <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" variant="text" />
                  <Skeleton className="h-4 w-1/2" variant="text" />
               </div>
               <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden h-24">
                  <Skeleton className="bg-[#050505] h-full w-full" />
                  <Skeleton className="bg-[#050505] h-full w-full" />
               </div>
               <div className="flex items-center justify-between pt-4">
                  <Skeleton className="h-10 w-24" variant="text" />
                  <Skeleton className="h-10 w-24 rounded-2xl" />
               </div>
            </div>
          ))
        ) : (
          // 💎 RENDERED STATE
          courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))
        )}
      </AnimatePresence>

      {!loading && courses.length === 0 && (
        <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-8 border-2 border-dashed border-white/5 rounded-[3rem]">
           <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 animate-bounce">
              <span className="text-4xl">📭</span>
           </div>
           <div className="text-center">
              <h4 className="text-xl font-black uppercase tracking-widest text-white/60">Node_Empty</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-2">Zero synchronization results in this sector.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default CourseGrid;
