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
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans pt-24 pb-20">
      {/* Master Header */}
      <div className="max-w-[1920px] mx-auto px-8 mb-12">
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
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-[1920px] mx-auto px-8 mb-8">
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

      <div className="max-w-[1920px] mx-auto px-8">
        <AnimatePresence mode="wait">
          {/* ROLES MATRIX VIEW */}
          {activeTab === 'matrix' && (
            <motion.div key="matrix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                <RolePermissionMatrix />
              </div>
            </motion.div>
          )}

          {/* USER COMBINATIONS VIEW */}
          {activeTab === 'combinations' && (
            <motion.div key="combinations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
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

              <div className="bg-transparent border border-white/5 rounded-[3rem] p-10 min-h-[600px] relative overflow-hidden">
                <div className="relative z-10 w-full">
                    {activeRoleTab === 'admin' && <AdminDashboard activeRole="admin" setActiveRole={() => {}} />}
                    {activeRoleTab === 'manager' && <ManagerDashboard />}
                    {activeRoleTab === 'chief_manager' && <ManagerDashboard />}
                    {activeRoleTab === 'moderator' && <ModeratorDashboard />}
                    {activeRoleTab === 'hr' && <HRDashboard />}
                    {activeRoleTab === 'finance' && <FinanceDashboard />}
                    {activeRoleTab === 'support' && <SupportDashboard />}
                    {activeRoleTab === 'agency' && <AgencyDashboard />}
                    {activeRoleTab === 'student' && <StudentDashboard user={user} view="overview" />}
                    {activeRoleTab === 'executor' && <ExecutorDashboard user={user} />}
                    {activeRoleTab === 'client' && <ClientDashboard />}
                </div>
              </div>
            </motion.div>
          )}

          {/* API INTERACTIVE (FULL CONNECTED LIST) */}
          {activeTab === 'api' && (
            <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                    <Terminal size={24} className="text-indigo-400" /> API Reference
                  </h3>
                </div>
                <div className="space-y-4">
                  {API_ENDPOINTS.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 border-l-2 border-indigo-500 pl-4">{group.tag}</h4>
                      {group.endpoints.map((ep, eIdx) => (
                        <div key={eIdx} className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <span className="text-[10px] font-black text-indigo-400 font-mono w-16">{ep.method}</span>
                              <span className="text-xs font-mono text-zinc-400">{ep.path}</span>
                           </div>
                           <span className="text-[9px] font-black uppercase text-white/20">{ep.desc}</span>
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
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {['Nodes: 14', 'Sync: 12ms', 'Load: 32%', 'Auth: OK'].map((s, i) => (
                   <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 text-center">
                      <span className="text-lg font-black text-white italic">{s}</span>
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
