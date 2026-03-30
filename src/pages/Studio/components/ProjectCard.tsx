import { motion } from 'framer-motion';
import { Zap, ChevronRight, Binary, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProjectCardProps {
  project: any;
  t: any;
  onViewDetails: (project: any) => void;
}

export default function ProjectCard({ project, t, onViewDetails }: ProjectCardProps) {
  // Parsing tags from JSON if needed
  const tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : (project.tags || []);
  const matchScore = project.matchScore || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="criativo-card group relative overflow-hidden flex flex-col h-full"
    >
      {/* Skill Match Pulse */}
      {matchScore > 0 && (
        <div className="absolute top-0 right-0 p-6 z-10">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1 italic">Grid Match</span>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 border shadow-lg transition-all ${
              matchScore >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10' : 
              matchScore >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-amber-500/10' : 
              'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10'
            }`}>
              <Binary size={12} className="animate-pulse" /> {matchScore}%
            </div>
          </div>
        </div>
      )}

      {/* Decorative Background Element */}
      <div className="absolute -bottom-12 -right-12 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />

      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3 pr-24">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-2xl tracking-tight text-white uppercase leading-none group-hover:text-primary transition-colors">{project.title}</h3>
              {project.urgency === 'urgent' && (
                <span className="px-2 py-0.5 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                  <Zap size={8} fill="currentColor" /> {t('urgent')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-white/40 font-bold uppercase tracking-widest text-[9px] italic">
              <Building2 size={12} className="text-white/20" />
              {t('posted_by')} <span className="text-white/60">{project.client?.displayName || 'Protocol Terminal'}</span>
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all ${
            project.status === 'open' ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(255,54,54,0.1)]' : 'bg-white/5 text-white/40'
          }`}>
            {t(project.status)}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5 group-hover:border-white/10 transition-all hover:text-white">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-white/50 font-medium leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-8 mt-6 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{t('budget_range')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white italic tracking-tighter leading-none">${project.budget.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">USD</span>
          </div>
        </div>
        <button 
          onClick={() => onViewDetails(project)}
          className="flex items-center gap-3 bg-white/5 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary hover:text-bg-dark transition-all border border-white/5 hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-primary/20 group"
        >
          {t('view_details')} 
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
