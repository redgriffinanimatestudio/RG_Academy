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

export function AdminDashboardContent({ activeModule, theme, user }: any) {
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

// --- SUB-COMPONENTS ---

function AdminOverview({ theme, stats }: any) {
  const metrics = [
    { label: 'Пользователи', value: stats?.users || '4,821', change: '↑ +134 за неделю', color: theme.accent, icon: Users },
    { label: 'Курсов опубл.', value: stats?.courses || '312', change: '↑ +18 за месяц', color: '#378add', icon: Video },
    { label: 'Открытых проектов', value: stats?.projects || '87', change: '↓ −5 vs пред. нед.', color: '#ef9f27', icon: Box },
    { label: 'Доход (месяц)', value: stats?.revenue || '$24,180', change: '↑ +12%', color: '#1d9e75', icon: Zap },
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
              <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full" style={{ background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <Activity size={20} style={{ color: theme.accent }} /> System Activity
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">View All Logs</button>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '14:32', user: 'alex@gmail.com', action: 'role changed to lecturer', color: '#378add' },
              { time: '14:18', user: 'Maya Rigging', action: 'course published', color: '#1d9e75' },
              { time: '13:55', user: 'spam_user_042', action: 'banned by moderator', color: '#e24b4a' },
              { time: '12:11', user: 'CTR-441', action: 'contract created $4,800', color: '#ef9f27' }
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="text-[10px] font-black text-white/20 pt-1">{log.time}</div>
                <div className="space-y-1">
                  <div className="text-[11px] font-black uppercase text-white truncate">{log.user}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: log.color }}>{log.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <Layers size={20} style={{ color: theme.accent }} /> Role Distribution
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Student', val: 3760, p: 78, c: '#378add' },
              { label: 'Lecturer', val: 580, p: 12, c: '#1d9e75' },
              { label: 'Client', val: 340, p: 7, c: '#ef9f27' },
              { label: 'Executor', val: 117, p: 5, c: '#e24b4a' }
            ].map((r, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/40">{r.label}</span>
                  <span className="text-white">{r.val}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.p}%` }} className="h-full" style={{ background: r.c }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ theme }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase tracking-tight">User Directory</h3>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input className="bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/40" placeholder="Search users..." />
          </div>
          <button className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Add User</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
              <th className="pb-6">User Entity</th>
              <th className="pb-6">Role</th>
              <th className="pb-6">Status</th>
              <th className="pb-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              { n: 'Alex Kim', e: 'alex@gmail.com', r: 'lecturer', s: 'active', c: '#378add' },
              { n: 'Sara R.', e: 'sara@mail.ru', r: 'student', s: 'active', c: '#888' },
              { n: 'John D.', e: 'john@studio.io', r: 'executor', s: 'banned', c: '#e24b4a' }
            ].map((u, i) => (
              <tr key={i} className="group">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[10px]" style={{ color: u.c }}>{u.n.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-black text-white uppercase">{u.n}</div>
                      <div className="text-[10px] text-white/20 font-bold lowercase">{u.e}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6"><span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">{u.r}</span></td>
                <td className="py-6"><span className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${u.s === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}><div className={`size-1 rounded-full ${u.s === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} /> {u.s}</span></td>
                <td className="py-6 text-right"><button className="p-2 text-white/20 hover:text-white transition-colors"><MoreVertical size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSecurity({ theme }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
      <Lock size={48} className="mx-auto text-white/10" />
      <h3 className="text-xl font-black uppercase tracking-tight text-white/20">Access Control Matrix Locked</h3>
      <p className="text-[10px] text-white/10 font-black uppercase tracking-widest max-w-xs mx-auto">Re-authenticate to modify RBAC configuration and system policies</p>
      <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Verify Identity</button>
    </div>
  );
}

function AdminContent({ theme }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
      <Database size={48} className="mx-auto text-white/10" />
      <h3 className="text-xl font-black uppercase tracking-tight text-white/20">Global Content Repository</h3>
      <p className="text-[10px] text-white/10 font-black uppercase tracking-widest">312 Courses · 1,240 Lessons · 48GB Assets</p>
      <button className="px-8 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest">Audit Registry</button>
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
