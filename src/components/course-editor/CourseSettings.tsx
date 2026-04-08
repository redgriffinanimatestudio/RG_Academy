import React from 'react';
import { Plus, X, DollarSign } from 'lucide-react';

interface CourseSettingsData {
  thumbnail: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  categoryId: string;
  tags: string[];
}

interface CourseStats {
  status: string | undefined;
  totalLessons: number;
  duration: string | undefined;
}

interface CourseSettingsProps {
  settings: CourseSettingsData;
  newTag: string;
  onSettingsChange: (settings: CourseSettingsData) => void;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  stats: CourseStats;
  activePanel: 'modules' | 'content' | 'settings';
}

const levels = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

const categories = [
  { value: '', label: 'Select_category' },
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' }
];

export default function CourseSettings({
  settings,
  newTag,
  onSettingsChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  stats,
  activePanel
}: CourseSettingsProps) {
  return (
    <div className={`
      w-full lg:w-80 xl:w-96 flex-shrink-0 border-l border-white/5 bg-[#050505]/50 backdrop-blur-xl overflow-y-auto
      ${activePanel === 'settings' ? 'block' : 'hidden lg:block'}
    `}>
      <div className="p-6 space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Course_Settings</h2>

        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Thumbnail_URL</label>
          <input
            type="text"
            value={settings.thumbnail}
            onChange={(e) => onSettingsChange({ ...settings, thumbnail: e.target.value })}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm font-black tracking-tight text-white placeholder-white/20"
            placeholder="https://..."
          />
          {settings.thumbnail && (
            <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
              <img src={settings.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Course_Price</label>
          <div className="relative">
            <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="number"
              value={settings.price}
              onChange={(e) => onSettingsChange({ ...settings, price: Number(e.target.value) })}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-4 text-sm font-black tracking-tight text-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Difficulty_Level</label>
          <div className="grid grid-cols-2 gap-3">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => onSettingsChange({ ...settings, level })}
                className={`
                  py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all
                  ${settings.level === level 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20'
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Category</label>
          <select
            value={settings.categoryId}
            onChange={(e) => onSettingsChange({ ...settings, categoryId: e.target.value })}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm font-black tracking-tight text-white"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddTag()}
              className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-black tracking-tight text-white placeholder-white/20"
              placeholder="Add_tag"
            />
            <button
              onClick={onAddTag}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-primary hover:border-primary/30 transition-all"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2"
              >
                {tag}
                <button onClick={() => onRemoveTag(tag)} className="hover:text-red-500 transition-colors">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Course_Status</span>
            <span className={`
              px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
              ${stats.status === 'published' 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : 'bg-primary/10 text-primary'
              }
            `}>
              {stats.status || 'draft'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Total_Lessons</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
              {stats.totalLessons}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Total_Duration</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
              {stats.duration || '0h 0m'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}