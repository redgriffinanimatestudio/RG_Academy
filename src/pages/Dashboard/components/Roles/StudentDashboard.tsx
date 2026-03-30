import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Zap, 
  Play, 
  ChevronRight, 
  ExternalLink,
  Target,
  Layers,
  Cpu,
  Monitor,
  Clock
} from 'lucide-react';
import { academyService } from '../../../../services/academyService';
import Preloader from '../../../../components/Preloader';
import NoDataPlaceholder from '../NoDataPlaceholder';
import RadialProgress from '../RadialProgress';

interface StudentDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ view, accent, user, lang }) => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        setLocalLoading(true);
        const res = await academyService.getStudentProgress();
        if (res) {
          setEnrollments(res.enrollments || []);
          setStats(res.stats || null);
        }
      } catch (error) { console.error(error); } finally { setLocalLoading(false); }
    }
    fetchData();
  }, [user?.id]);

  if (localLoading) return <Preloader message="Synchronizing career data..." size="lg" />;

  const latestEnrollment = enrollments[0];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 1. Career Header / AI Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-10 rounded-[3rem] bg-white text-bg-dark flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
            <Cpu size={200} />
          </div>
          <div className="size-32 rounded-[2rem] bg-bg-dark flex items-center justify-center text-white relative z-10">
            <Target size={48} />
          </div>
          <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">AI Readiness Rank</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Matrix Verified: {user?.profile?.aiReadiness || 0}%</h2>
            </div>
            <p className="text-sm font-bold opacity-60 leading-relaxed max-w-md">
              Your professional trajectory is being optimized by the Academy AI. Complete more industrial tasks to sync with Studio Mode.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to={`/aca/${lang}/trajectory`} className="px-6 py-3 bg-bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">View Roadmap</Link>
              <Link to={`/stu/${lang}/jobs`} className="px-6 py-3 border border-bg-dark/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-bg-dark/5 transition-all">Find Gigs</Link>
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 flex flex-col justify-between group hover:border-white/20 transition-all shadow-xl">
          <div className="flex justify-between items-start">
            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Mastery Stats</span>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-white">{stats?.total || 0}</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Active Industrial Pipelines</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <div>
              <span className="block text-lg font-black text-white">{stats?.completed || 0}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter text-white/20">Completed</span>
            </div>
            <div>
              <span className="block text-lg font-black text-white">{stats?.avgProgress || 0}%</span>
              <span className="text-[8px] font-black uppercase tracking-tighter text-white/20">Avg Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Resume Pipeline (Hero) */}
      {latestEnrollment && (
        <div className="relative p-1 bg-gradient-to-r from-primary via-white to-primary/20 rounded-[3.5rem] shadow-2xl shadow-primary/10 overflow-hidden group">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl m-[1px] rounded-[3.4rem]" />
          <div className="relative p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-10">
              <div className="size-40 rounded-[2.5rem] overflow-hidden border border-white/10 relative group-hover:scale-105 transition-transform duration-700">
                <img src={latestEnrollment.course.thumbnail} className="w-full h-full object-cover opacity-60" alt="" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={40} className="text-white fill-current" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Resume Mission</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{latestEnrollment.course.title}</h3>
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="size-8 rounded-full border-2 border-bg-dark bg-white/5 overflow-hidden">
                        <img src={`https://cdn.flyonui.com/fy-assets/avatar/avatar-${i}.png`} alt="" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{latestEnrollment.course.studentsCount} Students Enrolled</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <RadialProgress progress={latestEnrollment.progress} size={100} strokeWidth={8} color="#fff" />
              <Link to={`/learn/${lang}/${latestEnrollment.course.slug}`} className="px-10 py-5 bg-white text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">Launch Module</Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Catalog / Active Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Pipeline */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-white">
              <Layers size={20} className="text-primary" /> Active Pipelines
            </h3>
            <Link to={`/aca/${lang}`} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Expand Catalog</Link>
          </div>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {enrollments.length > 0 ? enrollments.map((enr, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/5">
                    <img src={enr.course.thumbnail} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase line-clamp-1">{enr.course.title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{enr.course.level} Integration</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <RadialProgress progress={enr.progress} size={40} strokeWidth={4} />
                  <Link to={`/learn/${lang}/${enr.course.slug}`} className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-white/20 group-hover:bg-white group-hover:text-bg-dark transition-all shadow-lg">
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            )) : <NoDataPlaceholder icon={BookOpen} message="No active workshops found." link={`/aca/${lang}`} linkText="Explore Academy" />}
          </div>
        </div>

        {/* Professional Specs / Skills tree hook */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-white">
                <Monitor size={20} className="text-primary" /> Tech Stack LOD
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Sync Studio</button>
            </div>
            <div className="space-y-6">
              {['3ds Max', 'Unreal Engine 5', 'Revit', 'Maya'].map((skill, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>{skill}</span>
                    <span className="text-white">LOD {300 + idx * 50}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary shadow-[0_0_10px_#fff]" style={{ width: `${85 - idx * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary p-10 rounded-[3rem] space-y-6 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:rotate-12 transition-transform duration-1000">
              <Award size={200} />
            </div>
            <div className="size-16 rounded-2xl bg-bg-dark text-white flex items-center justify-center shadow-xl">
              <ExternalLink size={24} />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-3xl font-black text-bg-dark uppercase tracking-tighter leading-none">Studio Ready?</h3>
              <p className="text-bg-dark/60 font-black uppercase text-xs tracking-widest">Connect your academy progress to real studio contracts.</p>
            </div>
            <Link to={`/aca/${lang}/portfolio`} className="block w-full py-5 bg-bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs text-center hover:scale-[1.02] transition-all relative z-10">Export Portfolio</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
