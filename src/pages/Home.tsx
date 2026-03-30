import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

// Sections
import HeroSection from './home/sections/HeroSection';
import ServicesSection from './home/sections/ServicesSection';
import AboutSection from './home/sections/AboutSection';
import StatsSection from './home/sections/StatsSection';
import CtaSection from './home/sections/CtaSection';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isStudio = location.pathname.includes('/studio/');
  const modePrefix = isStudio ? '/studio' : '/aca';

  const handleLoginRedirect = () => {
    navigate(`/${lang || 'eng'}/login`);
  };

  const getDashboardLink = () => {
    const targetLang = lang || 'eng';
    if (profile?.roles.includes('admin')) return `/admin/${targetLang}`;
    if (profile?.roles.includes('chief_manager')) return `/chief-manager/${targetLang}`;
    if (profile?.roles.includes('manager')) return `/manager/${targetLang}`;
    return `/aca/${targetLang}/dashboard`;
  };

  return (
    <div className="space-y-32 pb-24">
      <HeroSection 
        t={t} 
        lang={lang} 
        user={user} 
        getDashboardLink={getDashboardLink} 
        handleLoginRedirect={handleLoginRedirect} 
      />

      <ServicesSection t={t} />

      <AboutSection t={t} />

      <StatsSection t={t} />

      <CtaSection 
        t={t} 
        user={user} 
        lang={lang} 
        modePrefix={modePrefix} 
        getDashboardLink={getDashboardLink} 
        handleLoginRedirect={handleLoginRedirect} 
      />
    </div>
  );
};

export default Home;
