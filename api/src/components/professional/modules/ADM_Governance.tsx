import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  MoreVertical, 
  UserPlus, 
  Lock, 
  Unlock, 
  ArrowUpRight 
} from 'lucide-react';

const ADM_Governance: React.FC = () => {
  const users = [
    { id: 1, name: 'Alice Systems', role: 'Chief Manager', status: 'Active', pulse: 'Steady' },
    { id: 2, name: 'Bob Finance', role: 'Finance Head', status: 'Active', pulse: 'Steady' },
    { id: 3, name: 'Charlie Devl', role: 'System Architect', status: 'Maintenance', pulse: 'Low' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <ShieldCheck className="text-cyan-400" />
            CORE GOVERNANCE
          </h2>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Registry of Unified Identities & Permissions</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-cyan-400 text-bg-dark rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-400/20 hover:scale-105 transition-transform">
          <UserPlus size={16} /> provision entity
        </button>
      </div>

      {/* Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Users size={14} /> Active Personnel
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
              <input type="text" placeholder="QUERY UUID..." className="pl-10 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-[10px] font-mono focus:outline-none focus:border-cyan-400/40 w-48" />
            </div>
          </div>
          
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  <th className="px-4 py-4">Identity</th>
                  <th className="px-4 py-4">Current Node</th>
                  <th className="px-4 py-4">Pulse</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-6 flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-xs text-white/40">{u.name.substring(0,1)}</div>
                      <div>
                        <p className="text-sm font-bold tracking-tight">{u.name}</p>
                        <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest">UUID-99x-{u.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest rounded-lg">{u.role}</span>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`size-1.5 rounded-full animate-pulse ${u.status === 'Active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400'}`} />
                        <span className="text-[10px] font-mono text-white/40">{u.pulse}</span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-right">
                      <button className="p-2 text-white/20 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Sidebar (RBAC View) */}
        <div className="space-y-6">
          <section className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-6 flex items-center gap-2">
              <Lock size={12} /> RBAC CRITICAL PATH
            </h3>
            <div className="space-y-4">
              {[
                { r: 'Systems Arch', p: 'FULL_ROOT_AUTH', active: true },
                { r: 'Faculty Head', p: 'CONTENT_SIGN_OFF', active: true },
                { r: 'Support Node', p: 'IDENTITY_QUERY_ONLY', active: false }
              ].map((role, i) => (
                <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-cyan-400/40 transition-all">
                  <div>
                    <p className="text-xs font-bold mb-1">{role.r}</p>
                    <p className="text-[9px] font-mono text-white/20">{role.p}</p>
                  </div>
                  {role.active ? <Unlock size={14} className="text-emerald-400" /> : <Lock size={14} className="text-zinc-600" />}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-cyan-400/10 to-transparent border border-cyan-400/20 p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Audit Logs</p>
              <h4 className="text-lg font-black italic uppercase tracking-tighter mb-4">ENTITY LOG: V2</h4>
              <ArrowUpRight className="absolute top-0 right-0 text-cyan-400 opacity-20 group-hover:opacity-100 transition-opacity" size={48} />
            </div>
            <div className="size-20 bg-cyan-400/20 blur-[60px] absolute -bottom-10 -right-10" />
          </section>
        </div>
      </div>

    </div>
  );
};

export default ADM_Governance;
