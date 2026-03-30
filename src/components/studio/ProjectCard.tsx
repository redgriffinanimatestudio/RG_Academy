import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProjectCardProps {
  project: any;
  onViewDetails: (project: any) => void;
}

export default function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="criativo-card space-y-6 rounded-[2rem] card-glow group transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-2xl tracking-tight text-white uppercase group-hover:text-primary transition-colors">{project.title}</h3>
            {project.urgency === 'urgent' && (
              <span className="px-2 py-1 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 shadow-lg shadow-primary/20">
                <Zap size={8} fill="currentColor" /> {t('urgent')}
              </span>
            )}
          </div>
          <p className="text-sm text-white/40 font-medium">{t('posted_by')} <span className="text-white">{project.client}</span></p>
        </div>
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest glass-premium ${
          project.status === 'open' ? 'text-primary' : 'text-white/40'
        }`}>
          {t(project.status)}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag: string) => (
          <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('budget_range')}</span>
          <span className="text-lg font-black text-white">${project.budget.toLocaleString()}</span>
        </div>
        <button 
          onClick={() => onViewDetails(project)}
          className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary hover:text-bg-dark transition-all border border-white/5 group/btn"
        >
          {t('view_details')} <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
