import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronLeft, ChevronRight, Zap, Shield, ShieldCheck, 
  Users, Target, LayoutDashboard, Box, Briefcase, GraduationCap, 
  Video, DollarSign, LifeBuoy, Star, Cpu, Layers, MessageSquare,
  Lock, Activity, AlertCircle, Rocket, Globe, FileText, Settings,
  CheckCircle2, XCircle, Terminal, Database, Code
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import All specialized dashboard contents
import { AdminDashboardContent } from './AdminDashboard';
import { ChiefManagerDashboardContent } from './ChiefManagerDashboard';
import { ManagerDashboardContent } from './ManagerDashboard';
import { StaffDashboardContent } from './StaffDashboard';
import { ModeratorDashboardContent } from './ModeratorDashboard';

const ROLES = [
  { id: 'admin', label: 'Admin', icon: Shield, color: '#ef4444' },
  { id: 'chief_manager', label: 'Chief Manager', icon: Target, color: '#7f77dd' },
  { id: 'manager', label: 'Manager', icon: LayoutDashboard, color: '#1d9e75' },
  { id: 'moderator', label: 'Moderator', icon: ShieldCheck, color: '#ef9f27' },
  { id: 'hr', label: 'HR Lead', icon: Users, color: '#378add' },
  { id: 'finance', label: 'Finance', icon: DollarSign, color: '#1d9e75' },
  { id: 'support', label: 'Support', icon: LifeBuoy, color: '#7f77dd' },
  { id: 'student', label: 'Student', icon: GraduationCap, color: '#378add' },
  { id: 'lecturer', label: 'Instructor', icon: Video, color: '#1d9e75' },
  { id: 'client', label: 'Client', icon: Box, color: '#ef9f27' },
  { id: 'executor', label: 'Specialist', icon: Briefcase, color: '#e24b4a' }
];

const MATRIX_DATA = [
  { g: 'users', section: 'User Management' },
  { g: 'users', label: 'View all users', sub: 'GET /admin/users', cm: 1, mg: 1, mo: 2 },
  { g: 'users', label: 'Full user profile', sub: 'GET /admin/users/:id', cm: 1, mg: 1, mo: 1 },
  { g: 'users', label: 'Assign/remove roles', sub: 'PATCH /admin/users/:id/roles', cm: 1, mg: 0, mo: 0 },
  { g: 'users', label: 'Suspend account', sub: 'PATCH /admin/users/:id/suspend', cm: 1, mg: 1, mo: 1 },
  { g: 'users', label: 'Delete account permanently', sub: 'DELETE /admin/users/:id', cm: 1, mg: 0, mo: 0 },

  { g: 'content', section: 'Content Moderation' },
  { g: 'content', label: 'View all courses (draft)', sub: 'GET /admin/courses?status=all', cm: 1, mg: 1, mo: 1 },
  { g: 'content', label: 'Unpublish course', sub: 'PATCH /courses/:id/publish', cm: 1, mg: 1, mo: 1 },
  { g: 'content', label: 'Handle reports', sub: 'PATCH /admin/reports/:id', cm: 1, mg: 1, mo: 1 },
  { g: 'content', label: 'Approve Studio services', sub: 'PATCH /services/:id/approve', cm: 1, mg: 1, mo: 1 },

  { g: 'finance', section: 'Finance & Treasury' },
  { g: 'finance', label: 'View platform revenue', sub: 'GET /admin/finance/revenue', cm: 1, mg: 0, mo: 0 },
  { g: 'finance', label: 'Payouts to specialists', sub: 'GET /admin/finance/payouts', cm: 1, mg: 0, mo: 0 },
  { g: 'finance', label: 'Initiate refund', sub: 'POST /admin/finance/refund/:id', cm: 1, mg: 0, mo: 2 },

  { g: 'system', section: 'System Control' },
  { g: 'system', label: 'Audit Log access', sub: 'GET /admin/audit-log', cm: 1, mg: 2, mo: 0 },
  { g: 'system', label: 'Broadcast notifications', sub: 'POST /admin/notifications/broadcast', cm: 1, mg: 1, mo: 0 },
  { g: 'system', label: 'Platform settings', sub: 'PATCH /admin/system/settings', cm: 2, mg: 0, mo: 0 },
];

const DevDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('matrix');
  const [activeRoleTab, setActiveRoleTab] = useState('admin');
  const [activeMatrixFilter, setActiveMatrixFilter] = useState('all');

  const sym = (v: number) => {
    if (v === 1) return <span className="text-emerald-500 text-lg">●</span>;
    if (v === 2) return <span className="text-amber-500 text-base">◑</span>;
    return <span className="text-white/10 text-lg">○</span>;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pt-24 pb-20">
      {/* Master Header */}
      <div className="max-w-[1600px] mx-auto px-8 mb-12">
        <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]">
              <Zap size={14} fill="currentColor" />
              Development Access Mode
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">
              Master Control <span className="text-indigo-400 italic">Engine.</span>
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Logged in as System Developer · All Roles Active</p>
          </div>
          <div className="relative z-10 flex gap-4">
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all flex items-center gap-2">
              <Terminal size={14} /> CLI Console
            </button>
            <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">
              Deploy Changes
            </button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-[1600px] mx-auto px-8 mb-8">
        <div className="flex items-center gap-2 border-b border-white/5">
          {[
            { id: 'matrix', label: 'Roles Matrix', icon: Layers },
            { id: 'roles', label: 'All Role Panels', icon: Users },
            { id: 'api', label: 'API Endpoints', icon: Code },
            { id: 'system', label: 'System Health', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-white bg-indigo-500/5'
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8">
        <AnimatePresence mode="wait">
          {/* ROLES MATRIX VIEW */}
          {activeTab === 'matrix' && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">Permission Assignment Matrix</h3>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Global Administrative Access Levels</p>
                  </div>
                  <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                    {['all', 'users', 'content', 'finance', 'system'].map(f => (
                      <button
                        key={f}
                        onClick={() => setActiveMatrixFilter(f)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
                          activeMatrixFilter === f ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden border border-white/5 rounded-2xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                        <th className="px-8 py-5">Platform Action / API Route</th>
                        <th className="px-8 py-5 text-center">Chief Manager</th>
                        <th className="px-8 py-5 text-center">Manager</th>
                        <th className="px-8 py-5 text-center">Moderator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {MATRIX_DATA.map((row, idx) => {
                        if (row.section) {
                          if (activeMatrixFilter !== 'all' && row.g !== activeMatrixFilter) return null;
                          return (
                            <tr key={`sec-${idx}`} className="bg-indigo-500/5">
                              <td colSpan={4} className="px-8 py-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                {row.section}
                              </td>
                            </tr>
                          );
                        }
                        if (activeMatrixFilter !== 'all' && row.g !== activeMatrixFilter) return null;
                        return (
                          <tr key={idx} className="hover:bg-white/[0.02] group transition-colors">
                            <td className="px-8 py-5">
                              <div className="text-xs font-black text-white/80 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{row.label}</div>
                              <div className="text-[9px] text-white/20 font-mono mt-1 uppercase tracking-widest">{row.sub}</div>
                            </td>
                            <td className="px-8 py-5 text-center">{sym(row.cm || 0)}</td>
                            <td className="px-8 py-5 text-center">{sym(row.mg || 0)}</td>
                            <td className="px-8 py-5 text-center">{sym(row.mo || 0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ALL ROLE PANELS VIEW */}
          {activeTab === 'roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRoleTab(r.id)}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                      activeRoleTab === r.id
                        ? 'bg-white text-black border-white shadow-xl scale-105'
                        : 'bg-[#0a0a0a] border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <r.icon size={18} style={{ color: activeRoleTab === r.id ? '' : r.color }} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{r.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 min-h-[600px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  {React.createElement(ROLES.find(r => r.id === activeRoleTab)?.icon || Shield, { size: 200 })}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="size-12 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ background: ROLES.find(r => r.id === activeRoleTab)?.color }}>
                      {React.createElement(ROLES.find(r => r.id === activeRoleTab)?.icon || Shield, { size: 24 })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight text-white">{activeRoleTab.replace(/_/g, ' ')} Portal</h2>
                      <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Active Development Simulation Node</p>
                    </div>
                  </div>

                  {/* Render simulated dashboard content */}
                  <div className="w-full">
                    {activeRoleTab === 'admin' && <AdminDashboardContent activeModule="dashboard" theme={{ accent: '#ef4444' }} />}
                    {activeRoleTab === 'chief_manager' && <ChiefManagerDashboardContent activeModule="dashboard" theme={{ accent: '#7f77dd' }} />}
                    {activeRoleTab === 'manager' && <ManagerDashboardContent activeModule="overview" theme={{ accent: '#1d9e75' }} />}
                    {activeRoleTab === 'moderator' && <ModeratorDashboardContent activeModule="dashboard" accentColor="#ef9f27" />}
                    {['hr', 'finance', 'support'].includes(activeRoleTab) && <StaffDashboardContent activeRole={activeRoleTab} activeModule="dashboard" accentColor="#378add" />}
                    
                    {/* Simplified simulators for student/specialist */}
                    {['student', 'lecturer', 'client', 'executor'].includes(activeRoleTab) && (
                      <div className="bg-white/5 rounded-[2rem] p-20 text-center space-y-6">
                        <Rocket size={64} className="mx-auto text-white/10 animate-pulse" />
                        <div className="space-y-2">
                          <h3 className="text-xl font-black uppercase text-white">Full Simulator Hub</h3>
                          <p className="text-xs text-white/20 uppercase tracking-widest font-black">Redirecting to native view for deep inspection...</p>
                        </div>
                        <button 
                          onClick={() => {
                            // Logic to switch activeRole in context would go here
                            navigate(`/aca/${lang}/dashboard`);
                          }}
                          className="px-10 py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-all"
                        >
                          Open Live View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* API DOCS VIEW (Legacy functionality maintained) */}
          {activeTab === 'api' && (
            <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Total Endpoints', val: '42', icon: Code, c: '#00f5d4' },
                  { label: 'System Uptime', val: '99.9%', icon: Activity, c: '#378add' },
                  { label: 'API Version', val: 'v2.4.0', icon: Database, c: '#ef9f27' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-4">
                    <s.icon size={24} style={{ color: s.c }} />
                    <div>
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div>
                      <div className="text-3xl font-black text-white tracking-tighter">{s.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-20 text-center opacity-20">
                <Terminal size={64} className="mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-[0.5em]">API Documentation Engine</h3>
                <p className="mt-4 uppercase tracking-widest text-xs">Access via /aca/:lang/docs for full Swagger UI</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DevDashboard;
