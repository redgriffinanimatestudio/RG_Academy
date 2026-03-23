import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
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
  UserCheck,
  Mail,
  Lock,
  MessageSquare,
  Ticket,
  LifeBuoy,
  Target,
  DollarSign,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ModeratorDashboardContent } from './ModeratorDashboard.tsx';

// --- SHARED DASHBOARD MODULES ---

function GenericDashboard({ activeRole, accent }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { l: 'Pending Tasks', v: '12', s: 'require attention', c: accent },
          { l: 'Completed (24h)', v: '42', s: 'system processed', c: '#1d9e75' },
          { l: 'Efficiency Rate', v: '94%', s: 'above target', c: '#378add' },
        ].map((m, i) => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-[2rem] p-8 space-y-4 shadow-2xl">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{m.l}</div>
            <div className="text-4xl font-black text-white tracking-tighter">{m.v}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: m.c }}>{m.s}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
        <div className="text-[11px] font-black uppercase tracking-widest mb-8 text-white/40">Recent Activity Queue</div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <div className="flex items-center gap-6">
                <div className="size-3 rounded-full shadow-lg" style={{ background: accent, boxShadow: `0 0 15px ${accent}40` }} />
                <div className="space-y-1">
                  <span className="text-sm font-black text-white/80 uppercase tracking-tight">System Request ID-992{i}</span>
                  <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Received 24 mins ago</div>
                </div>
              </div>
              <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white text-white/40 transition-all">Review Process</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- HR MODULES ---
