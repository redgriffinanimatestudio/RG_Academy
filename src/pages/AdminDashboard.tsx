import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Layout, 
  Shield, 
  Settings, 
  Plus,
  FileText,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Cpu,
  Zap,
  Briefcase,
  Box,
  Video,
  ChevronRight,
  LogOut,
  Globe,
  Star,
  Clock,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Lock,
  MessageSquare,
  Send,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  Database,
  Cloud,
  HardDrive,
  History,
  Activity,
  Server,
  Key,
  FileSearch,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from '../context/AuthContext';

export function AdminDashboardContent({ activeModule, theme, user }: any) {
  return (
    <AnimatePresence mode="wait">
      {activeModule === 'dashboard' && <AdminOverview theme={theme} />}
      {activeModule === 'users_directory' && <UsersDirectory theme={theme} />}
      {activeModule === 'server_status' && <ServerStatus theme={theme} />}
      {activeModule !== 'dashboard' && activeModule !== 'users_directory' && activeModule !== 'server_status' && (
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center"
        >
          <Shield size={64} className="mb-6 text-red-500" />
          <div className="text-xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</div>
          <div className="text-sm mt-2 font-bold uppercase tracking-widest text-[#555]">Authorized Personnel Only</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminDashboard() {
  const { lang } = useParams();
  const { user, profile, activeRole, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'dashboard';

  const theme = {
    bg: '#0a0a0a',
    bg2: '#111',
    bg3: '#181818',
    bg4: '#222',
    accent: '#ef4444', // Red for Admin
    border: '#2a2a2a',
    text: '#e8e6df',
    text2: '#888',
    text3: '#555'
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
  if (!user || (profile && !adminService.isAdmin(profile.roles))) return <Navigate to={`/${lang || 'eng'}`} />;

  const handleModuleChange = (id: string) => {
    setSearchParams({ view: id });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e8e6df] font-sans selection:bg-red-500/30 overflow-hidden h-screen">
      {/* SIDEBAR - Full Integration from HTML */}
      <aside className="w-[240px] bg-[#111] border-r border-[#2a2a2a] flex flex-col h-full shrink-0 z-50">
        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="size-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white tracking-tighter shadow-lg shadow-red-500/20">RG</div>
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight truncate">Red Griffin</div>
            <div className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-none mt-1">Administrator</div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <div className="px-6 py-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Core</div>
          <SidebarItem id="dashboard" label="Dashboard" icon={Layout} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />
          
          <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">User Ops</div>
          <SidebarItem id="users_directory" label="Directory" icon={Users} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />
          <SidebarItem id="roles_rbac" label="RBAC Control" icon={Key} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />
          <SidebarItem id="access_logs" label="Access Logs" icon={History} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />

          <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Platform</div>
          <SidebarItem id="course_moderation" label="Courses" icon={Video} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />
          <SidebarItem id="studio_review" label="Studio" icon={Box} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />
          <SidebarItem id="reports" label="Reports" icon={FileSearch} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />

          <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">System</div>
          <SidebarItem id="server_status" label="Health" icon={Server} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />
          <SidebarItem id="api_logs" label="API Logs" icon={Cpu} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />
          <SidebarItem id="settings" label="Settings" icon={Settings} active={activeModule} accent={theme.accent} onChange={handleModuleChange} />
        </nav>

        <div className="p-4 border-t border-[#2a2a2a] bg-black/20 flex items-center gap-3">
          <div className="size-8 rounded-full bg-red-500/10 flex items-center justify-center text-[10px] font-black text-red-500 shrink-0">AD</div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate">Super Admin</div>
            <div className="text-[9px] text-[#555] truncate font-black uppercase tracking-widest">{user?.email}</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <div className="text-sm font-bold uppercase tracking-tight">{activeModule.replace(/_/g, ' ')}</div>
            <div className="text-[9px] text-[#555] font-black uppercase tracking-widest">Master Auth Mode</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative size-8 border border-[#333] rounded-lg flex items-center justify-center text-[#888] hover:text-red-500 cursor-pointer transition-colors">
              <Bell size={14} />
              <div className="absolute top-1.5 right-1.5 size-1.5 bg-red-500 rounded-full border border-[#111]" />
            </div>
            <button className="h-8 px-4 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
              System Control
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            {activeModule === 'dashboard' && <AdminOverview theme={theme} />}
            {activeModule === 'users_directory' && <UsersDirectory theme={theme} />}
            {activeModule === 'server_status' && <ServerStatus theme={theme} />}
            {activeModule !== 'dashboard' && activeModule !== 'users_directory' && activeModule !== 'server_status' && (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center"
              >
                <Shield size={64} className="mb-6 text-red-500" />
                <div className="text-xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</div>
                <div className="text-sm mt-2 font-bold uppercase tracking-widest text-[#555]">Authorized Personnel Only</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTS ---

function SidebarItem({ id, label, icon: Icon, active, accent, onChange }: any) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onChange(id)}
      className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all relative group ${
        isActive ? 'text-red-500 bg-red-500/5' : 'text-[#888] hover:text-[#e8e6df] hover:bg-white/5'
      }`}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />}
      <Icon size={14} className={isActive ? 'text-red-500' : 'text-[#555] group-hover:text-[#888]'} />
      <span className="flex-1 text-left uppercase tracking-widest text-[10px] font-black truncate">{label}</span>
    </button>
  );
}

function AdminOverview({ theme }: any) {
  const metrics = [
    { label: 'Total Users', value: '4,821', change: '+134', trend: 'up', color: '#378add', p: 72 },
    { label: 'Platform Revenue', value: '$124,180', change: '+12%', trend: 'up', color: '#1d9e75', p: 85 },
    { label: 'System Load', value: '12%', change: 'Stable', trend: 'neu', color: '#00f5d4', p: 12 },
    { label: 'Active Reports', value: '8', change: '-2', trend: 'up', color: '#ef4444', p: 40 },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5 space-y-4 hover:border-red-500/30 transition-all group shadow-xl">
            <div className="text-[9px] font-black text-[#555] uppercase tracking-widest group-hover:text-[#888] transition-colors">{m.label}</div>
            <div className="text-3xl font-black tracking-tighter text-[#e8e6df]">{m.value}</div>
            <div className={`text-[10px] font-bold flex items-center gap-1 ${m.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>{m.change}</div>
            <div className="h-1 bg-[#222] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${m.p}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl p-6">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6">Traffic Analysis (24h)</div>
          <div className="h-64 flex items-end gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 55, 40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 55].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-red-500/10 border-t border-red-500/20 rounded-t-sm" />
            ))}
          </div>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6 text-[#888]">Live Audit Log</div>
          <div className="space-y-1">
            {[
              { time: '14:32', icon: 'R', color: '#378add', bg: 'rgba(55,138,221,.12)', title: 'alex@rg.ac role change', desc: 'Manager → Chief' },
              { time: '14:18', icon: 'C', color: '#1d9e75', bg: 'rgba(29,158,117,.12)', title: 'Course Published', desc: 'Maya Rigging Level 2' },
              { time: '13:55', icon: 'B', color: '#ef4444', bg: 'rgba(239,68,68,.12)', title: 'System Security Alert', desc: 'Brute force IP blocked' },
              { time: '12:11', icon: '$', color: '#ef9f27', bg: 'rgba(239,159,39,.12)', title: 'Payout #441 Released', desc: '$4,800 · Alex R.' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors group cursor-default">
                <div className="text-[10px] font-black text-[#555] pt-1 group-hover:text-[#888] shrink-0">{log.time}</div>
                <div className="size-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 border border-white/5 shadow-lg" style={{ background: log.bg, color: log.color }}>{log.icon}</div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white/80 group-hover:text-white transition-colors truncate">{log.title}</div>
                  <div className="text-[9px] text-[#555] font-black uppercase tracking-widest truncate mt-0.5">{log.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersDirectory({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111] p-4 border border-[#2a2a2a] rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
          <input className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg py-2 pl-10 pr-4 text-xs focus:border-red-500 outline-none" placeholder="Search master directory..." />
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 border border-[#333] rounded-lg text-[10px] font-black uppercase tracking-widest text-[#888] hover:border-red-500 hover:text-red-500">Filter</button>
          <button className="h-9 px-4 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">+ Add User</button>
        </div>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/40 text-[9px] font-black text-[#555] uppercase tracking-widest"><th className="px-8 py-5">System Entity</th><th className="px-8 py-5">Role Identity</th><th className="px-8 py-5">Auth Status</th><th className="px-8 py-5 text-right">Master Control</th></tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/20 group-hover:text-red-500 transition-colors">U{i}</div>
                    <div><div className="text-xs font-bold text-white">Red Griffin Admin {i}</div><div className="text-[10px] text-[#555] font-black uppercase mt-0.5">admin@rg.ac</div></div>
                  </div>
                </td>
                <td className="px-8 py-6"><span className="px-2 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded border border-red-500/20 tracking-tighter">Superadmin</span></td>
                <td className="px-8 py-6"><div className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" /><span className="text-[10px] font-bold text-white/40">Verified Local</span></div></td>
                <td className="px-8 py-6 text-right flex justify-end gap-2 pt-7"><button className="p-2 hover:text-red-500 transition-colors"><ShieldCheck size={14} /></button><button className="p-2 hover:text-red-500 transition-colors"><Settings size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServerStatus({ theme }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { n: 'Main Core Cluster', s: 'Online', l: 12, m: 42, t: 'Frankfurt-01' },
        { n: 'Storage Node Alpha', s: 'Healthy', l: 64, m: 12, t: 'Warsaw-02' },
        { n: 'Auth Gateway', s: 'Secure', l: 4, m: 28, t: 'Dublin-01' },
      ].map((node, i) => (
        <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px] group-hover:bg-red-500/10 transition-all" />
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">{node.t} Node</div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">{node.n}</h3>
            </div>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded border border-emerald-500/20">{node.s}</span>
          </div>
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-white/20"><span>CPU Processor Load</span><span>{node.l}%</span></div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${node.l}%` }} transition={{ duration: 1.5, delay: i * 0.2 }} className="h-full bg-red-500" /></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-white/20"><span>Memory Bank Usage</span><span>{node.m}%</span></div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${node.m}%` }} transition={{ duration: 1.5, delay: i * 0.2 + 0.3 }} className="h-full bg-blue-500" /></div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 flex gap-3 relative z-10">
            <button className="flex-1 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 hover:bg-white/10 transition-all">Restart</button>
            <button className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 hover:scale-105 transition-all">Emergency</button>
          </div>
        </div>
      ))}
    </div>
  );
}
