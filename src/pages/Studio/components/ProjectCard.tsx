import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Zap, ChevronRight, Binary, Building2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProjectCardProps {
  project: any;
  t: any;
  onViewDetails: (project: any) => void;
}

export default function ProjectCard({ project, t, onViewDetails }: ProjectCardProps) {
  const tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : (project.tags || []);
  const matchScore = project.matchScore || 0;

  // 3D TILT LOGIC
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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
      className="glass-pro-max group relative overflow-hidden flex flex-col h-full rounded-[2.5rem] p-8 hover:shadow-[0_0_50px_rgba(0,245,212,0.15)] transition-shadow duration-500"
    >
      <div style={{ transform: "translateZ(50px)" }} className="relative z-20 flex-1 space-y-6">
        {/* Match Badge */}
        {matchScore > 0 && (
          <div className="absolute top-0 right-0 z-30">
            <div className="flex flex-col items-end">
              <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 neural-pulse">Sync Match</span>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 border shadow-lg transition-all ${
                matchScore >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10' : 
                'bg-primary/10 border-primary/20 text-primary shadow-primary/10'
              }`}>
                <Sparkles size={10} className="animate-pulse" /> {matchScore}%
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-black text-3xl tracking-tighter text-white uppercase leading-none group-hover:text-primary transition-colors text-data-glow">{project.title}</h3>
            {project.urgency === 'urgent' && (
              <span className="px-2 py-0.5 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1 shadow-[0_0_15px_rgba(0,245,212,0.4)]">
                <Zap size={8} fill="currentColor" /> {t('urgent')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/40 font-bold uppercase tracking-widest text-[9px] italic">
            <Building2 size={12} className="text-white/20" />
            {t('posted_by')} <span className="text-white/80">{project.client?.displayName || 'Protocol Terminal'}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5 group-hover:border-white/20 transition-all hover:text-white hover:bg-white/10 italic">
              #{tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-white/50 font-medium leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="flex items-center justify-between pt-8 mt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{t('budget_range')}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white italic tracking-tighter leading-none text-data-glow">${project.budget.toLocaleString()}</span>
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">USD</span>
            </div>
          </div>
          <button 
            onClick={() => onViewDetails(project)}
            className="metallic-glow flex items-center gap-3 bg-white/5 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary hover:text-bg-dark transition-all border border-white/10 hover:border-transparent group/btn overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('view_details')} 
              <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-10 -right-10 size-40 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-1000" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}
