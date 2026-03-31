import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, ShieldAlert, Clock, Activity, 
  MessageSquare, ChevronRight, Zap, Target,
  Filter, Search, Send, LayoutDashboard, Database
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { dashboardService } from '../../../services/dashboardService';
import TicketResolutionModal from '../components/Support/TicketResolutionModal';
import Preloader from '../../../components/Preloader';

interface SupportDashboardProps {
  view: string;
  user?: any;
  lang?: string | undefined;
}

const SupportDashboard: React.FC<SupportDashboardProps> = ({ view, user, lang }) => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getSupportSummary();
      setSummary(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setView = (v: string) => {
    setSearchParams(prev => {
        prev.set('view', v);
        return prev;
    });
  };

  const stats = [
    { label: 'Active Incidents', value: summary?.activeTickets || '0', sub: 'Nodes Pending', icon: MessageSquare, color: '#ef4444' },
    { label: 'Priority Spikes', value: summary?.prioritySpikes || '0', sub: 'Critical Load', icon: ShieldAlert, color: '#fbbf24' },
    { label: 'Mean Resolution', value: summary?.meanResolutionTime || '0.0h', sub: 'Cycle Speed', icon: Clock, color: '#378add' },
    { label: 'Ecosystem Health', value: summary?.systemHealth || 'Stable', sub: 'Nominal Status', icon: Activity, color: '#00f5d4' }
  ];

  const handleResolve = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  if (view === 'matrix') {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Incident <span className="text-[#ef4444]">Matrix</span></h2>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] font-mono">Telemetry: NODE-SUPPORT-L4</p>
                </div>
                <button onClick={() => setView('overview')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Overview Hub</button>
            </header>
            
            <div className="glass-industrial p-12 rounded-[3.5rem] border border-white/5 space-y-10 matrix-grid-bg relative overflow-hidden group">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="relative flex-1 w-full lg:max-w-md group">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ef4444] transition-colors" size={20} />
                        <input type="text" placeholder="Identify Incident ID..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ef4444]/40 transition-all text-white" />
                    </div>
                    <button onClick={fetchData} className="px-8 py-4 bg-[#ef4444] text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#ef4444]/20">Sync Queue</button>
               </div>

               <div className="grid gap-4 relative z-10">
                    {loading ? (
                        [1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)
                    ) : (
                        summary?.tickets?.map((ticket: any, i: number) => (
                            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group/tx hover:bg-white/[0.04] transition-all duration-500 border-l-4 border-l-[#ef4444]/40 card-glow">
                                <div className="flex items-center gap-8">
                                    <div className={`size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-xl ${ticket.priority === 'critical' ? 'text-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-amber-400'}`}>
                                        {ticket.id.substring(3)}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover/tx:text-[#ef4444] transition-colors">{ticket.user}</h4>
                                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/40">
                                            <span className={ticket.priority === 'critical' ? 'text-[#ef4444]' : 'text-amber-400'}>{ticket.priority}</span>
                                            <span className="size-1 rounded-full bg-white/20" />
                                            <span>{ticket.category}</span>
                                            <span className="size-1 rounded-full bg-white/20" />
                                            <span className="text-sky-400 italic uppercase">Sync: Active</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => handleResolve(ticket)}
                                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ef4444] hover:text-bg-dark transition-all flex items-center gap-2"
                                    >
                                        <Send size={14} /> Resolve Node
                                    </button>
                                    <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-white hover:text-bg-dark transition-all">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
               </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 🚀 HUB CONTROLS (Level 2 Nav) */}
      <div className="flex gap-4">
          <button onClick={() => setView('overview')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'overview' ? 'bg-[#ef4444] text-bg-dark border-[#ef4444]' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <LayoutDashboard size={14} /> Overview
          </button>
          <button onClick={() => setView('matrix')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${view === 'matrix' ? 'bg-[#ef4444] text-bg-dark border-[#ef4444]' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
            <Database size={14} /> Incident Matrix
          </button>
      </div>

      {/* 📊 INCIDENT TELEMETRY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass-industrial border border-white/5 rounded-[2.5rem] space-y-4 group/stat hover:border-white/20 transition-all duration-500 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <stat.icon size={80} style={{ color: stat.color }} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{stat.label}</div>
            <div className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</div>
            <div className="text-[9px] font-bold text-white/10 uppercase tracking-widest">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* 🎯 INCIDENT MATRIX PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass-industrial border border-white/5 rounded-[3.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group matrix-grid-bg"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-1000">
            <Target size={240} className="text-white" />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase tracking-tight text-white italic text-glow">Incident Queue</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Industrial Support Protocol v4.0</p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setView('matrix')}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center gap-2"
               >
                 <Database size={14} /> Full Matrix
               </button>
               <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all">
                 <Filter size={16} />
               </button>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
             {loading ? (
               [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-[2rem] animate-pulse" />)
             ) : (
               summary?.tickets?.slice(0, 4).map((ticket: any, i: number) => (
                 <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-center justify-between group/tx hover:bg-white/[0.06] hover:border-[#ef4444]/20 transition-all duration-500">
                    <div className="flex items-center gap-6">
                       <div className={`size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs italic ${ticket.priority === 'critical' ? 'text-[#ef4444]' : 'text-amber-400'}`}>
                          {ticket.id.substring(3)}
                       </div>
                       <div>
                          <p className="text-sm font-black text-white uppercase italic tracking-tight">{ticket.user}</p>
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{ticket.category} • {ticket.status}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-[10px] font-black uppercase tracking-widest ${ticket.priority === 'critical' ? 'text-[#ef4444]' : 'text-amber-400'}`}>{ticket.priority}</p>
                       <button 
                        onClick={() => handleResolve(ticket)}
                        className="text-[9px] font-black text-sky-400 uppercase tracking-widest mt-1 hover:text-white transition-colors"
                       >
                         Resolve Node →
                       </button>
                    </div>
                 </div>
               ))
             )}
          </div>
        </motion.div>

        {/* Action Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="glass-industrial border border-white/5 rounded-[3rem] p-8 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-1000">
               <LifeBuoy size={120} className="text-[#ef4444]" />
            </div>
            <div className="space-y-1 relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Response Node</h4>
              <p className="text-3xl font-black text-white italic tracking-tighter">{summary?.meanResolutionTime || '0.0h'} AVG</p>
              <p className="text-[9px] text-[#ef4444] font-black uppercase tracking-widest italic mt-1 drop-shadow-[0_0_8px_#ef4444]">Real-time Resolution Active</p>
            </div>

            <div className="space-y-3 relative z-10">
               <button className="w-full py-5 bg-[#ef4444] text-bg-dark rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#ef4444]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                 <Zap size={16} /> Force Sync
               </button>
               <button className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                 <MessageSquare size={16} /> Global Notify
               </button>
            </div>
          </div>

          <div className="p-8 glass-industrial border border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
             <div className="flex items-center justify-between">
                <div className="p-3 bg-[#fbbf24]/10 rounded-xl">
                  <ShieldAlert size={20} className="text-[#fbbf24]" />
                </div>
                <span className="px-3 py-1 bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 rounded-lg text-[8px] font-black uppercase tracking-widest">Watching</span>
             </div>
             <p className="text-[9px] text-white/40 font-black uppercase tracking-widest italic leading-relaxed">
                Incident Matrix monitoring total ecosystem health. 100% of nodes reporting nominal performance.
             </p>
          </div>
        </motion.div>
      </div>

      {/* Resolution Modal */}
      <TicketResolutionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        ticket={selectedTicket} 
      />
    </div>
  );
};

const SearchIcon = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

export default SupportDashboard;
