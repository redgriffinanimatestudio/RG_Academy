import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Shield, Zap, ArrowRight, Layers } from 'lucide-react';

// Components
import HeroPathfinder from '../components/home/HeroPathfinder';
import PathSelectionSection from './Home/sections/PathSelectionSection';
import ComplianceCenter from '../components/home/ComplianceCenter';
import { useUserJourney } from '../hooks/useUserJourney';
import { OperationalLedger } from '../components/finance/OperationalLedger';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { lang = 'eng' } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { journey } = useUserJourney();

  const isAuthenticated = !!user;

  const handleLoginRedirect = () => {
    navigate(`/${lang}/login`);
  };

  const scrollToPath = () => {
    const el = document.getElementById('path-selection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full relative min-h-screen bg-bg-dark">
      <ComplianceCenter onAccept={() => {}} />
      
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div 
            key="guest-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-0"
          >
            <HeroPathfinder 
              t={t} 
              lang={lang} 
              onDiscover={scrollToPath}
            />

            <div id="path-selection" className="pb-32">
              <PathSelectionSection 
                t={t} 
                lang={lang} 
                user={user}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth-home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12"
          >
            {/* --- GLOBAL NEXUS HEADER --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit text-primary">
                <Globe size={14} className="animate-spin-slow" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Nexus Active</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                Welcome back, <span className="text-primary italic">{profile?.displayName?.split(' ')[0]}</span>
              </h1>
            </div>

            {/* --- CORE SECTORS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Academy Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 onClick={() => navigate(`/aca/${lang}`)}
                 className="group relative p-8 rounded-[3rem] glass-pro-max border border-white/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden metallic-glow"
               >
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Activity size={120} className="text-primary" />
                 </div>
                 <div className="relative z-10 space-y-4">
                   <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                     <Layers size={20} className="text-primary" />
                     Academy Sector
                   </h2>
                   <p className="text-white/40 font-bold text-sm leading-relaxed max-w-xs">
                     Resume your professional trajectory and track skillset synchronization.
                   </p>
                   <div className="size-12 rounded-full bg-primary text-bg-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                     <ArrowRight size={20} />
                   </div>
                 </div>
               </motion.div>

               {/* Studio Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 onClick={() => navigate(`/studio/${lang}`)}
                 className="group relative p-8 rounded-[3rem] glass-pro-max border border-white/5 hover:border-blue-500/40 transition-all cursor-pointer overflow-hidden metallic-glow"
               >
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={120} className="text-blue-500" />
                 </div>
                 <div className="relative z-10 space-y-4">
                   <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                     <Zap size={20} className="text-blue-500" />
                     Studio Sector
                   </h2>
                   <p className="text-white/40 font-bold text-sm leading-relaxed max-w-xs">
                     Manage industrial projects, briefs, and team collaborations.
                   </p>
                   <div className="size-12 rounded-full bg-blue-500 text-bg-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                     <ArrowRight size={20} />
                   </div>
                 </div>
               </motion.div>
            </div>

            {/* --- OPERATIONAL LEDGER HUD --- */}
            <div className="pt-12 border-t border-white/5">
                <OperationalLedger />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
