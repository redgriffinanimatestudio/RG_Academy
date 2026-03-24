import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
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
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'manage'>('browse');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', urgency: 'all', budgetMin: 0 });
  const [talent, setTalent] = useState<any[]>([]);
  const [loadingTalent, setLoadingTalent] = useState(true);

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

  return (
    <div className="space-y-12 py-8">
      <StudioSynergyHeader hasSynergyCE={hasSynergyCE} />
      
      <StudioFilters 
        activeTab={activeTab} setActiveTab={setActiveTab}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        showFilters={showFilters} setShowFilters={setShowFilters}
        filters={filters} setFilters={setFilters} isClient={isClient}
      />

      <StudioStats isExecutor={isExecutor} />

      {activeTab === 'manage' ? (
        <div className="space-y-12">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Project Management</h2>
          <KanbanBoard />
        </div>
      ) : (
        <div className="space-y-20">
          <section className="space-y-8">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('active_projects')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map(p => (
                <ProjectCard key={p.id} project={p} onViewDetails={(proj) => { setSelectedProject(proj); setShowApplyModal(true); }} />
              ))}
            </div>
          </section>

          <section className="space-y-8 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('top_talent')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingTalent ? <Preloader size="sm" /> : talent.map(p => <TalentCard key={p.id} person={p} lang={lang} />)}
            </div>
          </section>
        </div>
      )}

      <ApplyModal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} project={selectedProject} onSubmit={(e) => { e.preventDefault(); setShowApplyModal(false); }} />
      
      <CheckoutSidebar isOpen={showCheckout} onClose={() => setShowCheckout(false)} />

      <button onClick={() => setShowCheckout(true)} className="fixed bottom-8 right-8 z-40 size-16 bg-white text-bg-dark rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-primary/20">
        <CreditCard size={28} />
      </button>
    </div>
  );
}
