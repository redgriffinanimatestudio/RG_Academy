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
  AlertCircle,
  CheckCircle,
  Eye,
  FileEdit,
  Archive,
  Target,
  DollarSign,
  UserPlus,
  Ticket,
  LifeBuoy
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile, UserRole } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from '../context/AuthContext';

export function StaffDashboardContent({ activeRole, activeModule, accentColor }: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`${activeRole}-${activeModule}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-[1400px] mx-auto">
        {activeModule === 'dashboard' && <GenericDashboard activeRole={activeRole} accent={accentColor} />}
        
        {/* Moderator Views */}
        {activeRole === 'moderator' && activeModule === 'reported_reviews' && <ModeratorReports accent={accentColor} />}
        {activeRole === 'moderator' && activeModule === 'flagged_posts' && <ModeratorFlagged accent={accentColor} />}
        
        {/* HR Views */}
        {activeRole === 'hr' && activeModule === 'job_openings' && <HRJobOpenings accent={accentColor} />}
        {activeRole === 'hr' && activeModule === 'applications' && <HRApplications accent={accentColor} />}
        
        {/* Finance Views */}
        {activeRole === 'finance' && activeModule === 'payment_queue' && <FinancePaymentQueue accent={accentColor} />}
        {activeRole === 'finance' && activeModule === 'revenue_share' && <FinanceRevenueShare accent={accentColor} />}
        
        {/* Support Views */}
        {activeRole === 'support' && activeModule === 'open_tickets' && <SupportTickets accent={accentColor} />}
        {activeRole === 'support' && activeModule === 'user_search' && <SupportUserSearch accent={accentColor} />}

        {/* Fallback for other modules */}
        {!['dashboard', 'reported_reviews', 'flagged_posts', 'job_openings', 'applications', 'payment_queue', 'revenue_share', 'open_tickets', 'user_search'].includes(activeModule) && (
          <div className="p-20 text-center opacity-20 flex flex-col items-center">
            <Shield size={64} className="mb-6" style={{ color: accentColor }} />
            <div className="text-xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</div>
            <div className="text-sm mt-2">Active Node Control Operational...</div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- MODERATOR MODULES ---

function ModeratorReports({ accent }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase tracking-tight">Reported Content Audit</h3>
        <span className="text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">12 Items Pending</span>
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-8 bg-red-500/[0.02] border border-red-500/10 rounded-[2rem] flex items-center justify-between group hover:border-red-500/20 transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm font-black text-white uppercase tracking-tight">User Review Violation #{i}42</span>
                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-full">High Priority</span>
              </div>
              <p className="text-xs text-white/40 italic">"Reported for: Spam & Offensive Language. Original content hidden."</p>
            </div>
            <div className="flex gap-3 ml-8">
              <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Dismiss</button>
              <button className="px-6 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-red-500/20 hover:scale-105 transition-all">Ban Content</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModeratorFlagged({ accent }: any) {
  return <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">Flagged Community Posts Engine Initializing...</div>;
}

// --- HR MODULES ---

function HRJobOpenings({ accent }: any) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase tracking-tight">Active Recruitment</h3>
        <button className="h-10 px-8 bg-[#378add] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#378add]/20">+ Post New Role</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Senior Unreal Generalist', dept: 'Studio Ops', app: 42, color: '#00f5d4' },
          { title: 'CGI Instructor', dept: 'Academy', app: 12, color: '#ef9f27' }
        ].map((job, i) => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start">
              <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center" style={{ color: job.color }}><UserPlus size={24} /></div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{job.app} Applicants</span>
            </div>
            <div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight">{job.title}</h4>
              <p className="text-[10px] text-[#555] font-black uppercase mt-1 tracking-widest">{job.dept}</p>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Manage Applications</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HRApplications({ accent }: any) {
  return <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">Candidate Tracking System Initializing...</div>;
}

// --- FINANCE MODULES ---

function FinancePaymentQueue({ accent }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-widest">Treasury Disbursement Queue</h3>
        <button className="px-6 py-2 bg-[#1d9e75] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#1d9e75]/20">Process All (12)</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-black/20 text-[9px] font-black text-[#555] uppercase tracking-widest">
            <th className="px-8 py-5">Payee Identity</th>
            <th className="px-8 py-5">Amount</th>
            <th className="px-8 py-5">Method</th>
            <th className="px-8 py-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map(i => (
            <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
              <td className="px-8 py-6">
                <div className="text-xs font-black text-white uppercase tracking-tight">Expert Contributor #{i}482</div>
                <div className="text-[9px] text-[#555] font-black uppercase mt-0.5 tracking-widest">Contract Payout</div>
              </td>
              <td className="px-8 py-6 text-xs font-black text-[#1d9e75]">$1,242.00</td>
              <td className="px-8 py-6 text-[10px] font-black text-[#888] uppercase">Bank Transfer</td>
              <td className="px-8 py-6 text-right">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:text-white transition-all">Verify & Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FinanceRevenueShare({ accent }: any) {
  return <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">Revenue Allocation Engine Initializing...</div>;
}

// --- SUPPORT MODULES ---

function SupportTickets({ accent }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase tracking-tight">Active Help Desk Tickets</h3>
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest">34 Open</span>
        </div>
      </div>
      <div className="grid gap-4">
        {[
          { user: 'Mark V.', sub: 'Course Access Issue', time: '12m ago', priority: 'High' },
          { user: 'Sarah L.', sub: 'Refund Request', time: '1h ago', priority: 'Medium' },
          { user: 'Alex R.', sub: 'Portfolio Upload Bug', time: '3h ago', priority: 'Low' }
        ].map((t, i) => (
          <div key={i} className="p-6 bg-[#111] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-[#7f77dd]/20 transition-all">
            <div className="flex items-center gap-6">
              <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center" style={{ color: t.priority === 'High' ? '#ef4444' : accent }}><Ticket size={24} /></div>
              <div>
                <div className="text-sm font-black text-white uppercase tracking-tight">{t.sub}</div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-[#555] font-black uppercase tracking-widest">
                  <span>From: {t.user}</span>
                  <span className="size-1 rounded-full bg-white/10" />
                  <span>Received {t.time}</span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Reply</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportUserSearch({ accent }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <div className="size-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-[#555] group-hover:text-primary transition-colors"><Search size={40} /></div>
        <h3 className="text-2xl font-black uppercase tracking-tight">Master User Identity Search</h3>
        <p className="text-[11px] text-[#555] font-black uppercase tracking-widest leading-relaxed">Search the global user directory to resolve access issues or profile discrepancies.</p>
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input className="w-full bg-[#181818] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-black uppercase tracking-[0.2em] focus:border-[#7f77dd] outline-none transition-all" placeholder="Enter UID, Email or Username..." />
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboard() {
  const { lang } = useParams();
  const { user, profile, activeRole, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'dashboard';
  
  const themeColors: Record<string, string> = {
    moderator: '#ef9f27',
    hr: '#378add',
    finance: '#1d9e75',
    support: '#7f77dd'
  };

  const accentColor = activeRole ? themeColors[activeRole] || '#00f5d4' : '#00f5d4';

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor }} /></div>;
  
  const staffRoles: UserRole[] = ['moderator', 'hr', 'finance', 'support', 'admin', 'chief_manager'];
  const isStaff = profile?.roles.some(r => staffRoles.includes(r));
  
  if (!user || (profile && !isStaff)) return <Navigate to={`/${lang || 'eng'}`} />;

  const handleModuleChange = (id: string) => {
    setSearchParams({ view: id });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e8e6df] font-sans selection:bg-white/10 overflow-hidden h-screen">
      {/* SIDEBAR */}
      <aside className="w-[220px] bg-[#111] border-r border-[#2a2a2a] flex flex-col h-full shrink-0 z-50">
        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="size-8 rounded-lg flex items-center justify-center font-bold text-white tracking-tighter shadow-lg" style={{ background: accentColor }}>RG</div>
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight truncate">Red Griffin</div>
            <div className="text-[9px] font-black uppercase tracking-widest leading-none mt-1" style={{ color: accentColor }}>{activeRole}</div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          {activeRole === 'moderator' && <ModeratorMenu accent={accentColor} active={activeModule} onChange={handleModuleChange} />}
          {activeRole === 'hr' && <HRMenu accent={accentColor} active={activeModule} onChange={handleModuleChange} />}
          {activeRole === 'finance' && <FinanceMenu accent={accentColor} active={activeModule} onChange={handleModuleChange} />}
          {activeRole === 'support' && <SupportMenu accent={accentColor} active={activeModule} onChange={handleModuleChange} />}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a] flex items-center gap-3 bg-black/20">
          <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: `${accentColor}15`, color: accentColor }}>{user?.displayName?.substring(0, 2).toUpperCase() || 'ST'}</div>
          <div className="min-w-0"><div className="text-xs font-bold truncate">Staff Member</div><div className="text-[9px] text-[#555] truncate font-black uppercase tracking-widest">{user?.email}</div></div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <div className="text-sm font-bold uppercase tracking-tight">{activeModule.replace(/_/g, ' ')}</div>
            <div className="text-[9px] text-[#555] font-black uppercase tracking-widest">Internal Portal / {activeRole}</div>
          </div>
          <div className="flex items-center gap-3"><button className="h-8 px-4 border border-[#333] rounded-lg text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-white transition-all">Alerts</button></div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            <motion.div key={`${activeRole}-${activeModule}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-[1400px] mx-auto">
              {activeModule === 'dashboard' && <GenericDashboard activeRole={activeRole} accent={accentColor} />}
              {activeModule !== 'dashboard' && (
                <div className="p-20 text-center opacity-20 flex flex-col items-center">
                  <Shield size={64} className="mb-6" style={{ color: accentColor }} />
                  <div className="text-xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</div>
                  <div className="text-sm mt-2">Active Node Control Operational...</div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- MENUS ---

function SidebarItem({ id, label, icon: Icon, active, accent, onChange }: any) {
  const isActive = active === id;
  return (
    <button onClick={() => onChange(id)} className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all relative group ${isActive ? 'bg-white/5' : 'text-[#888] hover:text-[#e8e6df] hover:bg-white/5'}`} style={{ color: isActive ? accent : undefined }}>
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: accent }} />}
      <Icon size={14} /><span className="uppercase tracking-widest text-[10px] font-black">{label}</span>
    </button>
  );
}

function ModeratorMenu({ active, accent, onChange }: any) {
  return (
    <>
      <div className="px-6 py-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Safety</div>
      <SidebarItem id="dashboard" label="Overview" icon={Layout} active={active} accent={accent} onChange={onChange} />
      <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Audit</div>
      {['Reported Reviews', 'Flagged Posts', 'Banned Keywords'].map(i => <SidebarItem key={i} id={i.toLowerCase().replace(/ /g, '_')} label={i} icon={Shield} active={active} accent={accent} onChange={onChange} />)}
    </>
  );
}

function HRMenu({ active, accent, onChange }: any) {
  return (
    <>
      <div className="px-6 py-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">People</div>
      <SidebarItem id="dashboard" label="Overview" icon={Users} active={active} accent={accent} onChange={onChange} />
      <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Recruiting</div>
      {['Job Openings', 'Applications', 'Interview Schedule'].map(i => <SidebarItem key={i} id={i.toLowerCase().replace(/ /g, '_')} label={i} icon={UserPlus} active={active} accent={accent} onChange={onChange} />)}
    </>
  );
}

function FinanceMenu({ active, accent, onChange }: any) {
  return (
    <>
      <div className="px-6 py-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Treasury</div>
      <SidebarItem id="dashboard" label="Overview" icon={DollarSign} active={active} accent={accent} onChange={onChange} />
      <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Operations</div>
      {['Payment Queue', 'Revenue Share', 'Tax Compliance'].map(i => <SidebarItem key={i} id={i.toLowerCase().replace(/ /g, '_')} label={i} icon={Briefcase} active={active} accent={accent} onChange={onChange} />)}
    </>
  );
}

function SupportMenu({ active, accent, onChange }: any) {
  return (
    <>
      <div className="px-6 py-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Desk</div>
      <SidebarItem id="dashboard" label="Overview" icon={Ticket} active={active} accent={accent} onChange={onChange} />
      <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Resources</div>
      {['Open Tickets', 'Base Knowledge', 'User Search'].map(i => <SidebarItem key={i} id={i.toLowerCase().replace(/ /g, '_')} label={i} icon={LifeBuoy} active={active} accent={accent} onChange={onChange} />)}
    </>
  );
}

function GenericDashboard({ activeRole, accent }: any) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: 'Pending Tasks', v: '12', s: 'require attention', c: accent },
          { l: 'Completed (24h)', v: '42', s: 'system processed', c: '#1d9e75' },
          { l: 'Efficiency Rate', v: '94%', s: 'above target', c: '#378add' },
        ].map((m, i) => (
          <div key={i} className="bg-[#181818] border border-white/5 rounded-xl p-5 space-y-3">
            <div className="text-[10px] font-black text-[#555] uppercase tracking-widest">{m.l}</div>
            <div className="text-3xl font-black text-white">{m.v}</div>
            <div className="text-[10px] font-bold" style={{ color: m.c }}>{m.s}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#111] border border-white/5 rounded-xl p-8 shadow-2xl">
        <div className="text-[11px] font-black uppercase tracking-widest mb-6">Department Queue</div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex justify-between items-center p-4 bg-white/[0.01] border border-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="size-2 rounded-full" style={{ background: accent }} />
                <span className="text-xs font-bold text-white/80 uppercase">Task Request ID-992{i}</span>
              </div>
              <button className="px-4 py-1.5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-white/40 transition-all">Process</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
