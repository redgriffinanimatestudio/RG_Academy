import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Cpu, Zap, ArrowRight, Briefcase, Users, Layout as LayoutIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { networkingService } from '../../services/networkingService';
import { useAuth } from '../../context/AuthContext';
import Preloader from '../../components/Preloader';
import KanbanBoard from '../../components/KanbanBoard';

// Modular Studio Components
import StudioSynergyHeader from '../../components/studio/StudioSynergyHeader';
import StudioFilters from '../../components/studio/StudioFilters';
import StudioStats from '../../components/studio/StudioStats';
import ProjectCard from '../../components/studio/ProjectCard';
import TalentCard from '../../components/studio/TalentCard';
import ApplyModal from '../../components/studio/ApplyModal';
import CheckoutSidebar from '../../components/studio/CheckoutSidebar';

const MOCK_PROJECTS = [
  { id: '1', title: 'Character Rigging for Indie RPG', client: 'Nebula Games', budget: 800, tags: ['Maya', 'Rigging'], status: 'open', urgency: 'urgent', description: 'We need a senior rigger.' },
  { id: '2', title: 'Environment Concept Art', client: 'Starlight Studios', budget: 2500, tags: ['Concept Art'], status: 'in_progress', urgency: 'normal', description: 'Sci-fi city concept.' },
  { id: '3', title: 'VFX for Short Film', client: 'Independent Creator', budget: 1800, tags: ['Houdini', 'VFX'], status: 'open', urgency: 'urgent', description: 'Magical fire effects.' }
];

export default function StudioPage() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'manage'>('browse');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', urgency: 'all', budgetMin: 0 });
  const [talent, setTalent] = useState<any[]>([]);
  const [loadingTalent, setLoadingTalent] = useState(true);

  const isAuthenticated = !!user;
  const userRoles = profile?.roles || [];
  const isClient = userRoles.includes('client') || userRoles.includes('admin');
  const isExecutor = userRoles.includes('executor') || userRoles.includes('admin');
  const hasSynergyCE = isClient && isExecutor;

  useEffect(() => {
    async function fetchTalent() {
      try {
        setLoadingTalent(true);
        const data = await networkingService.searchProfiles('');
        setTalent(data);
      } catch (error) { console.error(error); } finally { setLoadingTalent(false); }
    }
    fetchTalent();
  }, []);

  const filteredProjects = MOCK_PROJECTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === 'all' || p.status === filters.status;
    const matchesBudget = p.budget >= filters.budgetMin;
    return matchesSearch && matchesStatus && matchesBudget;
  });

  if (loadingTalent && isAuthenticated) return <Preloader message="Loading Studio Ecosystem..." size="lg" />;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔮 Industrial Studio Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-t from-blue-500/5 to-transparent blur-[180px] opacity-20" />
      </div>

      <div className="relative z-10 space-y-12 py-12 pb-32">
        
        {/* --- DYNAMIC STUDIO HEADER --- */}
        <AnimatePresence mode="wait">
          {isAuthenticated ? (
            <motion.div 
              key="auth-studio-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <StudioSynergyHeader hasSynergyCE={hasSynergyCE} />
              <StudioStats isExecutor={isExecutor} />
            </motion.div>
          ) : (
            <motion.div 
              key="guest-studio-header"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 text-center space-y-8 py-10"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Briefcase size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Industrial Agency Hub</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                  Industrial <span className="text-blue-500 italic">Production</span>
                </h1>
                <p className="text-white/40 font-bold max-w-2xl mx-auto leading-relaxed">
                  The Red Griffin Studio operates as an autonomous node for high-end CG production, 
                  connecting enterprise briefs with certified visual specialists.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 pt-6">
                <button 
                  onClick={() => navigate(`/${lang}/login`)}
                  className="px-10 py-5 bg-white text-bg-dark font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  Post a Brief
                </button>
                <button 
                  onClick={() => navigate(`/${lang}/register`)}
                  className="px-10 py-5 bg-transparent text-white border border-white/10 font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/5 transition-colors"
                >
                  Join as Creator
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🚀 NEURAL ENGINE CTA (Always visible for now, core feature) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/studio/${lang}/neural`)}
          className="group relative cursor-pointer overflow-hidden p-8 rounded-[3.5rem] glass-pro-max border border-white/5 hover:border-blue-500/40 transition-all duration-700 metallic-glow mx-4 sm:mx-8"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu size={200} className="text-blue-500 neural-pulse" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Experimental Node Active</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                  Launch <span className="text-blue-500 italic text-data-glow">Neural Engine</span>
              </h2>
              <p className="text-white/40 font-bold max-w-md leading-relaxed">
                  Experience high-performance AI synthesis. Direct ComfyUI integration for industrial creative identity generation.
              </p>
            </div>
            <div className="size-16 rounded-full bg-blue-500 text-bg-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                <ArrowRight size={24} />
            </div>
          </div>
        </motion.div>
        
        {/* --- OPERATIONAL CONTROLS (Only for Auth) --- */}
        {isAuthenticated && (
          <div className="px-4 sm:px-8 space-y-12">
            <StudioFilters 
              activeTab={activeTab} setActiveTab={setActiveTab}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              showFilters={showFilters} setShowFilters={setShowFilters}
              filters={filters} setFilters={setFilters} isClient={isClient}
            />

            <AnimatePresence mode="wait">
              {activeTab === 'manage' ? (
                <motion.div 
                  key="manage-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="flex items-center gap-4">
                    <LayoutIcon size={24} className="text-blue-500" />
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white">Project Matrix</h2>
                  </div>
                  <KanbanBoard />
                </motion.div>
              ) : (
                <motion.div 
                  key="browse-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-20"
                >
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <Zap size={24} className="text-blue-500" />
                      <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('active_projects')}</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredProjects.map(p => (
                        <ProjectCard key={p.id} project={p} onViewDetails={(proj) => { setSelectedProject(proj); setShowApplyModal(true); }} />
                      ))}
                    </div>
                  </section>

                  <section className="space-y-8 pt-12 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <Users size={24} className="text-blue-500" />
                      <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('top_talent')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {talent.length === 0 ? <Preloader size="sm" /> : talent.map(p => <TalentCard key={p.id} person={p} lang={lang} />)}
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- GUEST LANDING SECTIONS --- */}
        {!isAuthenticated && (
          <div className="space-y-32 pt-20">
            {/* We could add a Showreel/Portfolio section here */}
            <div className="px-8 text-center py-20 border-y border-white/5 bg-white/[0.01]">
               <h3 className="text-2xl font-black uppercase tracking-widest text-white/20">Industrial Showreel Coming Soon</h3>
            </div>
          </div>
        )}

        <ApplyModal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} project={selectedProject} onSubmit={(e) => { e.preventDefault(); setShowApplyModal(false); }} />
        <CheckoutSidebar isOpen={showCheckout} onClose={() => setShowCheckout(false)} />

        {isAuthenticated && (
          <button onClick={() => setShowCheckout(true)} className="fixed bottom-8 right-8 z-40 size-16 bg-white text-bg-dark rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-blue-500/20 hover:scale-110 transition-transform">
            <CreditCard size={28} />
          </button>
        )}
      </div>
    </div>
  );
}
