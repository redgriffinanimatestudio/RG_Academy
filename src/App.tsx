import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Academy from './pages/Academy/AcademyPage';
import CourseDetail from './pages/CourseDetail';
import Learn from './pages/Learn';
import Studio from './pages/Studio/StudioPage';
import Community from './pages/Community/CommunityPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard/DashboardController';
import TopicPage from './pages/TopicPage';
import ServicePage from './pages/ServicePage';
import CommunityTopic from './pages/CommunityTopic';
import SpecialistProfile from './pages/SpecialistProfile';
import Contracts from './pages/Contracts';
import InfoPage from './pages/InfoPage';
import DevDashboard from './pages/DevDashboard';
import { AlertProvider } from './components/Alert';
import { AuthProvider } from './context/AuthContext';
import { PlatformProvider } from './context/PlatformContext';
import { useSyncManager } from './services/syncManager';
import { useTranslation } from 'react-i18next';
import './i18n';

const LANGUAGES = ['eng', 'ru', 'tr', 'az'];

function SyncHandler({ children }: { children: React.ReactNode }) {
  useSyncManager();
  return <>{children}</>;
}

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && LANGUAGES.includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    } else {
      const pathParts = location.pathname.split('/').filter(Boolean);
      if (!(pathParts.length > 0 && LANGUAGES.includes(pathParts[0]))) {
        navigate(`/eng${location.pathname}`, { replace: true });
      }
    }
  }, [lang, i18n, navigate, location.pathname]);

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <PlatformProvider>
          <SyncHandler>
            <AlertProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/eng" replace />} />
                {/* ... rest of the routes ... */}
            {/* Main Routes */}
            <Route path="/:lang" element={<LanguageWrapper><Layout><Home /></Layout></LanguageWrapper>} />
            <Route path="/:lang/dev" element={<LanguageWrapper><Layout><DevDashboard /></Layout></LanguageWrapper>} />
            <Route path="/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
            
            {/* Redirect legacy specific routes to unified dashboard */}
            <Route path="/:lang/admin" element={<Navigate to="/:lang/dashboard" replace />} />
            <Route path="/:lang/chief-manager" element={<Navigate to="/:lang/dashboard" replace />} />
            <Route path="/:lang/manager" element={<Navigate to="/:lang/dashboard" replace />} />
            <Route path="/:lang/staff" element={<Navigate to="/:lang/dashboard" replace />} />
            <Route path="/:lang/moderator" element={<Navigate to="/:lang/dashboard" replace />} />
            <Route path="/:lang/hr" element={<Navigate to="/:lang/dashboard" replace />} />
            <Route path="/:lang/finance" element={<Navigate to="/:lang/dashboard" replace />} />
            <Route path="/:lang/support" element={<Navigate to="/:lang/dashboard" replace />} />

            {/* Academy Routes */}
            <Route path="/aca/:lang" element={<LanguageWrapper><Layout><Academy /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/topic/:topicSlug" element={<LanguageWrapper><Layout><TopicPage /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/course/:slug" element={<LanguageWrapper><Layout><CourseDetail /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/profile/:id" element={<LanguageWrapper><Layout><SpecialistProfile /></Layout></LanguageWrapper>} />
            <Route path="/aca/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
            
            {/* Studio Routes */}
            <Route path="/studio/:lang" element={<LanguageWrapper><Layout><Studio /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/service/:serviceSlug" element={<LanguageWrapper><Layout><ServicePage /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/profile/:id" element={<LanguageWrapper><Layout><SpecialistProfile /></Layout></LanguageWrapper>} />
            <Route path="/studio/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />

            {/* Other */}
            <Route path="/learn/:lang/:slug" element={<LanguageWrapper><Learn /></LanguageWrapper>} />
            <Route path="/:lang/privacy" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
            <Route path="/:lang/terms" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
            
            <Route path="*" element={<Navigate to="/eng" replace />} />
          </Routes>
        </AlertProvider>
      </SyncHandler>
    </PlatformProvider>
  </AuthProvider>
</Router>
  );
}
