import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Shield, 
  Star, 
  Award, 
  Briefcase, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { uid, lang } = useParams();
  const { t } = useTranslation();
  const { profile, activeRole } = useAuth();

  const isOwnProfile = profile?.uid === uid;
  const userToDisplay = isOwnProfile ? profile : null; // In a real app, fetch from API

  if (!userToDisplay) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="size-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs font-black uppercase tracking-widest">Gathering Identity Pulse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Profile Header */}
        <div className="relative mb-12">
          <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-[#1a1a20] to-[#0a0a0e] border border-white/5 overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>
          
          <div className="absolute -bottom-10 left-10 flex items-end gap-8">
            <div className="relative group">
              <div className="size-32 rounded-3xl border-4 border-[#050505] bg-zinc-900 overflow-hidden shadow-2xl relative z-10">
                {userToDisplay.photoURL ? (
                  <img src={userToDisplay.photoURL} alt="" className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center text-3xl font-black text-white/10 uppercase">
                    {userToDisplay.displayName?.substring(0, 2) || 'RG'}
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 p-2 bg-primary text-bg-dark rounded-xl shadow-lg z-20 hover:scale-110 transition-transform">
                  <User size={16} />
                </button>
              )}
            </div>
            
            <div className="mb-4">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3 mb-1">
                {userToDisplay.displayName || 'Unknown Artist'}
                {userToDisplay.isAdmin && <Shield size={20} className="text-primary" />}
              </h1>
              <div className="flex items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                <span className="flex items-center gap-1"><GraduationCap size={12} className="text-primary" /> {userToDisplay.primaryRole || 'Student'}</span>
                <span className="flex items-center gap-1 font-mono tracking-tighter text-[10px]"><Shield size={12} /> ID: {userToDisplay.uid?.substring(0, 8)}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 right-10 flex items-center gap-3 mb-4">
            <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Edit Identity</button>
            <button className="px-6 py-2.5 bg-primary text-bg-dark rounded-xl text-xs font-black uppercase tracking-widest transition-all">Share Portfolio</button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          
          {/* Sidebar Area */}
          <div className="space-y-8">
            <section className="bg-zinc-900/20 border border-white/5 p-6 rounded-3xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6">About Pulse</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6 italic">
                "Lead character artist specializing in high-fidelity UE5 workflows. Academic track focus on procedural assets and cinematic VFX."
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <Mail size={14} className="text-primary" /> {userToDisplay.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <Calendar size={14} className="text-primary" /> Joined {new Date(userToDisplay.createdAt || Date.now()).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <MapPin size={14} className="text-primary" /> Digital Nomad / Global Node
                </div>
              </div>
            </section>
            
            {/* Onboarding Metadata Panel */}
            {userToDisplay.profileData && Object.keys(userToDisplay.profileData).length > 2 && (
              <section className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 font-mono">Entity Attributes</h3>
                <div className="space-y-3">
                  {userToDisplay.profileData.experienceLevel && (
                    <div className="flex justify-between items-center text-xs border-b border-primary/10 pb-2">
                      <span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Rank</span>
                      <span className="text-white font-bold">{userToDisplay.profileData.experienceLevel}</span>
                    </div>
                  )}
                  {userToDisplay.profileData.primarySoftware && (
                    <div className="flex justify-between items-center text-xs border-b border-primary/10 pb-2">
                      <span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Main Engine</span>
                      <span className="text-primary font-black uppercase">{userToDisplay.profileData.primarySoftware}</span>
                    </div>
                  )}
                  {userToDisplay.profileData.learningGoal && (
                    <div className="flex justify-between items-center text-xs border-b border-primary/10 pb-2">
                      <span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Directive</span>
                      <span className="text-white font-bold">{userToDisplay.profileData.learningGoal}</span>
                    </div>
                  )}
                  {userToDisplay.profileData.companyName && (
                    <div className="flex justify-between items-center text-xs border-b border-primary/10 pb-2">
                      <span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Corporation</span>
                      <span className="text-white font-bold">{userToDisplay.profileData.companyName} ({userToDisplay.profileData.clientType})</span>
                    </div>
                  )}
                  {userToDisplay.profileData.specialization && (
                    <div className="flex justify-between items-center text-xs border-b border-primary/10 pb-2">
                      <span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Class</span>
                      <span className="text-white font-bold">{userToDisplay.profileData.specialization}</span>
                    </div>
                  )}
                  {userToDisplay.profileData.hourlyRate && (
                    <div className="flex justify-between items-center text-xs border-b border-primary/10 pb-2">
                      <span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Hourly Rate</span>
                      <span className="text-emerald-400 font-black font-mono">${userToDisplay.profileData.hourlyRate}/hr</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="bg-zinc-950 border border-white/5 p-6 rounded-3xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 font-mono">Roles & Authorizations</h3>
              <div className="flex flex-wrap gap-2">
                {userToDisplay.roles?.map((r: string) => (
                  <span key={r} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${activeRole === r ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    {r.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Activity/Portfolio Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Completed Tracks', value: '14', icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'Platform XP', value: '8.2k', icon: Star, color: 'text-amber-400' },
                { label: 'Contracts', value: '3', icon: Briefcase, color: 'text-sky-400' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-zinc-900/30 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-black">{stat.value}</p>
                  </div>
                  <stat.icon className={stat.color} size={20} />
                </div>
              ))}
            </div>

            {/* Achievement Hub */}
            <section className="bg-zinc-900/10 border border-white/5 rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic">
                  <Award className="text-primary" />
                  Academic Excellence
                </h2>
                <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View Transcript</Link>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { title: 'UE5 Procedural Mastery', company: 'Digital Arts Faculty', date: 'March 2026', grade: '98/100', icon: GraduationCap },
                    { title: 'Character Design Fundamentals', company: 'CG Pro Faculty', date: 'Jan 2026', grade: 'Pass', icon: Star }
                  ].map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5 group">
                      <div className="size-12 rounded-xl bg-zinc-900 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <cert.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{cert.title}</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{cert.company} · {cert.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-black text-emerald-400">{cert.grade}</span>
                        <ChevronRight size={14} className="text-white/20 ml-2 inline-block" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
