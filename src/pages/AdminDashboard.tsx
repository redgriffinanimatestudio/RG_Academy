import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Layout, 
  Shield, 
  BarChart3, 
  Settings, 
  DollarSign, 
  Search, 
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Lock,
  Eye,
  FileText,
  Zap,
  Globe
} from 'lucide-react';
import { adminService, Permission } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

type AdminModule = 'users' | 'content' | 'finance' | 'analytics' | 'team' | 'system';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeModule, setActiveModule] = useState<AdminModule>('users');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      userService.getProfile(user.uid).then(setUserProfile);
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="loading loading-spinner text-primary" /></div>;
  if (!user || (userProfile && !adminService.isAdmin(userProfile.roles))) return <Navigate to={`/${lang || 'eng'}`} />;

  const canAccess = (module: AdminModule) => userProfile ? adminService.canAccessModule(userProfile.roles, module) : false;
  const hasPerm = (perm: Permission) => userProfile ? adminService.hasPermission(userProfile.roles, perm) : false;

  const modules: { id: AdminModule; label: string; icon: any }[] = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: Layout },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Shield },
    { id: 'system', label: 'System', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Admin Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-2">
                <Shield size={12} className="text-primary" />
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Staff Central</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                Role: {userProfile?.roles.filter(r => ['chief_manager', 'manager', 'moderator', 'admin'].includes(r)).join(' · ')}
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none uppercase">
              Admin <span className="text-primary italic">Console.</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-white focus:border-primary/50 outline-none transition-all w-64"
              />
            </div>
            <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
              <Zap size={20} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <aside className="space-y-2">
            {modules.map((mod) => {
              const disabled = !canAccess(mod.id);
              return (
                <button
                  key={mod.id}
                  onClick={() => !disabled && setActiveModule(mod.id)}
                  disabled={disabled}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    activeModule === mod.id 
                      ? 'bg-primary text-bg-dark font-black' 
                      : disabled 
                        ? 'opacity-20 cursor-not-allowed' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <mod.icon size={20} className={activeModule === mod.id ? 'text-bg-dark' : 'group-hover:text-primary transition-colors'} />
                    <span className="text-xs uppercase tracking-widest">{mod.label}</span>
                  </div>
                  {!disabled && <ChevronRight size={14} className={activeModule === mod.id ? 'text-bg-dark' : 'opacity-0 group-hover:opacity-100 transition-all'} />}
                  {disabled && <Lock size={12} />}
                </button>
              );
            })}
          </aside>

          {/* Main Dashboard Content */}
          <main className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-12 min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Module Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white">{activeModule} Management</h2>
                    <p className="text-white/40 text-sm font-medium">Manage and monitor {activeModule} across the platform.</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
                      Export Data
                    </button>
                    <button className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
                      Create New
                    </button>
                  </div>
                </div>

                {/* Module-Specific Content (Placeholders) */}
                {activeModule === 'users' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Total Users', value: '42,102', delta: '+12%', icon: Users },
                        { label: 'Active Today', value: '3,840', delta: '+5%', icon: Zap },
                        { label: 'Pending Verification', value: '128', delta: '-2%', icon: UserCheck },
                      ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-4">
                          <div className="flex justify-between">
                            <stat.icon size={20} className="text-primary" />
                            <span className="text-[10px] font-black text-emerald-500">{stat.delta}</span>
                          </div>
                          <div>
                            <div className="text-2xl font-black text-white">{stat.value}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-white/20">{stat.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/20">User</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/20">Roles</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/20">Status</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/20">Joined</th>
                            <th className="px-4 py-4 text-right"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2, 3, 4, 5].map((u) => (
                            <tr key={u} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="size-10 rounded-xl bg-white/5" />
                                  <div>
                                    <div className="text-xs font-bold text-white uppercase tracking-tight">User_{u}</div>
                                    <div className="text-[10px] text-white/20">user{u}@example.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex gap-1">
                                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">Student</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                                  <div className="size-1.5 rounded-full bg-emerald-500" /> Active
                                </span>
                              </td>
                              <td className="px-4 py-4 text-[10px] text-white/40 font-bold">Mar 21, 2026</td>
                              <td className="px-4 py-4 text-right">
                                <button className="p-2 text-white/20 hover:text-white transition-colors">
                                  <MoreVertical size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeModule === 'finance' && (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary">
                      <DollarSign size={40} />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">Financial Controls</h3>
                      <p className="text-white/40 text-sm max-w-sm">Access to real-time revenue, Stripe balance, and payout systems is restricted to Senior Management.</p>
                    </div>
                    {hasPerm('view_revenue') ? (
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 text-center space-y-2">
                          <div className="text-4xl font-black text-emerald-500">$142,850.00</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40">Gross Revenue (MTD)</div>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-center space-y-2">
                          <div className="text-4xl font-black text-primary">$12,402.15</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-primary/40">Stripe Balance</div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest">
                        Insufficient Permissions
                      </div>
                    )}
                  </div>
                )}

                {/* Rest of modules would follow similar pattern... */}
                {activeModule !== 'users' && activeModule !== 'finance' && (
                  <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-20">
                    {React.createElement(modules.find(m => m.id === activeModule)?.icon || Settings, { size: 64 })}
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">{activeModule} View Initializing...</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
