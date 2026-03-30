import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, 
  Search, 
  MessageSquare, 
  User, 
  Book, 
  Clock, 
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';

const SUP_HelpDesk: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'kb' | 'users'>('tickets');

  const TICKETS = [
    { id: 'TKT-1042', subject: 'UE5 License Activation Error', user: 'Alex Rivera', status: 'open', priority: 'high', time: '12m ago' },
    { id: 'TKT-1043', subject: 'Refund Request: #ORD-992', user: 'Sarah Chen', status: 'pending', priority: 'medium', time: '45m ago' },
    { id: 'TKT-1044', subject: 'Course Content Missing', user: 'Marcus Thorne', status: 'resolved', priority: 'low', time: '2h ago' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* SUPPORT HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-sky-400/10 flex items-center justify-center text-sky-400 border border-sky-400/20 shadow-xl shadow-sky-400/5">
            <LifeBuoy size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">University Help Desk</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Status: Cluster Response Nominal • 12 Open Tickets</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-6 py-3 rounded-xl bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <Plus size={14} /> New Manual Ticket
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group max-w-2xl mx-auto w-full px-4">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sky-400 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search Tickets, Users or Documentation..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-sky-400/40 transition-all shadow-2xl"
        />
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'tickets', label: 'Open Tickets', count: 12, icon: MessageSquare },
          { id: 'kb', label: 'Knowledge Base', count: 442, icon: Book },
          { id: 'users', label: 'User Search', count: null, icon: User }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-sky-400' : 'text-white/40 hover:text-white'}`}
          >
            <tab.icon size={14} /> {tab.label}
            {tab.count !== null && <span className={`ml-2 px-1.5 py-0.5 rounded text-[8px] ${activeTab === tab.id ? 'bg-sky-400/10 text-sky-400' : 'bg-white/5 text-white/20'}`}>{tab.count}</span>}
            {activeTab === tab.id && <motion.div layoutId="support-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]" />}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-12">
        {activeTab === 'tickets' && TICKETS.map((ticket) => (
          <motion.div 
            key={ticket.id}
            variants={item}
            className="group flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-sky-400/20 transition-all cursor-pointer overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-sky-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex-1 space-y-2 relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-sky-400/60 tracking-widest">{ticket.id}</span>
                <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest ${
                  ticket.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                  ticket.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {ticket.priority} priority
                </span>
                <span className="text-[9px] font-bold text-white/20 uppercase flex items-center gap-1"><Clock size={10} /> {ticket.time}</span>
              </div>
              <h3 className="text-sm font-black text-white group-hover:text-sky-400 transition-colors uppercase tracking-widest">{ticket.subject}</h3>
              <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Requested by: <span className="text-white/60">{ticket.user}</span></p>
            </div>

            <div className="flex items-center gap-6 relative z-10">
               <div className="hidden md:flex flex-col items-end">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${
                    ticket.status === 'open' ? 'text-sky-400' : 'text-white/20'
                  }`}>{ticket.status}</span>
                  <div className={`h-1 w-12 rounded-full overflow-hidden bg-white/5 mt-1`}>
                    <div className={`h-full ${ticket.status === 'open' ? 'bg-sky-400' : 'bg-white/20'}`} style={{ width: ticket.status === 'open' ? '60%' : '100%' }} />
                  </div>
               </div>
               <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/40 group-hover:bg-sky-400 group-hover:text-bg-dark transition-all">
                  <ChevronRight size={18} />
               </button>
            </div>
          </motion.div>
        ))}

        {activeTab === 'kb' && (
          <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <Book size={48} className="text-white/10" />
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase text-white/40">Knowledge Base Active</h3>
              <p className="text-[9px] text-white/20 uppercase font-medium tracking-widest">Searching 442 documented solutions...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SUP_HelpDesk;
