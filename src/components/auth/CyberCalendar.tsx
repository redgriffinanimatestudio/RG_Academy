import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Check } from 'lucide-react';

interface CyberCalendarProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  label?: string;
  lang?: string;
}

const MONTHS_EN = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const MONTHS_RU = [
  'ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ',
  'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'
];

export const CyberCalendar: React.FC<CyberCalendarProps> = ({ value, onChange, label, lang = 'eng' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date(2000, 0, 1));
  const [viewedYear, setViewedYear] = useState(currentDate.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(currentDate.getMonth());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');

  const isRu = lang === 'rus';
  const months = isRu ? MONTHS_RU : MONTHS_EN;
  const displayLabel = label || (isRu ? 'Дата Рождения' : 'Date of Birth');

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
    // Ensure we don't have timezone shifts
    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;
    onChange(formatted);
    setCurrentDate(newDate);
  };

  const formatDisplayDate = (val: string) => {
    if (!val) return isRu ? 'ВЫБЕРИТЕ КООРДИНАТУ' : 'SELECT TEMPORAL CORE';
    const date = new Date(val);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d} // ${m} // ${y}`;
  };

  const days = Array.from({ length: getDaysInMonth(viewedYear, viewedMonth) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(viewedYear, viewedMonth);
  const emptySlots = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="space-y-2 relative">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-2">
        {displayLabel} <span className="text-red-500/50">*</span>
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 px-4 text-white text-xs font-bold flex items-center justify-between hover:bg-white/5 transition-all outline-none group border-glow-hover"
      >
        <div className="flex items-center gap-3">
          <CalendarIcon size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />
          <span className={value ? 'text-white font-mono tracking-widest' : 'text-white/20 uppercase tracking-widest text-[9px]'}>
            {formatDisplayDate(value)}
          </span>
        </div>
        <ChevronRight size={14} className="text-white/20 group-hover:translate-x-0.5 transition-all" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[340px] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1 text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 italic">Temporal Coordinate</h4>
                  <p className="text-[12px] font-black uppercase text-white tracking-widest">
                    {months[viewedMonth]} {viewedYear}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="size-8 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* View Control */}
              <div className="flex gap-2 mb-6">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setView('days'); }}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${view === 'days' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/30 hover:text-white'}`}
                >
                  {isRu ? 'ДНИ' : 'DAYS'}
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setView('months'); }}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${view === 'months' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/30 hover:text-white'}`}
                >
                  {isRu ? 'МЕСЯЦЫ' : 'MONTHS'}
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setView('years'); }}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${view === 'years' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/30 hover:text-white'}`}
                >
                  {isRu ? 'ГОДЫ' : 'YEARS'}
                </button>
              </div>

              {/* Main Content */}
              <div className="min-h-[220px]">
                {view === 'days' ? (
                  <div className="grid grid-cols-7 gap-1.5">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                      <div key={d} className="text-center text-[9px] font-black text-white/10 pb-2">{d}</div>
                    ))}
                    {emptySlots.map(i => <div key={`empty-${i}`} />)}
                    {days.map(d => {
                      const isSelected = value && new Date(value).getDate() === d && new Date(value).getMonth() === viewedMonth && new Date(value).getFullYear() === viewedYear;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleDateSelect(d)}
                          className={`aspect-square rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${isSelected ? 'bg-red-600 text-white shadow-xl shadow-red-500/30' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                ) : view === 'months' ? (
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((m, i) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setViewedMonth(i); setView('days'); }}
                        className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${viewedMonth === i ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
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
                        className={`py-4 rounded-2xl text-[9px] font-black transition-all ${viewedYear === y ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Header for Days */}
              {view === 'days' && (
                <div className="mt-6 flex items-center justify-between">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); viewedMonth === 0 ? (setViewedMonth(11), setViewedYear(viewedYear-1)) : setViewedMonth(viewedMonth-1); }}
                    className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2"
                  >
                    {isRu ? 'ПОДТВЕРДИТЬ' : 'CONFIRM'} <Check size={14} />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); viewedMonth === 11 ? (setViewedMonth(0), setViewedYear(viewedYear+1)) : setViewedMonth(viewedMonth+1); }}
                    className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
