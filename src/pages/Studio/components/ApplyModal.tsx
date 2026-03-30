import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Clock, DollarSign, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApplyModalProps {
  project: any;
  onClose: () => void;
  onSubmit: (data: { coverLetter: string, bid: number, days: number }) => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ project, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    coverLetter: '',
    bid: project.budget || 0,
    days: 7,
    portfolioUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      coverLetter: formData.coverLetter,
      bid: Number(formData.bid),
      days: Number(formData.days)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="w-full max-w-2xl bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(255,54,54,0.1)] relative"
      >
        <div className="p-8 sm:p-12 space-y-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                <Send size={12} /> {t('grid_application')}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-none">{project.title}</h2>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5 italic">
                  Client: {project.client?.displayName || 'Protocol'}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 italic">
                  Budget: ${project.budget?.toLocaleString()}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="size-12 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-all hover:bg-white/10 hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Cover Letter */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('proposal_intelligence')}</label>
                  <span className="text-[8px] font-bold text-primary italic uppercase tracking-widest">Required</span>
                </div>
                <textarea 
                  required
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                  placeholder="Explain your strategic approach to this node's requirements..."
                  className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-sm text-white focus:border-primary/40 focus:bg-white/[0.04] transition-all outline-none min-h-[160px] resize-none shadow-inner"
                />
              </div>

              {/* Financial & Timeline Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                    <DollarSign size={12} className="text-primary" /> {t('bid_amount')}
                  </label>
                  <input 
                    type="number" 
                    required 
                    value={formData.bid}
                    onChange={(e) => setFormData({...formData, bid: Number(e.target.value)})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm text-white font-black hover:border-white/10 focus:border-primary/40 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                    <Clock size={12} className="text-primary" /> {t('estimated_cycle')} (Days)
                  </label>
                  <input 
                    type="number" 
                    required 
                    value={formData.days}
                    onChange={(e) => setFormData({...formData, days: Number(e.target.value)})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm text-white font-black hover:border-white/10 focus:border-primary/40 transition-all outline-none" 
                  />
                </div>
              </div>

              {/* Portfolio Link */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                  <LinkIcon size={12} className="text-primary" /> {t('portfolio_reference')}
                </label>
                <input 
                  type="url" 
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                  placeholder="https://artstation.com/your-id" 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm text-white/60 font-medium hover:border-white/10 focus:border-primary/40 transition-all outline-none" 
                />
              </div>
            </div>

            {/* Compliance Info */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
              <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{t('escrow_protection_active')}</p>
                <p className="text-[9px] text-white/40 font-medium leading-relaxed italic">
                  Apply with confidence. Funds are locked in ESCROW upon contract initiation and released based on verified milestones. 
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-6 bg-primary text-bg-dark rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,54,54,0.3)] flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                {t('initiate_handshake')} <Send size={16} />
              </span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplyModal;
