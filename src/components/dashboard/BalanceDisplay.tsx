import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, ShieldCheck, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function BalanceDisplay() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const balance = profile?.balance || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-hidden group"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 size-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-emerald-500/20 transition-all duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            <Wallet size={14} className="text-emerald-400" /> {t('liquid_assets_protocol')}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white tracking-tighter italic">${balance.toLocaleString()}</span>
              <span className="text-xs font-bold text-white/20 uppercase tracking-widest">USD</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 w-fit px-3 py-1 rounded-full border border-emerald-500/10 italic">
              <TrendingUp size={12} /> +12.4% {t('this_cycle')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group/btn">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover/btn:scale-110 transition-transform">
              <ArrowDownLeft size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{t('withdraw')}</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group/btn">
            <div className="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover/btn:scale-110 transition-transform">
              <History size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{t('ledger')}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-bold text-white/40 uppercase tracking-widest italic">
            <ShieldCheck size={12} className="text-primary" /> {t('escrow_secured')}
          </div>
          <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest italic">
            {t('last_sync')}: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <button className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
          {t('financial_operations')} <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
