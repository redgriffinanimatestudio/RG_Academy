import React from 'react';

interface StatsSectionProps {
  t: (key: string) => string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ t }) => {
  return (
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
  );
};

export default React.memo(StatsSection);
