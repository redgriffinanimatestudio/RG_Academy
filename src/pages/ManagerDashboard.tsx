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
  MessageSquare,
  Send,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckCircle,
  Eye,
  FileEdit,
  Archive,
  Mail,
  Phone,
  Calendar,
  Lock,
  ThumbsDown,
  Flag,
  LayoutDashboard,
  ClipboardCheck,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function ManagerDashboardContent({ activeModule, theme }: any) {
  return (
    <AnimatePresence mode="wait">
      {activeModule === 'overview' && <ManagerOverview theme={theme} />}
      {activeModule === 'courses_review' && <CoursesReview theme={theme} />}
      {activeModule === 'student_feedback' && <StudentFeedbackView theme={theme} />}
      {activeModule === 'project_board' && <ProjectBoardView theme={theme} />}
      {activeModule === 'contract_status' && <ContractStatusView theme={theme} />}
      {activeModule === 'escrow_alerts' && <EscrowAlertsView theme={theme} />}
      {activeModule === 'user_list' && <UserListView theme={theme} />}
      {activeModule === 'role_requests' && <RoleRequestsView theme={theme} />}
      
      {activeModule !== 'overview' && activeModule !== 'courses_review' && activeModule !== 'student_feedback' && activeModule !== 'project_board' && activeModule !== 'contract_status' && activeModule !== 'escrow_alerts' && activeModule !== 'user_list' && activeModule !== 'role_requests' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center">
          <Box size={64} className="mb-6" />
          <div className="text-xl font-black uppercase tracking-[0.5em]">{activeModule} Module</div>
          <div className="text-sm mt-2">Section content coming soon...</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ... existing code for ManagerOverview and CoursesReview ...

function StudentFeedbackView({ theme }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg. Course Rating" value="4.82" sub="↑ 0.12 this mo" icon={Star} accent={theme.accent} />
        <StatCard label="Total Reviews" value="1,240" sub="84 new this wk" icon={MessageSquare} accent="#378add" />
        <StatCard label="Flagged Reviews" value="3" sub="Requires attention" icon={Flag} accent="#ef4444" />
        <StatCard label="Response Rate" value="92%" sub="Avg. 2h response" icon={Zap} accent="#00f5d4" />
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 shadow-2xl space-y-8">
        <h3 className="text-xl font-black uppercase tracking-tight">Recent Student Reviews</h3>
        <div className="grid gap-4">
          {[
            { user: 'Alex R.', course: 'Houdini FX Vol.1', rating: 5, comment: 'Incredible depth! Exactly what I needed for my reel.', status: 'Public' },
            { user: 'Sarah L.', course: 'Character Design', rating: 4, comment: 'Great course, but some videos have audio issues.', status: 'Reviewing' },
            { user: 'Mike V.', course: 'Unreal Shaders', rating: 2, comment: 'The assets are missing from the download link.', status: 'Flagged' }
          ].map((r, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
              <div className="flex items-center gap-6">
                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-white/40">{r.user.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white uppercase tracking-tight">{r.user}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => <Star key={j} size={10} fill={j < r.rating ? theme.accent : "transparent"} stroke={j < r.rating ? theme.accent : "white"} className="opacity-40" />)}
                    </div>
                  </div>
                  <div className="text-[10px] text-[#555] font-black uppercase mt-1">Course: {r.course}</div>
                  <p className="text-[11px] text-white/60 mt-2">"{r.comment}"</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border ${r.status === 'Flagged' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-white/5 border-white/10 text-[#555]'}`}>{r.status}</span>
                <button className="px-4 py-2 bg-[#1d9e75] text-white rounded-xl text-[9px] font-black uppercase">Action</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectBoardView({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-tight">Global Studio Kanban</h3>
        <div className="flex gap-4">
          <button className="h-10 px-6 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">+ Create Project</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {[
          { label: 'Discovery', count: 4, c: '#378add', tasks: ['Project Nebula', 'CGI Ad Concept'] },
          { label: 'Active Prod', count: 12, c: '#7f77dd', tasks: ['Project Phoenix', 'Asset Pack 14'] },
          { label: 'Post-Prod', count: 7, c: '#1d9e75', tasks: ['Film Grade V2', 'Sound Master'] }
        ].map((col, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-6 space-y-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full" style={{ background: col.c }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">{col.label}</span>
              </div>
              <span className="text-[10px] font-black text-white/20">{col.count}</span>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
              {col.tasks.map((task, j) => (
                <div key={j} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 group hover:border-white/10 transition-all cursor-pointer">
                  <div className="text-xs font-black text-white uppercase tracking-tight">{task}</div>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1,2].map(u => <div key={u} className="size-6 rounded-full border-2 border-[#111] bg-[#181818] text-[8px] flex items-center justify-center font-black">U{u}</div>)}
                    </div>
                    <div className="text-[9px] font-black text-[#555] uppercase tracking-widest">3 Days Left</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContractStatusView({ theme }: any) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-[#2a2a2a] bg-black/20 flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-widest">Master Studio Contracts</h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#555] hover:text-white transition-all">Filter: Overdue</button>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-black/20 text-[9px] font-black text-[#555] uppercase tracking-widest">
            <th className="px-8 py-5">Studio Client</th>
            <th className="px-8 py-5">Assigned Expert</th>
            <th className="px-8 py-5">Milestone Status</th>
            <th className="px-8 py-5 text-right">Ops Control</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {[1,2,3,4,5].map(i => (
            <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
              <td className="px-8 py-6">
                <div className="text-xs font-black text-white uppercase tracking-tight">Nebula Studio {i}</div>
                <div className="text-[9px] text-[#555] font-black uppercase mt-0.5 tracking-widest">Active Ad Production</div>
              </td>
              <td className="px-8 py-6">
                <div className="text-xs font-bold text-[#888]">Alex Rover</div>
                <div className="text-[9px] font-black text-emerald-500 uppercase mt-0.5 tracking-widest">Verified Expert</div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1d9e75]" style={{ width: i*20 + '%' }} />
                  </div>
                  <span className="text-[9px] font-black text-[#555]">{i*20}%</span>
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <button className="p-2 text-[#555] hover:text-white transition-colors"><MoreVertical size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EscrowAlertsView({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Pending Release', val: '$42,400', c: '#ef9f27' },
          { label: 'Disputed Funds', val: '$2,100', c: '#ef4444' }
        ].map((f, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl overflow-hidden relative group">
            <div className="relative z-10">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-2">{f.label}</div>
              <div className="text-3xl font-black text-white tracking-tighter">{f.val}</div>
            </div>
            <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors relative z-10">
              <AlertTriangle size={32} style={{ color: f.c }} />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10" style={{ background: f.c }} />
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 shadow-2xl">
        <h3 className="text-xl font-black uppercase tracking-tight mb-8">Escrow Anomaly Log</h3>
        <div className="space-y-4">
          {[1,2].map(i => (
            <div key={i} className="p-6 bg-red-500/[0.02] border border-red-500/10 rounded-3xl flex items-center justify-between group hover:border-red-500/20 transition-all">
              <div className="flex items-center gap-6">
                <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500"><AlertCircle size={24} /></div>
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-tight">Payment Dispute: Contract #{i}422</div>
                  <div className="text-[10px] text-[#555] font-black uppercase mt-1 tracking-widest">Studio reported incomplete milestones. $1,200 Held.</div>
                </div>
              </div>
              <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Mediate</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserListView({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111] p-4 border border-[#2a2a2a] rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
          <input className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl py-2 pl-10 pr-4 text-[11px] font-black uppercase tracking-widest focus:border-[#1d9e75] outline-none" placeholder="Search user directory..." />
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-6 bg-[#181818] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-white transition-all">Export Directory</button>
        </div>
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/40 text-[9px] font-black text-[#555] uppercase tracking-widest">
              <th className="px-8 py-6">User Identity</th>
              <th className="px-8 py-6">Account Mode</th>
              <th className="px-8 py-6">Security Status</th>
              <th className="px-8 py-6 text-right">Access Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {[
              { name: 'Alex Rover', mode: 'Expert/Executor', status: 'Verified', c: '#1d9e75' },
              { name: 'Sarah Chen', mode: 'Studio Client', status: 'Active', c: '#7f77dd' },
              { name: 'Mark Voronin', mode: 'Senior Student', status: 'Active', c: '#378add' }
            ].map((user, i) => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-[11px] group-hover:text-[#1d9e75] transition-colors">{user.name.charAt(0)}</div>
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-tight">{user.name}</div>
                      <div className="text-[10px] text-[#555] font-black uppercase mt-0.5 tracking-widest">Member since 2023</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-xs font-bold text-white/80" style={{ color: user.c }}>{user.mode}</div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-[#888]">{user.status}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleRequestsView({ theme }: any) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black uppercase tracking-tight">Role Elevation Requests</h3>
        <span className="text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">5 Pending Approval</span>
      </div>
      <div className="space-y-4">
        {[
          { user: 'Elena Sol', current: 'Student', target: 'Expert', reason: 'Verified reel with 5+ years experience.' },
          { user: 'Mike Rover', current: 'Guest', target: 'Studio Client', reason: 'Production house registration.' }
        ].map((req, i) => (
          <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-[#1d9e75]/20 transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm font-black text-white uppercase tracking-tight">{req.user}</span>
                <span className="text-[9px] font-black text-[#555] uppercase tracking-widest">{req.current} → {req.target}</span>
              </div>
              <p className="text-xs text-[#888] italic">"{req.reason}"</p>
            </div>
            <div className="flex gap-3 ml-8">
              <button className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500/20 transition-all">Reject</button>
              <button className="px-6 py-3 bg-[#1d9e75] text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-[#1d9e75]/20 hover:scale-105 transition-all">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }: any) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-[2rem] p-6 space-y-4 hover:border-white/10 transition-all shadow-xl group">
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{label}</div>
        <Icon size={18} style={{ color: accent }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{sub}</div>
    </div>
  );
}

export default function ManagerDashboard() {
  const { lang } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'overview';

  const theme = {
    bg: '#0a0a0a',
    bg2: '#111',
    bg3: '#181818',
    bg4: '#222',
    accent: '#1d9e75', // Manager Success Green
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d9e75]" /></div>;
  
  const isManager = userProfile?.roles.includes('manager') || userProfile?.roles.includes('admin') || userProfile?.roles.includes('chief_manager');
  if (!user || (userProfile && !isManager)) return <Navigate to={`/${lang || 'eng'}`} />;

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, color: theme.accent },
    { type: 'section', label: 'Academy Ops' },
    { id: 'courses_review', label: 'Courses Review', icon: ClipboardCheck, color: '#378add', badge: '7' },
    { id: 'student_feedback', label: 'Feedback', icon: MessageSquare, color: '#ef9f27' },
    { type: 'section', label: 'Studio Ops' },
    { id: 'project_board', label: 'Project Board', icon: Box, color: '#7f77dd' },
    { id: 'contract_status', label: 'Contracts', icon: Briefcase, color: '#00f5d4' },
    { id: 'escrow_alerts', label: 'Escrow Alerts', icon: AlertTriangle, color: '#e24b4a', badge: '2' },
    { type: 'section', label: 'Users' },
    { id: 'user_list', label: 'Directory', icon: Users, color: '#888' },
    { id: 'role_requests', label: 'Role Requests', icon: ShieldCheck, color: '#378add', badge: '5' },
  ];

  const handleModuleChange = (id: string) => {
    setSearchParams({ view: id });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e8e6df] font-sans selection:bg-[#1d9e75]/30 overflow-hidden h-screen">
      {/* SIDEBAR */}
      <aside className="w-[200px] bg-[#111] border-r border-[#2a2a2a] flex flex-col h-full shrink-0 z-50">
        <div className="p-6 border-b border-[#2a2a2a] mb-2">
          <div className="text-[15px] font-bold tracking-tight">Red Griffin</div>
          <div className="text-[11px] font-medium text-[#1d9e75] mt-0.5 uppercase tracking-widest">Operations</div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item, idx) => {
            if (item.type === 'section') return <div key={idx} className="px-4 pt-4 pb-1 text-[11px] font-black text-[#555] uppercase tracking-wider">{item.label}</div>;
            const Icon = item.icon as any;
            const isActive = activeModule === item.id;
            return (
              <button key={item.id} onClick={() => handleModuleChange(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 text-[13px] transition-all relative group ${isActive ? 'text-white bg-[#181818] font-medium border-l-2 border-[#1d9e75]' : 'text-[#888] hover:text-white hover:bg-[#181818]'}`}>
                <Icon size={14} className={isActive ? 'text-[#1d9e75]' : 'text-[#555] group-hover:text-[#888]'} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a] bg-black/20">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-[#1d9e75]/10 flex items-center justify-center text-[10px] font-black text-[#1d9e75] shrink-0">MG</div>
            <div className="min-w-0"><div className="text-[12px] font-bold truncate">Ops Manager</div><div className="text-[10px] text-[#555] truncate font-medium">{user?.email}</div></div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-14 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-6 shrink-0">
          <div className="text-[15px] font-medium">{activeModule.replace(/_/g, ' ')}</div>
          <div className="flex items-center gap-4"><span className="text-[12px] text-[#888]">Manager · LIVE Control</span></div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            {activeModule === 'overview' && <ManagerOverview theme={theme} />}
            {activeModule === 'courses_review' && <CoursesReview theme={theme} />}
            {activeModule !== 'overview' && activeModule !== 'courses_review' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center">
                <Box size={64} className="mb-6" />
                <div className="text-xl font-black uppercase tracking-[0.5em]">{activeModule} Module</div>
                <div className="text-sm mt-2">Section content coming soon...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ManagerOverview({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{l:'To Publish',v:'7',s:'courses waiting',c:'#ef9f27'},{l:'Open Projects',v:'87',s:'↑ +12 this week',c:theme.accent},{l:'Active Contracts',v:'34',s:'$148k total',c:'#378add'},{l:'Review Reports',v:'3',s:'require action',c:'#e24b4a'}].map((m, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-lg p-4 space-y-2 shadow-xl">
            <div className="text-[11px] text-[#888] font-medium uppercase tracking-wider">{m.l}</div>
            <div className="text-2xl font-semibold text-white">{m.v}</div>
            <div className="text-[11px] font-medium" style={{ color: m.c }}>{m.s}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
          <div className="text-[13px] font-medium mb-6 text-white">Pending Course Publications</div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] text-[#555] uppercase border-b border-[#2a2a2a]"><th className="pb-3">Title</th><th className="pb-3">Author</th><th className="pb-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {[1,2,3].map(i => (
                <tr key={i} className="hover:bg-white/[0.01]">
                  <td className="py-4 text-xs font-bold text-[#e8e6df]">Mastering Houdini FX Vol.{i}</td>
                  <td className="py-4 text-xs text-[#888]">S. Chen</td>
                  <td className="py-4 text-right"><button className="px-3 py-1.5 bg-[#1d9e75] text-white rounded text-[10px] font-black uppercase">Publish</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 text-center flex flex-col items-center justify-center opacity-40">
          <PieChart size={48} className="mb-4 text-[#1d9e75]" />
          <div className="text-sm font-bold uppercase tracking-widest">Analytics Pulse Coming Soon</div>
        </div>
      </div>
    </div>
  );
}

function CoursesReview({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2a2a2a] bg-black/20 flex items-center justify-between">
          <div className="text-[11px] font-black uppercase tracking-widest">Course Verification Queue</div>
          <span className="text-[10px] font-bold text-white/40">7 courses awaiting review</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/20 text-[9px] font-black text-[#555] uppercase tracking-widest"><th className="px-8 py-4">Course Title</th><th className="px-8 py-4">Lecturer</th><th className="px-8 py-4">Category</th><th className="px-8 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="hover:bg-white/[0.01]">
                <td className="px-8 py-5 text-xs font-bold text-white">Advanced Character Rigging Course {i}</td>
                <td className="px-8 py-5 text-xs text-[#888]">Alex Rivera</td>
                <td className="px-8 py-5"><span className="px-2 py-0.5 bg-white/5 text-white/40 text-[9px] font-black uppercase rounded-full">3D Animation</span></td>
                <td className="px-8 py-5 text-right flex justify-end gap-2"><button className="size-8 rounded-lg bg-[#1d9e75]/10 text-[#1d9e75] flex items-center justify-center"><CheckCircle size={14} /></button><button className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><XCircle size={14} /></button><button className="size-8 rounded-lg bg-white/5 text-white/40 flex items-center justify-center"><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
