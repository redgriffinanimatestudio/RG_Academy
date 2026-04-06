import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, ChevronRight, Briefcase, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PathSelectionSectionProps {
  t: (key: string) => string;
  lang: string | undefined;
  user?: any;
}

export default function PathSelectionSection({ t, lang, user }: PathSelectionSectionProps) {
  const navigate = useNavigate();

  if (user) return null;

  const sectors = [
    {
      id: 'studio',
      title: 'Studio Sector',
      subtitle: 'Production & Solutions',
      icon: Briefcase,
      desc: 'Collaborate with top-tier studios, manage high-budget production pipelines, and deploy world-class CG solutions.',
      color: 'from-emerald-600/20 to-emerald-500/5',
      accent: 'text-emerald-500',
      link: `/studio/${lang || 'eng'}/login?mode=register&path=studio`
    },
    {
      id: 'academy',
      title: 'Academy Sector',
      subtitle: 'Mastery & Evolution',
      icon: GraduationCap,
      desc: 'Master the core digital crafts under the guidance of industry veterans and build your strategic career trajectory.',
      color: 'from-primary/20 to-primary/5',
      accent: 'text-primary',
      link: `/aca/${lang || 'eng'}/login?mode=register&path=academy`
    }
  ];

  return (
    <section id="path-selection" className="relative py-32 px-4 sm:px-8 bg-bg-dark overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border-main to-transparent" />
      
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        <div className="text-center space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted opacity-40 italic">Initialization Phase 04</div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-ink italic leading-none">Choose Your <span className="text-primary">Trajectory.</span></h2>
          <p className="max-w-xl mx-auto text-sm text-text-muted font-medium leading-relaxed">
            Every journey in the Red Griffin Sovereignty begins with a strategic choice. Select the sector that aligns with your professional evolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {sectors.map((sector, idx) => (
            <motion.button
              key={sector.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              onClick={() => navigate(sector.link)}
              className="relative group h-[500px] rounded-[3rem] bg-bg-card border border-border-main overflow-hidden flex flex-col justify-between p-12 text-left hover:shadow-2xl transition-all duration-700"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-[2] group-hover:rotate-0">
                    <sector.icon size={250} />
                </div>

                <div className="relative space-y-6">
                    <div className={`size-16 rounded-2xl bg-bg-dark border border-border-main flex items-center justify-center ${sector.accent} shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                        <sector.icon size={32} />
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">{sector.subtitle}</div>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-ink italic leading-none">{sector.title}</h3>
                    </div>
                </div>

                <div className="relative space-y-10">
                    <p className="text-sm md:text-base text-text-muted leading-relaxed font-bold opacity-0 group-hover:opacity-80 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        {sector.desc}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="px-10 py-5 bg-ink text-bg-main rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group-hover:bg-primary group-hover:text-bg-dark transition-all">
                            Initialize Connection <ChevronRight size={16} />
                        </div>
                    </div>
                </div>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-border-main opacity-20">
            {[
                { icon: Cpu, label: 'Neural Protocols' },
                { icon: Globe, label: 'Global Grid' },
                { icon: ShieldCheck, label: 'Encrypted Identity' },
                { icon: Sparkles, label: 'Creative Synergy' }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 text-center">
                    <div className="size-10 rounded-xl bg-border-main/20 flex items-center justify-center text-ink/40">
                        <item.icon size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">{item.label}</span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}

// Helper to avoid issues with ShieldCheck naming in lucide-react if missed
const ShieldCheck = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
