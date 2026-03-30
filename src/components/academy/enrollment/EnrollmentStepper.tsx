import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  Users, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Settings,
  CreditCard,
  Target
} from 'lucide-react';
import { academyService, Course } from '../../../services/academyService';

interface EnrollmentStepperProps {
  course: Course;
  onSuccess: () => void;
  onClose: () => void;
  accent: string;
}

const steps = [
  { id: 1, title: 'Experience', icon: Target },
  { id: 2, title: 'Customization', icon: Settings },
  { id: 3, title: 'Confirmation', icon: ShieldCheck },
];

export default function EnrollmentStepper({ course, onSuccess, onClose, accent }: EnrollmentStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skillLevel: 'beginner',
    primaryGoal: '',
    intensity: 'standard',
    addSupport: false,
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await academyService.enrollInCourse(course.id);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">&times;</button>
        
        {/* Stepper Header */}
        <div className="p-10 pb-0 flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group">
                <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  currentStep >= step.id ? 'bg-white text-bg-dark' : 'bg-white/5 text-white/20'
                }`}>
                  <step.icon size={20} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  currentStep >= step.id ? 'text-white' : 'text-white/20'
                }`}>{step.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="h-[1px] flex-1 bg-white/5 mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="p-10 pt-16 min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase text-white leading-none tracking-tight">Experience Check</h2>
                  <p className="text-white/40 text-sm">Self-assessment to optimize your trajectory.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFormData({ ...formData, skillLevel: lvl.toLowerCase() })}
                      className={`p-6 rounded-2xl border transition-all text-left group ${
                        formData.skillLevel === lvl.toLowerCase() 
                        ? 'border-white bg-white/5' 
                        : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${
                        formData.skillLevel === lvl.toLowerCase() ? 'text-primary' : 'text-white/20'
                      }`}>Lvl. 0{['Beginner', 'Intermediate', 'Advanced', 'Expert'].indexOf(lvl) + 1}</span>
                      <span className="text-lg font-black text-white uppercase">{lvl}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase text-white leading-none tracking-tight">Project Config</h2>
                  <p className="text-white/40 text-sm">Tailor the intensity of your learning pipeline.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-white uppercase">Weekend Intensive</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Accelerated 2-day sprint</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary"
                      checked={formData.intensity === 'intensive'}
                      onChange={(e) => setFormData({ ...formData, intensity: e.target.checked ? 'intensive' : 'standard' })}
                    />
                  </div>
                  
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-white uppercase">Mentor Support</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Direct 1-on-1 feedback</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle"
                      checked={formData.addSupport}
                      onChange={(e) => setFormData({ ...formData, addSupport: e.target.checked })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase text-white leading-none tracking-tight">Final Handshake</h2>
                  <p className="text-white/40 text-sm">Review your enrollment parameters before deployment.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
                  <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-white/40">
                    <span>Course Name</span>
                    <span className="text-white">{course.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-white/40">
                    <span>Intensity Level</span>
                    <span className="text-white italic">{formData.intensity}</span>
                  </div>
                  <div className="h-[1px] bg-white/10" />
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Final Fee</span>
                      <div className="text-4xl font-black text-white">${course.price}</div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white text-bg-dark rounded-xl text-[10px] font-black uppercase">
                      <CreditCard size={12} /> Balance Deduction
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-10 pt-0 flex gap-4">
          {currentStep > 1 && (
            <button 
              onClick={prevStep}
              className="px-8 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all"
            >
              Back
            </button>
          )}
          
          <button 
            disabled={loading}
            onClick={currentStep === steps.length ? handleEnroll : nextStep}
            className="flex-1 py-5 bg-white text-bg-dark rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-2xl shadow-white/10"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                {currentStep === steps.length ? 'Finalize Enrollment' : 'Continue Integration'}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
