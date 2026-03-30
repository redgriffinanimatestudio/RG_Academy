import React from 'react';
import { motion } from 'framer-motion';

interface FilterPanelProps {
  showFilters: boolean;
  filters: any;
  setFilters: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ showFilters, filters, setFilters }) => {
  if (!showFilters) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Skill Level</h4>
          <div className="flex flex-wrap gap-2">
            {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilters({ ...filters, level: lvl })}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.level === lvl ? 'bg-primary text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Max Price: ${filters.priceRange[1]}</h4>
          <input 
            type="range" 
            min="0" 
            max="200" 
            step="10"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
            className="w-full accent-primary bg-white/10 rounded-lg appearance-none h-1"
          />
          <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
            <span>$0</span>
            <span>$200+</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Sort By</h4>
          <select 
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary cursor-pointer appearance-none"
          >
            <option value="popular" className="bg-bg-card text-white">Most Popular</option>
            <option value="rating" className="bg-bg-card text-white">Highest Rated</option>
            <option value="price_low" className="bg-bg-card text-white">Price: Low to High</option>
            <option value="price_high" className="bg-bg-card text-white">Price: High to Low</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(FilterPanel);
