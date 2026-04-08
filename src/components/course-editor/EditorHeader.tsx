import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  Check
} from 'lucide-react';

interface EditorHeaderProps {
  courseTitle: string;
  onTitleChange: (title: string) => void;
  isDirty: boolean;
  lastSaved: Date | null;
  saving: boolean;
  isPublishing: boolean;
  status: string | undefined;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onPreview: () => void;
}

export default function EditorHeader({
  courseTitle,
  onTitleChange,
  isDirty,
  lastSaved,
  saving,
  isPublishing,
  status,
  onSave,
  onPublish,
  onUnpublish,
  onPreview
}: EditorHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/aca/lecturer')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Return_ToNode
        </button>
        <div className="h-8 w-px bg-white/10" />
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-transparent text-xl font-black uppercase tracking-tighter text-white italic placeholder-white/20 border-none outline-none focus:ring-0 w-[300px]"
          placeholder="COURSE_TITLE"
        />
        <div className="flex items-center gap-2">
          {isDirty ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Unsaved</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
              <Check size={10} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onPreview}
          className="h-10 px-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-bg-dark transition-all flex items-center gap-2"
        >
          <Eye size={14} /> Preview
        </button>
        
        {status === 'published' ? (
          <button
            onClick={onUnpublish}
            disabled={isPublishing}
            className="h-10 px-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all flex items-center gap-2"
          >
            <EyeOff size={14} /> Unpublish
          </button>
        ) : (
          <button
            onClick={onPublish}
            disabled={isPublishing}
            className="h-10 px-6 bg-primary text-bg-dark rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-125 transition-all flex items-center gap-2"
          >
            {isPublishing ? <div className="size-4 border-2 border-bg-dark/30 border-t-bg-dark animate-spin rounded-full" /> : <Eye size={14} />}
            Publish
          </button>
        )}
        
        <button
          onClick={onSave}
          disabled={saving || !isDirty}
          className="h-10 px-8 bg-white text-bg-dark rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <div className="size-4 border-2 border-bg-dark/30 border-t-bg-dark animate-spin rounded-full" />
          ) : (
            <Save size={14} />
          )}
          Save
        </button>
      </div>
    </header>
  );
}