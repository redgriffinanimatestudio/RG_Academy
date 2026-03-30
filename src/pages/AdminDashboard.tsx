import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Box, Zap, Activity, Search, Filter, Shield, 
  MoreVertical, Edit2, Trash2, CheckCircle, XCircle, 
  ChevronRight, LayoutDashboard, Database, Lock, UserPlus, 
  Download, Bell, Rocket, Play, Award, Clock, Star, 
  Video, CreditCard, MessageSquare, Settings, Globe, Layers
} from 'lucide-react';
import { adminService } from '../services/adminService';

// --- ADMIN DASHBOARD CONTENT ---

export function AdminDashboardContentInternal({ activeModule, theme, user }: any) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    adminService.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeModule}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {activeModule === 'overview' && <AdminOverview theme={theme} stats={stats} />}
        {activeModule === 'users' && <AdminUsers theme={theme} />}
        {activeModule === 'security' && <AdminSecurity theme={theme} />}
        {activeModule === 'content_mgmt' && <AdminContent theme={theme} />}
        
        {!['overview', 'users', 'security', 'content_mgmt'].includes(activeModule) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <Shield size={64} className="mb-6" style={{ color: theme.accent }} />
            <h2 className="text-xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</h2>
            <p className="text-xs mt-2 uppercase tracking-widest">Master Control Node Operational</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Map it for backward compatibility or direct named export if preferred
export const AdminDashboardContent = AdminDashboardContentInternal;

// --- SUB-COMPONENTS ---

function AdminOverview({ theme, stats }: any) {
  const metrics = [
    { label: 'Пользователи', value: stats?.users || '0', change: 'Ecosystem Total', color: theme.accent, icon: Users },
    { label: 'Курсов опубл.', value: stats?.courses || '0', change: 'Live Workshops', color: '#378add', icon: Video },
    { label: 'Открытых проектов', value: stats?.projects || '0', change: 'Studio Pipeline', color: '#ef9f27', icon: Box },
    { label: 'Доход (всего)', value: stats?.totalRevenue ? `$${stats.totalRevenue.toLocaleString()}` : '$0', change: 'Platform Gross', color: '#1d9e75', icon: Zap },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-3xl p-6 space-y-4 group hover:border-white/10 transition-all shadow-2xl">
            <div className="flex justify-between items-start">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{m.label}</div>
              <m.icon size={18} style={{ color: m.color }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-black text-white tracking-tighter">{m.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: m.color }}>{m.change}</div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full" style={{ background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <Activity size={20} style={{ color: theme.accent }} /> Recent Entity Activity
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">View All Logs</button>
          </div>
          
          <div className="space-y-4">
            {stats?.recentUsers?.map((log: any, i: number) => (
              <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="text-[10px] font-black text-white/20 pt-1">{new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="space-y-1">
                  <div className="text-[11px] font-black uppercase text-white truncate">{log.displayName || log.email}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-primary">New entity registered in ecosystem</div>
                </div>
              </div>
            )) || <div className="py-10 text-center text-[10px] font-black text-white/10 uppercase tracking-widest">No recent activity detected</div>}
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <Layers size={20} style={{ color: theme.accent }} /> Role Distribution Breakdown
          </h3>
          <div className="space-y-6">
            {stats?.roleDistribution?.map((r: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/40">{r.label}</span>
                  <span className="text-white">{r.val}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(r.val / stats.users) * 100}%` }} className="h-full" style={{ background: r.c }} />
                </div>
              </div>
            )) || <div className="py-10 text-center text-[10px] font-black text-white/10 uppercase tracking-widest">Calculating distribution...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ theme }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(page, search, roleFilter);
      setUsers(data.users);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleRole = async (user: any, roleToToggle: string) => {
    try {
      let roles = [];
      try {
        roles = JSON.parse(user.roles || '[]');
      } catch (e) {
        roles = [user.role];
      }
      
      if (roles.includes(roleToToggle)) {
        roles = roles.filter((r: string) => r !== roleToToggle);
      } else {
        roles.push(roleToToggle);
      }

      const mainRole = roles[0] || 'student';
      await adminService.updateUserRole(user.id, mainRole, roles);
      fetchUsers();
    } catch (e) {
      console.error('Failed to update role', e);
    }
  };

  const availableRoles = ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'lecturer', 'client', 'executor', 'student'];

  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h3 className="text-2xl font-black uppercase tracking-tight">User Directory</h3>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/40 w-full" 
              placeholder="Search users..." 
            />
          </form>
          <button 
            onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <UserPlus size={14} /> Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
              <th className="pb-6">User Entity</th>
              <th className="pb-6">Active Roles</th>
              <th className="pb-6">Manage Roles</th>
              <th className="pb-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center text-white/10 uppercase font-black tracking-widest">Loading Users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="py-20 text-center text-white/10 uppercase font-black tracking-widest">No entities found</td></tr>
            ) : users.map((u) => {
              let userRoles = [];
              try {
                userRoles = JSON.parse(u.roles || '[]');
              } catch (e) {
                userRoles = [u.role];
              }

              return (
                <tr key={u.id} className="group">
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[10px] uppercase text-primary">
                        {u.displayName?.charAt(0) || u.email.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase">{u.displayName || 'Unnamed Entity'}</div>
                        <div className="text-[10px] text-white/20 font-bold lowercase">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex flex-wrap gap-2">
                      {userRoles.map((r: string) => (
                        <span key={r} className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {['admin', 'manager', 'moderator', 'lecturer', 'student'].map(r => (
                        <button 
                          key={r}
                          onClick={() => toggleRole(u, r)}
                          className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter transition-all ${userRoles.includes(r) ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/20 hover:bg-white/10'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <button 
                      onClick={() => { setEditingUser(u); setIsModalOpen(true); }}
                      className="p-2 text-white/20 hover:text-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {total > users.length && (
        <div className="flex justify-center gap-4 pt-8">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20">Prev</button>
          <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20">Next</button>
        </div>
      )}

      {isModalOpen && (
        <UserModal 
          user={editingUser} 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => { setIsModalOpen(false); fetchUsers(); }}
          theme={theme}
        />
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSave, theme }: any) {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    role: user?.role || 'student'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (user) {
        await adminService.updateUser(user.id, formData);
      } else {
        await adminService.createUser(formData);
      }
      onSave();
    } catch (e) {
      console.error(e);
      alert('Action failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
      >
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-black uppercase tracking-tight">{user ? 'Edit Entity' : 'Provision New Entity'}</h3>
          <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Ecosystem Management Node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Display Name</label>
            <input 
              required
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary/40 transition-colors"
              placeholder="e.g. Alex Griffin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Network Email</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary/40 transition-colors"
              placeholder="alex@redgriffin.academy"
            />
          </div>
          {!user && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-2">Primary Role</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary/40 transition-colors uppercase"
              >
                {['admin', 'manager', 'moderator', 'lecturer', 'student', 'client', 'executor'].map(r => (
                  <option key={r} value={r} className="bg-[#111]">{r}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
              {loading ? 'Processing...' : user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AdminSecurity({ theme }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Shield size={32} className="text-primary" />
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Access Control Matrix</h3>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Global RBAC configuration and permission hierarchy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { role: 'Admin', desc: 'Full system access, billing, and database control.', color: '#ef4444' },
            { role: 'Chief Manager', desc: 'Strategy hub, staff performance, and global analytics.', color: '#7f77dd' },
            { role: 'Manager', desc: 'Course reviews, project pipelines, and content moderation.', color: '#1d9e75' },
            { role: 'Moderator', desc: 'User reports, comment cleanup, and review handling.', color: '#ef9f27' },
          ].map((r, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full" style={{ background: r.color }} />
                <div className="text-sm font-black uppercase text-white">{r.role}</div>
              </div>
              <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed">{r.desc}</p>
              <div className="h-px bg-white/5" />
              <button className="text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">Edit Permissions</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminContent({ theme }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCourses(page);
      setCourses(data.courses);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page]);

  const updateStatus = async (courseId: string, status: string) => {
    try {
      await adminService.updateCourseStatus(courseId, status);
      fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
          <Database size={24} style={{ color: theme.accent }} /> Content Repository
        </h3>
        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{total} Global Workshops</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
              <th className="pb-6">Workshop Item</th>
              <th className="pb-6">Stats</th>
              <th className="pb-6">Status</th>
              <th className="pb-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center text-white/10 uppercase font-black tracking-widest">Accessing Repository...</td></tr>
            ) : courses.length === 0 ? (
              <tr><td colSpan={4} className="py-20 text-center text-white/10 uppercase font-black tracking-widest">Repository Empty</td></tr>
            ) : courses.map((c) => (
              <tr key={c.id} className="group">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-white/5 overflow-hidden border border-white/5">
                      {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase truncate max-w-[200px]">{c.title}</div>
                      <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{c.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6">
                  <div className="text-[10px] font-black text-white/40 uppercase space-y-1">
                    <div>{c._count?.lessons || 0} Lessons</div>
                    <div>{c._count?.enrollments || 0} Students</div>
                  </div>
                </td>
                <td className="py-6">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    c.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 
                    c.status === 'draft' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-white/40'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-6 text-right">
                  <div className="flex justify-end gap-2">
                    {c.status !== 'published' && (
                      <button onClick={() => updateStatus(c.id, 'published')} className="p-2 text-white/20 hover:text-emerald-500 transition-colors"><CheckCircle size={16} /></button>
                    )}
                    {c.status === 'published' && (
                      <button onClick={() => updateStatus(c.id, 'draft')} className="p-2 text-white/20 hover:text-amber-500 transition-colors"><XCircle size={16} /></button>
                    )}
                    <button className="p-2 text-white/20 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function AdminDashboard({ stats }: any) {
  return (
    <div className="p-8">
      <AdminDashboardContent activeModule="overview" theme={{ accent: '#ef4444' }} stats={stats} />
    </div>
  );
}
