import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Briefcase, ChevronRight, Play, Check, Users, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import Academy from './pages/Academy';
import CourseDetail from './pages/CourseDetail';
import Learn from './pages/Learn';
import Studio from './pages/Studio';
import Community from './pages/Community';
import Home from './pages/Home';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import SpecialistProfile from './pages/SpecialistProfile';
import Contracts from './pages/Contracts';
import InfoPage from './pages/InfoPage';
import DevDashboard from './pages/DevDashboard';
import { AlertProvider } from './components/Alert';
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
      // If no lang in URL, redirect to detected or default lang
      const detectedLang = i18n.language.split('-')[0];
      const targetLang = LANGUAGES.includes(detectedLang) ? detectedLang : 'eng';
      
      // Handle special cases for all main paths
      const path = location.pathname;
      if (path === '/academy' || path === '/aca') {
        navigate(`/aca/${targetLang}`, { replace: true });
      } else if (path === '/studio') {
        navigate(`/studio/${targetLang}`, { replace: true });
      } else if (path === '/community') {
        navigate(`/community/${targetLang}`, { replace: true });
      } else if (path === '/login') {
        navigate(`/login/${targetLang}`, { replace: true });
      } else if (path === '/dev') {
        navigate(`/dev/${targetLang}`, { replace: true });
      } else if (path === '/') {
        navigate(`/${targetLang}`, { replace: true });
      }
    }
  }, [lang, i18n, navigate, location.pathname]);

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AlertProvider>
        <Routes>
          {/* Redirects for legacy paths */}
          <Route path="/academy" element={<LanguageWrapper children={null} />} />
          <Route path="/aca" element={<LanguageWrapper children={null} />} />
          <Route path="/studio" element={<LanguageWrapper children={null} />} />
          <Route path="/community" element={<LanguageWrapper children={null} />} />
          <Route path="/login" element={<LanguageWrapper children={null} />} />
          <Route path="/dev" element={<LanguageWrapper children={null} />} />
          
          {/* Language prefixed routes */}
          <Route path="/:lang" element={<LanguageWrapper><Layout><Home /></Layout></LanguageWrapper>} />
          <Route path="/dev/:lang" element={<LanguageWrapper><Layout><DevDashboard /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang" element={<LanguageWrapper><Layout><Academy /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/course/:slug" element={<LanguageWrapper><Layout><CourseDetail /></Layout></LanguageWrapper>} />
          <Route path="/learn/:lang/:slug" element={<LanguageWrapper><Learn /></LanguageWrapper>} />
          <Route path="/studio/:lang" element={<LanguageWrapper><Layout><Studio /></Layout></LanguageWrapper>} />
          
          {/* Mode-specific sub-pages */}
          <Route path="/aca/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
          <Route path="/studio/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
          <Route path="/studio/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/create-course" element={<LanguageWrapper><Layout><CreateCourse /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/profile/:id" element={<LanguageWrapper><Layout><SpecialistProfile /></Layout></LanguageWrapper>} />
          <Route path="/studio/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/contracts" element={<LanguageWrapper><Layout><Contracts /></Layout></LanguageWrapper>} />
          <Route path="/studio/:lang/contracts" element={<LanguageWrapper><Layout><Contracts /></Layout></LanguageWrapper>} />
          
          {/* Info Pages (About, Contact, Support) */}
          <Route path="/aca/:lang/about" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
          <Route path="/studio/:lang/about" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/contact" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
          <Route path="/studio/:lang/contact" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
          <Route path="/aca/:lang/support" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
          <Route path="/studio/:lang/support" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
          
          {/* Legal Pages */}
          <Route path="/privacy" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
          <Route path="/terms" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
          
          {/* Legacy/Default sub-pages */}
          <Route path="/community/:lang" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
          <Route path="/login/:lang" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
          
          {/* Fallback */}
          <Route path="/" element={<LanguageWrapper children={null} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AlertProvider>
    </Router>
  );
}
