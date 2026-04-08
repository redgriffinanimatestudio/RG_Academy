import React, { useState, useEffect } from 'react';
import { 
  Users, Box, Zap, Activity, Search, Filter, Shield, 
  MoreVertical, Edit2, Trash2, CheckCircle, XCircle, 
  ChevronRight, LayoutDashboard, Database, Lock, 
  UserPlus, Download, Plus, Target, Cpu, Server,
  Fingerprint, Terminal
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StatCard, SectionHeader, GlassCard } from '../../../components/dashboard/shared/DashboardUI';
import AdminOmniRouteView from './AdminOmniRouteView';
import OmniCoreTopology from '../../../components/admin/OmniCoreTopology';


import { useAuth } from '../../../context/AuthContext';
import { adminService } from '../../../services/adminService';
import Preloader from '../../../components/Preloader';

interface AdminDashboardProps {
  stats?: any;
  activeRole: string;
  setActiveRole: (role: string) => void;
}

export default function AdminDashboard({ stats, activeRole, setActiveRole }: AdminDashboardProps) {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'overview';
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(1, search, roleFilter);
      if (data) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('[Admin] User fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'users') {
      fetchUsers();
    }
  }, [currentView, search, roleFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const setView = (view: string) => {
    setSearchParams({ view });
  };

  // --- RENDER: USERS VIEW ---
  if (currentView === 'users') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">
              Registry <span className="text-red-500">Matrix</span>
            </h1>
            <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-red-500 animate-ping" />
              Node Synchronization Active • ARCHITECT-V4
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setView('overview')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Overview Hub</button>
             <button className="px-6 py-3 bg-red-500 text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-red-500/20 flex items-center gap-2">
                <UserPlus size={14} /> New Entity
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-8">
                <GlassCard className="!p-4 flex flex-col md:flex-row items-center gap-4 border-red-500/10">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Identify Node..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-500/40 transition-all text-white"
                        />
                    </div>
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full md:w-auto bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/60 outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all border-r-8 border-r-transparent"
                    >
                        <option value="">All Classes</option>
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                    </select>
                </GlassCard>

                <div className="glass-industrial bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                    <div className="absolute inset-0 matrix-grid-bg opacity-5 pointer-events-none" />
                    <div className="overflow-x-auto no-scrollbar relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.03]">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Node Entity</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Primary Layer</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={4} className="py-20 text-center"><Preloader size="sm" /></td></tr>
                                ) : users.map((user) => (
                                    <tr 
                                        key={user.id} 
                                        onClick={() => setSelectedUser(user)}
                                        className={`group cursor-pointer transition-all duration-300 ${selectedUser?.id === user.id ? 'bg-red-500/5' : 'hover:bg-white/[0.03]'}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className={`size-12 rounded-2xl flex items-center justify-center font-black italic text-sm ${user.isAdmin ? 'bg-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-primary/20 text-primary shadow-[0_0_20px_rgba(0,255,157,0.1)]'}`}>
                                                    {user.displayName?.substring(0, 2).toUpperCase() || '??'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-white uppercase italic tracking-tight">{user.displayName}</span>
                                                    <span className="text-[9px] text-white/20 font-bold lowercase">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-2">
                                                {(user.roles || []).map((r: string) => (
                                                    <span key={r} className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/40">{r}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-1.5 rounded-full ${user.isSuspended ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse shadow-[0_0_10px_rgba(0,255,157,0.5)]`} />
                                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${user.isSuspended ? 'text-rose-500/60' : 'text-emerald-500/60'}`}>
                                                    {user.isSuspended ? 'Suspended' : 'Operational'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-white hover:text-bg-dark transition-all ml-auto">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <aside className="xl:col-span-4 space-y-6">
                <AnimatePresence mode="wait">
                    {selectedUser ? (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                            <GlassCard className="!p-10 space-y-8 border-red-500/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                                    <Fingerprint size={120} className="text-red-500" />
                                </div>
                                <div className="text-center space-y-5 relative z-10">
                                    <div className="size-24 mx-auto rounded-[2.5rem] bg-red-500/20 flex items-center justify-center text-4xl font-black italic text-red-500 shadow-2xl shadow-red-500/20 border border-red-500/30">
                                        {selectedUser.displayName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{selectedUser.displayName}</h3>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-1">Entity ID: {selectedUser.id.slice(0, 12)}...</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Sync Status</p>
                                        <p className="text-[11px] font-black text-emerald-500 uppercase tracking-tight italic">Nominal</p>
                                    </div>
                                    <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Tier Level</p>
                                        <p className="text-[11px] font-black text-white uppercase tracking-tight italic">Level 05</p>
                                    </div>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <button className="w-full py-5 bg-white text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl">
                                        <Lock size={14} /> Clear Credentials
                                    </button>
                                    <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3">
                                        <Shield size={14} className="text-red-500" /> Access Matrix
                                    </button>
                                    <button className="w-full py-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-3">
                                        <XCircle size={14} /> Terminate Sync
                                    </button>
                                </div>
                            </GlassCard>

                            <GlassCard className="!p-8 space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic flex items-center gap-3">
                                    <Activity size={14} className="text-red-500" /> Transmission Log
                                </h4>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/log hover:border-white/10 transition-colors">
                                            <div className="size-2 rounded-full bg-red-500/40 group-hover/log:scale-125 transition-transform" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[9px] font-black text-white uppercase truncate">Unauthorized Access Attempt Blocked</p>
                                                <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest mt-0.5">2 mins ago • IP: 124.***.***</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center glass-industrial border border-white/5 rounded-[3rem] opacity-20">
                            <Terminal size={64} className="mb-6" />
                            <p className="text-[12px] font-black uppercase tracking-[0.4em] italic">Awaiting Matrix<br/>Selection...</p>
                        </div>
                    )}
                </AnimatePresence>
            </aside>
        </div>
      </div>
    );
  }

  // --- RENDER: OMNIROUTE CORE VIEW ---
  if (currentView === 'omniroute') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('overview')} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">Overview</button>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Core Matrix Active</span>
          </div>
          <button onClick={() => setView('users')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Registry Matrix</button>
        </header>
        <AdminOmniRouteView />
      </div>
    );
  }

  // --- RENDER: OVERVIEW (Default) ---
  const cards = [
    { label: 'Platform Nodes', value: stats?.users || 0, sub: '↑ 12% Growth', icon: Users, color: '#378add', trend: 'positive' },
    { label: 'Active Pipelines', value: stats?.projects || 0, sub: 'Syncing...', icon: Box, color: '#00f5d4', trend: 'neutral' },
    { label: 'Global Gross', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, sub: '↑ $4.2K Today', icon: Zap, color: '#fbbf24', trend: 'positive' },
    { label: 'Network Integrity', value: '99.9%', sub: 'Zero Drifts', icon: Shield, color: '#ef4444', trend: 'stable' },
  ];

  return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24"
    >

      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-red-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500">Security: Level 05</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white italic leading-none lg:text-7xl">
            Master <span className="text-primary">Architect</span>
          </h1>
          <div className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-3">
            <div className="size-2 rounded-full bg-primary animate-ping" />
            Full Command System Active • Sync: ARCHITECT-GLOBAL-MASTER
          </div>
        </div>
        <div className="flex items-center gap-4">
             <button onClick={() => setView('omniroute')} className="px-10 py-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-bg-dark transition-all flex items-center gap-3 shadow-2xl">
                <Zap size={16} fill="currentColor" className="animate-pulse" /> OmniCore
             </button>
             <button onClick={() => setView('users')} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white active:bg-white active:text-bg-dark transition-all flex items-center gap-3 shadow-2xl">
                <Database size={16} className="text-red-500" /> Registry Matrix
             </button>
             <button className="p-5 glass-industrial border border-white/10 text-white/40 hover:text-white rounded-3xl transition-all border-red-500/20">
                <Settings size={20} />
             </button>
        </div>
      </header>

      {/* 🚀 HIGH-VELOCITY TELEMETRY (Bento-Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
           <motion.div 
                key={i} 
                variants={itemVariants}
                className="glass-industrial p-10 rounded-[3rem] border border-white/5 space-y-4 group/stat hover:border-white/20 transition-all duration-500 shadow-2xl relative overflow-hidden overflow-visible"
           >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                    <card.icon size={120} style={{ color: card.color }} />
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{card.label}</div>
                    {card.trend === 'positive' && <div className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shadow-sm shadow-emerald-500/10">↑ THRUST_LOG</div>}
                </div>
                
                <div className="text-5xl font-black text-white tracking-tighter italic text-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{card.value}</div>
                
                <div className="flex items-center gap-2 text-[9px] font-bold text-white/10 uppercase tracking-widest italic pt-2 group-hover/stat:text-white/30 transition-colors">
                    <div className="size-1 rounded-full animate-pulse" style={{ backgroundColor: card.color }} /> {card.sub}
                </div>
           </motion.div>
        ))}
      </div>

      {/* 🚀 OMNICORE VISUAL NEXUS (Industrial Topology) */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Cpu size={24} className="text-primary" />
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">OmniCore <span className="text-primary italic">Visual Nexus</span></h3>
          </div>
          <div className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] flex items-center gap-2">
             <div className="size-1.5 rounded-full bg-primary animate-ping" />
             Topology Sync: Nominal
          </div>
        </div>
        <OmniCoreTopology />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Nodes Matrix */}
        <motion.div variants={itemVariants} className="lg:col-span-8 glass-industrial rounded-[4rem] p-12 space-y-10 border border-white/5 shadow-2xl relative overflow-hidden group matrix-grid-bg">
            <div className="absolute -top-24 -right-24 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-[2000ms] group-hover:rotate-12">
                <Server size={440} className="text-white" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                         <div className="size-1.5 rounded-full bg-primary animate-ping" />
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">Live Signal: Active</span>
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tight text-white italic text-glow">System Activity <span className="text-primary/40">Nodes</span></h3>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic mt-2">Industrial Event Ledger v4.2 · Sync Mode: Global</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all shadow-xl">Audit Ledger</button>
                    <button className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><XCircle size={18} /></button>
                </div>
            </div>

            <div className="space-y-5 relative z-10">
                {(stats?.recentUsers || [
                    { id: '1', displayName: 'System Controller', createdAt: new Date() },
                    { id: '2', displayName: 'Auth Proxy Node', createdAt: new Date() },
                    { id: '3', displayName: 'Treasury Validator', createdAt: new Date() }
                ]).map((user: any, i: number) => (
                    <div key={user.id || i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-between group/node hover:bg-white/[0.06] hover:border-red-500/20 transition-all duration-500 card-glow relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-1 bg-red-500 scale-y-0 group-hover/node:scale-y-100 transition-transform duration-500" />
                        
                        <div className="flex items-center gap-10">
                            <div className="size-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary italic font-black text-2xl group-hover/node:border-red-500/40 transition-all shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/node:opacity-100 transition-opacity" />
                                {user.displayName?.substring(0, 2).toUpperCase() || 'RG'}
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter line-clamp-1 group-hover/node:text-primary transition-colors">{user.displayName || 'System Sync Node Activated'}</h4>
                                <div className="flex items-center gap-5 mt-2.5">
                                    <span className="text-[11px] text-white/20 font-black uppercase tracking-widest italic">{user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : 'RECENT_POLL'} • PROTOCOL: AUTH</span>
                                    <div className="px-3 py-1 bg-red-500/10 text-red-500 text-[9px] font-black uppercase rounded-lg border border-red-500/20 shadow-sm shadow-red-500/10">Authorized Node</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="hidden sm:block text-right">
                                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Signal Strength</div>
                                 <div className="flex gap-1 mt-1 justify-end">
                                     {[1, 2, 3, 4].map(b => (
                                         <div key={b} className={`h-3 w-1 rounded-full ${i % 2 === 0 && b > 2 ? 'bg-white/10' : 'bg-primary shadow-[0_0_8px_#00ff9d]'}`} />
                                     ))}
                                 </div>
                             </div>
                             <button className="size-16 glass-premium rounded-3xl flex items-center justify-center text-white/20 group-hover/node:text-primary transition-all group-hover/node:bg-white active:scale-95 shadow-xl">
                                <ChevronRight size={24} />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

        {/* Strategic Oversight Section */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-10">
            <GlassCard className="!p-12 space-y-10 bg-red-500/[0.03] border-red-500/20 relative overflow-hidden group shadow-[0_0_80px_rgba(239,68,68,0.05)]">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-[0.08]">
                    <Shield size={240} className="text-red-500" />
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                    <div className="p-5 bg-red-500/10 rounded-3xl border border-red-500/20 shadow-inner group-hover:scale-110 transition-transform">
                        <Shield size={32} className="text-red-500 drop-shadow-[0_0_10px_#ef4444]" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black tracking-widest uppercase text-emerald-500 shadow-xl shadow-emerald-500/10 italic">Secure Vector</div>
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Node Cluster: ARCH-01</span>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <h4 className="text-4xl font-black uppercase tracking-tighter text-white italic leading-none">Oversight <br/> <span className="text-red-500">Master</span></h4>
                    <p className="text-[11px] text-white/40 font-black uppercase tracking-[0.2em] italic leading-relaxed pt-2">
                        Global access control matrix synchronized. 100% of network traffic validated through Red Griffin Shield protocol v5.0.
                    </p>
                </div>

                <div className="pt-4 relative z-10 space-y-4">
                    <button className="w-full py-6 bg-white text-bg-dark rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3">
                        <Zap size={18} fill="currentColor" /> Matrix Pulse
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Audit RBAC</button>
                        <button className="py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Logs Mode</button>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="!p-12 space-y-8 group border-primary/20 relative overflow-hidden bg-primary/[0.01]">
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <Activity size={24} className="text-primary animate-pulse" />
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic">Node Latency</h4>
                   <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Global Matrix Sync</p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-primary font-mono drop-shadow-[0_0_12px_#00ff9d]">12.4ms</span>
                 </div>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px] relative shadow-inner">
                        <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-gradient-to-r from-primary via-white to-primary rounded-full shadow-[0_0_15px_rgba(0,255,157,0.6)]" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors italic">
                        <span>Architecture Drift</span>
                        <span className="text-primary/60">NOMINAL (0.00%)</span>
                    </div>
                 </div>
            </GlassCard>

            <div className="p-12 glass-industrial border border-white/5 rounded-[4rem] relative overflow-hidden group active:scale-95 transition-all cursor-pointer shadow-2xl hover:border-red-500/20 matrix-grid-bg">
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/40 group-hover:text-red-500 transition-colors italic">Registry Engine</p>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Verify Nodes</h4>
                    </div>
                    <div className="size-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-700">
                        <Cpu size={36} className="text-white/10 group-hover:text-white transition-colors group-hover:rotate-180 duration-1000" />
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const Settings = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
