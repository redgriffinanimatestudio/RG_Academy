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
  LockIcon,
  Eye,
  FileSearch,
  Key,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AdminDashboard() {
  const { lang } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'dashboard';

  const theme = {
    bg: '#0a0a0a',
    bg2: '#111',
    bg3: '#181818',
    bg4: '#222',
    accent: '#ef4444', // Admin Red
    border: '#2a2a2a',
    text: '#e8e6df',
    text2: '#888',
    text3: '#555'
  };

  useEffect(() => {
    if (user) {
      userService.getProfile(user.uid).then(setUserProfile);
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ef4444]" /></div>;
  if (!user || (userProfile && !adminService.isAdmin(userProfile.roles))) return <Navigate to={`/${lang || 'eng'}`} />;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout, color: theme.accent },
    { type: 'section', label: 'User Ops' },
    { id: 'users_directory', label: 'Directory', icon: Users, color: '#378add' },
    { id: 'roles_&_rbac', label: 'RBAC Control', icon: Key, color: '#7f77dd' },
    { id: 'access_logs', label: 'Access Logs', icon: History, color: '#888' },
    { type: 'section', label: 'Content' },
    { id: 'course_moderation', label: 'Courses', icon: Video, color: '#1d9e75' },
    { id: 'studio_review', label: 'Studio', icon: Box, color: '#ef9f27' },
    { id: 'reports', label: 'Reports', icon: FileSearch, color: theme.accent },
    { type: 'section', label: 'System' },
    { id: 'server_status', label: 'Health', icon: Server, color: '#00f5d4' },
    { id: 'api_logs', label: 'API Logs', icon: Cpu, color: '#378add' },
    { id: 'backups', label: 'Backups', icon: Database, color: '#ef9f27' },
  ];

  const handleModuleChange = (id: string) => {
    setSearchParams({ view: id });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e8e6df] font-sans selection:bg-red-500/30 overflow-hidden h-screen">
      {/* SIDEBAR */}
      <aside className="w-[240px] bg-[#111] border-r border-[#2a2a2a] flex flex-col h-full shrink-0 z-50">
        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="size-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white tracking-tighter shadow-lg shadow-red-500/20">RG</div>
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight truncate">Red Griffin</div>
            <div className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-none mt-1">Administrator</div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item, idx) => {
            if (item.type === 'section') return <div key={idx} className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">{item.label}</div>;
            const Icon = item.icon as any;
            const isActive = activeModule === item.id;
            return (
              <button key={item.id} onClick={() => handleModuleChange(item.id)} className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all relative group ${isActive ? 'text-red-500 bg-red-500/5' : 'text-[#888] hover:text-[#e8e6df] hover:bg-white/5'}`}>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />}
                <div className="size-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="flex-1 text-left uppercase tracking-widest text-[10px] font-black truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a] bg-black/20 flex items-center gap-3">
          <div className="size-8 rounded-full bg-red-500/10 flex items-center justify-center text-[10px] font-black text-red-500 shrink-0">AD</div>
          <div className="min-w-0"><div className="text-xs font-bold truncate">Super Admin</div><div className="text-[9px] text-[#555] truncate font-black uppercase tracking-widest">{user?.email}</div></div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <div className="text-sm font-bold uppercase tracking-tight">{activeModule.replace(/_/g, ' ')}</div>
            <div className="text-[9px] text-[#555] font-black uppercase tracking-widest">Core System / {activeModule === 'dashboard' ? 'Overview' : activeModule}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
              <Activity size={12} className="text-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Master Auth Mode</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            {activeModule === 'dashboard' && <AdminOverview theme={theme} />}
            {activeModule === 'users_directory' && <UsersDirectory theme={theme} />}
            {activeModule === 'server_status' && <ServerStatus theme={theme} />}
            {activeModule !== 'dashboard' && activeModule !== 'users_directory' && activeModule !== 'server_status' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 opacity-20">
                <Cpu size={64} className="mb-6" />
                <div className="text-[12px] font-black uppercase tracking-[0.5em]">{activeModule} View Initializing...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- ADMIN SUB-VIEWS ---

function AdminOverview({ theme }: any) {
  const metrics = [
    { label: 'Total Users', value: '4,821', change: '+134', trend: 'up', color: '#378add', p: 72 },
    { label: 'Platform Revenue', value: '$124,180', change: '+12%', trend: 'up', color: '#1d9e75', p: 85 },
    { label: 'System Load', value: '12%', change: 'Stable', trend: 'neu', color: '#00f5d4', p: 12 },
    { label: 'Open Reports', value: '8', change: '-2', trend: 'up', color: '#ef4444', p: 40 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5 space-y-4 hover:border-red-500/30 transition-all group">
            <div className="text-[9px] font-black text-[#555] uppercase tracking-widest">{m.label}</div>
            <div className="text-3xl font-black tracking-tighter text-[#e8e6df]">{m.value}</div>
            <div className={`text-[10px] font-bold flex items-center gap-1 ${m.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>{m.change}</div>
            <div className="h-1 bg-[#222] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${m.p}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: m.color }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6">Access Activity (24h)</div>
          <div className="h-64 flex items-end gap-2">
            {[30, 50, 40, 80, 60, 90, 70, 45, 55, 85, 100, 65, 40, 30, 20, 50, 70, 90, 100, 80, 60, 40, 30, 20].map((h, i) => (
              <div key={i} className="flex-1 bg-red-500/10 border-t border-red-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6">Recent Alerts</div>
          <div className="space-y-4">
            {[
              { t: 'Brute force attempt blocked', d: 'IP: 192.168.1.1', c: 'text-red-500' },
              { t: 'High memory usage on node-01', d: 'Current: 92%', c: 'text-orange-500' },
              { t: 'New staff role requested', d: 'User: alex@rg.ac', c: 'text-blue-500' },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <AlertCircle size={14} className={a.c} />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">{a.t}</div>
                  <div className="text-[9px] text-[#555] font-black uppercase mt-0.5">{a.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UsersDirectory({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111] p-4 border border-[#2a2a2a] rounded-xl">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={16} /><input className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg py-2 pl-10 pr-4 text-xs focus:border-red-500 outline-none" placeholder="Search all users..." /></div>
        <div className="flex gap-2"><button className="px-4 py-2 bg-[#222] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#333] hover:border-red-500">Export CSV</button></div>
      </div>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden"><table className="w-full text-left"><thead><tr className="bg-black/20 text-[9px] font-black text-[#555] uppercase tracking-widest"><th className="px-6 py-4">User</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Auth</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#2a2a2a]">{[1,2,3,4,5].map(i => <tr key={i} className="hover:bg-white/[0.01]"><td className="px-6 py-4 flex items-center gap-3"><div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40">U{i}</div><div><div className="text-xs font-bold text-white">System User {i}</div><div className="text-[10px] text-[#555] font-medium uppercase mt-0.5">student · lecturer</div></div></td><td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded-full">Verified</span></td><td className="px-6 py-4 text-[10px] text-[#555] font-black uppercase">Firebase · Google</td><td className="px-6 py-4 text-right flex justify-end gap-2"><button className="p-2 hover:text-red-500"><Lock size={14} /></button><button className="p-2 hover:text-red-500"><Edit size={14} /></button></td></tr>)}</tbody></table></div>
    </div>
  );
}

function ServerStatus({ theme }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { n: 'Compute Node A-01', s: 'Online', l: 12, m: 42, t: 'Frankfurt' },
        { n: 'Compute Node A-02', s: 'Online', l: 8, m: 38, t: 'Frankfurt' },
        { n: 'Storage Pool S-01', s: 'Healthy', l: 64, m: 12, t: 'Warsaw' },
      ].map((node, i) => (
        <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-[2rem] p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">{node.t} Cluster</div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{node.n}</h3>
            </div>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded">{node.s}</span>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-white/40"><span>CPU Load</span><span>{node.l}%</span></div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${node.l}%` }} /></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-white/40"><span>Memory</span><span>{node.m}%</span></div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${node.m}%` }} /></div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex gap-2">
            <button className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Restart</button>
            <button className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Logs</button>
          </div>
        </div>
      ))}
    </div>
  );
}
