import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
  Share2,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PROFILE = {
  id: 'cmn19ygty0000f0447bv3riu6',
  name: 'Alex Rivera',
  role: 'Senior Character Technical Artist',
  avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
  cover: 'https://picsum.photos/seed/cover/1200/400',
  location: 'Vancouver, Canada',
  joined: 'March 2022',
  verified: true,
  bio: 'Specializing in character rigging, tool development, and pipeline automation for AAA games and feature animation. 12+ years of experience in the industry.',
  skills: ['Maya', 'Python', 'C++', 'Unreal Engine', 'Character Rigging', 'Tool Dev'],
  stats: {
    projects: 24,
    rating: 4.9,
    availability: 'Part-time',
    experience: '12 Years',
    clients: 18,
    reviews: 142
  },
  portfolio: [
    { id: 1, title: 'Modular Rigging System', type: 'Tool', image: 'https://picsum.photos/seed/p1/600/400' },
    { id: 2, title: 'Realistic Face Rig', type: 'Rigging', image: 'https://picsum.photos/seed/p2/600/400' },
    { id: 3, title: 'Muscular Deformation System', type: 'VFX', image: 'https://picsum.photos/seed/p3/600/400' },
    { id: 4, title: 'Auto-Rig for Quadruped', type: 'Script', image: 'https://picsum.photos/seed/p4/600/400' },
  ]
};

type ProfileTab = 'about' | 'portfolio' | 'experience' | 'education' | 'reviews';

export default function SpecialistProfile() {
  const { id, lang } = useParams();
  const location = useLocation();
  const isStudio = location.pathname.includes('/studio/');
  const [activeTab, setActiveTab] = useState<ProfileTab>('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const backLink = isStudio ? `/studio/${lang || 'eng'}` : `/aca/${lang || 'eng'}`;

  const sidebarItems: { id: ProfileTab; label: string; icon: any }[] = [
    { id: 'about', label: 'О специалисте', icon: User },
    { id: 'portfolio', label: 'Портфолио', icon: Layers },
    { id: 'experience', label: 'Опыт работы', icon: Briefcase },
    { id: 'education', label: 'Образование', icon: GraduationCap },
    { id: 'reviews', label: 'Отзывы', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 pb-20">
      {/* Cover Image */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden">
        <img src={MOCK_PROFILE.cover} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        
        <div className="absolute top-24 left-4 sm:left-6 lg:left-8">
           <Link 
            to={backLink}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {isStudio ? 'Studio Network' : 'Academy Hub'}
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* LEFT SIDEBAR */}
          <aside className="space-y-6">
            {/* Profile Brief Card */}
            <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl space-y-8 sticky top-24">
              <div className="space-y-6 text-center">
                <div className="relative inline-block">
                  <div className="size-32 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl mx-auto">
                    <img src={MOCK_PROFILE.avatar} alt={MOCK_PROFILE.name} className="w-full h-full object-cover" />
                  </div>
                  {MOCK_PROFILE.verified && (
                    <div className="absolute -bottom-2 -right-2 size-8 bg-primary rounded-xl flex items-center justify-center text-bg-dark shadow-lg shadow-primary/20">
                      <ShieldCheck size={18} />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tighter uppercase">{MOCK_PROFILE.name}</h1>
                  <p className="text-xs font-black text-primary uppercase tracking-widest">{MOCK_PROFILE.role}</p>
                </div>

                <div className="flex justify-center gap-2">
                  <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5 hover:border-primary/40"><Twitter size={16} /></button>
                  <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5 hover:border-primary/40"><Github size={16} /></button>
                  <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5 hover:border-primary/40"><LinkIcon size={16} /></button>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1 pt-4 border-t border-white/5">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                      activeTab === item.id 
                        ? 'bg-primary text-bg-dark font-black' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={18} className={activeTab === item.id ? 'text-bg-dark' : 'group-hover:text-primary transition-colors'} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight size={14} />}
                  </button>
                ))}
              </nav>

              <div className="pt-6 border-t border-white/5 space-y-3">
                <button className="w-full py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                  Связаться
                </button>
                <button className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Heart size={14} className="text-red-500" /> В избранное
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="space-y-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/5 rounded-3xl">
              <div className="flex items-center gap-6 px-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1">Status</span>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Available</span>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-white/5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1">Joined</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{MOCK_PROFILE.joined}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5"><Share2 size={16} /></button>
                <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5"><MessageSquare size={16} /></button>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="min-h-[600px]">
              <AnimatePresence mode="wait">
                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Header Info */}
                    <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                      <div className="relative space-y-6">
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                          About <span className="text-primary italic">Specialist.</span>
                        </h2>
                        <p className="text-lg text-white/60 font-medium leading-relaxed max-w-3xl">
                          {MOCK_PROFILE.bio}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Rating', value: MOCK_PROFILE.stats.rating, icon: Star, color: 'text-amber-500' },
                        { label: 'Projects', value: MOCK_PROFILE.stats.projects, icon: Layers, color: 'text-primary' },
                        { label: 'Experience', value: MOCK_PROFILE.stats.experience, icon: Clock, color: 'text-emerald-500' },
                        { label: 'Reviews', value: MOCK_PROFILE.stats.reviews, icon: MessageSquare, color: 'text-sky-500' },
                      ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 text-center space-y-2">
                          <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                          <div className="text-2xl font-black text-white">{stat.value}</div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-white/20">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Skills Tag Cloud */}
                    <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 space-y-8">
                      <div className="flex items-center gap-3">
                        <Zap className="text-primary" size={24} />
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white">Expertise & Skills</h2>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {MOCK_PROFILE.skills.map((skill, idx) => (
                          <div 
                            key={idx}
                            className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'portfolio' && (
                  <motion.div
                    key="portfolio"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {MOCK_PROFILE.portfolio.map((item) => (
                      <div 
                        key={item.id}
                        className="group relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a0a0a]"
                      >
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 space-y-2">
                          <span className="px-3 py-1 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {item.type}
                          </span>
                          <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                        </div>
                        <button className="absolute top-8 right-8 size-12 bg-white rounded-2xl flex items-center justify-center text-bg-dark opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                          <ExternalLink size={20} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab !== 'about' && activeTab !== 'portfolio' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-40 opacity-20"
                  >
                    {React.createElement(sidebarItems.find(i => i.id === activeTab)?.icon || Layers, { size: 64 })}
                    <span className="text-[12px] font-black uppercase tracking-[0.5em] mt-6">{activeTab} Section Initializing...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
