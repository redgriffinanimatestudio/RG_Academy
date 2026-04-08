import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SUPPORTED_LANGS = ['eng', 'ru', 'az', 'tr', 'es', 'fr', 'de', 'it', 'thai'];

export const GeoRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only perform geo-redirect if we are on the root path
    if (location.pathname === '/' || location.pathname === '') {
      const detectAndRedirect = async () => {
        try {
          // Use browser language only to avoid third-party CORS failures in dev.
          const browserLang = navigator.language.split('-')[0].toLowerCase();
          
          if (SUPPORTED_LANGS.includes(browserLang)) {
            console.log(`[Geo] Detected browser language: ${browserLang}`);
            navigate(`/${browserLang}`, { replace: true });
            return;
          }
          navigate('/eng', { replace: true });
        } catch (error) {
          console.error('[Geo] Detection failed, defaulting to /eng', error);
          navigate('/eng', { replace: true });
        }
      };

      detectAndRedirect();
    }
  }, [location.pathname, navigate]);

  return null;
};
