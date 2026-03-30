import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  DollarSign, 
  ArrowUpRight,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Star,
  Filter,
  Cpu,
  Shield,
  Globe
} from 'lucide-react';

const ADM_Insights: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">
      {/* ANALYTICS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/20 shadow-xl shadow-amber-400/5">
            <BarChart3 size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">University Insights</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Platform Performance v2.6 • Real-time Data Sync</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Calendar size={14} className="text-white/40" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Last 30 Days</span>
          </div>
          <button className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          { label: 'Total Revenue', value: '$84,240', trend: '+12.5%', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Active Students', value: '1,248', trend: '+18.2%', icon: Users, color: 'text-sky-400' },
          { label: 'Course Completion', value: '78.4%', trend: '+4.1%', icon: GraduationCap, color: 'text-amber-400' },
          { label: 'Platform Rating', value: '4.82/5', trend: 'Steady', icon: Star, color: 'text-indigo-400' }
        ].map((metric, i) => (
          <motion.div key={i} variants={item} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform ${metric.color}`}>
              <metric.icon size={48} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{metric.label}</p>
                <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter ${
                  metric.trend.includes('+') ? 'text-emerald-400' : 'text-white/20'
                }`}>
                  {metric.trend} <ArrowUpRight size={10} />
                </div>
              </div>
              <h3 className={`text-2xl font-black ${metric.color}`}>{metric.value}</h3>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-current opacity-20 ${metric.color}`} style={{ width: '65%' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TRENDS & STATISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {/* REVENUE CHART PLACEHOLDER */}
        <motion.div variants={item} className="lg:col-span-2 p-8 rounded-[40px] border border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-[400px]">
           <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                 <h4 className="text-sm font-black uppercase tracking-widest text-white">Growth Dynamics</h4>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Monthly user & Revenue progression</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-emerald-500" /><span className="text-[8px] font-black uppercase text-white/40">Revenue</span></div>
                 <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-sky-500" /><span className="text-[8px] font-black uppercase text-white/40">Users</span></div>
              </div>
           </div>
           
           <div className="flex-1 flex items-end gap-3 px-4">
              {[40, 60, 45, 78, 92, 65, 88, 70, 95, 100, 82, 90].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-white/5 rounded-t-xl group-hover:bg-primary/20 transition-all cursor-pointer relative overflow-hidden" 
                    style={{ height: `${h}%` }}
                  >
                     <div className="absolute inset-x-0 bottom-0 bg-primary/40 h-1/2 opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-white/10 uppercase">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
                </div>
              ))}
           </div>
        </motion.div>

        {/* POPULAR COURSES LIST */}
        <motion.div variants={item} className="lg:col-span-1 p-8 rounded-[40px] border border-white/5 bg-white/[0.01] space-y-8">
           <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Top Performance</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Highest rated workshops</p>
           </div>

           <div className="space-y-4">
              {[
                { name: 'Character Rigging Mastery', count: '15.4k enrollments', color: 'text-amber-500' },
                { name: 'Cinematic VFX with Houdini', count: '8.2k enrollments', color: 'text-sky-500' },
                { name: 'AAA Environment Art', count: '22.1k enrollments', color: 'text-emerald-500' },
                { name: 'Real-time UE5 Lighting', count: '45.0k enrollments', color: 'text-indigo-500' }
              ].map((course, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">{course.name}</span>
                      <span className="text-[8px] font-black text-white/20 uppercase mt-1 tracking-tighter">{course.count}</span>
                   </div>
                   <Zap size={14} className={course.color} />
                </div>
              ))}
           </div>

           <button className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">
              Download Full Report
           </button>
        </motion.div>
      </div>

      {/* FOOTER METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 border-t border-white/5 pt-12">
         {[
           { label: 'Avg Node Latency', val: '24ms', icon: Cpu },
           { label: 'Security Handshake', val: 'Verified', icon: Shield },
           { label: 'Regional Sync', val: 'Global', icon: Globe }
         ].map((m, i) => (
           <div key={i} className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 shadow-xl border border-white/10">
                 <m.icon size={18} />
              </div>
              <div>
                 <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">{m.label}</p>
                 <p className="text-xs font-black uppercase text-white tracking-widest mt-1">{m.val}</p>
              </div>
           </div>
         ))}
      </div>
    </motion.div>
  );
};

export default ADM_Insights;
