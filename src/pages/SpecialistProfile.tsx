import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Link as LinkIcon, 
  Twitter, 
  Github, 
  ExternalLink,
  MessageSquare,
  Award,
  Zap,
  Star,
  Clock,
  Briefcase,
  UserCheck,
  ArrowLeft,
  User,
  Layers,
  GraduationCap,
  Heart,
  Target,
  Share2,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { networkingService, Profile } from '../services/networkingService';
import Preloader from '../components/Preloader';
import { useAuth } from '../context/AuthContext';

type ProfileTab = 'about' | 'portfolio' | 'experience' | 'education' | 'reviews';

export default function SpecialistProfile() {
  const { id, lang } = useParams();
  const { t } = useTranslation();
  const { profile: currentUserProfile, loading: authLoading } = useAuth();
  const location = useLocation();
  const isStudio = location.pathname.includes('/studio/');
  const [activeTab, setActiveTab] = useState<ProfileTab>('about');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!id) return;
      
      // Optimization: If viewing own profile, use context data
      if (currentUserProfile && id === currentUserProfile.uid) {
        setProfile({
          id: currentUserProfile.uid,
          userId: currentUserProfile.uid,
          bio: (currentUserProfile as any).bio || t('default_bio', 'Professional CG Specialist in the Red Griffin Ecosystem.'),
          location: 'Remote',
          skills: [],
          portfolio: [],
          user: {
            displayName: currentUserProfile.displayName || 'User',
            photoURL: currentUserProfile.photoURL || undefined
          }
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        try {
          const data = await networkingService.getProfile(id);
          if (data) {
            setProfile(data);
          } else {
            throw new Error('Not found');
          }
        } catch (err) {
          // Fallback to general user info if specialist profile doesn't exist
          const response = await fetch(`/api/users/${id}`);
          if (response.ok) {
            const resData = await response.json();
            const userData = resData.data || resData;
            setProfile({
              id: userData.id,
              userId: userData.id,
              bio: userData.bio || '',
              location: 'Remote',
              skills: [],
              portfolio: [],
              user: {
                displayName: userData.displayName || 'User',
                photoURL: userData.photoURL || undefined
              }
            });
          } else {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id, currentUserProfile, t]);

  const backLink = isStudio ? `/studio/${lang || 'eng'}` : `/aca/${lang || 'eng'}`;

  const tabs: { id: ProfileTab; label: string; icon: any }[] = [
    { id: 'about', label: t('about_specialist', 'О специалисте'), icon: User },
    { id: 'portfolio', label: t('portfolio', 'Портфолио'), icon: Layers },
    { id: 'experience', label: t('experience', 'Опыт работы'), icon: Briefcase },
    { id: 'education', label: t('education', 'Образование'), icon: GraduationCap },
    { id: 'reviews', label: t('reviews', 'Отзывы'), icon: Star },
  ];

  if (loading || authLoading) {
    return <Preloader message={t('loading_profile', 'Loading Profile...')} size="lg" className="min-h-screen bg-[#050505]" />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <h1 className="text-4xl font-black mb-4">{t('profile_not_found', 'Profile Not Found')}</h1>
        <Link to={backLink} className="text-primary hover:underline uppercase tracking-widest text-xs font-black">{t('go_back', 'Go Back')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="relative rounded-[3rem] bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-primary-hover/20 relative">
          <img src={`https://picsum.photos/seed/${profile.id}/1200/400`} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
        
        <div className="px-10 pb-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-8">
          <div className="relative group">
            <div className="size-40 rounded-[2.5rem] overflow-hidden border-4 border-[#0a0a0a] shadow-2xl bg-[#111]">
              <img src={profile.avatar || profile.user.photoURL || `https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-2xl flex items-center justify-center text-bg-dark shadow-lg">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="flex-1 space-y-4 pb-4">
            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tighter uppercase">{profile.user.displayName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                <div className="flex items-center gap-2"><MapPin size={12} className="text-primary" /> {profile.location || 'Remote'}</div>
                <div className="flex items-center gap-2"><Briefcase size={12} className="text-primary" /> {profile.skills?.[0]?.name || 'Visual Specialist'}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pb-4">
            <button className="px-8 py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">{t('connect', 'Connect')}</button>
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"><MessageSquare size={20} /></button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-[2rem] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white text-bg-dark shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight">{t('biography', 'Biography')}</h2>
                  <p className="text-lg text-white/60 font-medium leading-relaxed">{profile.bio || t('default_bio', 'Professional CG Specialist in the Red Griffin Ecosystem.')}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t('completion', 'Completion'), value: '98%', color: 'text-emerald-500' },
                    { label: t('response', 'Response'), value: '< 2h', color: 'text-sky-500' },
                  ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5">
                      <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tight">{t('expertise', 'Expertise')}</h2>
                  <div className="flex flex-wrap gap-2">
                    {['Unreal Engine', 'Maya', 'Houdini', 'ZBrush', 'Substance'].map(skill => (
                      <span key={skill} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.portfolio?.length ? profile.portfolio.map((item: any) => (
                <div key={item.id} className="group relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a0a0a]">
                  <img src={item.mediaUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 space-y-2">
                    <span className="px-3 py-1 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-lg">{item.category || 'Visual Art'}</span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                  <Layers size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">No portfolio entries available</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab !== 'about' && activeTab !== 'portfolio' && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 opacity-20">
              <Zap size={64} />
              <span className="text-[12px] font-black uppercase tracking-[0.5em] mt-6">{activeTab} section coming soon</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
