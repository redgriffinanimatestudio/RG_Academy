import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronRight } from 'lucide-react';

interface FooterProps {
  profile: any;
  modePrefix: string;
  modeColor: string;
  modeBg: string;
  currentLang: any;
  onOpenLangMenu: () => void;
}

export default function Footer({ profile, modePrefix, modeColor, modeBg, currentLang, onOpenLangMenu }: FooterProps) {
  const { t } = useTranslation();
  const { lang } = useParams();

  // 💎 Tier 2: Industrial Minimal Footer (For authenticated members)
  if (profile) {
    return (
      <footer className="bg-black/40 border-t border-white/5 py-6 mt-20 backdrop-blur-xl">
        <div className="mx-auto max-w-[1920px] px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-3 group opacity-60 hover:opacity-100 transition-opacity">
              <div className={`size-8 ${modeBg} rounded-lg flex items-center justify-center text-bg-dark text-xs font-black italic`}>RG</div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-white">Red Griffin Ecosystem</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex items-center gap-4 text-[9px] font-black uppercase text-white/30">
              <span className="hover:text-primary cursor-pointer transition-colors">Nodes Status: Optimal</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Latency: 24ms</span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-[9px] font-black uppercase text-white/20">
            <p>© {new Date().getFullYear()} Red Griffin Creative Ecosystem</p>
            <div className="flex items-center gap-4">
              <Link to="#" className="hover:text-white transition-colors">{t('terms')}</Link>
              <Link to="#" className="hover:text-white transition-colors">{t('legal')}</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // 🏛️ Tier 1: Full Marketing Footer (For guests)
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('academy')}</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
              <li><Link to={`/aca/${lang || 'eng'}`} className="hover:text-white">{t('workshops')}</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-hover">{t('studio')}</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
              <li><Link to={`/studio/${lang || 'eng'}`} className="hover:text-white">{t('hire_talent')}</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{t('community')}</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
              <li><Link to="#" className="hover:text-white">{t('blog')}</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{t('legal')}</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/40">
              <li><Link to="#" className="hover:text-white">{t('terms')}</Link></li>
            </ul>
          </div>
          <div className="space-y-8 col-span-full lg:col-span-1">
            <button 
              onClick={onOpenLangMenu} 
              className="w-full flex items-center justify-between px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Globe size={16} className={modeColor} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {currentLang?.name || 'Language'}
                </span>
              </div>
              <ChevronRight size={14} className="opacity-40" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
          <Link to={`${modePrefix}/${lang || 'eng'}`} className="flex items-center gap-4 group">
            <div className={`size-12 ${modeBg} rounded-2xl flex items-center justify-center text-bg-dark shadow-xl`}>
              <span className="text-xl font-black italic">RG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white uppercase leading-none">Red Griffin</span>
              <span className={`text-[8px] font-bold tracking-[0.4em] ${modeColor} uppercase mt-1`}>{t('creative_ecosystem')}</span>
            </div>
          </Link>
          <div className="flex flex-col md:items-end gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              © {new Date().getFullYear()} Red Griffin Creative Ecosystem. {t('all_rights_reserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
