import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface InputWithStatusProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  hint: string;
  status?: 'none' | 'loading' | 'success' | 'warning' | 'error';
  errorText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  id?: string;
  autoComplete?: string;
}

export const InputWithStatus: React.FC<InputWithStatusProps> = ({
  label, type = 'text', value, onChange, placeholder, hint, status = 'none', errorText, required, icon, id, autoComplete
}) => {

  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    none: 'border-white/5',
    loading: 'border-blue-500/40',
    success: 'border-emerald-500/40',
    warning: 'border-amber-500/40',
    error: 'border-red-500/40'
  };

  const dotColors = {
    none: 'bg-white/10',
    loading: 'bg-blue-500 animate-pulse',
    success: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    warning: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    error: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
  };

  return (
    <div className="space-y-2 relative group">
      <div className="flex items-center justify-between px-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          {label} {required && <span className="text-red-500/50">*</span>}
        </label>
        
        <div 
          className="cursor-help text-white/10 hover:text-primary transition-colors"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Info size={14} />
        </div>
      </div>

      <div className="relative">
        {icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          autoComplete={autoComplete}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-black/40 border ${statusColors[status]} rounded-[2rem] py-5 ${icon ? 'pl-16' : 'px-8'} pr-16 text-white text-sm font-bold outline-none focus:bg-primary/5 transition-all`}
          required={required}
        />


        {/* Status Dot/Icon inside input */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {status === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
          {status === 'error' && <XCircle size={18} className="text-red-500" />}
          {status === 'warning' && <AlertCircle size={18} className="text-amber-500" />}
          <div className={`size-2.5 rounded-full ${dotColors[status]} transition-all duration-500`} />
        </div>
      </div>

      {/* Hover Hint Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 bottom-full left-0 right-0 mb-4 p-4 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-none"
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Recommendation</div>
            <p className="text-[11px] font-medium text-white/60 leading-relaxed italic">{hint}</p>
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1a1a1a]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Text */}
      <AnimatePresence>
        {status === 'error' && errorText && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-[10px] font-black uppercase tracking-widest text-red-500/80 px-4"
          >
            {errorText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
