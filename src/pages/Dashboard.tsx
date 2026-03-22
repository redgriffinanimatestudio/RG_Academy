import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Play, 
  ChevronRight,
  Calendar,
  Star,
  Zap,
  CheckCircle,
  Search,
  Filter,
  Users,
  DollarSign,
  Briefcase,
  PieChart,
  Plus,
  Layout,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Layers,
  Box,
  Video,
  Shield,
  Cpu,
  MoreVertical,
  LayoutDashboard,
  FileText,
  CreditCard,
  History,
  Target,
  UserCheck,
  LifeBuoy,
  Settings,
  Mail,
  Heart,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { user, profile, activeRole } = useAuth();
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'overview';

  // Role-based accent colors
  const roleColors: Record<string, string> = {
    student: '#378add',
    lecturer: '#1d9e75',
    client: '#ef9f27',
    executor: '#e24b4a',
    admin: '#ef4444'
  };

  const accentColor = roleColors[activeRole || 'student'] || '#00f5d4';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto py-2">
      {/* HEADER SECTION */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex flex-col">
          <div className="text-[14px] font-medium uppercase tracking-tight text-white/80 flex items-center gap-2">
            <span style={{ color: accentColor }}>{activeRole?.replace('_', ' ')}</span>
            <span className="opacity-20">/</span>
            <span>{currentView.replace(/_/g, ' ')}</span>
          </div>
          <div className="text-[11px] font-medium text-white/40 uppercase tracking-widest mt-1">
            {user?.displayName || 'User'} · {new Date().toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/20">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-500/80">System Live</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD MODULES */}
      <motion.div
        key={`${activeRole}-${currentView}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {activeRole === 'student' && <StudentViews view={currentView} accent={accentColor} lang={lang} />}
        {activeRole === 'lecturer' && <LecturerViews view={currentView} accent={accentColor} lang={lang} />}
        {activeRole === 'client' && <ClientViews view={currentView} accent={accentColor} lang={lang} />}
        {activeRole === 'executor' && <ExecutorViews view={currentView} accent={accentColor} lang={lang} />}
        
        {(!activeRole || !['student', 'lecturer', 'client', 'executor'].includes(activeRole)) && (
          <div className="p-20 text-center opacity-20">
            <LayoutDashboard size={64} className="mx-auto mb-6" />
            <div className="text-xl font-black uppercase tracking-[0.5em]">Workspace Ready</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// --- STUDENT VIEWS ---

function StudentViews({ view, accent, lang }: any) {
  if (view === 'overview' || view === 'my_progress' || view === 'current_courses') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{l:'Активных курсов',v:'3',s:'в процессе'},{l:'Завершено',v:'7',s:'сертификатов'},{l:'Часов обучения',v:'142',s:'+8 на этой неделе'}].map((m, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-5 space-y-3 shadow-xl">
              <div className="text-[11px] text-white/40 font-medium uppercase tracking-wider">{m.l}</div>
              <div className="text-3xl font-bold text-white tracking-tighter">{m.v}</div>
              <div className="text-[11px] font-medium" style={{ color: accent }}>{m.s}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="text-[13px] font-bold mb-6 text-white uppercase tracking-tight">Текущий прогресс</div>
            <div className="space-y-6">
              {[{n:'Maya Character Rigging',p:68,c:accent},{n:'Houdini Dynamics FX',p:34,c:'#ef9f27'},{n:'ZBrush Creature Sculpting',p:12,c:'#555'}].map((p, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[12px] font-medium"><span className="text-white/80">{p.n}</span><span className="text-white/40">{p.p}%</span></div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.p}%`, background: p.c }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="text-[13px] font-bold mb-6 text-white uppercase tracking-tight">Последние сертификаты</div>
            <div className="space-y-3">
              {[{n:'UE5 Lighting Masterclass',s:'получен',c:'text-emerald-500 bg-emerald-500/10'},{n:'Traditional 2D Animation',s:'получен',c:'text-emerald-500 bg-emerald-500/10'}].map((cert, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-white/5 rounded-xl bg-white/[0.01]">
                  <span className="text-[12px] font-medium text-white/80">{cert.n}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cert.c}`}>{cert.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (view === 'certificates') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-[2rem] p-8 space-y-6 group hover:border-primary/20 transition-all shadow-2xl">
            <div className="aspect-[1.414/1] bg-white/5 rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
              <Award size={64} className="text-white/10 group-hover:text-primary/20 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-sm transition-all">
                <button className="px-6 py-2 bg-primary text-bg-dark text-[10px] font-black uppercase rounded-lg">Download PDF</button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Certificate of Completion</div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">Professional CGI Course Vol.{i}</h3>
              <div className="flex justify-between items-center pt-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <span>Issued March 202{i+2}</span>
                <span>ID: RG-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (view === 'purchases' || view === 'order_history') {
    return (
      <div className="bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="text-[11px] font-black uppercase tracking-widest">Order History & Invoices</div>
          <button className="text-[9px] font-black text-primary uppercase tracking-widest border-b border-primary/20">Export All</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/40 text-[9px] font-black text-white/20 uppercase tracking-widest"><th className="px-8 py-5">Order ID</th><th className="px-8 py-5">Course / Service</th><th className="px-8 py-5">Date</th><th className="px-8 py-5">Amount</th><th className="px-8 py-5 text-right">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1,2,3].map(i => (
              <tr key={i} className="hover:bg-white/[0.01]">
                <td className="px-8 py-6 text-xs font-bold text-white/40">#ORD-992{i}</td>
                <td className="px-8 py-6 text-xs font-bold text-white">Maya Character Rigging Level {i}</td>
                <td className="px-8 py-6 text-xs text-white/40 font-medium">12 March 2026</td>
                <td className="px-8 py-6 text-xs font-black text-primary">$89.00</td>
                <td className="px-8 py-6 text-right"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded">Completed</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <PlaceholderView name={view} />;
}

// --- LECTURER VIEWS ---

function LecturerViews({ view, accent, lang }: any) {
  if (view === 'overview' || view === 'instructor_hub' || view === 'published_workshops') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{l:'Опубликованных',v:'4',s:'активных курса'},{l:'Студентов',v:'1 240',s:'+86 за месяц'},{l:'Доход (мес.)',v:'$3 180',s:'+22%'}].map((m, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-5 space-y-3 shadow-xl">
              <div className="text-[11px] text-white/40 font-medium uppercase tracking-wider">{m.l}</div>
              <div className="text-3xl font-bold text-white tracking-tighter">{m.v}</div>
              <div className="text-[11px] font-medium" style={{ color: accent }}>{m.s}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="text-[11px] font-black uppercase tracking-widest">Active Workshops Management</div>
            <Link to={`/aca/${lang}/create-course`} className="h-10 px-6 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
              <Plus size={14} /> New Content
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 text-[9px] font-black text-white/20 uppercase tracking-widest">
                  <th className="px-8 py-5">Workshop Title</th><th className="px-8 py-5">Enrollment</th><th className="px-8 py-5">Revenue</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-primary">W{i+1}</div>
                      <div className="text-xs font-bold text-white">Maya Character Rigging Masterclass {i+1}</div>
                    </td>
                    <td className="px-8 py-6 text-xs text-white/40 font-bold">1,420 Students</td>
                    <td className="px-8 py-6 text-xs font-black text-emerald-500">$4,280</td>
                    <td className="px-8 py-6"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-md border border-emerald-500/20">Published</span></td>
                    <td className="px-8 py-6 text-right"><button className="size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all"><MoreVertical size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'financials' || view === 'earnings_report') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{l:'Available for Withdrawal',v:'$1,240',c:accent},{l:'Pending Clearance',v:'$840',c:'#ef9f27'},{l:'Lifetime Earnings',v:'$42,180',c:'#378add'},{l:'Monthly Growth',v:'+18%',c:'#1d9e75'}].map((m, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-5 space-y-2">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{m.l}</div>
              <div className="text-2xl font-black text-white">{m.v}</div>
              <div className="text-[10px] font-bold" style={{ color: m.c }}>Active Tracker</div>
            </div>
          ))}
        </div>
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8">
          <div className="text-[11px] font-black uppercase tracking-widest mb-8">Monthly Earnings Breakdown</div>
          <div className="h-64 flex items-end gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 55].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 rounded-t-lg bg-white/5 border-t border-primary/20 hover:bg-primary/20 transition-all cursor-pointer group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-black text-primary transition-all">${h*10}</div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between pt-4 px-2 text-[9px] font-black text-white/10 uppercase tracking-widest">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>
    );
  }

  return <PlaceholderView name={view} />;
}

// --- CLIENT VIEWS ---

function ClientViews({ view, accent, lang }: any) {
  if (view === 'overview' || view === 'client_workspace' || view === 'my_active_projects') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{l:'Активных проектов',v:'3',s:'в работе'},{l:'Заявок получено',v:'14',s:'5 новых',c:'#e24b4a'},{l:'Потрачено (мес.)',v:'$6 200',s:'2 контракта'}].map((m, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-5 space-y-3 shadow-xl">
              <div className="text-[11px] text-white/40 font-medium uppercase tracking-wider">{m.l}</div>
              <div className="text-3xl font-bold text-white tracking-tighter">{m.v}</div>
              <div className="text-[11px] font-medium" style={{ color: m.c || accent }}>{m.s}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <div className="text-[13px] font-bold mb-6 text-white uppercase tracking-tight">Active Project Pipeline</div>
          <div className="space-y-4">
            {[{n:'Character Rigging for RPG',b:'$1,000',s:'open',c:'emerald'},{n:'Creature FX Simulation',b:'$3,500',s:'in_progress',c:'amber'},{n:'Cinematic Intro Animation',b:'$2,000',s:'open',c:'emerald'}].map((p, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`size-12 rounded-2xl bg-${p.c}-500/10 flex items-center justify-center text-${p.c}-500`}><Briefcase size={20} /></div>
                  <div><h4 className="text-sm font-black text-white uppercase tracking-tight">{p.n}</h4><p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">Budget: {p.b} · 12 Applications</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 bg-${p.c}-500/10 text-${p.c}-500 text-[9px] font-black uppercase rounded-lg border border-${p.c}-500/20`}>{p.s.replace('_', ' ')}</span>
                  <button className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-white"><ChevronRight size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'talent_acquisition' || view === 'saved_experts') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-16 rounded-[1.5rem] overflow-hidden border-2 border-white/5"><img src={`https://picsum.photos/seed/user${i}/200`} className="w-full h-full object-cover" /></div>
              <div><h3 className="text-lg font-black text-white uppercase tracking-tight">Alex Rivera {i}</h3><p className="text-[10px] font-black text-primary uppercase tracking-widest">Senior Technical Artist</p></div>
            </div>
            <div className="flex gap-2 relative z-10">{['Maya', 'Python', 'UE5'].map(s => <span key={s} className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-black uppercase text-white/40 tracking-widest border border-white/5">{s}</span>)}</div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /><span className="text-[11px] font-black">4.9</span><span className="text-[10px] text-white/20 ml-1">(142)</span></div>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <PlaceholderView name={view} />;
}

// --- EXECUTOR VIEWS ---

function ExecutorViews({ view, accent, lang }: any) {
  if (view === 'overview' || view === 'pro_workspace' || view === 'active_contracts') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{l:'Активных контрактов',v:'2',s:'в работе'},{l:'Заработано (мес.)',v:'$2 800',s:'+$800 pending'},{l:'Рейтинг',v:'4.9',s:'24 проекта'}].map((m, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-5 space-y-3 shadow-xl">
              <div className="text-[11px] text-white/40 font-medium uppercase tracking-wider">{m.l}</div>
              <div className="text-3xl font-bold text-white tracking-tighter">{m.v}</div>
              <div className="text-[11px] font-medium" style={{ color: accent }}>{m.s}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="text-[13px] font-bold mb-6 text-white uppercase tracking-tight">Active Contracts & Milestones</div>
            <div className="space-y-6">
              {[{n:'Creature FX Simulation · Nebula',s:'Milestone 2/4',p:50,c:'#ef9f27'},{n:'Sci-Fi Environment Design',s:'Milestone 3/4',p:75,c:accent}].map((ctr, i) => (
                <div key={i} className="space-y-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div><div className="text-[12px] font-bold text-white/80">{ctr.n}</div><div className="text-[10px] text-white/20 uppercase font-black mt-0.5">{ctr.s}</div></div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10">In Progress</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{ width: `${ctr.p}%`, background: ctr.c }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="text-[13px] font-bold mb-6 text-white uppercase tracking-tight">Recommended Projects</div>
            <div className="space-y-4">
              {[{n:'Char Rigging RPG',b:'$1,000',sk:'Maya'},{n:'Cinematic Intro Animation',b:'$2,500',sk:'UE5'}].map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                  <div><div className="text-[12px] font-bold text-white/80">{p.n}</div><div className="text-[10px] text-white/40 uppercase tracking-tight">{p.b} · {p.sk}</div></div>
                  <button className="px-3 py-1.5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-bg-dark transition-all">Quick Apply</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'pro_profile' || view === 'portfolio_showcase') {
    return (
      <div className="space-y-10">
        <div className="p-10 rounded-[3rem] bg-[#111] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] group-hover:bg-primary/10 transition-all" />
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="size-40 rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl shrink-0"><img src="https://picsum.photos/seed/profile/400" className="w-full h-full object-cover" /></div>
            <div className="space-y-4 text-center md:text-left flex-1">
              <div><h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Your Professional <br /> <span className="text-primary italic">Identity.</span></h2><p className="text-white/40 text-sm mt-4 max-w-xl font-medium leading-relaxed">Showcase your skills, experience and portfolio to attract high-tier studio contracts. Keep your profile updated for better recommendation rankings.</p></div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3"><button className="px-8 py-3 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl">Edit Showcase</button><button className="px-8 py-3 bg-white/5 text-white border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Preview Profile</button></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{l:'Profile Views',v:'1,420',i:Eye},{l:'Search Appearances',v:'342',i:Search},{l:'Invite Rate',v:'12%',i:Mail},{l:'Skill Match',v:'98%',i:ShieldCheck}].map((s, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-[#111] border border-white/5 text-center space-y-2 group hover:border-primary/20 transition-all">
              <s.i size={20} className="text-primary mx-auto mb-2 opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="text-2xl font-black text-white">{s.v}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <PlaceholderView name={view} />;
}

// --- HELPER COMPONENTS ---

function PlaceholderView({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-40 opacity-20 text-center">
      <Cpu size={64} className="mb-6 animate-pulse" />
      <h2 className="text-2xl font-black uppercase tracking-[0.5em]">{name.replace(/_/g, ' ')}</h2>
      <p className="text-sm mt-2 font-bold uppercase tracking-widest">Interface Module Initializing...</p>
    </div>
  );
}
