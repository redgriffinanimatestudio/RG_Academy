import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Video, UserPlus, Cpu, MessageSquare, Users, GraduationCap, Shield, Target, LayoutDashboard, Zap, DollarSign, LifeBuoy, BarChart3, Binary, Briefcase, ClipboardList, TrendingUp, Landmark, ShieldCheck, HeartPulse, Terminal, Key, Activity, Settings, Database, Filter, Globe, Layers, Lock, Monitor, Share2, Smartphone, Map, Brain
} from 'lucide-react';
import Layout from './components/Layout';
import Academy from './pages/Academy/AcademyPage';
import CourseDetail from './pages/CourseDetail';
import Learn from './pages/Learn';
import CourseBuilder from './pages/Academy/CourseBuilder';
import CourseEditor from './pages/Academy/CourseEditor';
import Studio from './pages/Studio/StudioPage';
import NeuralStudio from './pages/Studio/NeuralStudio';
import Community from './pages/Community/CommunityPage';
import RoadmapPage from './pages/Academy/RoadmapPage';
import NeuralForge from './pages/Dashboard/NeuralForge';
import Home from './pages/Home';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard/DashboardController';
import SpecialistProfile from './pages/SpecialistProfile';
import TopicPage from './pages/TopicPage';
import ServicePage from './pages/ServicePage';
import CommunityTopic from './pages/CommunityTopic';
import Contracts from './pages/Contracts';
import InfoPage from './pages/InfoPage';
import DevDashboard from './pages/DevDashboard';
import TrajectoryPage from './pages/Trajectory';
import AssetReview from './pages/AssetReview';
import Finance from './pages/Finance';
import WelcomeWaitlist from './pages/Dashboard/WelcomeWaitlist';
import VerificationFlow from './components/auth/VerificationFlow';
import RouteGuard from './components/auth/RouteGuard';
import { AlertProvider } from './components/Alert';
import GlobalSearchOverlay from './components/search/GlobalSearchOverlay';
import { AuthProvider } from './context/AuthContext';
import { PlatformProvider } from './context/PlatformContext';
import { ThemeProvider } from './context/ThemeContext';
import { useSyncManager } from './services/syncManager';
import { useTranslation } from 'react-i18next';
import Terms from './pages/Terms';
import { CookieConsent } from './components/common/CookieConsent';
import { GeoRedirect } from './components/common/GeoRedirect';
import './i18n';

const LANGUAGES = ['eng', 'ru', 'tr', 'az', 'es', 'fr', 'de', 'it', 'thai'];

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

