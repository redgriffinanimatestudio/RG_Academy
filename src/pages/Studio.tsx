import React from 'react';
import { Users, MessageSquare, Plus, Briefcase, MapPin, ChevronRight, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'Character Rigging for Indie RPG',
    client: 'Nebula Games',
    budget: '$500 - $1,000',
    tags: ['Maya', 'Rigging', 'Game Dev'],
    statusKey: 'open',
    urgencyKey: 'urgent_status'
  },
  {
    id: '2',
    title: 'Environment Concept Art - Sci-Fi City',
    client: 'Starlight Studios',
    budget: '$2,000 - $3,500',
    tags: ['Concept Art', 'Environment', '2D'],
    statusKey: 'in_progress',
    urgencyKey: 'normal_status'
  },
  {
    id: '3',
    title: 'VFX for Short Film Sequence',
    client: 'Independent Creator',
    budget: '$1,500 - $2,000',
    tags: ['Houdini', 'VFX', 'Simulation'],
    statusKey: 'open',
    urgencyKey: 'urgent_status'
  }
];

const MOCK_TALENT = [
  {
    id: '1',
    name: 'Sarah Connor',
    roleKey: 'senior_3d_artist',
    location: 'Los Angeles, CA',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    online: true
  },
  {
    id: '2',
    name: 'John Doe',
    roleKey: 'vfx_supervisor',
    location: 'London, UK',
    avatar: 'https://picsum.photos/seed/john/200/200',
    online: false
  },
  {
    id: '3',
    name: 'Jane Smith',
    roleKey: 'concept_artist',
    location: 'Tokyo, JP',
    avatar: 'https://picsum.photos/seed/jane/200/200',
    online: true
  }
];

export default function Studio() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 py-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <Briefcase size={14} />
            {t('studio_collab')}
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white leading-none uppercase">
            {t('build_impossible').split('.')[0]} <br />
            <span className="text-primary italic">{t('build_impossible').split('.')[1] || 'IMPOSSIBLE.'}</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl font-medium">
            {t('studio_desc')}
          </p>
        </div>
        <button className="criativo-btn flex items-center gap-3">
          <Plus size={18} />
          {t('post_project')}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('active_projects')}</h2>
              <button className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">{t('view_all')}</button>
            </div>
            <div className="space-y-6">
              {MOCK_PROJECTS.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -4 }}
                  className="criativo-card space-y-6 rounded-[2rem]"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-2xl tracking-tight text-white uppercase">{project.title}</h3>
                        {project.urgencyKey === 'urgent_status' && (
                          <span className="px-2 py-0.5 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                            <Zap size={8} fill="currentColor" /> {t('urgent')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/40 font-medium">{t('posted_by')} <span className="text-white">{project.client}</span></p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      project.statusKey === 'open' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-white/40'
                    }`}>
                      {t(project.statusKey)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('budget_range')}</span>
                      <span className="text-lg font-black text-white">{project.budget}</span>
                    </div>
                    <button className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-primary hover:text-bg-dark transition-all border border-white/5">
                      {t('view_details')} <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">{t('top_talent')}</h2>
            <div className="space-y-4">
              {MOCK_TALENT.map((talent) => (
                <div key={talent.id} className="group flex items-center gap-4 p-5 rounded-[1.5rem] border border-white/5 bg-white/5 hover:border-primary/20 transition-all cursor-pointer">
                  <div className={`avatar ${talent.online ? 'avatar-online-bottom' : 'avatar-offline-bottom'}`}>
                    <div className="size-14 rounded-2xl shadow-lg shadow-black/20 border border-white/5">
                      <img src={talent.avatar} alt={talent.name} referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-white truncate tracking-tight uppercase">{talent.name}</h4>
                    <p className="text-xs text-white/40 font-medium truncate">{t(talent.roleKey)}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                      <MapPin size={10} />
                      <span>{talent.location}</span>
                    </div>
                  </div>
                  <button className="p-3 bg-white/5 text-white/20 rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-all">
                    <MessageSquare size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full py-4 rounded-2xl border-2 border-white/5 text-xs font-black uppercase tracking-widest text-white/40 hover:bg-white/5 hover:border-white/10 transition-all">
              {t('browse_talent')}
            </button>
          </section>

          <section className="p-8 rounded-[2.5rem] bg-bg-card border border-white/5 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-black/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-3 text-primary">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-bg-dark">
                <Globe size={20} />
              </div>
              <h3 className="font-black uppercase tracking-widest text-sm">{t('studio_pro')}</h3>
            </div>
            <p className="text-sm text-white/40 font-medium leading-relaxed">
              {t('studio_pro_desc')}
            </p>
            <button className="w-full py-4 rounded-2xl bg-primary text-bg-dark text-xs font-black uppercase tracking-widest hover:bg-primary-hover transition-all hover:scale-105 shadow-xl shadow-primary/20">
              {t('upgrade_pro')}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

