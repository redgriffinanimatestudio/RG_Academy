import React, { useMemo, Suspense } from 'react';
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  FileCheck,
  Zap,
  GraduationCap,
  Cpu,
  Briefcase,
  Clock,
  Loader2,
  BookOpen,
  PlayCircle,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import ViewModuleController from '../components/professional/ViewModuleController';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { activeRole } = useAuth();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';
  const [stats, setStats] = React.useState<any>(null);
  const fetchStats = async () => {
    try {
      const { data } = await apiClient.get('/v1/admin/stats');
      if (data.success) setStats(data.data);
    } catch (e) {
      console.error('Failed to fetch admin stats', e);
    }
  };
  // Load on mount or when view changes
  React.useEffect(() => {
    if (view === 'dashboard') fetchStats();
  }, [view]);
  const { activeRole } = useAuth();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';

  // Identification mapping for Dashboard Titles & Content
  const ROLE_CONTENT = useMemo(() => ({
    admin: {
      title: 'University Governance',
      health: 98,
      kpis: [
        { label: 'Platform GPA', value: '4.82', trend: '+2.1%', icon: GraduationCap, color: 'text-amber-400' },
        { label: 'Node Uptime', value: '99.9%', trend: 'Steady', icon: Cpu, color: 'text-emerald-400' },
        { label: 'Total Entities', value: '1,248', trend: '+124', icon: Users, color: 'text-indigo-400' }
      ],
      actions: [
        { id: 'ACT-001', text: 'Program Syllabus Audit', time: '14:20', type: 'System' },
        { id: 'ACT-002', text: 'Identity Permission Sync', time: '11:05', type: 'RBAC' },
        { id: 'ACT-003', text: 'Infrastructure Patch v2.0', time: 'Yesterday', type: 'Dev' }
      ]
    },
    hr: {
      title: 'Human Resources Hub',
      health: 94,
      kpis: [
        { label: 'Lecturer Apps', value: '24', trend: '+5', icon: Briefcase, color: 'text-indigo-400' },
        { label: 'Staff Performance', value: '8.4/10', trend: '+0.2', icon: TrendingUp, color: 'text-amber-400' },
        { label: 'User Satisfaction', value: '92%', trend: '+1.4%', icon: Zap, color: 'text-emerald-400' }
      ],
      actions: [
        { id: 'HR-001', text: 'Lead Artist Interview', time: '14:00', type: 'Recruitment' },
        { id: 'HR-002', text: 'Contract Renewal: B. Ray', time: '16:30', type: 'Payroll' },
        { id: 'HR-003', text: 'Standardize Faculty Onboarding', time: 'Tomorrow', type: 'Strategy' }
      ]
    },
    finance: {
      title: 'Financial Control Center',
      health: 100,
      kpis: [
        { label: 'Active Escrow', value: '$142,500', trend: 'Steady', icon: DollarSign, color: 'text-emerald-400' },
        { label: 'Weekly Revenue', value: '$18,240', trend: '+12%', icon: TrendingUp, color: 'text-sky-400' },
        { label: 'Tax Compliance', value: 'Ready', trend: 'Audit', icon: FileCheck, color: 'text-indigo-500' }
      ],
      actions: [
        { id: 'FIN-001', text: 'Escrow Release Alert: UE5 Project', time: '09:00', type: 'Payments' },
        { id: 'FIN-002', text: 'Refund Request: #ORD-992', time: '10:45', type: 'Dispute' },
        { id: 'FIN-003', text: 'Monthly Faculty Payout', time: '2 Days Left', type: 'Ledger' }
      ]
    },
    manager: {
      title: 'Nexus Operations',
      health: 96,
      kpis: [
        { label: 'Active Courses', value: '62', trend: '+2', icon: GraduationCap, color: 'text-emerald-400' },
        { label: 'Operational Health', value: 'Steady', trend: '96%', icon: Shield, color: 'text-sky-400' },
        { label: 'Registrations', value: '442', trend: '+28', icon: Users, color: 'text-amber-400' }
      ],
      actions: [
        { id: 'OPS-001', text: 'Daily Regional Sync', time: '08:00', type: 'Governance' },
        { id: 'OPS-002', text: 'Faculty Growth Report', time: '15:00', type: 'Strategic' },
        { id: 'OPS-003', text: 'Asset Pipeline Bottleneck', time: '17:30', type: 'Urgent' }
      ]
    },
    student: {
      title: 'Academic Workspace',
      health: 100,
      kpis: [
        { label: 'Enrolled Courses', value: '4', trend: '+1', icon: BookOpen, color: 'text-sky-400' },
        { label: 'Lessons Done', value: '42', trend: '+12', icon: PlayCircle, color: 'text-emerald-400' },
        { label: 'Academic GPA', value: '4.8', trend: 'Elite', icon: Trophy, color: 'text-amber-400' }
      ],
      actions: [
        { id: 'STU-001', text: 'UE5 Lighting Assignment', time: 'Due Today', type: 'Deadline' },
        { id: 'STU-002', text: 'VFX Masterclass: Houdini', time: '18:00', type: 'Lecture' },
        { id: 'STU-003', text: 'Review: Rigging Basics', time: 'Tomorrow', type: 'Revision' }
      ]
    }
  }[activeRole as string] || {
    title: 'Professional Workspace',
    health: 0,
    kpis: [],
    actions: []
  }), [activeRole]);

  // If view is 'dashboard', show the overview charts & KPIs. 
  const isBaseView = view === 'dashboard' || !view;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeRole}-${view}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Dynamic Dashboard Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4 mb-2">
                  <Shield className="text-primary" />
                  {ROLE_CONTENT.title}
                  <span className="text-[10px] font-mono font-black text-primary px-3 py-1 bg-primary/10 border border-primary/20 rounded-full tracking-widest not-italic">IDENTITY_NODE: {activeRole?.toUpperCase()}</span>
                </h1>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest max-w-lg">Academy Infrastructure Managed Pulse</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Infrastructure Health</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black italic tracking-tighter text-emerald-400">{ROLE_CONTENT.health}%</span>
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${ROLE_CONTENT.health}%` }}
                        className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Dispatcher */}
            {isBaseView ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* KPI Core Grid */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ROLE_CONTENT.kpis.map((kpi, idx) => (
                      <div key={idx} className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl group hover:border-primary/40 transition-all cursor-default relative overflow-hidden">
                        <kpi.icon className={`absolute top-4 right-4 text-white/5 group-hover:${kpi.color} group-hover:opacity-10 group-hover:scale-125 transition-all`} size={64} />
                        <div className="relative z-10">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">{kpi.label}</p>
                          <h3 className="text-3xl font-black italic tracking-tighter mb-1">{kpi.value}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-white/40'}`}>{kpi.trend}</span>
                            <div className={`h-px w-8 ${kpi.trend.startsWith('+') ? 'bg-emerald-400/40' : 'bg-white/10'}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Analytics Waveform */}
                  <div className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[2.5rem] p-10 h-[400px] flex flex-col justify-end relative group overflow-hidden">
                    <div className="absolute top-10 left-10 z-10">
                      <p className="text-xs font-black uppercase text-white/20 tracking-widest mb-2 italic">Analytics Waveform</p>
                      <h4 className="text-3xl font-black italic uppercase tracking-tighter">Unified Pulse Tracking</h4>
                    </div>
                    <div className="flex items-end justify-between h-48 gap-4 px-4 overflow-hidden relative z-10">
                      {[15, 30, 25, 60, 45, 80, 55, 90, 70, 100, 85, 95].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                          className="flex-1 bg-white/5 group-hover:bg-primary/20 rounded-t-xl transition-all relative"
                        >
                          {h > 80 && <div className="absolute -top-1 size-1.5 bg-primary rounded-full left-1/2 -translate-x-1/2 animate-pulse" />}
                        </motion.div>
                      ))}
                    </div>
                    <div className="size-64 bg-primary/5 blur-[100px] absolute -bottom-32 left-1/2 -translate-x-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Unified Action Queue */}
                <aside className="space-y-8">
                  <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 sticky top-24 backdrop-blur-md">
                    <h3 className="text-sm font-black italic uppercase tracking-tighter flex items-center gap-3 mb-8">
                      <Zap className="text-primary fill-primary/20" size={18} />
                      Action Queue
                    </h3>
                    <div className="space-y-6">
                      {ROLE_CONTENT.actions.map((action) => (
                        <div key={action.id} className="group relative pl-6 cursor-pointer">
                          <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-white/5 group-hover:bg-primary transition-all rounded-full" />
                          <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{action.type} · {action.time}</p>
                          <h4 className="text-sm font-bold tracking-tight">{action.text}</h4>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Expand Operations Queue</button>
                  </div>
                </aside>
              </div>
            ) : (
              <ViewModuleController />
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminDashboard;
