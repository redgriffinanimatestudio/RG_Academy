import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Globe, GraduationCap, Play } from 'lucide-react';

interface ServicesSectionProps {
  t: (key: string) => string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ t }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 space-y-6">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('our_services')}</div>
        <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-ink">
          {t('what_we_do')}
        </h2>
        <div className="w-24 h-1 bg-primary" />
        <p className="text-text-muted font-medium leading-relaxed">
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
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-ink">{service.title}</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              {t('challenge_status_quo')}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(ServicesSection);
