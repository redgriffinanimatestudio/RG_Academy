import React, { useState } from 'react';
import { Users, Box, Zap, Activity, Search, Filter, Shield, MoreVertical, Edit2, Trash2, CheckCircle, XCircle, ChevronRight, LayoutDashboard, Database, Lock, UserPlus, Download } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StatCard, SectionHeader, GlassCard } from '../../../components/dashboard/shared/DashboardUI';

interface AdminDashboardProps {
  stats?: any;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'overview';
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Mock users for the detailed view
  const mockUsers = [
    { id: '1', email: 'admin@redgriffin.academy', displayName: 'System Architect', role: 'admin', status: 'active', lastLogin: '2 mins ago' },
    { id: '2', email: 'lecturer@example.com', displayName: 'Alex Rivers', role: 'lecturer', status: 'active', lastLogin: '1 hour ago' },
    { id: '3', email: 'student@example.com', displayName: 'New Artist', role: 'student', status: 'active', lastLogin: 'Just now' },
    { id: '4', email: 'chief@redgriffin.academy', displayName: 'Elena Vance', role: 'chief_manager', status: 'active', lastLogin: 'Yesterday' },
  ];

  if (currentView === 'users') {
    return (
      <div className="flex flex-col xl:flex-row gap-6 min-h-[80vh]">
        {/* Central Panel: User Management */}
        <div className="flex-1 space-y-6 sm:space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white italic">
                User <span className="text-red-500">Registry</span>
              </h1>
              <p className="text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1">
                Manage ecosystem identities and permissions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-red-500/20">
                <UserPlus size={14} /> Add User
              </button>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                <Download size={16} />
              </button>
            </div>
          </header>

          {/* Search & Filter Bar */}
          <GlassCard className="!p-3 sm:!p-4 flex flex-col md:flex-row items-center gap-3 sm:gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Search entities..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest outline-none focus:border-red-500/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
                <Filter size={14} /> Filters
              </button>
              <select className="flex-1 md:flex-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[9px] font-black uppercase tracking-widest text-white/60 outline-none appearance-none cursor-pointer">
                <option>All Roles</option>
                <option>Admins</option>
                <option>Staff</option>
              </select>
            </div>
          </GlassCard>

          {/* Users Table */}
          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
            <div className="min-w-[600px] rounded-[2rem] border border-white/5 bg-white/[0.02] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/20">User Entity</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/20 hidden lg:table-cell">Primary Role</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/20 hidden sm:table-cell">Status</th>
                    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      onClick={() => setSelectedUser(user)}
                      className={`group cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-red-500/5' : 'hover:bg-white/[0.03]'}`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-xl flex items-center justify-center font-black italic text-xs shrink-0 ${user.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                            {user.displayName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-black text-white uppercase truncate">{user.displayName}</span>
                            <span className="text-[9px] text-white/20 font-bold lowercase truncate">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden lg:table-cell">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${user.role === 'admin' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-white/10 text-white/40'}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 text-white/20 hover:text-white transition-colors"><Edit2 size={14} /></button>
                          <button className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel: Active Intel & Actions */}
        <aside className="w-full xl:w-[320px] 2xl:w-[380px] shrink-0 space-y-6">
          <SectionHeader title="Control Panel" />
          
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <motion.div
                key={selectedUser.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <GlassCard className="!p-8 space-y-8 border-red-500/20 bg-red-500/[0.02]">
                  <div className="text-center space-y-4">
                    <div className="size-20 mx-auto rounded-3xl bg-red-500/20 flex items-center justify-center text-3xl font-black italic text-red-500 shadow-2xl shadow-red-500/20">
                      {selectedUser.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">{selectedUser.displayName}</h3>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">UID: {selectedUser.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black text-white/20 uppercase mb-1">Status</p>
                      <p className="text-[10px] font-black text-emerald-500 uppercase">Operational</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black text-white/20 uppercase mb-1">Access</p>
                      <p className="text-[10px] font-black text-white uppercase">{selectedUser.role}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                      <Shield size={14} className="text-red-500" /> Adjust Permissions
                    </button>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                      <Lock size={14} /> Reset Credentials
                    </button>
                    <button className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-3">
                      <XCircle size={14} /> Terminate Access
                    </button>
                  </div>
                </GlassCard>

                <GlassCard className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20">Recent Activity Log</h4>
                  <div className="space-y-3">
                    {[
                      { action: 'Login Success', time: '2 mins ago', icon: CheckCircle, color: 'text-emerald-500' },
                      { action: 'Permission Change', time: '1 hour ago', icon: Shield, color: 'text-amber-500' },
                      { action: 'Profile Update', time: 'Yesterday', icon: Activity, color: 'text-sky-500' }
                    ].map((log, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                        <log.icon size={12} className={log.color} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black text-white uppercase truncate">{log.action}</p>
                          <p className="text-[8px] text-white/20 font-bold uppercase">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                <div className="space-y-4">
                  <div className="size-16 mx-auto rounded-3xl bg-white/5 flex items-center justify-center text-white/10">
                    <Users size={32} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Select an entity<br/>to view details</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    );
  }

  if (currentView === 'security') {
    return (
      <div className="space-y-12">
        <header>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">
            Security <span className="text-red-500">& Permissions</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">
            Access Control Matrix & RBAC Configuration
          </p>
        </header>

        <GlassCard className="!p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System RBAC Matrix</h2>
                <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Ecosystem privilege mapping</p>
              </div>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                <Plus size={16} className="text-red-500" /> New Policy
              </button>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Module / Module</th>
                    <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 text-center">Admin</th>
                    <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 text-center">Chief</th>
                    <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 text-center">Manager</th>
                    <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { l: 'User Management', p: [3, 3, 2, 0] },
                    { l: 'Financial Systems', p: [3, 3, 1, 0] },
                    { l: 'Content Moderation', p: [3, 2, 3, 0] },
                    { l: 'System Architecture', p: [3, 1, 0, 0] },
                    { l: 'API Infrastructure', p: [3, 0, 0, 0] }
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="py-6 text-[12px] font-bold text-white/60 group-hover:text-white">{row.l}</td>
                      {row.p.map((p, j) => (
                        <td key={j} className="py-6">
                          <div className="flex justify-center">
                            <div className={`size-6 rounded-lg flex items-center justify-center ${p === 3 ? 'bg-emerald-500/20 text-emerald-500' : p === 2 ? 'bg-sky-500/20 text-sky-500' : p === 1 ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-white/10'}`}>
                              {p > 0 ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  // OVERVIEW (Default)
  const cards = [
    { label: 'Total Users', value: stats?.users || 0, icon: Users, color: 'blue-400' },
    { label: 'Active Projects', value: stats?.projects || 0, icon: Box, color: 'emerald-400' },
    { label: 'Revenue', value: `$${stats?.totalRevenue || 0}`, icon: Zap, color: 'amber-400' },
    { label: 'System Load', value: '0.42%', icon: Activity, color: 'rose-400' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">
          Master Control <span className="text-red-500">Engine</span>
        </h1>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">
          Full access to Red Griffin Creative Ecosystem
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} color={card.color.split('-')[0]} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader title="System Activity" />
          <GlassCard className="space-y-4">
            {(stats?.recentUsers || [1, 2, 3]).map((user: any, i: number) => (
              <div key={user.id || i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-colors">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary italic font-black">
                  {user.displayName?.substring(0, 2).toUpperCase() || 'RG'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white uppercase truncate">
                    {user.displayName || 'User Sync initiated'}
                  </p>
                  <p className="text-[10px] text-white/20 uppercase font-black mt-1">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Just now'} • Service: Auth
                  </p>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="space-y-6">
          <SectionHeader title="Security" />
          <GlassCard className="bg-red-500/5 border-red-500/10">
            <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-200">
              <p className="text-xs font-black uppercase tracking-widest">Shield Operational</p>
              <p className="text-[10px] mt-2 opacity-60 font-bold uppercase">No threats detected in the last 24h</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
