import React from 'react';

interface AboutSectionProps {
  t: (key: string) => string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ t }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group">
        <img 
          src="https://picsum.photos/seed/criativo-about/800/1000" 
          alt="" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="space-y-10">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('about_us')}</div>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-ink">
          {t('creativity_clients').split('|')[0]} <span className="text-primary italic">{t('creativity_clients').split('|')[1]}</span> {t('creativity_clients').split('|')[2]}
        </h2>
        <p className="text-text-muted font-medium leading-relaxed">
          {t('agency_foundation')}
        </p>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-border-main flex items-center justify-center text-primary">
              <div className="font-black text-xs">01</div>
            </div>
            <div>
              <div className="font-black uppercase tracking-tight text-sm text-ink">{t('clean_code')}</div>
              <div className="text-xs text-text-muted mt-1">{t('clean_code_desc')}</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-border-main flex items-center justify-center text-primary">
              <div className="font-black text-xs">02</div>
            </div>
            <div>
              <div className="font-black uppercase tracking-tight text-sm text-ink">{t('modern_design')}</div>
              <div className="text-xs text-text-muted mt-1">{t('modern_design_desc')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(AboutSection);
