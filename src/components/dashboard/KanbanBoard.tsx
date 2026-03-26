import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  MessageSquare, 
  Paperclip, 
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { studioService } from '../../services/studioService';

const COLUMNS = [
  { id: 'open', title: 'To Do', color: 'text-white/40' },
  { id: 'in_progress', title: 'In Progress', color: 'text-primary' },
  { id: 'review', title: 'Review', color: 'text-amber-400' },
  { id: 'completed', title: 'Done', color: 'text-emerald-400' }
];

export default function KanbanBoard() {
  const { data, setData } = usePlatform();
  const projects = data.projects || [];

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      await studioService.updateProjectStatus(projectId, newStatus);
      // Optimistic update
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p)
      }));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const groupedProjects = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      items: projects.filter(p => p.status === col.id)
    }));
  }, [projects]);

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar min-h-[600px]">
      {groupedProjects.map((column) => (
        <div key={column.id} className="w-80 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <h3 className={`text-xs font-black uppercase tracking-widest ${column.color}`}>{column.title}</h3>
              <span className="size-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/20">
                {column.items.length}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3 p-2 rounded-3xl bg-white/[0.01] border border-white/[0.03]">
            <AnimatePresence mode="popLayout">
              {column.items.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={project.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      project.urgency === 'urgent' ? 'bg-rose-500/10 text-rose-500' : 'bg-white/5 text-white/40'
                    }`}>
                      {project.urgency || 'Normal'}
                    </span>
                    <div className="dropdown dropdown-end">
                      <button className="text-white/10 hover:text-white transition-colors">
                        <MoreVertical size={14} />
                      </button>
                      <ul className="dropdown-content menu p-2 shadow-2xl bg-zinc-900 border border-white/10 rounded-xl w-40 z-50">
                        {COLUMNS.filter(c => c.id !== column.id).map(c => (
                          <li key={c.id}>
                            <button 
                              onClick={() => updateProjectStatus(project.id, c.id)}
                              className="text-[9px] font-black uppercase tracking-widest hover:text-primary"
                            >
                              Move to {c.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-primary transition-colors uppercase truncate">
                    {project.title}
                  </h4>
                  <p className="text-[10px] text-white/40 mb-4 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-white/5 flex items-center justify-center">
                        <Zap size={12} className="text-primary" />
                      </div>
                      <span className="text-[10px] font-black text-white/20">${project.budget?.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/20">
                      <div className="flex items-center gap-1">
                        <Clock size={12} /> {project.deadline || 'No date'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {column.items.length === 0 && (
              <div className="h-32 border border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                <span className="text-[9px] font-black uppercase text-white/5">Empty</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
