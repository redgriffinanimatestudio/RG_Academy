import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Briefcase, FileText, Zap } from 'lucide-react';
import { hrService } from '../../services/hrService';

interface CreateOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateOpeningModal({ isOpen, onClose, onCreated }: CreateOpeningModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    department: 'CG',
    description: '',
    salaryRange: '',
    requirements: []
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await hrService.createOpening(formData);
      onCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create opening:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 italic">
            Create <span className="text-primary not-italic">Opening.</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Job Title</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none"
                placeholder="Senior VFX Artist"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Department</label>
                <select 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none"
                >
                  <option value="CG">CG</option>
                  <option value="VFX">VFX</option>
                  <option value="AI">AI</option>
                  <option value="Dev">Development</option>
                </select>
               </div>
               <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Salary Range</label>
                <input 
                  value={formData.salaryRange}
                  onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none"
                  placeholder="$80k - $120k"
                />
               </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Description</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-primary transition-all outline-none min-h-[120px]"
                placeholder="Job details..."
              />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-5 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
          >
            {loading ? 'Publishing...' : 'Publish Opening'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
