import React from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_PROFILE = {
  // ... existing mock data
  name: 'Alex Rivera',
  role: 'Senior Character Technical Artist',
  avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
  location: 'Vancouver, Canada',
  bio: 'Specializing in character rigging, tool development, and pipeline automation for AAA games and feature animation. 12+ years of experience in the industry.',
  skills: ['Maya', 'Python', 'C++', 'Unreal Engine', 'Character Rigging', 'Tool Dev'],
  stats: {
    projects: 24,
    rating: 4.9,
    availability: 'Part-time',
    experience: '12 Years'
  },
  portfolio: [
    { id: 1, title: 'Modular Rigging System', type: 'Tool', image: 'https://picsum.photos/seed/p1/600/400' },
    { id: 2, title: 'Realistic Face Rig', type: 'Rigging', image: 'https://picsum.photos/seed/p2/600/400' },
    { id: 3, title: 'Muscular Deformation System', type: 'VFX', image: 'https://picsum.photos/seed/p3/600/400' },
    { id: 4, title: 'Auto-Rig for Quadruped', type: 'Script', image: 'https://picsum.photos/seed/p4/600/400' },
  ]
};

export default function SpecialistProfile() {
  const { id } = useParams();
  const location = useLocation();
  const isStudio = location.pathname.includes('/studio/');
  const backLink = isStudio ? `/studio` : `/aca`;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <Link 
          to={backLink}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          {isStudio ? 'Back to Studio' : 'Back to Academy'}
        </Link>

        {/* Profile Header Card */}
        <div className="relative p-12 rounded-[3rem] bg-zinc-900 border border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
            <div className="size-48 rounded-[2.5rem] border-4 border-white/10 overflow-hidden shrink-0 shadow-2xl">
              <img src={MOCK_PROFILE.avatar} alt={MOCK_PROFILE.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-5xl font-black tracking-tighter text-white uppercase">{MOCK_PROFILE.name}</h1>
                  <UserCheck className="text-primary" size={24} />
                </div>
                <p className="text-xl font-medium text-primary italic uppercase tracking-tight">{MOCK_PROFILE.role}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {MOCK_PROFILE.location}</div>
                <div className="flex items-center gap-2"><Briefcase size={14} className="text-primary" /> {MOCK_PROFILE.stats.availability}</div>
                <div className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {MOCK_PROFILE.stats.experience}</div>
              </div>

              <p className="text-white/60 max-w-2xl leading-relaxed text-lg font-medium">
                {MOCK_PROFILE.bio}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="px-8 py-4 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20">
                  Hire Specialist
                </button>
                <button className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5 flex items-center gap-2">
                  <MessageSquare size={16} /> Send Message
                </button>
              </div>
            </div>

            <div className="shrink-0 space-y-4">
              <div className="flex gap-2">
                <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/5"><Twitter size={20} /></button>
                <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/5"><Github size={20} /></button>
                <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/5"><LinkIcon size={20} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Rating', value: MOCK_PROFILE.stats.rating, icon: Star, color: 'text-amber-500' },
            { label: 'Projects', value: MOCK_PROFILE.stats.projects, icon: Briefcase, color: 'text-primary' },
            { label: 'Completed', value: '100%', icon: UserCheck, color: 'text-emerald-500' },
            { label: 'Skill Score', value: '98', icon: Zap, color: 'text-sky-500' },
          ].map((stat, idx) => (
            <div key={idx} className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 text-center space-y-2">
              <stat.icon size={24} className={`${stat.color} mx-auto mb-4`} />
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Portfolio</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
              View All <ExternalLink size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_PROFILE.portfolio.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -10 }}
                className="group relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5"
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-10 left-10 space-y-2">
                  <span className="px-3 py-1 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {item.type}
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                </div>
                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-bg-dark shadow-2xl">
                    <ExternalLink size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="p-12 rounded-[3rem] bg-white/5 border border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <Award className="text-primary" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Expertise</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {MOCK_PROFILE.skills.map((skill, idx) => (
              <div 
                key={idx}
                className="px-6 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-sm font-bold text-white/60 hover:text-primary hover:border-primary/40 transition-all cursor-default"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