function HRJobOpenings({ accent }: any) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase tracking-tight">Active Recruitment</h3>
        <button className="h-12 px-8 bg-[#378add] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#378add]/20 hover:scale-105 transition-all">+ Post New Role</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Senior Unreal Generalist', dept: 'Studio Ops', app: 42, color: '#00f5d4' },
          { title: 'CGI Instructor', dept: 'Academy', app: 12, color: '#ef9f27' }
        ].map((job, i) => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start">
              <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner" style={{ color: job.color }}><UserPlus size={28} /></div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{job.app} applicants</span>
            </div>
            <div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight">{job.title}</h4>
              <p className="text-[10px] text-white/20 font-black uppercase mt-1 tracking-widest">{job.dept}</p>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all tracking-widest">Manage Applications</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FINANCE MODULES ---
function FinancePaymentQueue({ accent }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-widest">Treasury Disbursement Queue</h3>
        <button className="px-8 py-3 bg-[#1d9e75] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#1d9e75]/20 hover:scale-105 transition-all">Process All (12)</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-black/20 text-[9px] font-black text-white/20 uppercase tracking-widest">
            <th className="px-10 py-6">Payee Identity</th>
            <th className="px-10 py-6">Amount</th>
            <th className="px-10 py-6">Method</th>
            <th className="px-10 py-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map(i => (
            <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
              <td className="px-10 py-8">
                <div className="text-sm font-black text-white uppercase tracking-tight">Expert Contributor #{i}482</div>
                <div className="text-[9px] text-white/20 font-black uppercase mt-0.5 tracking-widest">Contract Payout</div>
              </td>
              <td className="px-10 py-8 text-sm font-black text-[#1d9e75]">$1,242.00</td>
              <td className="px-10 py-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Bank Transfer</td>
              <td className="px-10 py-8 text-right">
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 hover:text-white text-white/40 transition-all">Verify & Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- SUPPORT MODULES ---
function SupportTickets({ accent }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase tracking-tight">Active Help Desk</h3>
        <div className="flex gap-4">
          <span className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40">34 Open Tickets</span>
        </div>
      </div>
      <div className="grid gap-4">
        {[
          { user: 'Mark V.', sub: 'Course Access Issue', time: '12m ago', priority: 'High' },
          { user: 'Sarah L.', sub: 'Refund Request', time: '1h ago', priority: 'Medium' },
          { user: 'Alex R.', sub: 'Portfolio Upload Bug', time: '3h ago', priority: 'Low' }
        ].map((t, i) => (
          <div key={i} className="p-8 bg-[#111] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-[#7f77dd]/20 transition-all shadow-xl">
            <div className="flex items-center gap-8">
              <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner" style={{ color: t.priority === 'High' ? '#ef4444' : accent }}><Ticket size={28} /></div>
              <div>
                <div className="text-base font-black text-white uppercase tracking-tight">{t.sub}</div>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-white/20 font-black uppercase tracking-widest">
                  <span>From: {t.user}</span>
                  <div className="size-1 rounded-full bg-white/10" />
                  <span>Received {t.time}</span>
                </div>
              </div>
            </div>
            <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 hover:text-white text-white/40 transition-all tracking-widest">Reply</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StaffDashboardContent({ activeRole, activeModule, accentColor }: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={`${activeRole}-${activeModule}`} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -20 }} 
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="min-h-[600px]"
      >
        {activeModule === 'dashboard' && <GenericDashboard activeRole={activeRole} accent={accentColor} />}
        
        {/* Moderator Views */}
        {activeRole === 'moderator' && (
          <ModeratorDashboardContent activeModule={activeModule} accentColor={accentColor} />
        )}
        
        {/* HR Views */}
        {activeRole === 'hr' && (
          <>
            {activeModule === 'vacancies' && <HRJobOpenings accent={accentColor} />}
            {activeModule === 'candidates' && <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">Candidate Tracking System Initializing...</div>}
          </>
        )}
        
        {/* Finance Views */}
        {activeRole === 'finance' && (
          <>
            {activeModule === 'payout_queue' && <FinancePaymentQueue accent={accentColor} />}
            {activeModule === 'all_contracts' && <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">Contract Ledger Audit Initializing...</div>}
          </>
        )}
        
        {/* Support Views */}
        {activeRole === 'support' && (
          <>
            {activeModule === 'active_tickets' && <SupportTickets accent={accentColor} />}
            {activeModule === 'user_search' && <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">User Directory Search Initializing...</div>}
          </>
        )}

        {/* Fallback for other modules */}
        {!['dashboard', 'reports', 'complaints', 'vacancies', 'payout_queue', 'active_tickets'].includes(activeModule) && 
         activeRole !== 'moderator' && (
          <div className="flex flex-col items-center justify-center py-40 opacity-10">
            <Shield size={80} className="mb-8" style={{ color: accentColor }} />
            <h2 className="text-2xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</h2>
            <p className="text-xs mt-4 uppercase tracking-widest">Operational Protocol Pending Implementation</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function StaffDashboard() {
  const { lang } = useParams();
  const { user, profile, activeRole, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'dashboard';
  
  const themeColors: Record<string, string> = {
    moderator: '#ef9f27',
    hr: '#378add',
    finance: '#1d9e75',
    support: '#7f77dd',
    admin: '#00f5d4',
    chief_manager: '#00f5d4'
  };

  const accentColor = activeRole ? themeColors[activeRole] || '#00f5d4' : '#00f5d4';

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor }} />
    </div>
  );
  
  const staffRoles: string[] = ['moderator', 'hr', 'finance', 'support', 'admin', 'chief_manager'];
  const isStaff = profile?.roles.some(r => staffRoles.includes(r));
  
  if (!user || (profile && !isStaff)) return <Navigate to={`/${lang || 'eng'}`} />;

  return (
    <div className="space-y-10">
      {/* Dynamic Header for Content Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full animate-pulse" style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
              {activeModule.replace(/_/g, ' ')}
            </h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            Internal Portal / {activeRole?.replace('_', ' ')} / Node v2.0
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
            System Online
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
            Last Sync: Just Now
          </div>
        </div>
      </div>

      <StaffDashboardContent activeRole={activeRole} activeModule={activeModule} accentColor={accentColor} />
    </div>
  );
}
