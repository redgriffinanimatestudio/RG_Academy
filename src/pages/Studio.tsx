import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  Globe, 
  Zap, 
  X, 
  Shield, 
  CreditCard, 
  CheckCircle, 
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import KanbanBoard from '../components/KanbanBoard';

const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'Character Rigging for Indie RPG',
    client: 'Nebula Games',
    clientId: 'client_1',
    budget: 800,
    tags: ['Maya', 'Rigging', 'Game Dev'],
    status: 'open',
    urgency: 'urgent',
    description: 'We need a senior rigger to help us with our main character. 12+ joints, facial setup, and IK/FK switching required.',
    participants: []
  },
  {
    id: '2',
    title: 'Environment Concept Art - Sci-Fi City',
    client: 'Starlight Studios',
    clientId: 'client_2',
    budget: 2500,
    tags: ['Concept Art', 'Environment', '2D'],
    status: 'in_progress',
    urgency: 'normal',
    description: 'Creating a high-end sci-fi city environment concept art.',
    participants: []
  },
  {
    id: '3',
    title: 'VFX for Short Film Sequence',
    client: 'Independent Creator',
    clientId: 'client_3',
    budget: 1800,
    tags: ['Houdini', 'VFX', 'Simulation'],
    status: 'open',
    urgency: 'urgent',
    description: 'Looking for a VFX artist to create magical fire and destruction effects.',
    participants: []
  }
];

const MOCK_TALENT = [
  {
    id: '1',
    name: 'Sarah Connor',
    roleKey: 'senior_3d_artist',
    location: 'Los Angeles, CA',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    online: true
  },
  {
    id: '2',
    name: 'John Doe',
    roleKey: 'vfx_supervisor',
    location: 'London, UK',
    avatar: 'https://picsum.photos/seed/john/200/200',
    online: false
  },
  {
    id: '3',
    name: 'Jane Smith',
    roleKey: 'concept_artist',
    location: 'Tokyo, JP',
    avatar: 'https://picsum.photos/seed/jane/200/200',
    online: true
  }
];

