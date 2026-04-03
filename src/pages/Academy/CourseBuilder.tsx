import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Layout, 
  Settings, 
  Zap, 
  Users, 
  BarChart, 
  FileEdit, 
  Trash2, 
  ChevronRight,
  Globe,
  Award,
  Video,
  FileText,
  Activity,
  ArrowLeft,
  Search,
  Star
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { academyService, Course } from '../../services/academyService';
import Preloader from '../../components/Preloader';

export default function CourseBuilder() {
  const { lang } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my_nodes' | 'analytics' | 'payouts'>('my_nodes');

  useEffect(() => {
    async function loadInstructorData() {
      setLoading(true);
      try {
        const data = await academyService.getCourses(); // In production, filter by lecturer ID
        setCourses(data);
      } catch (err) {
        console.error("Workshop initialization failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInstructorData();
  }, []);

  if (loading) return <Preloader message="INIT_WORKSHOP_ENVIRONMENT..." size="lg" className="h-screen bg-[#050505]" />;

  return (
    <div className="relative min-h-screen">
      {/* 🔮 Neural Architecture Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent blur-[140px] opacity-20" />
      </div>

      <div className="relative z-10 py-12 pb-32 space-y-20">
        
        {/* 🔝 WORKSHOP HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
             <Link to={`/aca/${lang}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors group">
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back_ToNode_Directory
             </Link>
             <div className="space-y-1">
                <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic">Academy_Workshop.</h1>
                <div className="flex items-center gap-3">
                   <div className="size-2 rounded-full bg-primary animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60">Operational_Hub: Authenticated_Instructor</span>
                </div>
             </div>
          </div>
          
          <button className="h-16 px-10 bg-white text-bg-dark rounded-[2.2rem] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-primary transition-all shadow-2xl flex items-center justify-center gap-4 group">
             <Plus size={20} /> Initialize_New_Node
          </button>
        </header>

        {/* 📊 SYNERGY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Network_Size', value: '2.4K', sub: '+12% Sync Yield', icon: Users, color: 'text-primary' },
            { label: 'Matrix_Yield', value: '$8.2K', sub: 'Nominal Payouts', icon: Zap, color: 'text-white' },
            { label: 'Node_Retention', value: '94%', sub: 'High_Sync_Rate', icon: BarChart, color: 'text-white' },
            { label: 'Auth_Lvl', value: 'SYNERGY', sub: 'Mastery_Achieved', icon: Award, color: 'text-emerald-500' }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6 hover:border-white/10 transition-all group"
            >
              <div className="flex items-center justify-between">
                 <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                 </div>
                 <Activity size={16} className="text-white/10" />
              </div>
              <div className="space-y-1">
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">{stat.label}</span>
                 <div className="text-4xl font-black text-white tabular-nums tracking-tighter">{stat.value}</div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-primary/40 italic">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🛠️ MANAGEMENT TERMINAL */}
        <div className="space-y-12">
           <div className="flex border-b border-white/5 w-full">
              {[
                { id: 'my_nodes', label: 'My_Nodes', icon: Layout },
                { id: 'analytics', label: 'Neural_Analytics', icon: BarChart },
                { id: 'payouts', label: 'Revenue_Matrix', icon: Zap },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] relative transition-all flex items-center gap-3 ${activeTab === tab.id ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                >
                  <tab.icon size={14} className={activeTab === tab.id ? 'text-primary' : ''} /> {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 inset-x-0 h-1 bg-primary" />}
                </button>
              ))}
           </div>

           <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {courses.map((course, idx) => (
                  <motion.div 
                    key={course.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 rounded-[3.5rem] bg-white/[0.01] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-12 hover:border-white/10 transition-all group overflow-hidden relative"
                  >
                    <div className="flex items-center gap-10 relative z-10">
                       <div className="size-24 rounded-3xl overflow-hidden border border-white/5 grayscale group-hover:grayscale-0 transition-all">
                          <img src={course.thumbnail} className="w-full h-full object-cover opacity-40 group-hover:opacity-100" />
                       </div>
                       <div className="space-y-3">
                          <div className="flex items-center gap-3">
                             <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40">ID: {course.id.slice(0, 8)}</div>
                             <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">Node_Online</span>
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic transition-colors group-hover:text-primary">{course.title}</h3>
                          <div className="flex items-center gap-8">
                             <div className="flex items-center gap-2 text-white/20">
                                <Users size={14} /> <span className="text-[10px] font-black tabular-nums tracking-widest">1,245 SYNCED</span>
                             </div>
                             <div className="flex items-center gap-2 text-white/20">
                                <Star size={14} fill="currentColor" /> <span className="text-[10px] font-black tabular-nums tracking-widest">4.9 PARITY</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                       <button className="flex-1 lg:flex-none h-14 px-8 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-bg-dark transition-all flex items-center justify-center gap-3">
                          <FileEdit size={16} /> Manage_Matrix
                       </button>
                       <button className="size-14 bg-white/5 border border-white/10 rounded-2xl text-white/20 hover:text-red-500 hover:border-red-500/30 transition-all flex items-center justify-center">
                          <Trash2 size={20} />
                       </button>
                    </div>

                    {/* Gradient Accent */}
                    <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-primary/5 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>

        {/* 🎬 DRAFT AREA */}
        <div className="p-12 lg:p-20 rounded-[5rem] bg-[#080808] border border-white/5 space-y-10 relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 text-primary/5">
              <Plus size={120} />
           </div>
           <div className="space-y-4 relative z-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Awaiting_Initialization.</h2>
              <p className="text-white/20 font-medium italic max-w-2xl leading-relaxed">
                 The Matrix recognizes your expertise. Initialize new industrial nodes to synchronize with the global Red Griffin network. Efficiency parity and high-stakes visuals are required.
              </p>
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <button className="h-20 px-12 bg-primary text-bg-dark rounded-[3rem] font-black uppercase tracking-[0.4em] text-xs hover:brightness-125 transition-all shadow-[0_40px_100px_-20px_rgba(var(--primary-rgb),0.5)]">
                 SECURE_INITIALIZE_01
              </button>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/10 italic">LOD_SYNC: 100% Ready</p>
           </div>
        </div>

      </div>
    </div>
  );
}
