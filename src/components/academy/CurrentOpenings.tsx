import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, ChevronRight, Sparkles } from 'lucide-react';
import { hrService } from '../../services/hrService';
import JobApplyModal from '../hr/JobApplyModal';

export default function CurrentOpenings() {
  const [openings, setOpenings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpening, setSelectedOpening] = useState<any>(null);

  useEffect(() => {
    async function fetchOpenings() {
      try {
        const data = await hrService.getOpenings();
        setOpenings(data);
      } catch (err) {
        console.error('Failed to fetch openings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOpenings();
  }, []);

  if (loading) return null;
  if (openings.length === 0) return null;

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3 italic">
            Current <span className="text-primary not-italic">Openings.</span>
          </h2>
          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-none">Join the high-authority academy staff</p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
          <Sparkles size={14} className="text-primary animate-pulse" />
          <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">{openings.length} Positions Available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openings.map((opening, idx) => (
          <motion.div 
            key={opening.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] hover:border-primary/20 transition-all relative overflow-hidden"
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Briefcase size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5 rounded-full text-white/40">
                  {opening.department}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{opening.title}</h3>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-[9px] font-bold text-white/40 uppercase flex items-center gap-1.5 whitespace-nowrap">
                    <MapPin size={10} /> Remote / HQ
                  </span>
                  <span className="size-1 rounded-full bg-white/10 shrink-0" />
                  <span className="text-[9px] font-bold text-white/40 uppercase flex items-center gap-1.5">
                    <DollarSign size={10} /> {opening.salaryRange || 'Competitive'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => setSelectedOpening(opening)}
                  className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-primary hover:text-bg-dark transition-all flex items-center justify-center gap-2"
                >
                  Initiate Application <ChevronRight size={12} />
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <JobApplyModal 
        isOpen={!!selectedOpening} 
        onClose={() => setSelectedOpening(null)} 
        opening={selectedOpening} 
      />
    </section>
  );
}
