import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

interface CyberCalendarProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  label?: string;
}

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export const CyberCalendar: React.FC<CyberCalendarProps> = ({ value, onChange, label = 'Date of Birth' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date(2000, 0, 1));
  const [viewedYear, setViewedYear] = useState(currentDate.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(currentDate.getMonth());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');

  // Generate years list (from current year down to 1940)
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewedYear, viewedMonth, day);
    const formatted = newDate.toISOString().split('T')[0];
    onChange(formatted);
    setCurrentDate(newDate);
    setIsOpen(false);
  };

  const days = Array.from({ length: getDaysInMonth(viewedYear, viewedMonth) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(viewedYear, viewedMonth);
  const emptySlots = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="space-y-2 relative">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-2">
        {label} <span className="text-red-500/50">*</span>
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 px-4 text-white text-xs font-bold flex items-center justify-between hover:bg-white/5 transition-all outline-none group"
      >
        <div className="flex items-center gap-3">
          <CalendarIcon size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />
          <span className={value ? 'text-white' : 'text-white/20 uppercase tracking-widest'}>
            {value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase() : 'SELECT TEMPORAL COORDINATE'}
          </span>
        </div>
        <ChevronRight size={14} className={`text-white/20 transition-transform ${isOpen ? 'rotate-90 text-red-500' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 z-[110] mt-4 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl p-4 min-w-[300px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setView('months')}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                  >
                    {MONTHS[viewedMonth]}
                  </button>
                  <button 
                    onClick={() => setView('years')}
                    className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    {viewedYear}
                  </button>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => viewedMonth === 0 ? (setViewedMonth(11), setViewedYear(viewedYear-1)) : setViewedMonth(viewedMonth-1)}
                    className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => viewedMonth === 11 ? (setViewedMonth(0), setViewedYear(viewedYear+1)) : setViewedMonth(viewedMonth+1)}
                    className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* View Rendering */}
              <div className="min-h-[220px]">
                {view === 'days' ? (
                  <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                      <div key={d} className="text-center text-[8px] font-black text-white/20 pb-2">{d}</div>
                    ))}
                    {emptySlots.map(i => <div key={`empty-${i}`} />)}
                    {days.map(d => {
                      const isSelected = value && new Date(value).getDate() === d && new Date(value).getMonth() === viewedMonth && new Date(value).getFullYear() === viewedYear;
                      const isToday = new Date().getDate() === d && new Date().getMonth() === viewedMonth && new Date().getFullYear() === viewedYear;
                      
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleDateSelect(d)}
                          className={`aspect-square rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${isSelected ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : isToday ? 'border border-red-500/40 text-red-500' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                ) : view === 'months' ? (
                  <div className="grid grid-cols-3 gap-2">
                    {MONTHS.map((m, i) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setViewedMonth(i); setView('days'); }}
                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewedMonth === i ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                      >
                        {m.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 h-[220px] overflow-y-auto custom-scrollbar pr-2">
                    {years.map(y => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => { setViewedYear(y); setView('days'); }}
                        className={`py-3 rounded-xl text-[9px] font-black transition-all ${viewedYear === y ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Line */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 italic">Temporal Grid V5.2</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-[8px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
                >
                  Confirm Node Selection
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
