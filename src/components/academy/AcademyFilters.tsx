import React from 'react';
import { Search, Filter, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface AcademyFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  categories: any[];
  filters: any;
  setFilters: (v: any) => void;
}

export default function AcademyFilters({
  searchQuery, setSearchQuery, showFilters, setShowFilters,
  selectedCategory, setSelectedCategory, categories, filters, setFilters
}: AcademyFiltersProps) {
  const { t } = useTranslation();

  return (
    <header className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
            <div className="size-2 rounded-full bg-primary animate-ping" />
            NODE_DIRECTORY_04
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-none uppercase italic">
            Search <span className="text-primary tracking-normal">The_Vault.</span>
          </h2>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="flex gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-3xl shadow-2xl">
            <div className="relative flex-1 md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder={t('search_workshops_code')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-transparent border-none rounded-2xl focus:ring-0 transition-all font-black uppercase tracking-widest text-xs text-white placeholder:text-white/10 outline-none"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-8 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-primary text-bg-dark border-primary' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:bg-white/10'}`}
            >
              <Filter size={18} />
              {t('matrix_filters')}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.98 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="overflow-hidden"
          >
            <div className="p-10 rounded-[3rem] bg-black border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12 shadow-2xl relative">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }} />
              
              <div className="space-y-6 relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Skill_Authorization</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFilters({ ...filters, level: lvl })}
                      className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${filters.level === lvl ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Investment_Cap: ${filters.priceRange[1]}</h4>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="200" 
                    step="10"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                    className="w-full accent-primary bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Sort_Algorithm</h4>
                <div className="relative">
                  <select 
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary/40 cursor-pointer appearance-none transition-all"
                  >
                    <option value="popular">Priority: Popularity</option>
                    <option value="rating">Priority: Efficiency</option>
                    <option value="price_low">Budget: Descending</option>
                    <option value="price_high">Budget: Ascending</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <GraduationCap size={14} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
        <button
          onClick={() => setSelectedCategory('all_workshops')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border shrink-0 ${
            selectedCategory === 'all_workshops' ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'
          }`}
        >
          {t('all_workshops_node')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border shrink-0 ${
              selectedCategory === cat.id ? 'bg-primary text-bg-dark border-primary shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {t(cat.name)}
          </button>
        ))}
      </div>
    </header>
  );
}
