import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Video,
  Users
} from 'lucide-react';

const STU_AcademyCalendar: React.FC = () => {
  const [currentDate] = useState(new Date());

  const EVENTS = [
    { id: 1, title: 'UE5 Cinematic Lighting', type: 'Lecture', time: '14:00 - 16:00', date: '2026-03-29', instructor: 'Elena Vance' },
    { id: 2, title: 'VFX Pipeline Workshop', type: 'Workshop', time: '11:00 - 13:00', date: '2026-03-30', instructor: 'Sarah Chen' },
    { id: 3, title: 'Houdini Destruction FX', type: 'Lab', time: '15:30 - 17:30', date: '2026-04-01', instructor: 'Marcus Thorne' },
    { id: 4, title: 'Rigging Mastery Submission', type: 'Deadline', time: '23:59', date: '2026-04-02', instructor: 'Grading Team' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* CALENDAR HEADER */}
      <div className="flex items-center justify-between p-8 rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <CalendarIcon size={120} />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="size-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20">
            <span className="text-[10px] font-black uppercase text-primary/60">{currentDate.toLocaleString('default', { month: 'short' })}</span>
            <span className="text-2xl font-black text-primary">{currentDate.getDate()}</span>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Academic Schedule</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Status: Cluster Sync Active • Timezone: UTC+7</p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white"><ChevronLeft size={20} /></button>
          <button className="px-6 py-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white">Today</button>
          <button className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="grid grid-cols-1 gap-4">
        {EVENTS.map((evt) => (
          <motion.div 
            key={evt.id}
            variants={item}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-primary/20 transition-all cursor-pointer overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* DATE COL */}
            <div className="md:col-span-2 flex flex-col justify-center border-r border-white/5 pr-6 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-colors">{new Date(evt.date).toLocaleDateString('default', { weekday: 'long' })}</span>
              <span className="text-lg font-black text-white">{new Date(evt.date).toLocaleDateString('default', { day: 'numeric', month: 'short' })}</span>
            </div>

            {/* INFO COL */}
            <div className="md:col-span-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                    evt.type === 'Deadline' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    evt.type === 'Workshop' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                    'bg-primary/10 text-primary border-primary/20'
                  }`}>
                    {evt.type}
                  </span>
                  <span className="text-[10px] font-bold text-white/20 uppercase flex items-center gap-1"><Clock size={12} /> {evt.time}</span>
                </div>
                <h3 className="text-base font-black text-white group-hover:text-primary transition-colors">{evt.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-medium text-white/40 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Users size={12} className={evt.type === 'Deadline' ? 'text-red-500' : 'text-primary'} /> {evt.instructor}</span>
                  <span className="flex items-center gap-1.5"><Video size={12} className="opacity-40" /> Virtual Classroom 04</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:bg-primary group-hover:text-bg-dark group-hover:border-primary transition-all shadow-xl">
                  {evt.type === 'Deadline' ? 'Submit Project' : 'Join Session'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMPTY FOOTER INFO */}
      <div className="p-8 rounded-3xl border border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center gap-6">
         <BookOpen size={24} className="text-white/20" />
         <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Academic Year 2026 • Spring Semester</span>
      </div>
    </motion.div>
  );
};

export default STU_AcademyCalendar;
