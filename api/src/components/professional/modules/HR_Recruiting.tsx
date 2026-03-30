import React from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  Clock, 
  ChevronRight 
} from 'lucide-react';

const HR_Recruiting: React.FC = () => {
  const applicants = [
    { id: 1, name: 'Elena Vance', role: 'VFX Artist', status: 'In Interview', score: '94%' },
    { id: 2, name: 'Gordon Freeman', role: 'Physicist / Researcher', status: 'Pending', score: '88%' },
    { id: 3, name: 'Alyx Vance', role: 'Technical Lead', status: 'Accepted', score: '97%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <Users size={28} className="text-teal-400" />
            TALENT DISCOVERY
          </h2>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Acquisition Pipeline for Unified Lecturers & Faculty</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white/5 border border-white/5 text-white/40 rounded-xl hover:text-white transition-all"><Filter size={18} /></button>
          <button className="flex items-center gap-2 px-6 py-3 bg-teal-400 text-bg-dark rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-400/20 hover:scale-105 transition-all">
            <Briefcase size={16} /> post opening
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Active Openings', value: '12', color: 'text-teal-400' },
          { label: 'Total Applicants', value: '142', color: 'text-white' },
          { label: 'Interviews Today', value: '4', color: 'text-amber-400' },
          { label: 'Hired Ratio', value: '14%', color: 'text-white/40' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-teal-400/40 cursor-default transition-all">
            <div>
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pipeline Table */}
        <div className="lg:col-span-2 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-400 font-mono">CANDIDATE WORKFLOW</h3>
            <span className="px-3 py-1 bg-teal-400/10 border border-teal-400/20 text-teal-400 text-[9px] font-black rounded-full uppercase tracking-widest">LIVE SYNC</span>
          </div>
          <div className="p-4 space-y-4">
            {applicants.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10 group transition-all cursor-pointer">
                <div className="size-12 rounded-xl bg-zinc-900 flex items-center justify-center font-black text-xs text-teal-400/40 group-hover:scale-110 transition-transform">{a.name.substring(0,1)}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold tracking-tight">{a.name}</h4>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{a.role}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${a.status === 'Accepted' ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/20' : a.status === 'In Interview' ? 'bg-teal-400/20 text-teal-400 border border-teal-400/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                      {a.status}
                    </span>
                    <span className="text-xs font-mono font-black text-white/80">{a.score}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-white/10 ml-2 group-hover:text-teal-400 transition-colors" />
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors bg-white/5">Load Archived Identities</button>
        </div>

        {/* Calendar / Notifications */}
        <div className="space-y-6">
          <section className="bg-zinc-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-6 flex items-center gap-2">
                <Calendar size={12} /> Upcoming Slots
              </h3>
              <div className="space-y-6">
                {[
                  { time: '14:00', pos: 'Lead Designer', applicant: 'S. Cooper' },
                  { time: '16:30', pos: 'Senior Dev', applicant: 'B. Ray' }
                ].map((slot, i) => (
                  <div key={i} className="flex gap-4 group/slot cursor-pointer">
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-black text-white italic">{slot.time}</p>
                      <div className="w-px flex-1 bg-white/5 my-2 group-hover/slot:bg-teal-400 transition-colors duration-500" />
                    </div>
                    <div className="pb-6">
                      <p className="text-xs font-bold leading-none mb-1 group-hover/slot:text-teal-400 transition-colors">{slot.pos}</p>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{slot.applicant}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="size-32 bg-teal-400/10 blur-3xl absolute -bottom-10 -right-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </section>

          <section className="bg-black border border-white/5 p-6 rounded-3xl">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 font-mono">System Intel</h3>
                <CheckCircle2 size={12} className="text-emerald-400 animate-pulse" />
             </div>
             <p className="text-[11px] text-white/40 italic leading-relaxed">
               Pulse analysis detected high applicant volume for VFX tracks. Recommendation: Scale automated screening nodes.
             </p>
          </section>
        </div>

      </div>

    </div>
  );
};

// Mock icon missed import
const CheckCircle2 = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
    <path d="M9 12L11 14L15 10"/>
  </svg>
);

export default HR_Recruiting;
