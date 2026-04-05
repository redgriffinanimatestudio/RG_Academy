import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

// Sections
import HeroSection from './Home/sections/HeroSection';
import ServicesSection from './Home/sections/ServicesSection';
import AboutSection from './Home/sections/AboutSection';
import StatsSection from './Home/sections/StatsSection';
import CtaSection from './Home/sections/CtaSection';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { lang = 'eng' } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleLoginRedirect = () => {
    navigate(`/${lang}/login`);
  };

  const getDashboardLink = () => {
    if (profile?.roles.includes('admin')) return `/admin/${lang}`;
    return `/aca/${lang}/dashboard`;
  };

  return (
    <div className="w-full">
      <HeroSection 
        t={t} 
        lang={lang} 
        user={user} 
        getDashboardLink={getDashboardLink} 
        handleLoginRedirect={handleLoginRedirect} 
      />
    </div>
  );
};

export default Home;
