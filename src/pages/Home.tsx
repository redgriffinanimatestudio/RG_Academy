import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Play, Check, Globe, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithGoogle } from '../firebase';
import OAuthConsent from '../components/OAuthConsent';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [showConsent, setShowConsent] = useState(false);

  const handleSocialLogin = () => {
    setShowConsent(true);
  };

  const handleAcceptConsent = async () => {
    setShowConsent(false);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img 
            src="https://picsum.photos/seed/criativo-hero/800/1200" 
            alt="" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-5xl space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.4em] text-[10px]"
          >
            <div className="w-12 h-[1px] bg-primary" />
            {t('master_cg')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
          >
            {t('we_are')} <span className="text-primary">{t('creative')}</span> <br />
            {t('design_agency')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 max-w-xl font-medium leading-relaxed"
          >
            {t('ecosystem_desc')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 pt-4"
          >
            <Link to={`/aca/${lang}`} className="flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
                <Play size={24} className="text-bg-dark fill-current ml-1" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('about_us')}</div>
                <div className="text-sm font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">{t('promotion_studio')}</div>
              </div>
            </Link>

            <button 
              onClick={handleSocialLogin}
              className="flex items-center gap-3 bg-white text-bg-dark px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-100 transition-all shadow-xl active:scale-95"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
              {t('continue_google')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('our_services')}</div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
            {t('what_we_do')}
          </h2>
          <div className="w-24 h-1 bg-primary" />
          <p className="text-white/40 font-medium leading-relaxed">
            {t('high_end_solutions')}
          </p>
          <button className="criativo-btn">{t('view_all')}</button>
        </div>
        
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: t('brand_identity'), icon: Briefcase },
            { title: t('website_design'), icon: Globe },
            { title: t('ui_ux_design'), icon: GraduationCap },
            { title: t('video_marketing'), icon: Play },
          ].map((service, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="criativo-card group"
            >
              <service.icon size={32} className="text-primary mb-6 transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{service.title}</h3>
              <p className="text-white/30 text-sm leading-relaxed">
                {t('challenge_status_quo')}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/criativo-about/800/1000" 
            alt="" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
        </div>
        
        <div className="space-y-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('about_us')}</div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
            {t('creativity_clients').split('|')[0]} <span className="text-primary italic">{t('creativity_clients').split('|')[1]}</span> {t('creativity_clients').split('|')[2]}
          </h2>
          <p className="text-white/40 font-medium leading-relaxed">
            {t('agency_foundation')}
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                <div className="font-black text-xs">01</div>
              </div>
              <div>
                <div className="font-black uppercase tracking-tight text-sm">{t('clean_code')}</div>
                <div className="text-xs text-white/30 mt-1">{t('clean_code_desc')}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                <div className="font-black text-xs">02</div>
              </div>
              <div>
                <div className="font-black uppercase tracking-tight text-sm">{t('modern_design')}</div>
                <div className="text-xs text-white/30 mt-1">{t('modern_design_desc')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 border-y border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { value: '150+', label: t('projects_done') },
            { value: '75+', label: t('happy_customers') },
            { value: '20+', label: t('award_winning') },
            { value: '45+', label: t('team_members') },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-5xl font-black tracking-tighter text-primary">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-12">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
          {t('ready_legacy').split('|')[0]} <span className="text-primary italic">{t('ready_legacy').split('|')[1]}</span> {t('ready_legacy').split('|')[2]}
        </h2>
        <p className="text-xl text-white/40 font-medium max-w-2xl mx-auto">
          {t('join_artists')}
        </p>
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
            <button 
              onClick={handleSocialLogin}
              className="bg-white text-bg-dark px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-100 transition-all w-full sm:w-auto flex items-center justify-center gap-4 shadow-2xl shadow-white/5"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
              {t('continue_google')}
            </button>
            <Link to={`/community/${lang}`} className="px-12 py-5 border-2 border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all w-full sm:w-auto">
              {t('view_community')}
            </Link>
          </div>
          
          <div className="flex items-center gap-6 opacity-20 group">
            <div className="h-[1px] w-12 bg-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t('secure_auth')}</span>
            <div className="h-[1px] w-12 bg-white" />
          </div>
        </div>
      </section>

      <OAuthConsent 
        isOpen={showConsent} 
        onClose={() => setShowConsent(false)} 
        onAccept={handleAcceptConsent}
      />
    </div>
  );
};

export default Home;
