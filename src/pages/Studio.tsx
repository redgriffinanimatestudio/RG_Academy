import React from 'react';
import { 
  Plus, 
  Briefcase, 
  ChevronRight, 
  Zap, 
  Shield, 
  CreditCard, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader from '../components/Preloader';
import KanbanBoard from '../components/KanbanBoard';

// Hooks & Logic
import { useStudioLogic } from './Studio/useStudioLogic';

// Modular Components
import ProjectCard from './Studio/components/ProjectCard';
import TalentCard from './Studio/components/TalentCard';
import ApplyModal from './Studio/components/ApplyModal';
import CheckoutSidebar from './Studio/components/CheckoutSidebar';
import ReviewRoom from './Studio/components/ReviewRoom';
import CreateProjectModal from './Studio/components/CreateProjectModal';
import BalanceDisplay from '../components/dashboard/BalanceDisplay';

export default function Studio() {
  const {
    t, lang, activeTab, setActiveTab,
    selectedProject, setSelectedProject,
    showApplyModal, setShowApplyModal,
    showCheckout, setShowCheckout,
    searchQuery, setSearchQuery,
    showFilters, setShowFilters,
    filters, setFilters,
    showReviewRoom, setShowReviewRoom,
    showCreateModal, setShowCreateModal,
    activeSession, setActiveSession,
    isClient, isExecutor, hasSynergyCE,
    talent, loadingTalent, loadingProjects, filteredProjects, handleApply
  } = useStudioLogic();

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8">
      {/* 1. Client + Executor Synergy Header */}
      {hasSynergyCE && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-1 border border-sky-500/20 bg-sky-500/5 rounded-2xl sm:rounded-[2.5rem] backdrop-blur-xl mb-8 sm:mb-12 overflow-hidden"
        >
          <div className="p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/20 shadow-lg shadow-sky-500/10 shrink-0">
                <Layers size={24} className="sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="text-sm sm:text-xl font-black uppercase tracking-tight text-white italic truncate">Subcontracting Hub</h3>
                  <span className="px-2 py-0.5 bg-sky-500 text-bg-dark text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded shadow-lg shadow-primary/20">Production Synergy</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 italic truncate">
                  "Может нанимать других и сам браться за работу — идеальный баланс субподряда"
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                <Sparkles size={14} className="text-sky-400" /> <span className="sm:inline">Delegate Tasks</span>
              </button>
              <button 
                onClick={() => {
                  setActiveSession({ id: 'demo-session', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', type: 'image' });
                  setShowReviewRoom(true);
                }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-bg-dark rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-sky-500/20"
              >
                Master Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
        <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <Briefcase size={14} />
            {t('studio_collab')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-white leading-none uppercase">
            {t('build_impossible').split('.')[0]} <br />
            <span className="text-primary italic">{t('build_impossible').split('.')[1] || 'IMPOSSIBLE.'}</span>
          </h1>
          <p className="text-sm sm:text-lg text-white/40 max-w-xl font-medium mx-auto lg:mx-0">
            {t('studio_desc')}
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="p-1 bg-white/10 rounded-2xl border border-white/5 flex flex-1">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`flex-1 px-4 sm:px-6 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'browse' ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
              >
                Browse Projects
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`flex-1 px-4 sm:px-6 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
              >
                My Projects
              </button>
            </div>
            {isClient && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="criativo-btn flex items-center justify-center gap-3 w-full sm:w-auto !py-4 !rounded-2xl"
              >
                <Plus size={18} />
                <span className="text-[10px]">{t('post_project')}</span>
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text" placeholder="Search projects..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/5 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-white placeholder:text-white/40 outline-none"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-primary text-bg-dark border-primary' : 'bg-white/10 text-white/60 border-white/5 hover:border-white/20'}`}
            >
              <Filter size={18} /> {t('filters')}
            </button>
          </div>
        </div>
      </header>

      {/* Financial Ledger Bridge */}
      {isExecutor && activeTab === 'browse' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BalanceDisplay />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { l: 'Open Requests', v: filteredProjects.length.toString(), i: Briefcase, c: 'text-primary' },
              { l: 'Your Active Bids', v: '0', i: Clock, c: 'text-sky-400' },
              { l: 'Success Rate', v: '100%', i: CheckCircle, c: 'text-emerald-400' }
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                <div className="space-y-1"><p className="text-[9px] font-black uppercase tracking-widest text-white/20">{s.l}</p><p className="text-xl font-black text-white">{s.v}</p></div>
                <s.i size={20} className={`${s.c} opacity-20 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Project Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'open', 'in_progress', 'completed'].map((s) => (
                    <button key={s} onClick={() => setFilters({ ...filters, status: s })} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.status === s ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}>{s.replace('_', ' ')}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Min Budget: ${filters.budgetMin}</h4>
                <input type="range" min="0" max="5000" step="100" value={filters.budgetMin} onChange={(e) => setFilters({ ...filters, budgetMin: parseInt(e.target.value) })} className="w-full accent-primary bg-white/10 rounded-lg appearance-none h-1" />
                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest"><span>$0</span><span>$5,000+</span></div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Urgency</h4>
                <select value={filters.urgency} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary cursor-pointer appearance-none">
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
        <div className="space-y-8 sm:space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Project Management</h2>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white outline-none cursor-pointer appearance-none">
              <option className="bg-bg-card text-white">Active Projects</option>
              <option className="bg-bg-card text-white">Completed</option>
            </select>
          </div>
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"><KanbanBoard /></div>
        </div>
      ) : (
        <div className="space-y-12 sm:space-y-16">
          <section className="space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">{t('active_projects')}</h2>
              <button className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">{t('view_all')}</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {loadingProjects ? (
                <div className="col-span-full">
                  <Preloader message="Synchronizing Project Feed..." size="md" />
                </div>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} t={t} onViewDetails={(p) => { setSelectedProject(p); setShowApplyModal(true); }} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-white/20 uppercase font-black border border-dashed border-white/5 rounded-[2.5rem]">
                  No projects found in the current sector.
                </div>
              )}
            </div>
          </section>

          <section className="space-y-8 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('top_talent')}</h2>
              <button className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">{t('browse_talent')}</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingTalent ? (
                <Preloader message="Loading Talent..." size="sm" />
              ) : Array.isArray(talent) && talent.length > 0 ? (
                talent.map((person) => <TalentCard key={person.id} person={person} lang={lang} />)
              ) : (
                <p className="text-sm text-white/50">No talent profiles found.</p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Modals & Sidebars */}
      <AnimatePresence>
        {showApplyModal && selectedProject && (
          <ApplyModal project={selectedProject} onClose={() => setShowApplyModal(false)} onSubmit={handleApply} />
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => setShowCheckout(true)}
          className="size-16 bg-white text-bg-dark rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-4 border-primary/20"
        >
          <CreditCard size={28} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 size-6 bg-primary text-bg-dark text-[10px] font-black flex items-center justify-center rounded-full border-4 border-bg-dark">1</div>
        </button>
      </div>

      <AnimatePresence>
        {showCheckout && <CheckoutSidebar onClose={() => setShowCheckout(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewRoom && activeSession && (
          <ReviewRoom 
            sessionId={activeSession.id}
            mediaUrl={activeSession.url}
            mediaType={activeSession.type}
            onClose={() => setShowReviewRoom(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <CreateProjectModal 
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => { /* Logic to refresh projects list already exists in fetchProjects */ }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
