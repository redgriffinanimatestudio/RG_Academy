import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

export default function BecomeMentor() {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <section className="bg-primary rounded-[2.5rem] p-12 text-bg-dark flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="space-y-4 text-center md:text-left">
        <h2 className="text-4xl font-black tracking-tighter uppercase">{t('become_mentor')}</h2>
        <p className="text-bg-dark/60 font-medium max-w-md">
          {t('mentor_desc')}
        </p>
      </div>
      <Link to={`/aca/${lang || 'en'}/workshop`}>
        <button className="bg-bg-dark text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:scale-105 shadow-xl shadow-black/10">
          {t('start_teaching')}
        </button>
      </Link>
    </section>
  );
}
