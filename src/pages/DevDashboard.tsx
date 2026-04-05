import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Zap, Users, Target, LayoutDashboard, Box, 
  Rocket, Code, Terminal, Database, Activity, ChevronDown,
  Copy, Check, Send, Sparkles, Shield, Layers
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- INDUSTRIALIZED HUB IMPORTS ---
import AdminDashboard from './Dashboard/roles/AdminDashboard';
import ManagerDashboard from './Dashboard/roles/ManagerDashboard';
import ModeratorDashboard from './Dashboard/roles/ModeratorDashboard';
import HRDashboard from './Dashboard/roles/HRDashboard';
import FinanceDashboard from './Dashboard/roles/FinanceDashboard';
import SupportDashboard from './Dashboard/roles/SupportDashboard';
import AgencyDashboard from './Dashboard/roles/AgencyDashboard';
import StudentDashboard from './Dashboard/roles/StudentDashboard';
import ExecutorDashboard from './Dashboard/roles/ExecutorDashboard';
import ClientDashboard from './Dashboard/roles/ClientDashboard';

import { RoleCombinationMatrix } from '../components/RoleCombinationMatrix';
import { RolePermissionMatrix } from '../components/RolePermissionMatrix';

// Configuration Data
import { ROLES, API_ENDPOINTS } from '../config/apiInventory';

const DevDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { user, setActiveRole } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('matrix');
  const [activeRoleTab, setActiveRoleTab] = useState('admin');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

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
    <div className="min-h-screen bg-bg-dark text-ink font-sans pt-24 pb-20 tracking-tight">
      {/* Master Header */}
      <div className="max-w-[1920px] mx-auto px-8 mb-12">
        <div className="flex items-center justify-between bg-bg-card border border-border-main rounded-[3rem] p-10 relative overflow-hidden shadow-sm">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px]">
              <Zap size={14} fill="currentColor" />
              Development Access Mode
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-ink uppercase leading-none">
              Master Control <span className="text-emerald-500 italic">Engine.</span>
            </h1>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Logged in as System Developer · All Roles Active</p>
          </div>
          <div className="relative z-10 flex gap-4">
            <button className="px-8 py-4 bg-bg-card border border-border-main rounded-2xl text-[10px] font-black uppercase text-ink hover:bg-bg-dark hover:shadow-md transition-all flex items-center gap-3">
              <Terminal size={16} /> CLI Console
            </button>
            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase shadow-2xl transition-all flex items-center gap-3 ${isDeploying ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 text-white shadow-emerald-200 hover:scale-105 active:scale-95'}`}
            >
              {isDeploying ? <div className="size-4 border-2 border-slate-400 border-t-transparent animate-spin rounded-full" /> : <Rocket size={16} />}
              {isDeploying ? 'Deploying...' : 'Deploy Changes'}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] -mr-48 -mt-48 rounded-full" />
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-[1920px] mx-auto px-8 mb-10">
        <div className="flex items-center gap-4 border-b border-border-main">
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
              className={`px-10 py-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-ink bg-emerald-50/50'
                  : 'border-transparent text-text-muted hover:text-ink hover:bg-bg-card'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-8">
        <AnimatePresence mode="wait">
          {/* ROLES MATRIX VIEW */}
          {activeTab === 'matrix' && (
            <motion.div key="matrix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-bg-card backdrop-blur-3xl border border-border-main rounded-[3rem] p-12 shadow-sm">
                <RolePermissionMatrix />
              </div>
            </motion.div>
          )}

          {/* USER COMBINATIONS VIEW */}
          {activeTab === 'combinations' && (
            <motion.div key="combinations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-bg-card backdrop-blur-3xl border border-border-main rounded-[3rem] p-12 shadow-sm">
                <RoleCombinationMatrix />
              </div>
            </motion.div>
          )}

          {/* ALL ROLE PANELS VIEW (Industrialized Simulator) */}
          {activeTab === 'roles' && (
            <motion.div key="roles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRoleTab(r.id)}
                    className={`flex flex-col items-center justify-center gap-4 p-5 rounded-[2rem] border transition-all ${
                      activeRoleTab === r.id
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-2xl shadow-emerald-200 scale-105'
                        : 'bg-bg-card border-border-main text-text-muted hover:border-emerald-500/20 hover:text-emerald-600 shadow-sm'
                    }`}
                  >
                    <r.icon size={22} style={{ color: activeRoleTab === r.id ? 'white' : r.color }} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{r.label?.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="bg-bg-card backdrop-blur-2xl border border-border-main rounded-[4rem] p-12 min-h-[600px] relative overflow-hidden shadow-inner">
                <div className="relative z-10 w-full">
                    {activeRoleTab === 'admin' && <AdminDashboard activeRole="admin" setActiveRole={() => {}} />}
                    {activeRoleTab === 'manager' && <ManagerDashboard />}
                    {activeRoleTab === 'chief_manager' && <ManagerDashboard />}
                    {activeRoleTab === 'moderator' && <ModeratorDashboard />}
                    {activeRoleTab === 'hr' && <HRDashboard view="overview" />}
                    {activeRoleTab === 'finance' && <FinanceDashboard view="overview" />}
                    {activeRoleTab === 'support' && <SupportDashboard view="overview" />}
                    {activeRoleTab === 'agency' && <AgencyDashboard />}
                    {activeRoleTab === 'student' && <StudentDashboard user={user} view="overview" />}
                    {activeRoleTab === 'executor' && <ExecutorDashboard user={user} view="overview" />}
                    {activeRoleTab === 'client' && <ClientDashboard view="overview" />}
                </div>
              </div>
            </motion.div>
          )}

          {/* API INTERACTIVE (FULL CONNECTED LIST) */}
          {activeTab === 'api' && (
            <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-bg-card backdrop-blur-3xl border border-border-main rounded-[3rem] p-12 shadow-sm">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-ink flex items-center gap-4">
                    <Terminal size={32} className="text-emerald-500" /> API Reference
                  </h3>
                </div>
                <div className="space-y-4">
                  {API_ENDPOINTS.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 border-l-4 border-emerald-500 pl-6 my-8">{group.tag}</h4>
                      {group.endpoints.map((ep, eIdx) => (
                        <div key={eIdx} className="bg-bg-dark border border-border-main p-6 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow group">
                           <div className="flex items-center gap-8">
                              <span className="px-3 py-1 bg-emerald-50 text-[10px] font-black text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">{ep.method}</span>
                              <span className="text-sm font-mono text-text-muted">{ep.path}</span>
                           </div>
                           <span className="text-[10px] font-black uppercase text-text-muted">{ep.desc}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SYSTEM HEALTH VIEW */}
          {activeTab === 'system' && (
            <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {['Nodes: 14', 'Sync: 12ms', 'Load: 32%', 'Auth: OK'].map((s, i) => (
                   <div key={i} className="bg-bg-card border border-border-main rounded-[2.5rem] p-10 text-center shadow-sm hover:shadow-xl transition-shadow">
                      <span className="text-2xl font-black text-ink italic tracking-tighter">{s}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DevDashboard;
