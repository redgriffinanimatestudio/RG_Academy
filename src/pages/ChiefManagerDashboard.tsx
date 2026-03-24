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
  Scale,
  DollarSign,
  ShieldAlert,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function ChiefManagerDashboardContent({ activeModule, theme }: any) {
  return (
    <AnimatePresence mode="wait">
      {activeModule === 'overview' && <OverviewView theme={theme} />}
      {activeModule === 'academy' && <AcademyView theme={theme} />}
      {activeModule === 'studio' && <StudioView theme={theme} />}
      {activeModule === 'team' && <TeamView theme={theme} />}
      {activeModule === 'contracts' && <ContractsView theme={theme} />}
      {activeModule === 'queue' && <QueueView theme={theme} />}
      {!['overview', 'academy', 'studio', 'team', 'contracts', 'queue'].includes(activeModule) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center">
          <Target size={64} className="mb-6" />
          <div className="text-[12px] font-black uppercase tracking-[0.5em]">{activeModule} View Initializing...</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OverviewView({ theme }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Platform Revenue', val: '$148,200', delta: '+12%', icon: DollarSign, color: '#1d9e75' },
          { label: 'Active Users', val: '42,380', delta: '+8%', icon: Users, color: '#378add' },
          { label: 'Active Contracts', val: '318', delta: '-3 in dispute', icon: Briefcase, color: '#ef9f27' },
          { label: 'Pending Moderation', val: '24', delta: 'Requires action', icon: Shield, color: '#ef4444' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-[2rem] p-8 space-y-4 hover:border-white/10 transition-all shadow-2xl group relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{kpi.label}</div>
              <kpi.icon size={18} style={{ color: kpi.color }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-4xl font-black text-white tracking-tighter relative z-10">{kpi.val}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest relative z-10" style={{ color: kpi.color }}>{kpi.delta}</div>
            <div className="absolute top-0 right-0 w-24 h-24 blur-[50px] opacity-5 group-hover:opacity-10 transition-opacity" style={{ background: kpi.color }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Revenue Split Chart */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Revenue Flow: Academy vs Studio</div>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-white uppercase">Academy</span>
                <span className="text-lg font-black text-[#7f77dd] tracking-tight">$106k</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-[#7f77dd] rounded-full shadow-[0_0_20px_rgba(127,119,221,0.3)]" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-white uppercase">Studio</span>
                <span className="text-lg font-black text-[#1d9e75] tracking-tight">$42k</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '28%' }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} className="h-full bg-[#1d9e75] rounded-full shadow-[0_0_20px_rgba(29,158,117,0.3)]" />
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 space-y-6">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Growth Vector (12 Months)</div>
            <div className="h-32 flex items-end gap-2 px-2">
              {[40, 55, 48, 62, 58, 70, 65, 78, 82, 88, 94, 100].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }} 
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className={`flex-1 rounded-t-sm transition-all group-hover:brightness-125 ${i >= 8 ? 'bg-[#7f77dd]' : 'bg-[#7f77dd]/30'}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-black text-white/20 uppercase px-2">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Role Distribution Donut and New Registrations */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Identity Distribution</div>
          <div className="flex items-center gap-10">
            <div className="relative size-32 shrink-0">
              <svg className="size-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#7f77dd" strokeWidth="12" strokeDasharray="251" strokeDashoffset="125" strokeLinecap="round" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1d9e75" strokeWidth="12" strokeDasharray="251" strokeDashoffset="188" strokeLinecap="round" transform="rotate(45 50 50)" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef9f27" strokeWidth="12" strokeDasharray="251" strokeDashoffset="220" strokeLinecap="round" transform="rotate(135 50 50)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white leading-none">42k</span>
                <span className="text-[8px] font-black text-white/20 uppercase mt-1">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[
                { label: 'Student', p: '50%', c: '#7f77dd' },
                { label: 'Executor', p: '25%', c: '#1d9e75' },
                { label: 'Lecturer', p: '13%', c: '#ef9f27' },
                { label: 'Client', p: '12%', c: '#ef4444' }
              ].map((role, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full" style={{ background: role.c }} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{role.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-white/40">{role.p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 space-y-6">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">New Entities (7 Days)</div>
            <div className="h-16 flex items-end gap-1 px-1">
              {[60, 80, 50, 90, 70, 100, 85].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }} 
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`flex-1 rounded-t-sm transition-all ${i >= 5 ? 'bg-[#1d9e75]' : 'bg-[#1d9e75]/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Academy Oversight', color: '#7f77dd', kpis: [{ l: 'Courses', v: '214' }, { l: 'Enrolled', v: '18,420' }], p: 64 },
          { label: 'Studio Operations', color: '#1d9e75', kpis: [{ l: 'Projects', v: '87' }, { l: 'Active Contracts', v: '318' }], p: 82 },
          { label: 'Content Moderation', color: '#ef9f27', kpis: [{ l: 'Pending Reviews', v: '12' }, { l: 'Resolved Today', v: '19' }], p: 79 }
        ].map((dept, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-[2rem] p-8 space-y-6 shadow-2xl">
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: dept.color }}>{dept.label}</div>
            <div className="space-y-3">
              {dept.kpis.map((k, j) => (
                <div key={j} className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/40 uppercase">{k.l}</span>
                  <span className="text-xs font-black text-white tracking-tight">{k.v}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-white/5">
              <div className="flex justify-between text-[9px] font-black uppercase text-white/20"><span>Completion / Success</span><span>{dept.p}%</span></div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${dept.p}%` }} className="h-full rounded-full" style={{ background: dept.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AcademyView({ theme }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', val: '241', delta: '+14' },
          { label: 'Academy Rev', val: '$106.4k', delta: '+18%' },
          { label: 'Avg Rating', val: '4.7', delta: 'out of 5.0' },
          { label: 'Certificates', val: '3,240', delta: '+210' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl border-l-4" style={{ borderLeftColor: theme.accent }}>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{kpi.label}</div>
            <div className="text-2xl font-black text-white tracking-tighter">{kpi.val}</div>
            <div className="text-[10px] font-bold text-[#7f77dd] uppercase mt-1">{kpi.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Top Performing Lecturers</div>
          <div className="divide-y divide-white/5">
            {[
              { name: 'Alex Rivera', courses: 12, students: '15,420', revenue: '$24,800', initial: 'AR', color: '#7f77dd' },
              { name: 'Sarah Chen', courses: 8, students: '8,200', revenue: '$18,300', initial: 'SC', color: '#1d9e75' },
              { name: 'Marcus Thorne', courses: 6, students: '22,100', revenue: '$15,600', initial: 'MT', color: '#ef9f27' },
              { name: 'Elena Vance', courses: 4, students: '45,000', revenue: '$12,900', initial: 'EV', color: '#378add' }
            ].map((lec, i) => (
              <div key={i} className="py-6 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="size-14 rounded-2xl flex items-center justify-center text-xl font-black" style={{ background: lec.color + '20', color: lec.color }}>{lec.initial}</div>
                  <div>
                    <div className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#7f77dd] transition-colors">{lec.name}</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">{lec.courses} Courses · {lec.students} Students</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white tracking-tighter">{lec.revenue}</div>
                  <div className="text-[10px] font-black text-[#1d9e75] uppercase tracking-widest mt-1">Active</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Category Saturation</div>
          <div className="space-y-6">
            {[
              { label: '3D Modeling', count: 86, p: 85, color: '#7f77dd' },
              { label: 'Animation', count: 63, p: 62, color: '#7f77dd' },
              { label: 'VFX', count: 49, p: 48, color: '#AFA9EC' },
              { label: 'Game Dev', count: 33, p: 32, color: '#CECBF6' },
              { label: 'Digital Art', count: 24, p: 22, color: '#CECBF6' }
            ].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white">{cat.label}</span>
                  <span className="text-white/40">{cat.count} Courses</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${cat.p}%` }} className="h-full rounded-full" style={{ background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all mt-6">Review Growth Matrix</button>
        </div>
      </div>
    </motion.div>
  );
}

function StudioView({ theme }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Open Projects', val: '87', delta: '+11' },
          { label: 'Studio Rev', val: '$41.8k', delta: '+6%' },
          { label: 'Active Disputes', val: '3', delta: 'High Priority' },
          { label: 'Executors', val: '2,140', delta: '+88 new' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl border-l-4" style={{ borderLeftColor: '#1d9e75' }}>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{kpi.label}</div>
            <div className="text-2xl font-black text-white tracking-tighter">{kpi.val}</div>
            <div className="text-[10px] font-bold text-[#1d9e75] uppercase mt-1">{kpi.delta}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
        <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Production Funnel Overview</div>
        <div className="flex h-12 gap-1 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex-[87] bg-[#E1F5EE] flex items-center justify-center text-[10px] font-black text-[#0F6E56] uppercase tracking-widest border-r border-black/10">Open 87</div>
          <div className="flex-[46] bg-[#9FE1CB] flex items-center justify-center text-[10px] font-black text-[#085041] uppercase tracking-widest border-r border-black/10">Active 46</div>
          <div className="flex-[318] bg-[#5DCAA5] flex items-center justify-center text-[10px] font-black text-[#04342C] uppercase tracking-widest border-r border-black/10">Contracts 318</div>
          <div className="flex-[280] bg-[#1d9e75] flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest">Done 280</div>
          <div className="flex-[3] bg-red-500 flex items-center justify-center text-[10px] font-black text-white animate-pulse" title="Disputes">3</div>
        </div>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
          <span>Tenders / Bidding</span>
          <span>In Production</span>
          <span>Delivery / Milestone</span>
          <span>Archived / Paid</span>
          <span className="text-red-500">Alerts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Top Production Partners</div>
          <div className="divide-y divide-white/5">
            {[
              { name: 'Sarah Connor', role: 'Senior 3D Artist', initial: 'SC', value: '$48,200', location: 'LA' },
              { name: 'John Doe', role: 'VFX Supervisor', initial: 'JD', value: '$36,700', location: 'London' },
              { name: 'Jane Smith', role: 'Concept Artist', initial: 'JS', value: '$29,400', location: 'Tokyo' }
            ].map((p, i) => (
              <div key={i} className="py-6 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="size-12 rounded-xl bg-[#1d9e75]/20 flex items-center justify-center text-lg font-black text-[#1d9e75]">{p.initial}</div>
                  <div>
                    <div className="text-base font-black text-white uppercase tracking-tight group-hover:text-[#1d9e75] transition-colors">{p.name}</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">{p.role} · {p.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-white tracking-tighter">{p.value}</div>
                  <div className="text-[9px] font-black text-[#1d9e75] uppercase tracking-widest mt-1">Top Rated</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Active Disputes</div>
          <div className="space-y-4">
            {[
              { project: 'Neon City VFX', sub: 'Client vs Executor · $12,400', status: 'Disputed' },
              { project: 'Game Rig Pack', sub: 'Milestone dispute · $3,200', status: 'Alert' },
              { project: 'Concept Sprint', sub: 'Delivery delay · $1,800', status: 'Warning' }
            ].map((d, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-red-500/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tight">{d.project}</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase mt-1">{d.sub}</div>
                  </div>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TeamView({ theme }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Operations Team', val: '24', delta: '+2 this month' },
          { label: 'Moderators', val: '6', delta: '3 currently online' },
          { label: 'Managers', val: '4', delta: 'All active' },
          { label: 'Support Tier', val: '14', delta: '8 on shift' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{kpi.label}</div>
            <div className="text-2xl font-black text-white tracking-tighter">{kpi.val}</div>
            <div className="text-[10px] font-bold text-[#7f77dd] uppercase mt-1">{kpi.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Core Operations Managers</div>
          <div className="space-y-2">
            {[
              { name: 'Katya Morozova', role: 'Academy Operations', initial: 'KM', stats: '214 Courses', color: '#7f77dd' },
              { name: 'Dmitri Sokolov', role: 'Studio Production', initial: 'DS', stats: '318 Contracts', color: '#1d9e75' },
              { name: 'Lena Azimova', role: 'Financial Control', initial: 'LA', stats: '$148k Rev', color: '#ef9f27' },
              { name: 'Pavel Hassan', role: 'Support & Experience', initial: 'PH', stats: '98% SLA', color: '#378add' }
            ].map((m, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] rounded-3xl transition-all group">
                <div className="flex items-center gap-6">
                  <div className="size-12 rounded-full flex items-center justify-center font-black text-white" style={{ background: m.color }}>{m.initial}</div>
                  <div>
                    <div className="text-base font-black text-white uppercase tracking-tight group-hover:text-[#7f77dd] transition-colors">{m.name}</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-0.5">{m.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white uppercase">{m.stats.split(' ')[0]}</div>
                  <div className="text-[9px] font-black text-white/20 uppercase mt-0.5">{m.stats.split(' ')[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Active Moderation Tier</div>
          <div className="space-y-2">
            {[
              { name: 'Nina Bloch', role: 'Content Moderation', initial: 'NB', stats: '47 Decisions', color: '#ef4444' },
              { name: 'Omar Khadr', role: 'Community & Ethics', initial: 'OK', stats: '38 Decisions', color: '#7f77dd' },
              { name: 'Yuki Larsson', role: 'Review Verification', initial: 'YL', stats: '29 Decisions', color: '#1d9e75' }
            ].map((m, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] rounded-3xl transition-all group">
                <div className="flex items-center gap-6">
                  <div className="size-12 rounded-full border-2 border-white/5 flex items-center justify-center font-black text-white" style={{ background: m.color }}>{m.initial}</div>
                  <div>
                    <div className="text-base font-black text-white uppercase tracking-tight">{m.name}</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-0.5">{m.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white uppercase">{m.stats.split(' ')[0]}</div>
                  <div className="text-[9px] font-black text-white/20 uppercase mt-0.5">{m.stats.split(' ')[1]}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-white/5">
            <button className="w-full py-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all">Evaluate Load Distribution</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ContractsView({ theme }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Global Contracts', val: '318', delta: '+22 this month' },
          { label: 'Active Volume', val: '$890k', delta: '+14%' },
          { label: 'Avg Deal Time', val: '18d', delta: 'Nominal' },
          { label: 'Paid Milestones', val: '$340k', delta: 'Q1 Output' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{kpi.label}</div>
            <div className="text-2xl font-black text-white tracking-tighter">{kpi.val}</div>
            <div className="text-[10px] font-bold text-[#7f77dd] uppercase mt-1">{kpi.delta}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-[#2a2a2a] flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tight">Global Contract Ledger</h3>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest">Active Filters</button>
            <button className="px-6 py-3 bg-[#7f77dd] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Export Ledger</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-[9px] font-black text-white/20 uppercase tracking-widest">
                <th className="px-10 py-6">Project Title</th>
                <th className="px-10 py-6">Participants</th>
                <th className="px-10 py-6">Value</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { title: 'Cyberpunk Cinematics', flow: 'Starlight Studios → John Doe', val: '$120,000', status: 'Active', c: '#1d9e75' },
                { title: 'RPG Character Pack', flow: 'Nebula Games → Sarah Connor', val: '$85,000', status: 'Active', c: '#1d9e75' },
                { title: 'Neon City VFX', flow: 'Independent → Jane Smith', val: '$48,500', status: 'Dispute', c: '#ef4444' },
                { title: 'Env Art Collection', flow: 'GameForge → Marcus Thorne', val: '$36,200', status: 'Done', c: '#555' },
                { title: 'Houdini FX Library', flow: 'VFX House → Elena Vance', val: '$28,000', status: 'Pending', c: '#ef9f27' }
              ].map((c, i) => (
                <tr key={i} className="hover:bg-white/[0.01] group transition-colors">
                  <td className="px-10 py-8">
                    <div className="text-sm font-black text-white uppercase tracking-tight">{c.title}</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-[11px] text-white/40 font-bold uppercase tracking-widest">{c.flow}</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-base font-black text-white tracking-tighter">{c.val}</div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border" style={{ borderColor: c.c + '40', color: c.c, background: c.c + '05' }}>{c.status}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="text-[10px] font-black uppercase text-[#7f77dd] hover:underline">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function QueueView({ theme }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Courses for Publication', val: '8', icon: Box },
          { label: 'Review Complaints', val: '12', icon: MessageSquare },
          { label: 'Disputes Pending', val: '3', icon: Scale },
          { label: 'User Reports', val: '2', icon: Shield }
        ].map((k, i) => (
          <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 flex items-center gap-6 shadow-xl">
            <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20"><k.icon size={24} /></div>
            <div>
              <div className="text-2xl font-black text-white">{k.val}</div>
              <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
        <h3 className="text-xl font-black uppercase tracking-tight border-b border-white/5 pb-6">Content Moderation Queue</h3>
        <div className="space-y-4">
          {[
            { title: 'Mastering Substance Painter 2025', author: 'Alex Rivera', cat: '3D Modeling', lessons: 24, time: '2h ago', color: '#ef9f27' },
            { title: 'Rigging for Games — Advanced', author: 'Marcus Thorne', cat: 'Animation', lessons: 18, time: '5h ago', color: '#378add' },
            { title: 'ZBrush Creature Design', author: 'David Miller', cat: '3D Modeling', lessons: 31, time: '1d ago', color: '#ef9f27' }
          ].map((q, i) => (
            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-white/10 transition-all">
              <div className="flex items-center gap-8">
                <div className="size-14 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: q.color }}><Box size={24} className="text-bg-dark" /></div>
                <div>
                  <div className="text-lg font-black text-white uppercase tracking-tight">{q.title}</div>
                  <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">{q.author} · {q.cat} · {q.lessons} Lessons · Sent {q.time}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-8 py-3 bg-[#1d9e75]/10 text-[#1d9e75] border border-[#1d9e75]/20 rounded-2xl text-[10px] font-black uppercase hover:bg-[#1d9e75] hover:text-white transition-all">Approve</button>
                <button className="px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Reject</button>
                <button className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all"><ExternalLink size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
        <h3 className="text-xl font-black uppercase tracking-tight border-b border-white/5 pb-6">Review Flagged Queue</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Feedback on "Houdini Destruction"', sub: '3 Reports · Rating 1/5 · Spam suspicion', priority: 'High' },
            { title: 'Feedback on "UE5 Lighting"', sub: '1 Report · Violates Community Guidelines', priority: 'Medium' }
          ].map((r, i) => (
            <div key={i} className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden group hover:border-red-500/20 transition-all">
              <div className="absolute top-0 right-0 p-8 text-red-500/10 group-hover:text-red-500/30 transition-colors"><Shield size={40} /></div>
              <div>
                <div className="text-base font-black text-white uppercase tracking-tight leading-tight">{r.title}</div>
                <div className="text-[10px] text-white/40 font-bold uppercase mt-2">{r.sub}</div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Delete</button>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ChiefManagerDashboard() {
  const { lang } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'overview';

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
            Global Operations / {activeModule === 'overview' ? 'Strategy' : activeModule}
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
