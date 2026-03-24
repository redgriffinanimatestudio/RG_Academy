import React from 'react';
import { Search, Filter, Plus, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface StudioFiltersProps {
  activeTab: 'browse' | 'manage';
  setActiveTab: (tab: 'browse' | 'manage') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  filters: any;
  setFilters: (f: any) => void;
  isClient: boolean;
}

export default function StudioFilters({
  activeTab, setActiveTab, searchQuery, setSearchQuery, 
  showFilters, setShowFilters, filters, setFilters, isClient
}: StudioFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
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
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="p-1 bg-white/5 rounded-2xl border border-white/5 flex">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'browse' ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
              >
                Browse Projects
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
              >
                My Projects
              </button>
            </div>
            {isClient && (
              <button className="criativo-btn flex items-center gap-3">
                <Plus size={18} />
                {t('post_project')}
              </button>
            )}
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-white placeholder:text-white/20"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
            >
              <Filter size={18} />
              {t('filters')}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Project Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'open', 'in_progress', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilters({ ...filters, status })}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.status === status ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Min Budget: ${filters.budgetMin}</h4>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={filters.budgetMin}
                  onChange={(e) => setFilters({ ...filters, budgetMin: parseInt(e.target.value) })}
                  className="w-full accent-primary bg-white/10 rounded-lg appearance-none h-1"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Urgency</h4>
                <select 
                  value={filters.urgency}
                  onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="all">Any Urgency</option>
                  <option value="urgent">Urgent Only</option>
                  <option value="normal">Normal Only</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
