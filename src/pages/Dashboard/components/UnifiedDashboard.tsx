import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Shield, DollarSign, Briefcase, GraduationCap, Zap, Box, Rocket, UserPlus, LifeBuoy } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import StatCard from './StatCard';
import HelpModal from '../../../components/support/HelpModal';

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
  const isStaff = ['manager', 'chief_manager', 'moderator', 'hr', 'finance', 'support'].includes(activeRole || '');

  const [staffStats, setStaffStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const fetchStaffStats = async () => {
    // Only fetch full ecosystem stats if Admin. Roles like HR/Finance should use their own endpoints (Phase 16)
    if (!isAdmin) {
      // Provide simulated domain stats for staff
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
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {(isC || isE || isAdmin) && (
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                    <Box size={20} className="text-primary" /> Studio Production Hub
                  </h3>
                  <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mt-1">Management of active studio pipelines</p>
                </div>
                {(isC || isAdmin) && <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase rounded-lg tracking-widest">Global Escrow Monitor</span>}
              </div>

              <div className="grid gap-4 relative z-10">
                {[
                  { name: "Nebula CGI Sequence", role: "Client", status: "Reviewing", p: 85, c: '#ef9f27' },
                  { name: "Character Rigging Pack", role: "Executor", status: "In Production", p: 42, c: '#e24b4a' }
                ].map((p, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                        <Rocket size={20} style={{ color: p.c }} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight">{p.name}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] font-black uppercase" style={{ color: p.c }}>{p.role}</span>
                          <span className="size-1 rounded-full bg-white/10" />
                          <span className="text-[9px] text-white/40 font-bold uppercase">{p.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.p}%` }} className="h-full" style={{ background: p.c }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20" />
            </div>
          </div>
        )}

        <div className="space-y-8">
          {(isS || isAdmin) && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <GraduationCap size={14} className="text-primary" /> Learning Pipeline
              </h3>
              <div className="space-y-4">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="text-[10px] font-black text-white uppercase tracking-tight">Next Lesson</div>
                    <span className="text-[8px] font-black px-2 py-0.5 bg-primary/20 text-primary rounded-md uppercase">UE5 Master</span>
                  </div>
                  <div className="text-xs font-bold text-white/80 leading-tight">Advanced Particle Simulation for Environment VFX</div>
                  <Link to={`/learn/${lang}/unreal-engine-masterclass`} className="block w-full py-3 bg-primary text-bg-dark rounded-xl text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all text-center">Resume Learning</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
