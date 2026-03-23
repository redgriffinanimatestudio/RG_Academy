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
  TrendingUp,
  PieChart,
  Target,
  Rocket,
  Scale
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function ChiefManagerDashboardContent({ activeModule, theme }: any) {
  return (
    <AnimatePresence mode="wait">
      {activeModule === 'dashboard' && <StrategyView theme={theme} />}
      {activeModule === 'all_contracts' && <ContractsView theme={theme} />}
      {activeModule === 'kpi_metrics' && <KPIView theme={theme} />}
      {activeModule === 'growth' && <GrowthView theme={theme} />}
      {activeModule === 'staff_list' && <StaffListView theme={theme} />}
      {activeModule === 'performance' && <PerformanceView theme={theme} />}
      {activeModule === 'legal' && <LegalView theme={theme} />}
      {activeModule === 'financials' && <FinancialsView theme={theme} />}
      {activeModule === 'risk_management' && <RiskView theme={theme} />}
      {activeModule === 'audit_log' && <AuditLogView theme={theme} />}
      {activeModule === 'roadmap' && <RoadmapView theme={theme} />}
      {!['dashboard', 'all_contracts', 'kpi_metrics', 'growth', 'staff_list', 'performance', 'legal', 'financials', 'risk_management', 'audit_log', 'roadmap'].includes(activeModule) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center">
          <Target size={64} className="mb-6" />
          <div className="text-[12px] font-black uppercase tracking-[0.5em]">{activeModule} View Initializing...</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RiskView({ theme }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl">
        <h3 className="text-xl font-black uppercase tracking-tight text-red-500 mb-8 flex items-center gap-3"><ShieldAlert size={24} /> Systemic Risk Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Operational Risk', val: 'Low', color: '#1d9e75' },
            { label: 'Financial Risk', val: 'Moderate', color: '#ef9f27' },
            { label: 'Compliance Risk', val: 'Low', color: '#1d9e75' }
          ].map((r, i) => (
            <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl">
              <div className="text-[10px] font-black text-white/40 uppercase mb-2">{r.label}</div>
              <div className="text-2xl font-black uppercase" style={{ color: r.color }}>{r.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditLogView({ theme }: any) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-[#2a2a2a] bg-black/20 flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-widest">Global Operations Audit</h3>
      </div>
      <div className="p-8 space-y-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
            <div className="text-[10px] font-black text-white/20 pt-1">14:{30-i}</div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">Admin Action: Role Update</div>
              <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-bold">User uid_0042 role changed to manager by super_admin</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapView({ theme }: any) {
  return (
    <div className="space-y-12 py-10">
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />
        {[
          { q: 'Q2 2026', title: 'Global Expansion', desc: 'Opening server clusters in Tokyo and London.' },
          { q: 'Q3 2026', title: 'Studio AI Integration', desc: 'Automated rendering optimization.' },
          { q: 'Q4 2026', title: 'Mobile Ecosystem', desc: 'Full RG Academy mobile app launch.' }
        ].map((m, i) => (
          <div key={i} className={`relative flex items-center gap-12 mb-20 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1 text-right">
              <div className={`space-y-2 ${i % 2 === 0 ? 'text-left' : 'text-right'}`}>
                <div className="text-xl font-black text-white uppercase tracking-tighter">{m.title}</div>
                <div className="text-xs text-white/40 font-medium leading-relaxed">{m.desc}</div>
              </div>
            </div>
            <div className="size-4 rounded-full bg-[#7f77dd] relative z-10 shadow-[0_0_20px_#7f77dd]" />
            <div className="flex-1">
              <div className={`text-2xl font-black text-[#7f77dd] uppercase tracking-tighter ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>{m.q}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalView({ theme }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#7f77dd]" size={24} />
            Compliance Status
          </h3>
          <div className="space-y-4">
            {[
              { label: 'GDPR Data Privacy', status: 'Compliant', color: '#1d9e75' },
              { label: 'Platform Terms of Service', status: 'Updated', color: '#378add' },
              { label: 'Lecturer Agreements', status: '98% Signed', color: '#7f77dd' },
              { label: 'Content Copyright Audit', status: 'In Progress', color: '#ef9f27' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <span className="text-xs font-bold text-white/60">{item.label}</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ borderColor: item.color + '40', color: item.color, backgroundColor: item.color + '10' }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <FileText className="text-[#7f77dd]" size={24} />
            Legal Action Queue
          </h3>
          <div className="space-y-4">
            {[
              { type: 'Dispute', project: 'CGI Environment Alpha', priority: 'High' },
              { type: 'Trademark', entity: 'Red Griffin Logo IP', priority: 'Medium' },
              { type: 'Licensing', asset: 'Unreal Engine Plugin', priority: 'Low' }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-tight">{item.type}</div>
                  <div className="text-[10px] text-white/40 mt-1">{Object.values(item)[1]}</div>
                </div>
                <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${item.priority === 'High' ? 'text-red-500 border-red-500/20' : 'text-blue-500 border-blue-500/20'}`}>{item.priority}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialsView({ theme }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Financial Treasury</h3>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-2">Platform Revenue and Expenditure Flow</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white tracking-tighter">$482,900.00</div>
            <div className="text-[10px] font-black text-[#1d9e75] uppercase tracking-widest mt-1">Total Assets Under Management</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { label: 'Academy Revenue', val: '$312,400', p: 65, color: '#7f77dd' },
            { label: 'Studio Contracts', val: '$142,500', p: 30, color: '#378add' },
            { label: 'Other Income', val: '$28,000', p: 5, color: '#1d9e75' }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</span>
                <span className="text-xs font-black text-white">{item.val}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.p}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ... existing code for StrategyView and ContractsView ...

function KPIView({ theme }: any) {
  const kpis = [
    { label: 'Revenue Target', val: '$120,000', p: 85, color: theme.accent },
    { label: 'Course Completion', val: '72%', p: 68, color: '#00f5d4' },
    { label: 'Studio NPS', val: '8.4/10', p: 84, color: '#378add' },
    { label: 'Talent Retention', val: '94%', p: 94, color: '#1d9e75' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-2 group-hover:text-[#888] transition-colors">{kpi.label}</div>
              <div className="text-3xl font-black text-white tracking-tighter mb-6">{kpi.val}</div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${kpi.p}%` }} transition={{ duration: 1.5, delay: i * 0.2 }} className="h-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ background: kpi.color }} />
              </div>
              <div className="mt-4 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#555]">
                <span>Progress</span>
                <span style={{ color: kpi.color }}>{kpi.p}%</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-all" style={{ background: kpi.color }} />
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-xl font-black uppercase tracking-tight">Department Efficiency Analysis</h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest">Yearly</button>
            <button className="px-4 py-2 bg-[#7f77dd] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#7f77dd]/20">Quarterly</button>
          </div>
        </div>
        <div className="h-[300px] flex items-end gap-4 px-4">
          {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 55].map((h, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: i * 0.05 }} className="flex-1 bg-gradient-to-t from-[#7f77dd]/5 to-[#7f77dd]/20 border-t border-[#7f77dd]/40 rounded-t-sm group-hover:from-[#7f77dd]/10 transition-all" />
          ))}
        </div>
      </div>
    </div>
  );
}

function GrowthView({ theme }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      <div className="space-y-8">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 shadow-2xl space-y-8">
          <h3 className="text-xl font-black uppercase tracking-tight">User Acquisition Channels</h3>
          <div className="grid gap-4">
            {[
              { label: 'Organic Search', val: '4,210', p: 72, c: '#00f5d4' },
              { label: 'Direct Traffic', val: '2,142', p: 45, c: '#378add' },
              { label: 'Social Referral', val: '1,892', p: 32, c: '#ef9f27' },
              { label: 'Email Campaigns', val: '1,421', p: 18, c: '#ef4444' }
            ].map((ch, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-[11px] text-[#555]" style={{ color: ch.c }}>{i+1}</div>
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tight">{ch.label}</div>
                    <div className="text-[10px] text-[#555] font-black uppercase mt-1">Growth: +12.4% MoM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white tracking-tighter">{ch.val}</div>
                  <div className="text-[9px] font-black uppercase" style={{ color: ch.c }}>{ch.p}% Impact</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6">Market Share Target</h3>
            <div className="flex flex-col items-center justify-center py-10 relative">
              <div className="size-48 rounded-full border-[10px] border-white/5 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tracking-tighter">14.2%</span>
                <span className="text-[9px] font-black text-[#555] uppercase tracking-widest mt-1">Overall Sector</span>
              </div>
              <motion.div initial={{ rotate: 0 }} animate={{ rotate: 140 }} transition={{ duration: 2, type: 'spring' }} className="absolute inset-0 border-[10px] border-transparent border-t-[#7f77dd] rounded-full shadow-[0_0_30px_#7f77dd]/20" />
            </div>
            <button className="w-full py-4 bg-[#7f77dd] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#7f77dd]/20 hover:scale-[1.02] transition-all mt-6">Review Expansion Strategy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffListView({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111] p-4 border border-[#2a2a2a] rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
          <input className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl py-2 pl-10 pr-4 text-[11px] font-black uppercase tracking-widest focus:border-[#7f77dd] outline-none" placeholder="Search operations team..." />
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-6 bg-[#181818] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-white transition-all">Filter</button>
          <button className="h-10 px-6 bg-[#7f77dd] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ Onboard Expert</button>
        </div>
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 text-[9px] font-black text-[#555] uppercase tracking-widest">
              <th className="px-8 py-6">Member Identity</th>
              <th className="px-8 py-6">Role / Dept</th>
              <th className="px-8 py-6">Load Factor</th>
              <th className="px-8 py-6 text-right">Ops Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {[
              { name: 'Alex Rivera', role: 'Head of Academy', dept: 'Edu Ops', load: 82, color: '#378add' },
              { name: 'Sarah Chen', role: 'Studio Producer', dept: 'Production', load: 64, color: '#1d9e75' },
              { name: 'Mark Voronin', role: 'Lead Moderator', dept: 'Community', load: 45, color: '#ef9f27' },
              { name: 'Elena Sol', role: 'HR Specialist', dept: 'Talent', load: 92, color: '#ef4444' }
            ].map((staff, i) => (
              <tr key={i} className="hover:bg-white/[0.01] group transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-[11px] group-hover:text-[#7f77dd] transition-colors">{staff.name.charAt(0)}</div>
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-tight">{staff.name}</div>
                      <div className="text-[10px] text-[#555] font-black uppercase mt-0.5">rg.team@{staff.name.toLowerCase().split(' ')[0]}.ac</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-xs font-bold text-white/80">{staff.role}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-[#555] mt-0.5">{staff.dept}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-1 bg-[#222] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${staff.load}%`, background: staff.color }} />
                    </div>
                    <span className="text-[10px] font-black" style={{ color: staff.color }}>{staff.load}%</span>
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
    </div>
  );
}

function PerformanceView({ theme }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Avg Task Velocity', val: '4.2d', sub: 'Faster than sector avg' },
          { label: 'Quality Audit Score', val: '9.8/10', sub: 'Elite performance tier' },
          { label: 'Resolution Rate', val: '98.4%', sub: '24h SLA compliant' }
        ].map((p, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-[2rem] p-8 space-y-4 hover:border-[#7f77dd]/30 transition-all shadow-xl group">
            <div className="text-[10px] font-black text-[#555] uppercase tracking-widest group-hover:text-[#888] transition-colors">{p.label}</div>
            <div className="text-4xl font-black text-white tracking-tighter">{p.val}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#7f77dd]">{p.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7f77dd]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Zap size={64} className="mx-auto mb-6 text-[#7f77dd]" />
        <div className="text-xl font-black uppercase tracking-[0.5em] mb-4">Master Efficiency Engine</div>
        <p className="max-w-md mx-auto text-xs text-[#555] font-black uppercase tracking-widest leading-relaxed">System performance is currently optimized for global scale. All operational parameters are within nominal ranges.</p>
        <button className="mt-8 px-8 py-4 bg-[#181818] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all relative z-10">Run Global Audit</button>
      </div>
    </div>
  );
}

export default function ChiefManagerDashboard() {
  const { lang } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'dashboard';

  const theme = {
    bg: '#0a0a0a',
    bg2: '#111',
    bg3: '#181818',
    bg4: '#222',
    accent: '#7f77dd', // Purple
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accent }} />
    </div>
  );
  
  const isChief = userProfile?.roles.includes('chief_manager') || userProfile?.roles.includes('admin');
  if (!user || (userProfile && !isChief)) return <Navigate to={`/${lang || 'eng'}`} />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full animate-pulse" style={{ background: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }} />
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
              {activeModule.replace(/_/g, ' ')}
            </h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            Global Operations / {activeModule === 'dashboard' ? 'Strategy' : activeModule}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-8 px-4 bg-[#7f77dd] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">+ New Project</button>
        </div>
      </div>

      <ChiefManagerDashboardContent activeModule={activeModule} theme={theme} />
    </div>
  );
}

function StrategyView({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{l:'Quarterly Revenue',v:'$72,440',c:theme.accent},{l:'Platform NPS',v:'74',c:'#1d9e75'},{l:'User Retention',v:'68%',c:'#ef9f27'},{l:'Active Staff',v:'24',c:'#378add'}].map((m, i) => (
          <div key={i} className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
            <div className="text-[9px] font-black text-[#555] uppercase tracking-widest">{m.l}</div>
            <div className="text-3xl font-black text-white tracking-tighter">{m.v}</div>
            <div className="h-1 bg-[#222] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: m.c }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6">Department KPIs</div>
          <div className="space-y-4">
            {['Academy - Content Growth', 'Studio - Completion Rate', 'Support - SLA Score'].map(k => (
              <div key={k} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-xs font-bold text-[#888]">{k}</span>
                <span className="text-xs font-black text-white">92%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6">Revenue by Mode</div>
          <div className="space-y-6">
            {[{l:'Academy', p:64},{l:'Studio', p:36}].map(r => (
              <div key={r.l} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span>{r.l}</span><span>{r.p}%</span></div>
                <div className="h-1.5 bg-[#222] rounded-full overflow-hidden"><div className="h-full bg-[#7f77dd]" style={{ width: `${r.p}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContractsView({ theme }: any) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-[#2a2a2a] bg-black/20 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-widest">Global Contract Ledger</div>
        <button className="text-[9px] font-black text-[#7f77dd] uppercase tracking-widest hover:underline">Download Report</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-black/20 text-[9px] font-black text-[#555] uppercase tracking-widest"><th className="px-8 py-4">Client</th><th className="px-8 py-4">Project</th><th className="px-8 py-4">Value</th><th className="px-8 py-4">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {[1,2,3,4,5].map(i => (
            <tr key={i} className="hover:bg-white/[0.01]">
              <td className="px-8 py-5 text-xs font-bold text-white">Client Studio {i}</td>
              <td className="px-8 py-5 text-xs text-[#888]">CGI Production Phase {i}</td>
              <td className="px-8 py-5 text-xs font-black text-[#7f77dd]">$12,400</td>
              <td className="px-8 py-5"><span className="px-2 py-0.5 bg-[#7f77dd]/10 text-[#7f77dd] text-[9px] font-black uppercase rounded-full border border-[#7f77dd]/20">Active</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
