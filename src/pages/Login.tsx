import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import { auth, signInWithGoogle } from '../firebase';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [user, loading] = useAuthState(auth);
  const { lang } = useParams();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  );
  
  if (user) return <Navigate to={`/${lang || 'eng'}`} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
          {t('welcome_back').split('|')[0]} <span className="text-primary italic">{t('welcome_back').split('|')[1]}</span>
        </h2>
        <p className="text-white/40 font-medium">{t('sign_in_desc')}</p>
      </div>
      
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-4 bg-white text-bg-dark px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-100 transition-all shadow-2xl shadow-white/5 active:scale-95"
      >
        <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
        {t('continue_google')}
      </button>
      
      <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">
        {t('secure_auth')}
      </div>
    </div>
  );
};

export default Login;
