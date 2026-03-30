import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Briefcase, FileText, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { hrService } from '../../services/hrService';

interface JobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opening: any;
}

export default function JobApplyModal({ isOpen, onClose, opening }: JobApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !opening) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await hrService.submitApplication({
        openingId: opening.id,
        coverLetter,
        resumeUrl
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setCoverLetter('');
        setResumeUrl('');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-zinc-950 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative"
      >
        <div className="p-12 space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Briefcase size={12} /> Career Submission
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-none">
                {opening.title} <span className="text-white/20">/</span> {opening.department}
              </h2>
            </div>
            <button onClick={onClose} className="size-12 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-all hover:bg-white/10 border border-white/5">
              <X size={24} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center space-y-6"
              >
                <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-2 border-primary/40 shadow-xl shadow-primary/20">
                  <Briefcase className="text-primary" size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">Application <span className="not-italic text-primary">Received.</span></h1>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mt-2">The recruiting division will audit your profile.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-3">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Opening Description</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">{opening.description}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Cover Letter / Expertise</label>
                  <textarea 
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe your background and motivation for this role..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white focus:border-primary transition-all outline-none min-h-[160px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Portfolio / Resume URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://behance.net/your-profile"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-tight">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full py-5 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Send size={18} /> {loading ? 'Processing...' : 'Submit Professional Application'}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20 opacity-50" />
      </motion.div>
    </div>
  );
}
