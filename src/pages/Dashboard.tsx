import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MY_COURSES = [
  {
    id: '1',
    slug: 'mastering-character-rigging-maya',
    title: 'Mastering Character Rigging in Maya',
    progress: 40,
    thumbnail: 'https://picsum.photos/seed/rigging/400/225',
    lastAccessed: '2 hours ago',
    nextLesson: 'Naming Conventions'
  },
  {
    id: '4',
    slug: 'unreal-engine-5-real-time-lighting',
    title: 'Unreal Engine 5: Real-time Lighting',
    progress: 85,
    thumbnail: 'https://picsum.photos/seed/ue5/400/225',
    lastAccessed: '1 day ago',
    nextLesson: 'Volumetric Fog'
  }
];

const LECTURER_STATS = [
  { label: 'Total Students', value: '1,240', icon: Users, color: 'text-primary' },
  { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-yellow-400' },
  { label: 'Course Revenue', value: '$12,450', icon: DollarSign, color: 'text-emerald-400' },
  { label: 'Hours Taught', value: '450', icon: Clock, color: 'text-blue-400' },
];

const STUDIO_PROJECTS = [
  { id: 'p1', name: 'Cyberpunk Environment', client: 'NeoGames', status: 'In Progress', budget: '$15,000', deadline: 'Apr 15' },
  { id: 'p2', name: 'Character Retopology', client: 'IndieTeam', status: 'Review', budget: '$2,500', deadline: 'Mar 28' },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { profile, activeRole, setActiveRole } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const ROLES: { id: string, label: string, color: string }[] = [
    { id: 'student', label: 'Student', color: 'bg-primary' },
    { id: 'lecturer', label: 'Lecturer', color: 'bg-primary' },
    { id: 'executor', label: 'Specialist', color: 'bg-primary-hover' },
    { id: 'client', label: 'Client', color: 'bg-primary-hover' },
    { id: 'admin', label: 'Admin', color: 'bg-red-500' },
  ];

  const filteredCourses = MY_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'in_progress' && course.progress < 100) ||
                         (filter === 'completed' && course.progress === 100);
    return matchesSearch && matchesFilter;
  });

  const renderAdminSection = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <Users className="text-red-500" size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500/40">Users Control</span>
          </div>
          <p className="text-3xl font-black text-white">4,281</p>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: '65%' }} />
          </div>
          <Link to={`/admin/${lang}/users`} className="block text-center py-2 bg-red-500/20 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Manage Users</Link>
        </div>
        
        <div className="p-8 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <BookOpen className="text-blue-500" size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/40">Content Approval</span>
          </div>
          <p className="text-3xl font-black text-white">12 Pending</p>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '40%' }} />
          </div>
          <Link to={`/admin/${lang}/content`} className="block text-center py-2 bg-blue-500/20 text-blue-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Review Requests</Link>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <DollarSign className="text-emerald-500" size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40">System Revenue</span>
          </div>
          <p className="text-3xl font-black text-white">$84,200</p>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
          </div>
          <Link to={`/admin/${lang}/finance`} className="block text-center py-2 bg-emerald-500/20 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Financial Reports</Link>
        </div>
      </div>

      <div className="p-10 rounded-[3rem] bg-zinc-900 border border-white/5 space-y-8">
        <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
          <Zap size={24} className="text-red-500" /> System Activity Log
        </h3>
        <div className="space-y-4">
          {[
            { msg: 'New specialist verified: Alex Design', time: '5m ago', type: 'System' },
            { msg: 'Course "UE5 Masterclass" published', time: '12m ago', type: 'Lecturer' },
            { msg: 'Payment failed for Order #1204', time: '1h ago', type: 'Error' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-4">
                <div className={`size-2 rounded-full ${log.type === 'Error' ? 'bg-red-500' : 'bg-white/20'}`} />
                <span className="text-sm font-medium text-white/80">{log.msg}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{log.type}</span>
                <span className="text-[10px] font-bold text-white/40">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentSection = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white shrink-0">Continue Learning</h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my courses..." 
            className="w-full pl-10 pr-4 py-3 bg-white/5 border-none rounded-xl text-[11px] font-medium text-white placeholder:text-white/20 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <motion.div key={course.id} whileHover={{ y: -5 }} className="p-6 rounded-[2.5rem] bg-zinc-900 border border-white/5 group transition-all">
            <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={40} className="text-primary fill-current" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
              <Link to={`/learn/${lang}/${course.slug}`} className="block w-full py-3 bg-white/5 text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-bg-dark transition-all">Resume Session</Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderLecturerSection = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {LECTURER_STATS.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <stat.icon size={20} className={stat.color} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Active Workshops</h2>
          <Link to={`/aca/${lang}/create-course`} className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20">
            <Plus size={14} /> Create New
          </Link>
        </div>
        <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Workshop</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Students</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Earnings</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2].map((_, i) => (
                <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6 font-bold text-sm">Maya Rigging Pro {i+1}</td>
                  <td className="px-8 py-6 text-sm text-white/60">450</td>
                  <td className="px-8 py-6 text-sm font-black text-emerald-400">$2,400</td>
                  <td className="px-8 py-6"><span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase">Published</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStudioSection = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Briefcase className="text-primary-hover" size={24} /> Active Contracts
          </h2>
          <div className="space-y-4">
            {STUDIO_PROJECTS.map((proj) => (
              <div key={proj.id} className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-between group hover:border-primary-hover/20 transition-all">
                <div className="space-y-1">
                  <h4 className="font-black text-white uppercase tracking-tight">{proj.name}</h4>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{proj.client} • Deadline: {proj.deadline}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Budget</p>
                    <p className="text-sm font-black text-primary-hover">{proj.budget}</p>
                  </div>
                  <button className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-white group-hover:bg-primary-hover/20 transition-all">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <PieChart className="text-primary-hover" size={24} /> Analytics
          </h2>
          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-6">
            <div className="space-y-4 text-center">
              <div className="inline-flex size-32 rounded-full border-8 border-primary-hover border-t-white/10 items-center justify-center">
                <span className="text-2xl font-black text-white">$17.5k</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Monthly Volume</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Net Income', value: '$14,200', color: 'bg-emerald-500' },
                { label: 'Pending', value: '$3,300', color: 'bg-primary-hover' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] font-black uppercase text-white/40">{item.label}</span>
                  </div>
                  <span className="text-xs font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-8 space-y-12">
      {/* Welcome Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px] ${activeRole === 'client' || activeRole === 'executor' ? 'text-primary-hover' : activeRole === 'admin' ? 'text-red-500' : 'text-primary'}`}>
              <Layout size={14} />
              {activeRole?.replace('_', ' ')} Dashboard
            </div>
            
            {/* Role Switcher for Testing */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id as any)}
                  className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
                    activeRole === role.id 
                      ? `${role.color} text-bg-dark` 
                      : 'text-white/20 hover:text-white'
                  }`}
                >
                  {role.id.charAt(0)}
                </button>
              ))}
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] uppercase">
            Control <br />
            <span className={activeRole === 'client' || activeRole === 'executor' ? 'text-primary-hover italic' : activeRole === 'admin' ? 'text-red-500 italic' : 'text-primary italic'}>Everything.</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="px-8 py-6 rounded-[2rem] bg-white/[0.02] border border-white/5 text-center min-w-[140px]">
            <div className="text-3xl font-black text-white">{activeRole === 'admin' ? '24' : '14'}</div>
            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-2">{activeRole === 'admin' ? 'Reports' : 'Active Tasks'}</div>
          </div>
          <div className="px-8 py-6 rounded-[2rem] bg-white/[0.02] border border-white/5 text-center min-w-[140px]">
            <div className="text-3xl font-black text-white">{activeRole === 'admin' ? '5' : '3'}</div>
            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-2">New Alerts</div>
          </div>
        </div>
      </section>

      {/* Dynamic Content based on Role */}
      <motion.div
        key={activeRole}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeRole === 'admin' ? renderAdminSection() :
         activeRole === 'lecturer' ? renderLecturerSection() : 
         (activeRole === 'client' || activeRole === 'executor') ? renderStudioSection() : 
         renderStudentSection()}
      </motion.div>

      {/* Global Widgets: Schedule & Certificates (Visible to all but adapted) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-8">
          <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Calendar size={24} className="text-primary" /> Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Rigging Q&A Live', date: 'Today, 18:00', type: 'Live Class' },
              { title: 'Project Milestone', date: 'Tomorrow, 12:00', type: 'Studio' },
            ].map((ev, i) => (
              <div key={i} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex justify-between items-center group hover:border-primary/20 transition-all">
                <div>
                  <p className="text-xs font-black uppercase text-white group-hover:text-primary transition-colors">{ev.title}</p>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{ev.date}</p>
                </div>
                <span className="px-2 py-1 rounded bg-white/5 text-[8px] font-black uppercase text-white/40">{ev.type}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-10 rounded-[2.5rem] bg-primary text-bg-dark space-y-6">
          <div className="size-12 rounded-xl bg-bg-dark/5 flex items-center justify-center">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight">Recent Achievement</h3>
          <p className="text-sm font-bold opacity-60 leading-relaxed uppercase tracking-tight">
            You've completed the "Advanced Lighting" workshop with elite marks.
          </p>
          <button className="w-full py-4 bg-bg-dark text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-black transition-all">
            Download Certificate
          </button>
        </div>
      </section>
    </div>
  );
}
