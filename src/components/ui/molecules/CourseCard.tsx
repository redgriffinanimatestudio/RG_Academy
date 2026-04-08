import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Clock, PlayCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

export interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  lecturerName: string;
  price: number;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  level: string;
  tags: string[];
  lang?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  slug,
  title,
  lecturerName,
  price,
  thumbnail,
  rating,
  reviewsCount,
  studentsCount,
  duration,
  level,
  tags,
  lang = 'eng',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-700 shadow-2xl hover:shadow-primary/5 relative flex flex-col h-full"
    >
      {/* 🖼️ THUMBNAIL ZONE */}
      <div className="relative aspect-[16/10] overflow-hidden shrink-0">
        <motion.img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
          <Badge variant="primary" size="sm" dot>{level}</Badge>
          {tags.slice(0, 1).map(tag => (
            <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
          ))}
        </div>
        
        <button className="absolute top-6 right-6 size-10 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:border-red-500/20 transition-all group/heart">
          <Heart size={18} className="group-hover/heart:fill-current" />
        </button>

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <div className="size-20 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-2xl flex items-center justify-center text-primary animate-pulse">
              <PlayCircle size={40} />
           </div>
        </div>
      </div>

      {/* 📝 CONTENT ZONE */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="space-y-4 mb-8 flex-1">
          <div className="flex items-center gap-3">
             <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 italic">Industrial_Node: Active</span>
          </div>
          
          <Link to={`/aca/${lang}/course/${slug}`}>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-tight hover:text-primary transition-colors line-clamp-2 italic">
              {title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-3">
             <div className="size-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/20 italic">A</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">{lecturerName}</span>
          </div>
        </div>

        {/* 📊 STATS MATRIX */}
        <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden mb-8">
           <div className="bg-[#050505] p-4 flex items-center gap-3">
              <Star size={14} className="text-amber-500 fill-current" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-white italic">{rating}</span>
                 <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">({reviewsCount})</span>
              </div>
           </div>
           <div className="bg-[#050505] p-4 flex items-center gap-3">
              <Users size={14} className="text-primary" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-white italic">{studentsCount}+</span>
                 <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Active_Sync</span>
              </div>
           </div>
           <div className="bg-[#050505] p-4 flex items-center gap-3 col-span-2 border-t border-white/5">
              <Clock size={14} className="text-white/20" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 italic">Total_Operational_Time: {duration}</span>
           </div>
        </div>

        {/* 💰 ACTION ZONE */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Resource_Cost</span>
              <div className="text-2xl font-black text-white italic tracking-tighter">
                ${price}
              </div>
           </div>
           <Link to={`/aca/${lang}/course/${slug}`}>
             <Button variant="primary" size="sm" glow className="px-8">
               Initialize
             </Button>
           </Link>
        </div>
      </div>

      {/* Neural Background Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-0" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
    </motion.div>
  );
};

export default CourseCard;