export default function Studio() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [activeTab, setActiveTab] = useState<'browse' | 'manage'>('browse');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    urgency: 'all',
    budgetMin: 0
  });

  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesUrgency = filters.urgency === 'all' || project.urgency === filters.urgency;
    const matchesBudget = project.budget >= filters.budgetMin;

    return matchesSearch && matchesStatus && matchesUrgency && matchesBudget;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setShowApplyModal(false);
  };

  return (
    <div className="space-y-12 py-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <Briefcase size={14} />
            {t('studio_collab')}
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white leading-none uppercase">
            {t('build_impossible').split('.')[0]} <br />
            <span className="text-primary italic">{t('build_impossible').split('.')[1] || 'IMPOSSIBLE.'}</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl font-medium">
            {t('studio_desc')}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="p-1 bg-white/5 rounded-2xl border border-white/5 flex">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'browse' ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
              >
                Browse Projects
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
              >
                My Projects
              </button>
            </div>
            <button className="criativo-btn flex items-center gap-3">
              <Plus size={18} />
              {t('post_project')}
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-white placeholder:text-white/20"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
            >
              <Filter size={18} />
              {t('filters')}
            </button>
          </div>
        </div>
      </header>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Project Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'open', 'in_progress', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilters({ ...filters, status })}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.status === status ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Min Budget: ${filters.budgetMin}</h4>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={filters.budgetMin}
                  onChange={(e) => setFilters({ ...filters, budgetMin: parseInt(e.target.value) })}
                  className="w-full accent-primary bg-white/10 rounded-lg appearance-none h-1"
                />
                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                  <span>$0</span>
                  <span>$5,000+</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Urgency</h4>
                <select 
                  value={filters.urgency}
                  onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary cursor-pointer appearance-none"
                >
                  <option value="all" className="bg-bg-card text-white">Any Urgency</option>
                  <option value="urgent" className="bg-bg-card text-white">Urgent Only</option>
                  <option value="normal" className="bg-bg-card text-white">Normal Only</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'manage' ? (
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Project Management</h2>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Filter by:</span>
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none cursor-pointer appearance-none">
                <option className="bg-bg-card text-white">Active Projects</option>
                <option className="bg-bg-card text-white">Completed</option>
              </select>
            </div>
          </div>
          <KanbanBoard />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('active_projects')}</h2>
                <button className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">{t('view_all')}</button>
              </div>
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ y: -4 }}
                    className="criativo-card space-y-6 rounded-[2rem]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-2xl tracking-tight text-white uppercase">{project.title}</h3>
                          {project.urgency === 'urgent' && (
                            <span className="px-2 py-0.5 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                              <Zap size={8} fill="currentColor" /> {t('urgent')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/40 font-medium">{t('posted_by')} <span className="text-white">{project.client}</span></p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        project.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-white/40'
                      }`}>
                        {t(project.status)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('budget_range')}</span>
                        <span className="text-lg font-black text-white">${project.budget.toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedProject(project);
                          setShowApplyModal(true);
                        }}
                        className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-primary hover:text-bg-dark transition-all border border-white/5"
                      >
                        {t('view_details')} <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('top_talent')}</h2>
              <div className="space-y-4">
                {MOCK_TALENT.map((talent) => (
                  <Link 
                    key={talent.id} 
                    to={`/studio/${lang || 'eng'}/profile/${talent.id}`}
                    className="group flex items-center gap-4 p-5 rounded-[1.5rem] border border-white/5 bg-white/5 hover:border-primary/20 transition-all cursor-pointer"
                  >
                    <div className={`avatar ${talent.online ? 'avatar-online-bottom' : 'avatar-offline-bottom'}`}>
                      <div className="size-14 rounded-2xl shadow-lg shadow-black/20 border border-white/5">
                        <img src={talent.avatar} alt={talent.name} referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-white truncate tracking-tight uppercase">{talent.name}</h4>
                      <p className="text-xs text-white/40 font-medium truncate">{t(talent.roleKey)}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                        <MapPin size={10} />
                        <span>{talent.location}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 text-white/20 rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-all">
                      <MessageSquare size={18} />
                    </div>
                  </Link>
                ))}
              </div>
              <button className="w-full py-4 rounded-2xl border-2 border-white/5 text-xs font-black uppercase tracking-widest text-white/40 hover:bg-white/5 hover:border-white/10 transition-all">
                {t('browse_talent')}
              </button>
            </section>

            <section className="p-8 rounded-[2.5rem] bg-bg-card border border-white/5 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-black/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-3 text-primary">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-bg-dark">
                  <Globe size={20} />
                </div>
                <h3 className="font-black uppercase tracking-widest text-sm">{t('studio_pro')}</h3>
              </div>
              <p className="text-sm text-white/40 font-medium leading-relaxed">
                {t('studio_pro_desc')}
              </p>
              <button className="w-full py-4 rounded-2xl bg-primary text-bg-dark text-xs font-black uppercase tracking-widest hover:bg-primary-hover transition-all hover:scale-105 shadow-xl shadow-primary/20">
                {t('upgrade_pro')}
              </button>
            </section>
          </aside>
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-zinc-900 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
            >
              <div className="p-12 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Apply to Project</span>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white">{selectedProject.title}</h2>
                  </div>
                  <button onClick={() => setShowApplyModal(false)} className="size-12 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-all hover:bg-white/10">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20">Project Description</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{selectedProject.description}</p>
                </div>

                <form onSubmit={handleApply} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Proposal / Cover Letter</label>
                      <textarea 
                        required
                        placeholder="Explain why you are the best fit for this project..."
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none min-h-[120px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Bid Amount ($)</label>
                        <input type="number" required placeholder="800" className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Estimated Days</label>
                        <input type="number" required placeholder="5" className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Portfolio Link</label>
                      <input type="url" placeholder="https://artstation.com/your-name" className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
                    Submit Application
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Checkout Sidebar Trigger (Mock) */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => setShowCheckout(true)}
          className="size-16 bg-white text-bg-dark rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-4 border-primary/20"
        >
          <CreditCard size={28} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 size-6 bg-primary text-bg-dark text-[10px] font-black flex items-center justify-center rounded-full border-4 border-bg-dark">1</div>
        </button>
      </div>

      {/* Stripe Checkout Mock UI */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-bg-dark">
                    <Shield size={20} />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-bg-dark">Secure Checkout</h2>
                </div>
                <button onClick={() => setShowCheckout(false)} className="p-2 text-zinc-300 hover:text-bg-dark transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Subscription</h3>
                  <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-black uppercase tracking-tight text-bg-dark">Studio Pro Annual</div>
                      <div className="text-xs font-bold text-zinc-400">Billed yearly • Save 20%</div>
                    </div>
                    <div className="text-xl font-black text-bg-dark">$199</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Details</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CreditCard size={20} className="text-zinc-400" />
                        <span className="text-sm font-bold text-zinc-300">•••• •••• •••• 4242</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Edit</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-bold text-zinc-300">12 / 26</div>
                      <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-bold text-zinc-300">CVC</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-12">
                  <div className="flex items-center justify-between text-sm font-bold text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-bg-dark">$199.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-zinc-400">
                    <span>Tax (0%)</span>
                    <span className="text-bg-dark">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <span className="text-lg font-black uppercase text-bg-dark">Total Due</span>
                    <span className="text-2xl font-black text-bg-dark">$199.00</span>
                  </div>
                </div>
              </div>

              <div className="p-10 border-t border-zinc-100">
                <button className="w-full py-5 bg-bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3">
                  <CheckCircle size={18} className="text-primary" /> Pay & Activate Pro
                </button>
                <p className="text-center mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Shield size={12} /> Powered by Stripe
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
