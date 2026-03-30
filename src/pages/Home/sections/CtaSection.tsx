import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CtaSectionProps {
  t: (key: string) => string;
  user: any;
  lang: string | undefined;
  modePrefix: string;
  getDashboardLink: () => string;
  handleLoginRedirect: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ t, user, lang, modePrefix, getDashboardLink, handleLoginRedirect }) => {
  return (
    <section className="max-w-5xl mx-auto px-4 text-center space-y-12">
      <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
        {t('ready_legacy').split('|')[0]} <span className="text-primary italic">{t('ready_legacy').split('|')[1]}</span> {t('ready_legacy').split('|')[2]}
      </h2>
      <p className="text-xl text-white/40 font-medium max-w-2xl mx-auto">
        {t('join_artists')}
      </p>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
          {user ? (
            <Link 
              to={getDashboardLink()}
              className="bg-primary text-bg-dark px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-4 shadow-2xl shadow-primary/20"
            >
              <LayoutDashboard size={18} />
              {t('my_dashboard')}
            </Link>
          ) : (
            <button 
              onClick={handleLoginRedirect}
              className="bg-white text-bg-dark px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-100 transition-all w-full sm:w-auto flex items-center justify-center gap-4 shadow-2xl shadow-white/5"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-4" />
              {t('continue_google')}
            </button>
          )}
          <Link to={`${modePrefix}/${lang || 'eng'}/community`} className="px-12 py-5 border-2 border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all w-full sm:w-auto text-center">
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
  );
};

export default React.memo(CtaSection);
