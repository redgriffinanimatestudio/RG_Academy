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
          // 1. Check Browser Language first (Fastest)
          const browserLang = navigator.language.split('-')[0].toLowerCase();
          
          if (SUPPORTED_LANGS.includes(browserLang)) {
            console.log(`[Geo] Detected browser language: ${browserLang}`);
            navigate(`/${browserLang}`, { replace: true });
            return;
          }

          // 2. Fallback to IP-based Geolocation (More accurate for regional mapping)
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          let targetLang = 'eng';
          const countryCode = data.country_code?.toLowerCase();
          
          const countryToLang: Record<string, string> = {
            'ru': 'ru',
            'by': 'ru',
            'kz': 'ru',
            'th': 'thai',
            'az': 'az',
            'tr': 'tr',
            'es': 'es',
            'mx': 'es',
            'fr': 'fr',
            'de': 'de',
            'at': 'de',
            'ch': 'de',
            'it': 'it'
          };

          if (countryCode && countryToLang[countryCode]) {
            targetLang = countryToLang[countryCode];
          }

          console.log(`[Geo] Detected country: ${countryCode}, Redirecting to: /${targetLang}`);
          navigate(`/${targetLang}`, { replace: true });

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
