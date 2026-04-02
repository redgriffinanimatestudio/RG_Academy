import React from 'react';
import { motion } from 'framer-motion';
import { Video, BookOpen, ShieldCheck } from 'lucide-react';
import Preloader from '../../../components/Preloader';

const SynergySection = ({ data, loading, activeRole }: any) => {
  if (loading) return <Preloader message="Synchronizing Synergy Node..." size="sm" className="mb-12" />;
  if (!data) return null;

  const Icon = activeRole === 'lecturer' ? Video : (activeRole === 'student' ? BookOpen : ShieldCheck);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-1 border border-primary/20 bg-primary/5 rounded-2xl sm:rounded-[2.5rem] backdrop-blur-xl mb-12 overflow-hidden relative group"
    >
      <div className="p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="size-16 sm:size-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10 shrink-0">
            <Icon size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white italic">
                {activeRole === 'lecturer' ? 'Lecturer' : (activeRole === 'student' ? 'Learning' : 'Member')} <span className="text-primary">Hub</span>
              </h3>
              <span className="px-2 py-0.5 bg-primary text-bg-dark text-[8px] font-black uppercase tracking-widest rounded shadow-lg shadow-primary/20">Synergy Active</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-white/40 font-bold uppercase tracking-widest mt-1">
              {data.primary?.course?.title || data.primary?.title || 'Manage your activities and growth'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 sm:gap-12 w-full md:w-auto px-4 md:px-0">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{data.label}</p>
            <p className="text-2xl font-black text-white italic">{data.count}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{data.extraLabel}</p>
            <p className="text-2xl font-black text-white italic">{data.extra}</p>
          </div>
          {data.revenue !== undefined && (
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Revenue</p>
              <p className="text-2xl font-black text-primary italic">${data.revenue}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SynergySection;
