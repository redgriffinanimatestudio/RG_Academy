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
import AdminDashboard from './pages/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import TopicPage from './pages/TopicPage';
import SpecialistProfile from './pages/SpecialistProfile';
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
      
      // If path is root, just go to /lang
      if (path === '/') {
        navigate(`/${targetLang}`, { replace: true });
        return;
      }

      // Handle common paths that might be missing the language prefix
      const segments = path.split('/').filter(Boolean);
      const firstSegment = segments[0];

      if (['aca', 'studio', 'community', 'login', 'dev', 'messages', 'dashboard', 'contracts'].includes(firstSegment)) {
        // Path is like /aca/something -> redirect to /aca/lang/something
        const newPath = `/${firstSegment}/${targetLang}/${segments.slice(1).join('/')}`;
        navigate(newPath, { replace: true });
      } else if (firstSegment === 'academy') {
        // Special case for /academy
        navigate(`/aca/${targetLang}/${segments.slice(1).join('/')}`, { replace: true });
      } else if (!LANGUAGES.includes(firstSegment)) {
        // Fallback for unknown paths: try to prepend language
        // but avoid prepending to legal pages which don't have lang in App.tsx routes
        if (!['privacy', 'terms'].includes(firstSegment)) {
          navigate(`/${targetLang}${path}`, { replace: true });
        }
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
            <Route path="/admin/:lang" element={<LanguageWrapper><Layout><AdminDashboard /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang" element={<LanguageWrapper><Layout><Academy /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/topic/:topicSlug" element={<LanguageWrapper><Layout><TopicPage /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/course/:slug" element={<LanguageWrapper><Layout><CourseDetail /></Layout></LanguageWrapper>} />
            <Route path="/learn/:lang/:slug" element={<LanguageWrapper><Learn /></LanguageWrapper>} />
            <Route path="/studio/:lang" element={<LanguageWrapper><Layout><Studio /></Layout></LanguageWrapper>} />
            
            {/* Mode-specific sub-pages */}
            <Route path="/aca/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/signup" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/signup" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/create-course" element={<LanguageWrapper><Layout><CreateCourse /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/profile/:id" element={<LanguageWrapper><Layout><SpecialistProfile /></Layout></LanguageWrapper>} />
            
            <Route path="/studio/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/profile/:id" element={<LanguageWrapper><Layout><SpecialistProfile /></Layout></LanguageWrapper>} />
            
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
      </AuthProvider>
    </Router>
  );
}
