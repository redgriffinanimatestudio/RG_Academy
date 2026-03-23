import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
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
import ChiefManagerDashboard from './pages/ChiefManagerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import TopicPage from './pages/TopicPage';
import ServicePage from './pages/ServicePage';
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
      
      if (path === '/') {
        navigate(`/${targetLang}`, { replace: true });
        return;
      }

      const segments = path.split('/').filter(Boolean);
      const firstSegment = segments[0];

      if (['aca', 'studio', 'community', 'login', 'dev', 'messages', 'dashboard', 'contracts', 'admin', 'chief-manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'staff'].includes(firstSegment)) {
        const newPath = `/${firstSegment}/${targetLang}/${segments.slice(1).join('/')}`;
        navigate(newPath, { replace: true });
      } else if (!LANGUAGES.includes(firstSegment)) {
        navigate(`/${targetLang}${path}`, { replace: true });
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
            <Route path="/dev/:lang" element={<LanguageWrapper><Layout><DevDashboard /></Layout></LanguageWrapper>} />
            
            {/* WRAPPING ALL DASHBOARDS IN LAYOUT FOR GLOBAL NAV CONSISTENCY */}
            <Route path="/admin/:lang" element={<LanguageWrapper><Layout><AdminDashboard /></Layout></LanguageWrapper>} />
            <Route path="/chief-manager/:lang" element={<LanguageWrapper><Layout><ChiefManagerDashboard /></Layout></LanguageWrapper>} />
            <Route path="/manager/:lang" element={<LanguageWrapper><Layout><ManagerDashboard /></Layout></LanguageWrapper>} />
            <Route path="/staff/:lang" element={<LanguageWrapper><Layout><StaffDashboard /></Layout></LanguageWrapper>} />
            <Route path="/moderator/:lang" element={<LanguageWrapper><Layout><StaffDashboard /></Layout></LanguageWrapper>} />
            <Route path="/hr/:lang" element={<LanguageWrapper><Layout><StaffDashboard /></Layout></LanguageWrapper>} />
            <Route path="/finance/:lang" element={<LanguageWrapper><Layout><StaffDashboard /></Layout></LanguageWrapper>} />
            <Route path="/support/:lang" element={<LanguageWrapper><Layout><StaffDashboard /></Layout></LanguageWrapper>} />

            <Route path="/aca/:lang" element={<LanguageWrapper><Layout><Academy /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/topic/:topicSlug" element={<LanguageWrapper><Layout><TopicPage /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/service/:serviceSlug" element={<LanguageWrapper><Layout><ServicePage /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/course/:slug" element={<LanguageWrapper><Layout><CourseDetail /></Layout></LanguageWrapper>} />
            <Route path="/learn/:lang/:slug" element={<LanguageWrapper><Learn /></LanguageWrapper>} />
            <Route path="/studio/:lang" element={<LanguageWrapper><Layout><Studio /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            <Route path="/community/:lang" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/profile/:id" element={<LanguageWrapper><Layout><SpecialistProfile /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/profile/:id" element={<LanguageWrapper><Layout><SpecialistProfile /></Layout></LanguageWrapper>} />
            
            <Route path="/aca/:lang/contracts" element={<LanguageWrapper><Layout><Contracts /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/contracts" element={<LanguageWrapper><Layout><Contracts /></Layout></LanguageWrapper>} />
            
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