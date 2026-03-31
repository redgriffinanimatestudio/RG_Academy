import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Shield, DollarSign, Briefcase, GraduationCap, Zap, Box, Rocket, UserPlus, LifeBuoy, Activity, ChevronRight } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import StatCard from './StatCard';
import HelpModal from '../../../components/support/HelpModal';
import ActivityFeed from '../../../components/dashboard/ActivityFeed';
import BalanceDisplay from '../../../components/dashboard/BalanceDisplay';
import HRDashboard from '../roles/HRDashboard';
import FinanceDashboard from '../roles/FinanceDashboard';
import SupportDashboard from '../roles/SupportDashboard';

interface UnifiedDashboardProps {
  roles: string[];
  activeRole: string | null;
  user: any;
  lang: string | undefined;
  theme: any;
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ roles, activeRole, user, lang, theme }) => {
  const [searchParams] = useSearchParams();
  const isAdmin = useMemo(() => activeRole === 'admin', [activeRole]);
  const isL = activeRole === 'lecturer';
  const isE = activeRole === 'executor';
  const isC = activeRole === 'client';
  const isS = activeRole === 'student';
  const isHR = activeRole === 'hr';
  const isFinance = activeRole === 'finance';
  const isSupport = activeRole === 'support';
  const isStaff = ['manager', 'chief_manager', 'moderator', 'hr', 'finance', 'support'].includes(activeRole || '');

  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'overview';

  const [staffStats, setStaffStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const fetchStaffStats = async () => {
    if (!isAdmin) {
      setStaffStats({
        users: 1240,
        totalRevenue: 45000,
        pendingReports: 3,
        courses: 42
      });
      return;
    }

    try {
      setStatsLoading(true);
      const stats = await adminService.getStats();
      setStaffStats(stats);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffStats();
  }, [isAdmin, activeRole]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 📊 TELEMETRY STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin && (
          <>
            <Link to="/dashboard?perspective=finance" className="block transform hover:scale-[1.02] transition-all">
              <StatCard label="Platform Gross" value={`$${staffStats?.totalRevenue || "0"}`} icon={DollarSign} accent="#1d9e75" sub="Click to manage payments" />
            </Link>
            <Link to="/dashboard?view=users&perspective=admin" className="block transform hover:scale-[1.02] transition-all">
              <StatCard label="Total Users" value={statsLoading ? "..." : (staffStats?.users || "0")} icon={UserPlus} accent="#378add" sub="View full directory" />
            </Link>
            <Link to="/dashboard?view=content_mgmt&perspective=admin" className="block transform hover:scale-[1.02] transition-all">
              <StatCard label="Academy Content" value={statsLoading ? "..." : (staffStats?.courses || "0")} icon={GraduationCap} accent="#7f77dd" sub="Control workshops" />
            </Link>
          </>
        )}
        {(isAdmin || isStaff) && (
          <StatCard 
            label="Action Queue" 
            value={statsLoading ? "..." : (staffStats?.pendingReports || "0")} 
            sub={statsLoading ? "Refreshing..." : "Critical notifications"} 
            icon={Shield} 
            accent="#ef4444" 
            onClick={fetchStaffStats}
          />
        )}

        {isC && <StatCard label="Studio Budget" value="$24.8k" sub="Escrow held" icon={DollarSign} accent="#ef9f27" />}
        {isE && <StatCard label="Active Contracts" value="3" sub="+$4,200 pending" icon={Briefcase} accent="#e24b4a" />}
        {isS && <StatCard label="Workshop Progress" value="84%" sub="UE5 Niagara" icon={GraduationCap} accent="#378add" />}
        {isL && <StatCard label="Monthly Payout" value="$4,120" sub="↑ 12% vs last mo" icon={Zap} accent="#1d9e75" />}
        
        {isStaff && !isAdmin && (
          <>
            <StatCard label="Domain Health" value="Stable" sub="Ecosystem integrity" icon={Zap} accent="#378add" />
            <StatCard label="Network Load" value="Optimal" sub="Global node status" icon={Box} accent="#1d9e75" />
          </>
        )}

        {!isAdmin && !isStaff && (isS || isE) && (
          <StatCard 
            label="System Support" 
            value="Active" 
            sub="Establish Ticket Connection" 
            icon={LifeBuoy} 
            accent="#ef4444" 
            onClick={() => setHelpOpen(true)}
          />
        )}
      </div>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* 💎 HR TALENT MATRIX HUB */}
          {isHR && <HRDashboard view={currentView} accent={''} user={user} lang={lang} />}

          {/* 💰 FINANCE TREASURY HUB */}
          {isFinance && <FinanceDashboard view={currentView} user={user} lang={lang} />}

          {/* 🛠️ SUPPORT INCIDENT HUB */}
          {isSupport && <SupportDashboard view={currentView} user={user} lang={lang} />}

          {/* 💰 VAULT STATUS (Shared for others) */}
          {(!isHR && !isFinance && !isSupport) && <BalanceDisplay />}

          {/* 🛠️ PRODUCTION PIPELINE MONITOR */}
          {(isC || isE || isAdmin) && (
            <div className="glass-industrial border border-white/5 rounded-[3.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group matrix-grid-bg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-1000" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-4 italic text-glow">
                    <Box size={24} className="text-primary animate-pulse" /> Studio Production Hub
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_#00ff9d]" />
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] font-mono">Live Sync: Industrial-Pipeline-v4</p>
                  </div>
                </div>
                {(isC || isAdmin) && (
                  <div className="px-5 py-2 glass-premium border border-primary/20 text-primary text-[9px] font-black uppercase rounded-xl tracking-[0.2em] shadow-lg shadow-primary/10">
                    Global Escrow Monitor
                  </div>
                )}
              </div>

              <div className="grid gap-5 relative z-10">
                {[
                  { name: "Nebula CGI Sequence", role: "Client", status: "Reviewing", p: 85, c: '#ef9f27' },
                  { name: "Character Rigging Pack", role: "Executor", status: "In Production", p: 42, c: '#e24b4a' }
                ].map((p, i) => (
                  <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-between group/p hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 card-glow">
                    <div className="flex items-center gap-8">
                      <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover/p:scale-110 transition-transform duration-500 shadow-xl border border-white/5">
                        <Rocket size={24} style={{ color: p.c }} className="drop-shadow-[0_0_10px_currentColor]" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-base font-black text-white uppercase tracking-tight group-hover/p:text-primary transition-colors">{p.name}</div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: p.c }}>
                            <div className="size-1 rounded-full" style={{ backgroundColor: p.c }} /> {p.role}
                          </span>
                          <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">{p.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right text-[11px] font-black font-mono text-white/40">{p.p}% SYNC</div>
                      <div className="w-40 h-2 bg-white/5 rounded-full overflow-hidden p-[2px]">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${p.p}%` }} className="h-full rounded-full shadow-[0_0_10px_currentColor]" style={{ background: p.c, color: p.c }} transition={{ duration: 1.5, delay: 0.2 * i }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🎓 LEARNING PIPELINE PREVIEW */}
          {(isS || isAdmin) && (
            <div className="glass-industrial border border-white/5 rounded-[3.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <GraduationCap size={160} />
              </div>
              
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-3 relative z-10">
                <div className="size-1.5 bg-primary rounded-full animate-ping" />
                Learning Pipeline
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 card-glow">
                  <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="px-3 py-1 glass-premium rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest border border-white/5">
                        Next Lesson
                      </div>
                      <span className="text-[9px] font-black px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg uppercase tracking-widest">
                        LMS NODE
                      </span>
                    </div>
                    <h4 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-tight italic">
                      Advanced Particle Simulation for Environment VFX
                    </h4>
                  </div>
                  
                  <Link to={`/learn/${lang}/unreal-engine-masterclass`} className="flex items-center justify-center gap-4 px-10 py-6 bg-primary text-bg-dark rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 shrink-0">
                    <Rocket size={20} /> Resume <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 📡 LIVE TELEMETRY SIDEBAR */}
        <div className="lg:col-span-4">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