function RedirectWithLang({ to }: { to: string }) {
  const { lang } = useParams();
  return <Navigate to={`/${lang || 'eng'}${to}`} replace />;
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PlatformProvider>
            <SyncHandler>
              <AlertProvider>
                <GlobalSearchOverlay />
                <CookieConsent />
                <GeoRedirect />
                <Routes>
                  {/* Public Entrance with Guard (Root Redirection) */}
                  <Route path="/" element={<RouteGuard><div className="bg-bg-dark min-h-screen" /></RouteGuard>} />
                  
                  {/* Main Routes */}
                  <Route path="/:lang" element={<LanguageWrapper><Layout><RouteGuard><Home /></RouteGuard></Layout></LanguageWrapper>} />
                  <Route path="/:lang/dev" element={<LanguageWrapper><Layout><DevDashboard /></Layout></LanguageWrapper>} />
                  <Route path="/:lang/dashboard" element={<LanguageWrapper><RouteGuard><Dashboard /></RouteGuard></LanguageWrapper>} />
                  <Route path="/:lang/dashboard/neural-forge" element={<LanguageWrapper><RouteGuard><Layout><NeuralForge /></Layout></RouteGuard></LanguageWrapper>} />
                  <Route path="/:lang/profile" element={<LanguageWrapper><RouteGuard><SpecialistProfile /></RouteGuard></LanguageWrapper>} />
                  <Route path="/:lang/dashboard/welcome-waitlist" element={<LanguageWrapper><WelcomeWaitlist /></LanguageWrapper>} />
                  <Route path="/:lang/finance" element={<LanguageWrapper><Layout><Finance /></Layout></LanguageWrapper>} />
                  <Route path="/:lang/login" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
                  <Route path="/:lang/register" element={<LanguageWrapper><Layout><Login /></Layout></LanguageWrapper>} />
                  <Route path="/:lang/verify" element={<LanguageWrapper><VerificationFlow /></LanguageWrapper>} />
                  
                  {/* Redirect legacy specific routes to unified dashboard */}
                  <Route path="/:lang/admin" element={<RedirectWithLang to="/dashboard" />} />
                  <Route path="/:lang/chief-manager" element={<RedirectWithLang to="/dashboard" />} />
                  <Route path="/:lang/manager" element={<RedirectWithLang to="/dashboard" />} />
                  <Route path="/:lang/staff" element={<RedirectWithLang to="/dashboard" />} />
                  <Route path="/:lang/moderator" element={<RedirectWithLang to="/dashboard" />} />
                  <Route path="/:lang/hr" element={<RedirectWithLang to="/dashboard" />} />
                  <Route path="/:lang/finance" element={<RedirectWithLang to="/dashboard" />} />
                  <Route path="/:lang/support" element={<RedirectWithLang to="/dashboard" />} />

              {/* Academy Routes */}
              <Route path="/aca/:lang" element={<LanguageWrapper><Layout><Academy /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/roadmap" element={<LanguageWrapper><Layout><RoadmapPage /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/topic/:topicSlug" element={<LanguageWrapper><Layout><TopicPage /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/course/:slug" element={<LanguageWrapper><Layout><CourseDetail /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/workshop" element={<LanguageWrapper><Layout><CourseBuilder /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/workshop/:courseId" element={<LanguageWrapper><Layout><CourseEditor /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/profile/:id" element={<LanguageWrapper><Layout><SpecialistProfile /></Layout></LanguageWrapper>} />
              <Route path="/aca/:lang/login" element={<LanguageWrapper><Layout><RouteGuard><Login /></RouteGuard></Layout></LanguageWrapper>} />
              
              {/* Studio Routes */}
              <Route path="/studio/:lang" element={<LanguageWrapper><Layout><Studio /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/service/:serviceSlug" element={<LanguageWrapper><Layout><ServicePage /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/community" element={<LanguageWrapper><Layout><Community /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/messages" element={<LanguageWrapper><Layout><Messages /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/dashboard" element={<LanguageWrapper><Layout><Dashboard /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/neural" element={<LanguageWrapper><Layout><NeuralStudio /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/finance" element={<LanguageWrapper><Layout><Finance /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/contracts" element={<LanguageWrapper><Layout><Contracts /></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/login" element={<LanguageWrapper><Layout><RouteGuard><Login /></RouteGuard></Layout></LanguageWrapper>} />
              <Route path="/studio/:lang/trajectory" element={<LanguageWrapper><Layout><TrajectoryPage /></Layout></LanguageWrapper>} />

              {/* Other */}
              <Route path="/learn/:lang/:slug" element={<LanguageWrapper><Learn /></LanguageWrapper>} />
              <Route path="/:lang/privacy" element={<LanguageWrapper><Layout><InfoPage /></Layout></LanguageWrapper>} />
              <Route path="/:lang/terms" element={<LanguageWrapper><Terms /></LanguageWrapper>} />
              
              {/* Review Terminal */}
              <Route path="/review/:lang/:projectId" element={<LanguageWrapper><AssetReview /></LanguageWrapper>} />
              <Route path="/review/:lang/:projectId/:taskId" element={<LanguageWrapper><AssetReview /></LanguageWrapper>} />
              
              <Route path="*" element={<Navigate to="/eng" replace />} />
            </Routes>
          </AlertProvider>
        </SyncHandler>
      </PlatformProvider>
    </AuthProvider>
  </ThemeProvider>
</Router>
  );
}
