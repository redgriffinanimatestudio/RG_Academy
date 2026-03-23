import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Academy from './pages/Academy';
import Studio from './pages/Studio';
import Community from './pages/Community';
import Home from './pages/Home';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Contracts from './pages/Contracts';
import InfoPage from './pages/InfoPage';
import DevDashboard from './pages/DevDashboard';
import { AlertProvider } from './components/Alert';
import { AuthProvider } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import './i18n';

const LANGUAGES = ['eng', 'ru', 'tr', 'az'];

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && LANGUAGES.includes(lang)) {
      i18n.changeLanguage(lang);
    } else if (!lang) {
      const detectedLang = i18n.language.split('-')[0];
      const targetLang = LANGUAGES.includes(detectedLang) ? detectedLang : 'eng';
      const path = location.pathname;
      if (path === '/') {
        navigate(`/${targetLang}`, { replace: true });
      }
    }
  }, [lang, i18n, navigate, location.pathname]);

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <Routes>
            <Route path="/:lang" element={<LanguageWrapper><Layout><Home /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang" element={<LanguageWrapper><Layout><Academy /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang" element={<LanguageWrapper><Layout><Studio /></Layout></LanguageWrapper>} />
            <Route path="/community/:lang" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            <Route path="/login/:lang" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/contracts" element={<LanguageWrapper><Layout><Contracts /></Layout></LanguageWrapper>} />
            
            <Route path="/dev/:lang" element={<LanguageWrapper><Layout><DevDashboard /></Layout></LanguageWrapper>} />
            <Route path="/privacy" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
            <Route path="/terms" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
            
            <Route path="/" element={<LanguageWrapper children={null} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}