import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Layers, Plus, Minus, Tag, DollarSign, Clock, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../../services/apiClient';

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: 500,
    urgency: 'normal',
    maturityLevel: 'junior',
    requiredSkills: [] as { skill: string, level: number }[]
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentLevel, setCurrentLevel] = useState(5);

  const addSkill = () => {
    if (currentSkill && !formData.requiredSkills.find(s => s.skill === currentSkill)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, { skill: currentSkill, level: currentLevel }]
      });
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillName: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s.skill !== skillName)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/v1/studio/projects', {
        ...formData,
        requiredSkills: JSON.stringify(formData.requiredSkills),
        tags: JSON.stringify(formData.requiredSkills.map(s => s.skill))
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error("Failed to post project:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_0_150px_rgba(255,54,54,0.15)] flex flex-col max-h-[90vh]"
      >
        <div className="p-12 overflow-y-auto no-scrollbar space-y-12">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                <Layers size={14} /> {t('node_initialization')}
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight text-white leading-none">{t('post_new_project')}</h2>
              <p className="text-sm text-white/40 max-w-lg font-medium">{t('project_creation_notice')}</p>
            </div>
            <button 
              onClick={onClose} 
              className="size-14 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center hover:text-white transition-all hover:bg-white/10 hover:rotate-90"
            >
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Basic Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2 italic">01. Project Identifier</label>
                  <input 
                    required 
                    placeholder="E.g., High-Poly Vehicle Rigging"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-lg font-black text-white focus:border-primary/40 transition-all outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2 italic">02. Execution Protocol (Details)</label>
                  <textarea 
                    required 
                    placeholder="Describe the technical requirements, milestones, and deliverables..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-sm text-white/60 focus:border-primary/40 transition-all outline-none min-h-[240px] resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Parameters & Skills */}
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-4">
                     <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 px-2 italic">
                       <DollarSign size={12} className="text-primary" /> Budget Allocation
                     </label>
                     <input 
                       type="number" 
                       value={formData.budget}
                       onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm font-black text-white"
                     />
                   </div>
                   <div className="space-y-4">
                     <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 px-2 italic">
                       <Clock size={12} className="text-primary" /> Priority Level
                     </label>
                     <select 
                       value={formData.urgency}
                       onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm font-black text-white outline-none cursor-pointer"
                     >
                        <option value="normal" className="bg-bg-card">Normal</option>
                        <option value="urgent" className="bg-bg-card text-primary">Urgent</option>
                     </select>
                   </div>
                </div>

                <div className="space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                   <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                     <Tag size={12} /> {t('skill_requirements')}
                   </h4>
                   
                   <div className="flex gap-4">
                      <input 
                        placeholder="Maya, Houdini, ZBrush..."
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary/20"
                      />
                      <input 
                        type="number" min="1" max="10" 
                        value={currentLevel}
                        onChange={(e) => setCurrentLevel(Number(e.target.value))}
                        className="w-20 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-center text-white font-black"
                      />
                      <button 
                        type="button" onClick={addSkill}
                        className="size-12 rounded-xl bg-primary text-bg-dark flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                      >
                        <Plus size={20} />
                      </button>
                   </div>

                   <div className="flex flex-wrap gap-2">
                     {formData.requiredSkills.map(s => (
                       <span key={s.skill} className="group px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase flex items-center gap-3 text-white/60 hover:text-white transition-all">
                         {s.skill} <span className="text-primary">LV.{s.level}</span>
                         <button type="button" onClick={() => removeSkill(s.skill)} className="text-white/20 hover:text-primary transition-all">
                           <Minus size={12} />
                         </button>
                       </span>
                     ))}
                   </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4 italic font-medium text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">
                  <Shield size={20} className="text-primary shrink-0" />
                  Your project will be broadcasted to the Matrix. executors matching your criteria will be prioritized by the AI Grid Matcher.
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-8 bg-primary text-bg-dark rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-[0_25px_60px_rgba(255,54,54,0.3)] flex items-center justify-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center gap-3">
                {loading ? 'Initializing Interface...' : t('deploy_project_node')} <Send size={20} />
              </span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProjectModal;
