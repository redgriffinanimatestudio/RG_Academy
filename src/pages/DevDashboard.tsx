import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronLeft, ChevronRight, Zap, Shield, ShieldCheck, 
  Users, Target, LayoutDashboard, Box, Briefcase, GraduationCap, 
  Video, DollarSign, LifeBuoy, Star, Cpu, Layers, MessageSquare,
  Lock, Activity, AlertCircle, Rocket, Globe, FileText, Settings,
  CheckCircle2, XCircle, Terminal, Database, Code, ChevronDown,
  Play, ExternalLink, Copy, Check, Send, Sparkles, UserCheck, Bell
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import All specialized dashboard contents
import { AdminDashboardContent } from './AdminDashboard';
import { ChiefManagerDashboardContent } from './ChiefManagerDashboard';
import { ManagerDashboardContent } from './ManagerDashboard';
import { StaffDashboardContent } from './StaffDashboard';
import { ModeratorDashboardContent } from './ModeratorDashboard';
import { RoleCombinationMatrix } from '../components/RoleCombinationMatrix';
import { RolePermissionMatrix } from '../components/RolePermissionMatrix';

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
  { g: 'users', label: 'View all users', sub: 'GET /api/admin/users', cm: 1, mg: 1, mo: 2 },
  { g: 'users', label: 'Full user profile', sub: 'GET /api/admin/users/:id', cm: 1, mg: 1, mo: 1 },
  { g: 'users', label: 'Assign/remove roles', sub: 'PATCH /api/admin/users/:id/role', cm: 1, mg: 0, mo: 0 },
  { g: 'users', label: 'Suspend account', sub: 'PATCH /api/admin/users/:id/suspend', cm: 1, mg: 1, mo: 1 },

  { g: 'content', section: 'Content Moderation' },
  { g: 'content', label: 'View all courses (draft)', sub: 'GET /api/admin/courses', cm: 1, mg: 1, mo: 1 },
  { g: 'content', label: 'Handle reports', sub: 'PATCH /api/admin/reports/:reportId', cm: 1, mg: 1, mo: 1 },
  { g: 'content', label: 'Approve reviews', sub: 'PATCH /api/admin/reviews/:reviewId/approve', cm: 1, mg: 1, mo: 1 },

  { g: 'finance', section: 'Finance & Treasury' },
  { g: 'finance', label: 'System revenue stats', sub: 'GET /api/admin/stats', cm: 1, mg: 0, mo: 0 },
  { g: 'finance', label: 'Initiate refund', sub: 'POST /api/admin/finance/refund/:id', cm: 1, mg: 0, mo: 2 },
];

