import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronRight, Activity, Cpu, ShieldCheck, Github, Twitter, MessageSquare, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from './Layout.constants';

interface FooterProps {
  profile: any;
  modePrefix: string;
  modeColor: string;
  modeBg: string;
  currentLang: any;
  onOpenLangMenu: () => void;
  onChangeLanguage?: (newLang: string) => void;
}

export default function Footer({ 
  profile, modePrefix, modeColor, modeBg, currentLang, onOpenLangMenu, onChangeLanguage 
}: FooterProps) {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // 💎 Tier 2: Industrial Minimal Member Footer (Authenticated)
  if (profile) {
    return (
      <footer className="w-full bg-[#050505]/80 backdrop-blur-3xl border-t border-white/5 py-4 mt-12 pb-24 md:pb-4 relative z-50">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
          
          {/* Status Telemetry */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8">
            <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-3 group transition-all">
              <div className={`size-8 ${modeBg} rounded-lg flex items-center justify-center text-bg-dark text-[10px] font-black italic shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform`}>RG</div>
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-tighter text-white/40 group-hover:text-white transition-colors tracking-[0.2em]">Ecosystem v2.6.4</span>
            </Link>
            
            <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 group cursor-help">
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-emerald-500/60 group-hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                  <Activity size={10} /> Nodes: Optimal
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors">
                <Cpu size={10} /> Core: Syncing
              </div>
              <div className="hidden md:flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors">
                <ShieldCheck size={10} /> Security: Industrial
              </div>
            </div>
          </div>

          {/* Quick Links & Legal */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[9px] font-black uppercase tracking-[0.15em] text-white/20">
            <div className="flex items-center gap-4">
              <Link to="#" className="hover:text-white transition-all hover:translate-y-[-1px]">{t('terms')}</Link>
              <Link to="#" className="hover:text-white transition-all hover:translate-y-[-1px]">{t('legal')}</Link>
              <Link to="#" className="hover:text-white transition-all hover:translate-y-[-1px]">Infrastructure</Link>
            </div>
            <div className="h-3 w-[1px] bg-white/5 hidden sm:block" />
            <p className="whitespace-nowrap italic opacity-60">© {new Date().getFullYear()} Red Griffin Creative Ecosystem</p>
          </div>
        </div>
      </footer>
    );
  }

  // 🏛️ Tier 1: Bold Marketing Guest Footer
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-24 pb-32 md:pb-12 overflow-hidden relative">
      {/* Subtle Background Glow */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] ${modeBg.replace('bg-', 'bg-')}/5 blur-[120px] rounded-full -mb-64 opacity-20`} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Tier 1 CTA Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-32 p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:border-primary/20 transition-all duration-700">
          <div className="space-y-4 text-center lg:text-left">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
              Ready to <span className="text-primary">Sync?</span>
            </h3>
            <p className="text-sm text-white/40 font-medium tracking-wide max-w-md">{t('join_collective_desc') || 'Join the collective of technical artists, architects and creators pushing the limits of the ecosystem.'}</p>
          </div>
          <Link to={`/aca/${lang || 'eng'}/register`} className="px-16 py-6 bg-primary text-bg-dark rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl shadow-primary/20 active:scale-95 group-hover:rotate-[-1deg]">
            {t('join_collective') || 'Join Ecosystem'}
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-16 mb-24 lg:mb-32">
          {/* Brand Info */}
          <div className="col-span-full lg:col-span-2 space-y-8 pr-0 lg:pr-12">
            <Link to={`/${lang || 'eng'}`} className="flex items-center gap-4 group">
              <div className={`size-14 ${modeBg} rounded-2xl flex items-center justify-center text-bg-dark shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)] group-hover:scale-110 transition-transform duration-500`}>
                <span className="text-2xl font-black italic">RG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white uppercase leading-none italic">Red Griffin</span>
                <span className="text-[9px] font-bold tracking-[0.5em] text-white/30 uppercase mt-2">Architecture v2.6</span>
              </div>
            </Link>
            <p className="text-[11px] font-medium leading-relaxed text-white/30 max-w-xs uppercase tracking-widest italic">
              Industrialized Creative Architecture for the New Digital Era. Verified, Scalable, Performance-driven.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-6 text-white/40">
               <Twitter size={18} className="hover:text-primary transition-colors cursor-pointer" />
               <Github size={18} className="hover:text-primary transition-colors cursor-pointer" />
               <MessageSquare size={18} className="hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic underline underline-offset-8 decoration-primary/20">{t('academy')}</h4>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-[0.15em] text-white/30 italic">
              <li><Link to={`/aca/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('workshops')}</Link></li>
              <li><Link to={`/aca/${lang || 'eng'}/mentors`} className="hover:text-white transition-colors">Mentorship</Link></li>
              <li><Link to={`/aca/${lang || 'eng'}/certs`} className="hover:text-white transition-colors">Certification</Link></li>
            </ul>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-hover italic underline underline-offset-8 decoration-primary/20">{t('studio')}</h4>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-[0.15em] text-white/30 italic">
              <li><Link to={`/studio/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('hire_talent')}</Link></li>
              <li><Link to={`/studio/${lang || 'eng'}/contracts`} className="hover:text-white transition-colors">Escrow Logic</Link></li>
              <li><Link to={`/studio/${lang || 'eng'}/gigs`} className="hover:text-white transition-colors">Brave Gigs</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 italic underline underline-offset-8 decoration-white/10">{t('community')}</h4>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-[0.15em] text-white/30 italic">
              <li><Link to={`/community/${lang || 'eng'}`} className="hover:text-white transition-colors">{t('blog')}</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Collective</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Registry</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 italic underline underline-offset-8 decoration-white/10">{t('legal')}</h4>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-[0.15em] text-white/30 italic">
              <li><Link to="#" className="hover:text-white transition-colors">{t('terms')}</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">{t('privacy') || 'Privacy'}</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Node-EULA</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-12 border-t border-white/5 group">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">
            <span>© {new Date().getFullYear()} Red Griffin Ecosystem</span>
            <div className="hidden sm:block h-3 w-[1px] bg-white/10" />
            <span>Industrialized Creative Engine</span>
          </div>

          {/* Language Integrated */}
          <div className="flex items-center gap-8 relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
              className="flex items-center gap-4 px-8 py-3 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10 transition-all group/lang"
            >
              <Globe size={14} className={`${modeColor} group-hover/lang:scale-110 transition-transform`} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">
                {currentLang?.name || 'SYNCED_NODE'}
              </span>
              {isLangMenuOpen ? <ChevronDown size={12} className="opacity-20" /> : <ChevronUp size={12} className="opacity-20 translate-y-[-1px]" />}
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full right-0 mb-4 w-44 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden backdrop-blur-xl"
                >
                  {LANGUAGES.map((l) => (
                    <button 
                      key={l.code} 
                      onClick={() => {
                        onChangeLanguage?.(l.code);
                        setIsLangMenuOpen(false);
                      }} 
                      className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase flex items-center justify-between transition-all ${currentLang?.code === l.code ? 'text-primary bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                      <span className="flex items-center gap-3"><span>{l.flag}</span> {l.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
}
