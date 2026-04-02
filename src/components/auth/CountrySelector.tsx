import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Search, ChevronDown, Check } from 'lucide-react';
import { ALL_COUNTRIES } from '../../utils/countries';

interface CountrySelectorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  value, 
  onChange, 
  label = 'Country of Residence',
  placeholder = 'Select Node Location'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isPrivacyHovered, setIsPrivacyHovered] = useState(false);

  const filtered = ALL_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCountry = ALL_COUNTRIES.find(c => c.code === value);

  return (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between px-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          {label} <span className="text-red-500/50">*</span>
        </label>
        
        <div 
          className="cursor-help text-primary/40 hover:text-primary transition-colors flex items-center gap-2"
          onMouseEnter={() => setIsPrivacyHovered(true)}
          onMouseLeave={() => setIsPrivacyHovered(false)}
        >
          <span className="text-[8px] font-black uppercase tracking-widest text-[#00f3ff]/40">Node Compliance</span>
          <Shield size={10} className="text-[#00f3ff]/40" />
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-12 pr-6 text-white text-xs font-bold flex items-center justify-between hover:bg-white/5 transition-all outline-none"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Globe className="flex-shrink-0 text-white/20" size={16} />
            <span className="truncate">{selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : placeholder}</span>
          </div>
          <ChevronDown size={14} className={`flex-shrink-0 text-white/20 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 z-[200] mt-2 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-3xl overflow-hidden backdrop-blur-3xl"
            >
              <div className="p-3 border-b border-white/5 flex items-center gap-3">
                <Search size={14} className="text-white/20" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH COORDINATES..."
                  className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-[0.2em] text-primary w-full"
                />
              </div>
              <div className="max-h-[220px] overflow-y-auto p-1 custom-scrollbar">
                {filtered.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { onChange(c.code); setIsOpen(false); setSearch(''); }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${value === c.code ? 'bg-primary/20 text-primary border border-primary/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{c.flag}</span>
                      <span>{c.name}</span>
                    </div>
                    {value === c.code && <Check size={12} className="text-primary" />}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="p-6 text-center text-white/20 text-[9px] font-black uppercase italic">
                    Node Location Not Found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isPrivacyHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute z-[210] top-0 left-full ml-4 w-48 p-4 bg-[#0f0f0f] border border-[#00f3ff]/20 rounded-2xl shadow-2xl backdrop-blur-2xl hidden lg:block"
          >
            <p className="text-[8px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
              Coordinate identification is required for <span className="text-[#00f3ff]">Protocol Compliance</span> and dynamic Smart Contract generation.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
