import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

// Components
import HeroPathfinder from '../components/home/HeroPathfinder';
import PathSelectionSection from './Home/sections/PathSelectionSection';
import ComplianceCenter from '../components/home/ComplianceCenter';
import { useUserJourney } from '../hooks/useUserJourney';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { lang = 'eng' } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { journey } = useUserJourney();

  const handleLoginRedirect = () => {
    navigate(`/${lang}/login`);
  };

  const getDashboardLink = () => {
    if (profile?.roles?.includes('admin')) return `/${lang}/admin`;
    return `/aca/${lang}/dashboard`;
  };

  const scrollToPath = () => {
    const el = document.getElementById('path-selection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full relative">
      <ComplianceCenter onAccept={() => {}} />
      
      <HeroPathfinder 
        t={t} 
        lang={lang} 
        onDiscover={scrollToPath}
      />

      <div id="path-selection">
        <PathSelectionSection 
          t={t} 
          lang={lang} 
          user={user}
        />
      </div>
    </div>
  );
};

export default Home;
