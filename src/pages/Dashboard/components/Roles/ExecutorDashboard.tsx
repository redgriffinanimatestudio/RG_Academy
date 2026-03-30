import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { studioService } from '../../../../services/studioService';
import Preloader from '../../../../components/Preloader';
import NoDataPlaceholder from '../NoDataPlaceholder';

interface ExecutorDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const ExecutorDashboard: React.FC<ExecutorDashboardProps> = ({ view, accent, user, lang }) => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLocalLoading(true);
      const [cRes, tRes] = await Promise.all([
        studioService.getContracts(user.id, 'executor'),
        studioService.getMyTasks()
      ]);
      setContracts(cRes);
      setTasks(tRes);
    } catch (e) { console.error(e); } finally { setLocalLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleUpdateStatus = async (taskId: string, currentStatus: string) => {
    const statuses = ['todo', 'in_progress', 'done'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
    
    try {
      await studioService.updateTaskStatus(taskId, nextStatus);
      fetchData();
    } catch (e) {
      alert('Failed to update task.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
          <div className="size-2 rounded-full bg-blue-500 animate-pulse" /> My Active Tasks
        </h3>
        {localLoading ? <Preloader message="Fetching tasks..." size="sm" /> : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((t) => (
              <div key={t.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between gap-4 group hover:bg-white/[0.05] transition-all">
                <div>
                  <div className="text-[9px] font-black uppercase text-white/20 mb-1">{t.project?.title || 'General Task'}</div>
                  <div className="text-sm font-black text-white uppercase leading-tight">{t.title}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <div className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${
                    t.status === 'done' ? 'bg-emerald-500/10 text-emerald-500' : 
                    t.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/10 text-white/40'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </div>
                  <button 
                    onClick={() => handleUpdateStatus(t.id, t.status)}
                    className="text-[8px] font-black uppercase px-3 py-1.5 bg-white/5 hover:bg-primary hover:text-bg-dark rounded-md transition-all"
                  >
                    Next Status →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Briefcase} message="Wait for assignments." link={`/studio/${lang}`} linkText="Explore Projects" />}
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl opacity-60">
        <h3 className="text-2xl font-black uppercase tracking-tight">Contract Overview</h3>
        <div className="grid gap-4">
          {contracts.map((c) => (
            <div key={c.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group">
              <div className="flex items-center gap-6">
                <div className="size-10 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center font-black">C</div>
                <div>
                  <div className="text-sm font-black uppercase">{c.project?.title || `Contract #${c.id.slice(0, 8)}`}</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase mt-1">Budget: ${c.amount} · ID: {c.id.slice(0, 8)}</div>
                </div>
              </div>
              <div className="text-[10px] font-black uppercase px-4 py-2 bg-white/5 rounded-xl">{c.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutorDashboard;
