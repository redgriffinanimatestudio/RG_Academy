import React from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  strength: 0 | 1 | 2 | 3; // 0: None, 1: Weak, 2: Medium, 3: Strong
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength }) => {
  const labels = ['Empty', 'Weak Node', 'Balanced Node', 'Fortified Node'];
  const colors = ['bg-white/5', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
  const descriptions = [
    'Encryption Key Required',
    'Vulnerable to brute force',
    'Standard security parameters met',
    'Military-grade fragmentation detected'
  ];

  return (
    <div className="space-y-3 px-4">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Entropy Analysis:</span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${strength === 3 ? 'text-emerald-500' : strength === 2 ? 'text-amber-500' : strength === 1 ? 'text-red-500' : 'text-white/10'}`}>
          {labels[strength]}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 h-1">
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            initial={false}
            animate={{ 
              opacity: strength >= s ? 1 : 0.2,
              backgroundColor: strength >= s ? (s === 1 ? '#ef4444' : s === 2 ? '#f59e0b' : '#10b981') : '#ffffff'
            }}
            className="rounded-full h-full transition-all duration-500"
          />
        ))}
      </div>

      <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.1em] leading-relaxed italic">
        {descriptions[strength]}
      </div>
    </div>
  );
};
