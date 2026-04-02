import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, DollarSign, LifeBuoy, Clock, 
  CheckCircle, AlertCircle, Search, Filter, 
  MoreVertical, Briefcase, UserPlus, FileText, 
  CreditCard, ShieldCheck, Mail, Zap, ExternalLink, Trash2
} from 'lucide-react';

import { hrService } from '../services/hrService';
import { financeService } from '../services/financeService';
import { supportService } from '../services/supportService';
import CreateOpeningModal from '../components/hr/CreateOpeningModal';
import Preloader from '../components/Preloader';

// --- STAFF DASHBOARD CONTENT ---

export function StaffDashboardContent({ activeRole, activeModule, accentColor }: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeRole + activeModule}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {activeRole === 'hr' && <HRDashboard accent={accentColor} module={activeModule} />}
        {activeRole === 'finance' && <FinanceDashboard accent={accentColor} module={activeModule} />}
        {activeRole === 'support' && <SupportDashboard accent={accentColor} module={activeModule} />}
        
        {!['hr', 'finance', 'support'].includes(activeRole) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <Briefcase size={64} className="mb-6" style={{ color: accentColor }} />
            <h2 className="text-xl font-black uppercase tracking-[0.5em]">{activeRole.replace(/_/g, ' ')} Module</h2>
            <p className="text-xs mt-2 uppercase tracking-widest">Staff Node Operational</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- SUB-COMPONENTS ---

function HRDashboard({ accent, module }: any) {
  const [openings, setOpenings] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [o, a] = await Promise.all([
        hrService.getOpenings(),
        hrService.getApplicants()
      ]);
      setOpenings(o);
      setApplicants(a);
    } catch (err) {
      console.error('HR Dashboard Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      await hrService.updateApplicantStatus(appId, status);
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <Preloader message="Syncing HR Node..." size="lg" />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Вакансий" value={openings.length} sub={`${openings.filter(o => o.status === 'open').length} открыто`} icon={Briefcase} accent={accent} />
        <StatCard label="Кандидатов" value={applicants.length} sub={`${applicants.filter(a => a.status === 'pending').length} ожидают`} icon={Users} accent="#ef9f27" />
        <StatCard label="Сотрудников" value="Synced" sub="Live Sync Active" icon={Zap} accent="#1d9e75" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <Briefcase size={20} style={{ color: accent }} /> Открытые вакансии
            </h3>
            <button 
              onClick={() => setCreateOpen(true)}
              className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
            >
              <UserPlus size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {openings.length === 0 ? (
              <div className="py-10 text-center text-[10px] text-white/20 uppercase font-bold border border-dashed border-white/5 rounded-2xl">No open roles found</div>
            ) : openings.map((v, i) => (
              <div key={v.id} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                <div>
                  <div className="text-xs font-bold text-white uppercase">{v.title}</div>
                  <div className="text-[9px] text-white/40 uppercase font-bold tracking-wider">{v.department}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40">{v.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <Users size={20} style={{ color: accent }} /> Кандидаты (Последние)
          </h3>
          <div className="space-y-4">
            {applicants.length === 0 ? (
              <div className="py-10 text-center text-[10px] text-white/20 uppercase font-bold border border-dashed border-white/5 rounded-2xl">No applicants yet</div>
            ) : applicants.map((c, i) => (
              <div key={c.id} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-[10px] uppercase text-white/20">
                    {c.user?.displayName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase">{c.user?.displayName}</div>
                    <div className="text-[9px] text-white/20 font-black uppercase tracking-tighter truncate max-w-[150px]">{c.user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={c.status}
                    onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                    className="bg-white/5 border-none text-[9px] font-black uppercase tracking-widest text-white/40 rounded-lg p-1 px-2 focus:ring-0 active:text-white transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateOpeningModal 
        isOpen={createOpen} 
        onClose={() => setCreateOpen(false)} 
        onCreated={fetchData} 
      />
    </div>
  );
}

function FinanceDashboard({ accent, module }: any) {
  const [stats, setStats] = useState<any>(null);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, e] = await Promise.all([
          financeService.getStats(),
          financeService.getEscrows('locked')
        ]);
        setStats(s);
        setEscrows(e);
      } catch (err) {
        console.error('Finance Dashboard Sync Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRelease = async (escrowId: string, amount: number) => {
    if (!window.confirm(`Confirm release of $${amount}?`)) return;
    try {
      await financeService.releasePayment(escrowId);
      setEscrows(prev => prev.filter(e => e.id !== escrowId));
      // Refresh stats
      const s = await financeService.getStats();
      setStats(s);
    } catch (err) {
      alert('Failed to release payment');
    }
  };

  if (loading) return <Preloader message="Syncing Treasury Node..." size="lg" />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="В Эскроу" value={`$${stats?.summary?.escrow?.toLocaleString() || '0'}`} sub="Locked Funds" icon={ShieldCheck} accent="#ef9f27" />
        <StatCard label="Ожидают выплат" value={stats?.summary?.pendingPayouts || '0'} sub="Contracts Pending" icon={AlertCircle} accent="#ef4444" />
        <StatCard label="Выручка (All Time)" value={`$${stats?.summary?.revenue?.toLocaleString() || '0'}`} sub="Platform Gross" icon={CheckCircle} accent="#1d9e75" />
      </div>

      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tight">Очередь выплат (Escrow)</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
             <div className="size-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase text-white/40">Secure Node Online</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          {escrows.length === 0 ? (
            <div className="py-20 text-center text-[10px] text-white/20 uppercase font-black border border-dashed border-white/5 rounded-[2rem]">No pending escrow releases found</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <th className="pb-6">Контракт / Проект</th>
                  <th className="pb-6">Сумма</th>
                  <th className="pb-6">Стороны</th>
                  <th className="pb-6 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {escrows.map((e, i) => (
                  <tr key={e.id} className="group">
                    <td className="py-6">
                      <div className="font-black text-white uppercase text-xs">{e.contract?.project?.title || 'System Contract'}</div>
                      <div className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">ID: {e.id.slice(-8)}</div>
                    </td>
                    <td className="py-6 font-black text-white text-sm">${e.amount?.toLocaleString()}</td>
                    <td className="py-6">
                      <div className="flex items-center gap-2">
                         <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-white/40 uppercase">C: {e.contract?.clientId?.slice(-4)}</span>
                         <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-white/40 uppercase">E: {e.contract?.executorId?.slice(-4)}</span>
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <button 
                        onClick={() => handleRelease(e.id, e.amount)}
                        className="px-6 py-2 bg-primary text-bg-dark rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                      >
                        Выплатить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function SupportDashboard({ accent, module }: any) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await supportService.getReports();
        setReports(data);
      } catch (err) {
        console.error('Support Dashboard Sync Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = async (reportId: string, action: 'resolved' | 'dismissed' | 'delete') => {
    try {
      if (action === 'delete') {
        if (!window.confirm('Delete this report?')) return;
        await supportService.deleteReport(reportId);
        setReports(prev => prev.filter(r => r.id !== reportId));
      } else {
        await supportService.resolveReport(reportId, action);
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
      }
    } catch (err) {
      alert('Failed to perform action');
    }
  };

  if (loading) return <Preloader message="Syncing Support Node..." size="lg" />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Открытых тикетов" value={reports.filter(r => r.status === 'pending').length} sub="Pending Action" icon={LifeBuoy} accent="#ef4444" />
        <StatCard label="Решено (Всего)" value={reports.filter(r => r.status === 'resolved').length} sub="Completed" icon={CheckCircle} accent="#1d9e75" />
        <StatCard label="Всего обращений" value={reports.length} sub="Database Total" icon={Zap} accent="#ef9f27" />
      </div>

      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <h3 className="text-xl font-black uppercase tracking-tight">Активные тикеты (Reports)</h3>
        <div className="overflow-x-auto">
          {reports.length === 0 ? (
            <div className="py-20 text-center text-[10px] text-white/20 uppercase font-black border border-dashed border-white/5 rounded-[2rem]">No active reports found</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <th className="pb-6">От кого</th>
                  <th className="pb-6">Причина / Тип</th>
                  <th className="pb-6">Статус</th>
                  <th className="pb-6 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports.map((t, i) => (
                  <tr key={t.id} className="group">
                    <td className="py-6">
                      <div className="text-xs font-bold text-white uppercase">{t.reporter?.displayName || 'Anonymous'}</div>
                      <div className="text-[9px] text-white/40 lowercase font-bold tracking-tighter">{t.reporter?.email}</div>
                    </td>
                    <td className="py-6">
                      <div className="text-xs font-black text-white uppercase truncate max-w-[200px]">{t.reason}</div>
                      <div className="text-[9px] text-white/20 uppercase font-bold tracking-widest">{t.targetType}</div>
                    </td>
                    <td className="py-6">
                      <span className={`px-2 py-0.5 rounded bg-white/5 text-[9px] font-black uppercase tracking-widest ${t.status === 'pending' ? 'text-orange-500' : 'text-green-500'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {t.status === 'pending' && (
                          <button 
                            onClick={() => handleAction(t.id, 'resolved')}
                            className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg border border-green-500/10 transition-all"
                            title="Resolve"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleAction(t.id, 'delete')}
                          className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg border border-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-3xl p-6 space-y-4 group hover:border-white/10 transition-all shadow-2xl">
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{label}</div>
        <Icon size={18} style={{ color: accent }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{sub}</div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function StaffDashboard() {
  return (
    <div className="p-8">
      <StaffDashboardContent activeRole="hr" activeModule="overview" accentColor="#378add" />
    </div>
  );
}
