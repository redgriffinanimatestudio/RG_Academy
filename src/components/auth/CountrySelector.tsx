import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Search, ChevronDown, Check } from 'lucide-react';

const COMMON_COUNTRIES = [
  { code: 'GE', name: 'Georgia' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'AE', name: 'UAE' },
  { code: 'CA', name: 'Canada' },
  { code: 'PL', name: 'Poland' }
];

interface CountrySelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isPrivacyHovered, setIsPrivacyHovered] = useState(false);

  const filtered = COMMON_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCountry = COMMON_COUNTRIES.find(c => c.code === value);

  return (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between px-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          Country / Residency <span className="text-red-500/50">*</span>
        </label>
        
        <div 
          className="cursor-help text-primary/40 hover:text-primary transition-colors flex items-center gap-2"
          onMouseEnter={() => setIsPrivacyHovered(true)}
          onMouseLeave={() => setIsPrivacyHovered(false)}
        >
          <span className="text-[8px] font-black uppercase tracking-widest">Privacy Compliance</span>
          <Shield size={12} />
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-black/40 border border-white/5 rounded-[2rem] py-5 pl-16 pr-8 text-white text-sm font-bold flex items-center justify-between hover:bg-white/5 transition-all outline-none"
        >
          <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <span>{selectedCountry ? selectedCountry.name : 'Select Jurisdiction'}</span>
          <ChevronDown size={18} className={`text-white/20 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.9, originY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.9 }}
              className="absolute top-full left-0 right-0 z-[100] mt-2 bg-[#1a1a1a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-3xl"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search size={16} className="text-white/20" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="FIND NODE..."
                  className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-primary w-full"
                />
              </div>
              <div className="max-h-[250px] overflow-y-auto p-2 custom-scrollbar">
                {filtered.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { onChange(c.code); setIsOpen(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${value === c.code ? 'bg-primary text-black' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                  >
                    <span>{c.name}</span>
                    {value === c.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isPrivacyHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-[110] bottom-full left-0 right-0 mb-4 p-6 bg-[#0f0f0f] border border-primary/20 rounded-3xl shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 mb-3 text-primary">
              <Shield size={18} />
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Regional Protocol Policy</h5>
            </div>
            <p className="text-[10px] font-medium text-white/40 leading-relaxed uppercase tracking-widest">
              We require your jurisdiction to determine **GDPR compliance** (EU Citizens), data localization laws (Georgia/UAE), and to dynamically generate **Smart Contracts** relevant to your specific residency. Your digital rights are governed by this parameter.
            </p>
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0f0f0f]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
