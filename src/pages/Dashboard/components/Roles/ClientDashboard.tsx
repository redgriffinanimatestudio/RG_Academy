import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';
import { studioService } from '../../../../services/studioService';
import Preloader from '../../../../components/Preloader';
import NoDataPlaceholder from '../NoDataPlaceholder';

interface ClientDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ view, accent, user, lang }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLocalLoading(true);
      const [pRes, cRes] = await Promise.all([
        studioService.getProjects(),
        studioService.getContracts(user.id, 'client')
      ]);
      setProjects(pRes.filter((p: any) => p.clientId === user.id));
      setContracts(cRes);
    } catch (e) { console.error(e); } finally { setLocalLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleRelease = async (contractId: string, index: number) => {
    if (!confirm('Are you sure you want to release this payment? This action is irreversible.')) return;
    try {
      await studioService.releaseMilestone(contractId, index);
      fetchData();
    } catch (e) {
      alert('Failed to release payment. Check console.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black uppercase tracking-tight">Studio Projects</h3>
          <Link to={`/studio/${lang}/post`} className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase">+ New Project</Link>
        </div>
        {localLoading ? <Preloader message="Loading Projects..." size="sm" /> : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((p, i) => (
              <div key={p.id} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex justify-between items-center group hover:border-sky-500/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="size-12 bg-white/5 rounded-xl flex items-center justify-center font-black">P{i+1}</div>
                  <div>
                    <div className="text-lg font-black uppercase tracking-tight text-white">{p.title}</div>
                    <div className="text-[10px] text-white/40 font-black uppercase mt-1">Budget: ${p.budget} · Status: {p.status}</div>
                  </div>
                </div>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: '65%' }} /></div>
              </div>
            ))}
          </div>
        ) : <NoDataPlaceholder icon={Box} message="No projects found." link={`/studio/${lang}/post`} linkText="Post Project" />}
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Active Production Contracts
        </h3>
        {localLoading ? <Preloader message="Syncing Contracts..." size="sm" /> : contracts.length > 0 ? (
          <div className="grid gap-6">
            {contracts.map((c) => {
              const milestones = JSON.parse(c.milestones || '[]');
              return (
                <div key={c.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-black uppercase text-white">{c.project?.title || 'Studio Contract'}</h4>
                      <p className="text-[10px] font-bold text-white/20 uppercase mt-1">Contract ID: {c.id.slice(0, 8)} · Executor: {c.executor.displayName}</p>
                    </div>
                    <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase rounded-lg">Active</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {milestones.map((m: any, idx: number) => (
                      <div key={idx} className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col justify-between gap-4">
                        <div>
                          <div className="text-[10px] font-black uppercase text-white/40">{m.title}</div>
                          <div className="text-lg font-black text-white mt-1">${m.amount}</div>
                        </div>
                        {m.status === 'released' ? (
                          <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase py-2 bg-emerald-500/5 rounded-lg justify-center">
                            Paid Out ✓
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleRelease(c.id, idx)}
                            className="w-full py-2 bg-primary text-bg-dark rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                          >
                            Release Payout
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <NoDataPlaceholder icon={Box} message="No active contracts found." link={`/studio/${lang}`} linkText="Explore Studio" />}
      </div>
    </div>
  );
};

export default ClientDashboard;
