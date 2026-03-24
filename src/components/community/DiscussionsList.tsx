import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DiscussionsListProps {
  discussions: any[];
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  filters: any;
  setFilters: (f: any) => void;
  onCreatePost: () => void;
}

export default function DiscussionsList({
  discussions, showFilters, setShowFilters, filters, setFilters, onCreatePost
}: DiscussionsListProps) {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-medium text-white placeholder:text-white/20 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
          />
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-emerald-500 text-bg-dark border-emerald-500' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
          >
            <Filter size={18} />
            Filters
          </button>
          <button 
            onClick={onCreatePost}
            className="px-6 py-4 rounded-2xl bg-white text-bg-dark font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-zinc-200 transition-all"
          >
            <Plus size={18} />
            Start Topic
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'design', 'technical', 'showcase'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, category: cat })}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.category === cat ? 'bg-emerald-500 text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Sort By</h4>
                <div className="flex gap-2">
                  {[
                    { id: 'recent', label: 'Most Recent' },
                    { id: 'replies', label: 'Most Active' }
                  ].map((sort) => (
                    <button
                      key={sort.id}
                      onClick={() => setFilters({ ...filters, sortBy: sort.id })}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.sortBy === sort.id ? 'bg-emerald-500 text-bg-dark' : 'bg-white/5 text-white/40 hover:text-white'}`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-bold uppercase tracking-tight">{t('recent_discussions')}</h2>
        </div>

        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/40 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400">{t(discussion.category)}</span>
                    <span className="text-xs text-zinc-500">{discussion.time}</span>
                  </div>
                  <h4 className="text-lg font-bold group-hover:text-emerald-400 transition-colors mb-2">{t(discussion.title)}</h4>
                  <p className="text-sm text-zinc-500">{t('started_by')} {discussion.author}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                  <img src={`https://picsum.photos/seed/${discussion.id}/100/100`} alt="" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