const API_ENDPOINTS = [
  { 
    tag: 'Auth & Profile', 
    endpoints: [
      { method: 'POST', path: '/api/auth/sync', desc: 'Sync Secure user with DB', body: '{\n  "uid": "abc...",\n  "email": "user@example.com",\n  "displayName": "John Doe",\n  "photoURL": "..."\n}' },
      { method: 'GET', path: '/api/auth/me', desc: 'Get current session profile' },
      { method: 'GET', path: '/api/auth/users/:id', desc: 'Get public user data' },
      { method: 'POST', path: '/api/auth/dev/auth', desc: 'Developer backdoor login', body: '{\n  "login": "admin",\n  "password": "admin"\n}' }
    ]
  },
  { 
    tag: 'Academy Engine', 
    endpoints: [
      { method: 'GET', path: '/api/academy/categories', desc: 'List course categories' },
      { method: 'GET', path: '/api/academy/courses', desc: 'Get all active workshops' },
      { method: 'GET', path: '/api/academy/courses/:slug', desc: 'Get workshop details' },
      { method: 'POST', path: '/api/academy/courses', desc: 'Create new course', body: '{\n  "title": "Mastering 3D",\n  "desc": "...",\n  "categoryId": "..."\n}' },
      { method: 'POST', path: '/api/academy/enroll', desc: 'Join a workshop', body: '{\n  "courseId": "uuid..."\n}' },
      { method: 'GET', path: '/api/academy/users/:userId/enrollments', desc: 'Get user progress' },
      { method: 'PATCH', path: '/api/academy/enrollments/:id/progress', desc: 'Update lesson progress', body: '{\n  "completedLessons": ["uuid..."]\n}' },
      { method: 'POST', path: '/api/academy/reviews', desc: 'Add course review', body: '{\n  "courseId": "...",\n  "rating": 5,\n  "comment": "Great!"\n}' }
    ]
  },
  { 
    tag: 'Studio & Production', 
    endpoints: [
      { method: 'GET', path: '/api/studio/projects', desc: 'Browse studio project board' },
      { method: 'POST', path: '/api/studio/projects', desc: 'Create production project', body: '{\n  "title": "CGI Film",\n  "budget": 5000\n}' },
      { method: 'POST', path: '/api/studio/applications', desc: 'Apply for project as executor' },
      { method: 'GET', path: '/api/studio/contracts', desc: 'Get active session contracts' },
      { method: 'POST', path: '/api/studio/contracts', desc: 'Generate production contract', body: '{\n  "projectId": "...",\n  "executorId": "...",\n  "amount": 1500\n}' },
      { method: 'PATCH', path: '/api/studio/contracts/:id', desc: 'Update milestone / status' }
    ]
  },
  { 
    tag: 'Admin & Control', 
    endpoints: [
      { method: 'GET', path: '/api/admin/stats', desc: 'Platform KPI overview' },
      { method: 'GET', path: '/api/admin/users', desc: 'Manage user directory' },
      { method: 'PATCH', path: '/api/admin/users/:userId/role', desc: 'Elevate/Demote user' },
      { method: 'GET', path: '/api/admin/reports', desc: 'Get moderation queue' },
      { method: 'PATCH', path: '/api/admin/reports/:reportId', desc: 'Resolve safety ticket' },
      { method: 'GET', path: '/api/admin/reviews/pending', desc: 'Moderation review stream' },
      { method: 'PATCH', path: '/api/admin/courses/:courseId/status', desc: 'Approve/Reject workshop' }
    ]
  },
  { 
    tag: 'Networking Feed', 
    endpoints: [
      { method: 'GET', path: '/api/networking/profiles/:userId', desc: 'Get specialist profile' },
      { method: 'POST', path: '/api/networking/portfolio', desc: 'Add work to portfolio', body: '{\n  "title": "Orc Sculpt",\n  "imageUrl": "..."\n}' },
      { method: 'POST', path: '/api/networking/connections', desc: 'Follow user', body: '{\n  "followingId": "..."\n}' },
      { method: 'GET', path: '/api/networking/feed/:userId', desc: 'Get social activity stream' },
      { method: 'GET', path: '/api/networking/discovery/search', desc: 'Deep talent search' }
    ]
  },
  { 
    tag: 'Notifications', 
    endpoints: [
      { method: 'GET', path: '/api/notifications/:userId', desc: 'Get user notification inbox' },
      { method: 'GET', path: '/api/notifications/:userId/unread-count', desc: 'Get bubble count' },
      { method: 'PATCH', path: '/api/notifications/:id/read', desc: 'Mark single notification' },
      { method: 'POST', path: '/api/notifications/mark-all-read', desc: 'Clear all inbox' },
      { method: 'POST', path: '/api/notifications/', desc: 'Broadcast global system alert' }
    ]
  }
];

const DevDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('matrix');
  const [activeRoleTab, setActiveRoleTab] = useState('admin');
  const [activeMatrixFilter, setActiveMatrixFilter] = useState('all');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const sym = (v: number) => {
    if (v === 1) return <span className="text-emerald-500 text-lg">●</span>;
    if (v === 2) return <span className="text-amber-500 text-base">◑</span>;
    return <span className="text-white/10 text-lg">○</span>;
  };

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<string[]>([]);

  const handleDeploy = async () => {
    if (!window.confirm("Are you sure you want to trigger a global deployment?")) return;
    
    setIsDeploying(true);
    setDeployStatus(['Initializing connection...']);
    
    try {
      const response = await fetch('/api/dev/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid })
      });
      
      const data = await response.json();
      if (data.success) {
        for (const step of data.steps) {
          await new Promise(r => setTimeout(r, 800));
          setDeployStatus(prev => [...prev, step]);
        }
        await new Promise(r => setTimeout(r, 500));
        alert("System deployed successfully to production edge.");
      } else {
        alert("Deployment failed: " + data.message);
      }
    } catch (error) {
      alert("Network error during deployment");
    } finally {
      setIsDeploying(false);
      setDeployStatus([]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(null), 2000);
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
            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase shadow-xl transition-all flex items-center gap-2 ${isDeploying ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-indigo-500 text-white shadow-indigo-500/20 hover:scale-105'}`}
            >
              {isDeploying ? <div className="size-3 border-2 border-zinc-500 border-t-transparent animate-spin rounded-full" /> : <Rocket size={14} />}
              {isDeploying ? 'Deploying...' : 'Deploy Changes'}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
        </div>
        
        {isDeploying && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-6 bg-black border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Deployment Pipeline Logs</span>
            </div>
            <div className="space-y-2">
              {deployStatus.map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-[11px] font-mono">
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-zinc-400">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-[1600px] mx-auto px-8 mb-8">
        <div className="flex items-center gap-2 border-b border-white/5">
          {[
            { id: 'matrix', label: 'Roles Matrix', icon: Layers },
            { id: 'combinations', label: 'User Combinations', icon: Sparkles },
            { id: 'roles', label: 'All Role Panels', icon: Users },
            { id: 'api', label: 'API Interactive', icon: Code },
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
                </div>

                <RolePermissionMatrix />
              </div>
            </motion.div>
          )}

          {/* USER COMBINATIONS VIEW */}
          {activeTab === 'combinations' && (
            <motion.div
              key="combinations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">Interactive Role Combinations</h3>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Simulate cross-role synergy and permissions</p>
                  </div>
                </div>
                
                <RoleCombinationMatrix />
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

                  <div className="w-full">
                    {activeRoleTab === 'admin' && <AdminDashboardContent activeModule="dashboard" theme={{ accent: '#ef4444' }} />}
                    {activeRoleTab === 'chief_manager' && <ChiefManagerDashboardContent activeModule="dashboard" theme={{ accent: '#7f77dd' }} />}
                    {activeRoleTab === 'manager' && <ManagerDashboardContent activeModule="overview" theme={{ accent: '#1d9e75' }} />}
                    {activeRoleTab === 'moderator' && <ModeratorDashboardContent activeModule="dashboard" accentColor="#ef9f27" />}
                    {['hr', 'finance', 'support'].includes(activeRoleTab) && <StaffDashboardContent activeRole={activeRoleTab} activeModule="dashboard" accentColor="#378add" />}
                    
                    {['student', 'lecturer', 'client', 'executor'].includes(activeRoleTab) && (
                      <div className="bg-white/5 rounded-[2rem] p-20 text-center space-y-6">
                        <Rocket size={64} className="mx-auto text-white/10 animate-pulse" />
                        <div className="space-y-2">
                          <h3 className="text-xl font-black uppercase text-white">Full Simulator Hub</h3>
                          <p className="text-xs text-white/20 uppercase tracking-widest font-black">Redirecting to native view for deep inspection...</p>
                        </div>
                        <button 
                          onClick={() => {
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

          {/* API INTERACTIVE (FULL CONNECTED LIST) */}
          {activeTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                      <Terminal size={24} className="text-indigo-400" />
                      API Reference <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-white/40 ml-4">v2.4.0-stable</span>
                    </h3>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Interactive endpoint documentation and testing tools</p>
                  </div>
                  <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:border-indigo-500/40 outline-none" placeholder="Search endpoints..." />
                  </div>
                </div>

                <div className="space-y-12">
                  {API_ENDPOINTS.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 border-l-2 border-indigo-500 pl-4">{group.tag}</h4>
                      <div className="grid gap-3">
                        {group.endpoints.map((ep, eIdx) => {
                          const epId = `${gIdx}-${eIdx}`;
                          const isExpanded = expandedEndpoint === epId;
                          const methodColor = ep.method === 'GET' ? 'text-blue-400' : ep.method === 'POST' ? 'text-emerald-400' : ep.method === 'PATCH' ? 'text-amber-400' : 'text-rose-400';
                          const methodBg = ep.method === 'GET' ? 'bg-blue-400/10 border-blue-400/20' : ep.method === 'POST' ? 'bg-emerald-400/10 border-emerald-400/20' : ep.method === 'PATCH' ? 'bg-amber-400/10 border-amber-400/20' : 'bg-rose-400/10 border-rose-400/20';

                          return (
                            <div key={eIdx} className={`border rounded-2xl transition-all overflow-hidden ${isExpanded ? 'bg-white/[0.03] border-white/20 shadow-2xl' : 'bg-white/[0.01] border-white/5 hover:border-white/10'}`}>
                              <div 
                                onClick={() => setExpandedEndpoint(isExpanded ? null : epId)}
                                className="w-full flex items-center justify-between p-4 text-left group cursor-pointer"
                              >
                                <div className="flex items-center gap-6">
                                  <div className={`w-20 py-1.5 border rounded-lg text-center text-[10px] font-black ${methodColor} ${methodBg}`}>{ep.method}</div>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-mono font-bold text-white/80 group-hover:text-white transition-colors">{ep.path}</span>
                                    <span className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">{ep.desc}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(ep.path); }}
                                    className="p-2 text-white/10 hover:text-white transition-colors relative z-10"
                                  >
                                    {copiedPath === ep.path ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                  </button>
                                  <ChevronDown size={16} className={`text-white/20 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                                </div>
                              </div>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden bg-black/40 border-t border-white/5"
                                  >
                                    <div className="p-8 space-y-8">
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Request Body</span>
                                            <span className="text-[10px] font-bold text-white/20">application/json</span>
                                          </div>
                                          <div className="relative group">
                                            <pre className="bg-[#050505] p-6 rounded-2xl border border-white/5 text-[11px] font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap">
                                              {ep.body || '// No body required'}
                                            </pre>
                                            {ep.body && (
                                              <button onClick={() => copyToClipboard(ep.body!)} className="absolute top-4 right-4 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500/20 hover:text-indigo-400">
                                                <Copy size={12} />
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        <div className="space-y-4">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Example Response</span>
                                            <span className="text-[10px] font-bold text-white/20">Status: 200 OK</span>
                                          </div>
                                          <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 text-[11px] font-mono text-zinc-500 italic">
                                            {`{\n  "success": true,\n  "data": { ... },\n  "timestamp": "${new Date().toISOString()}"\n}`}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex gap-6">
                                          <div className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-indigo-500" />
                                            <span className="text-[9px] font-black uppercase text-white/20">Auth: Required</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-indigo-500" />
                                            <span className="text-[9px] font-black uppercase text-white/20">Rate Limit: 100/min</span>
                                          </div>
                                        </div>
                                        <button className="flex items-center gap-3 px-8 py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase shadow-xl shadow-indigo-500/20 hover:brightness-110 active:scale-95 transition-all">
                                          <Send size={14} /> Try It Out
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SYSTEM HEALTH VIEW */}
          {activeTab === 'system' && (
            <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'CPU Usage', val: '12%', status: 'Normal', icon: Cpu, c: '#00f5d4' },
                  { label: 'Database', val: 'Synced', status: 'Healthy', icon: Database, c: '#378add' },
                  { label: 'Storage', val: '42GB', status: '82% Free', icon: Box, c: '#ef9f27' },
                  { label: 'Network', val: '12ms', status: 'Stable', icon: Activity, c: '#7f77dd' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start relative z-10">
                      <div className="p-3 bg-white/5 rounded-xl"><s.icon size={20} style={{ color: s.c }} /></div>
                      <span className="text-[9px] font-black uppercase px-2 py-1 bg-white/5 rounded text-white/40">{s.status}</span>
                    </div>
                    <div className="relative z-10">
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div>
                      <div className="text-3xl font-black text-white tracking-tighter mt-1">{s.val}</div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 size-24 blur-[40px] opacity-10" style={{ background: s.c }} />
                  </div>
                ))}
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-20 text-center space-y-6">
                <div className="size-20 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto">
                  <Activity size={40} className="text-indigo-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none">System Telemetry Engine</h3>
                  <p className="text-xs text-white/20 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                    Real-time monitoring of global nodes, cloud infrastructure and decentralized ledger integrity.
                  </p>
                </div>
                <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Launch Performance Audit</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DevDashboard;
