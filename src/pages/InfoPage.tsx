import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Info, Mail, LifeBuoy, Shield, FileText } from 'lucide-react';

const InfoPage: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const pathname = window.location.pathname;
  
  const isAbout = pathname.includes('/about');
  const isContact = pathname.includes('/contact');
  const isSupport = pathname.includes('/support');
  const isPrivacy = pathname.includes('/privacy');
  const isTerms = pathname.includes('/terms');

  const getTitle = () => {
    if (isAbout) return t('about_us');
    if (isContact) return t('contact');
    if (isSupport) return t('support');
    if (isPrivacy) return 'Privacy Policy';
    if (isTerms) return 'Terms of Service';
    return 'Information';
  };

  const getIcon = () => {
    if (isAbout) return <Info size={32} className="text-primary" />;
    if (isContact) return <Mail size={32} className="text-primary" />;
    if (isSupport) return <LifeBuoy size={32} className="text-primary" />;
    if (isPrivacy) return <Shield size={32} className="text-primary" />;
    if (isTerms) return <FileText size={32} className="text-primary" />;
    return <Info size={32} className="text-primary" />;
  };

  return (
    <div className="min-h-[60vh] py-12 space-y-12">
      <header className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 mb-4"
        >
          {getIcon()}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-tighter uppercase"
        >
          {getTitle()}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/40 max-w-2xl mx-auto font-medium"
        >
          {isAbout && "We are a global ecosystem dedicated to empowering digital artists through world-class education and professional collaboration."}
          {isContact && "Have questions or want to collaborate? Reach out to our team and let's build something incredible together."}
          {isSupport && "Need help with your account or a workshop? Our support team is here to ensure your creative journey is smooth."}
          {(isPrivacy || isTerms) && "Please read our legal documentation carefully to understand your rights and responsibilities within our ecosystem."}
        </motion.p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto criativo-card rounded-[2.5rem] p-12 space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">Section Title</h2>
          <p className="text-white/60 leading-relaxed font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">Our Mission</h2>
          <p className="text-white/60 leading-relaxed font-medium">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {isContact && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Email Support</div>
              <div className="text-lg font-bold">support@redgriffin.com</div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Business Inquiries</div>
              <div className="text-lg font-bold">studio@redgriffin.com</div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InfoPage;
