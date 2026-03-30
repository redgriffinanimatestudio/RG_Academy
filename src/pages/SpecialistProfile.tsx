import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Layers, 
  GraduationCap, 
  Briefcase, 
  Star,
  Award,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader from '../components/Preloader';

// Hooks & Logic
import { useProfileLogic, ProfileTab } from './Profile/useProfileLogic';

// Modular Components
import ProfileHeader from './Profile/components/ProfileHeader';
import ProfileTabsNav from './Profile/components/ProfileTabsNav';
import AboutTab from './Profile/components/AboutTab';
import PortfolioTab from './Profile/components/PortfolioTab';

export default function SpecialistProfile() {
  const {
    id, lang, t, profile, loading, authLoading, 
    activeTab, setActiveTab, isValidating, 
    handleStartChat, synergyBadges, isStudio
  } = useProfileLogic();

  const backLink = isStudio ? `/studio/${lang || 'eng'}` : `/aca/${lang || 'eng'}`;

  const tabs: { id: ProfileTab; label: string; icon: any }[] = [
    { id: 'about', label: t('about_specialist', 'О специалисте'), icon: User },
    { id: 'portfolio', label: t('portfolio', 'Портфолио'), icon: Layers },
    { id: 'experience', label: t('experience', 'Опыт работы'), icon: Briefcase },
    { id: 'education', label: t('education', 'Образование'), icon: GraduationCap },
    { id: 'reviews', label: t('reviews', 'Отзывы'), icon: Star },
  ];

  if (loading || authLoading) {
    return <Preloader message={t('loading_profile', 'Loading Profile...')} size="lg" className="min-h-screen bg-[#050505]" />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <h1 className="text-4xl font-black mb-4">{t('profile_not_found', 'Profile Not Found')}</h1>
        <Link to={backLink} className="text-primary hover:underline uppercase tracking-widest text-xs font-black">{t('go_back', 'Go Back')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <ProfileHeader 
        profile={profile} 
        synergyBadges={synergyBadges} 
        handleStartChat={handleStartChat} 
        isValidating={isValidating} 
        t={t} 
      />

      {/* Synergy Alert (Optional Info) */}
      {synergyBadges.some(b => b.synergy === 'le') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center gap-4">
          <div className="size-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Award size={20} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Practicing Mentor Synergy</p>
            <p className="text-xs text-white/60 font-medium">Этот специалист не только преподает, но и активно работает над проектами в Студии. Его портфолио включает реальные кейсы из индустрии.</p>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <ProfileTabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[400px] pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AboutTab profile={profile} t={t} />
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PortfolioTab profile={profile} synergyBadges={synergyBadges} />
            </motion.div>
          )}

          {activeTab !== 'about' && activeTab !== 'portfolio' && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 opacity-20">
              <Zap size={64} />
              <span className="text-[12px] font-black uppercase tracking-[0.5em] mt-6">{activeTab} section coming soon</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
