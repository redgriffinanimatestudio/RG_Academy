import React, { useEffect, Suspense } from 'react';
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
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { AlertProvider } from './components/Alert';
import { AuthProvider } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import './i18n';

const LANGUAGES = ['eng', 'ru', 'tr', 'az'];
const PROFESSIONAL_ROLES = ['admin', 'chief-manager', 'manager', 'moderator', 'hr', 'finance', 'support'];

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

function LoginRedirect() {
  const { lang } = useParams();
  return <Navigate to={`/login/${lang || 'eng'}`} replace />;
}

function ProfessionalRoute({ children }: { children: React.ReactNode }) {
  const { role } = useParams();
  if (!PROFESSIONAL_ROLES.includes(role || '')) {
    return <Navigate to="/eng" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
              <div className="size-16 rounded-3xl border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
          }>
            <Routes>
              {/* Unified Entry Points */}
              <Route path="/:lang" element={<LanguageWrapper><Layout><Home /></Layout></LanguageWrapper>} />
              
              {/* Core Modules */}
              <Route path="/aca/:lang" element={<LanguageWrapper><Layout><Academy /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang" element={<LanguageWrapper><Layout><Studio /></Layout></LanguageWrapper>} />
              <Route path="/community/:lang" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
              
              {/* Professional Auth Entry */}
              <Route path="/login/:lang" element={<LanguageWrapper><Login /></LanguageWrapper>} />
              
              {/* Redirects for Legacy Paths to ensure "Single Entry" */}
              <Route path="/aca/:lang/login" element={<LanguageWrapper><LoginRedirect /></LanguageWrapper>} />
              <Route path="/studio/:lang/login" element={<LanguageWrapper><LoginRedirect /></LanguageWrapper>} />
              
              {/* User Content */}
              <Route path="/aca/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/contracts" element={<LanguageWrapper><Layout><Contracts /></Layout></LanguageWrapper>} />
              <Route path="/:mode/:lang/profile/:uid" element={<LanguageWrapper><Layout><Profile /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/dashboard" element={<LanguageWrapper><Layout><AdminDashboard /></Layout></LanguageWrapper>} />
              
              {/* Professional Dashboards (Dynamic) */}
              <Route path="/:role/:lang" element={
                <LanguageWrapper>
                  <ProfessionalRoute>
                    <Layout><AdminDashboard /></Layout>
                  </ProfessionalRoute>
                </LanguageWrapper>
              } />
              
              <Route path="/privacy" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
              <Route path="/terms" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
              
              {/* Root & Catch-all */}
              <Route path="/" element={<LanguageWrapper children={null} />} />
              <Route path="*" element={<Navigate to="/eng" />} />
            </Routes>
          </Suspense>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}