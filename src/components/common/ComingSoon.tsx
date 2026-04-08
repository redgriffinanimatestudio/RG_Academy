import React from 'react';
import { Construction, Rocket, Shield, Cpu, Activity, Zap } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
  moduleName?: string;
}

export default function ComingSoon({
  title,
  description,
  moduleName = 'Academy Core',
}: ComingSoonProps) {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden p-6 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-primary/5 blur-[120px] opacity-20" />
        <div className="absolute inset-0 opacity-[0.03] matrix-grid-bg" />
      </div>

      <div className="relative z-10 max-w-2xl space-y-12">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 backdrop-blur-xl">
          <Activity size={14} className="animate-pulse text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            {moduleName} <span className="text-primary/60">:: Phase 1.0</span>
          </span>
        </div>

        <div className="flex justify-center -space-x-4">
          <div className="size-20 rounded-2xl border border-white/10 bg-white/5 text-primary shadow-2xl backdrop-blur-2xl flex items-center justify-center">
            <Cpu size={32} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex size-24 scale-110 items-center justify-center rounded-3xl border border-primary/20 bg-bg-card text-primary shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <Construction size={40} strokeWidth={1} />
          </div>
          <div className="size-20 rounded-2xl border border-white/10 bg-white/5 text-primary shadow-2xl backdrop-blur-2xl flex items-center justify-center">
            <Zap size={32} strokeWidth={1} />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-black uppercase leading-none tracking-tighter text-white md:text-6xl">
            {title ?? (
              <>
                In Neural <span className="text-primary">Development</span>
              </>
            )}
          </h1>
          <p className="mx-auto max-w-lg text-sm font-medium leading-relaxed text-text-muted md:text-lg">
            {description ??
              'Our architects are currently stabilizing this neural node. Access will be granted shortly upon completion of the Industrialization Phase.'}
          </p>
        </div>

        <div className="mx-auto w-full max-w-md space-y-3">
          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
            <span>SYNC PROGRESS</span>
            <span>68% COMPLETE</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/5 bg-white/5 p-[1px]">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mx-auto flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white/10"
          >
            <Rocket size={16} />
            Return to Core
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 flex items-center gap-6 opacity-10">
        <Shield size={40} className="text-white" />
        <div className="h-10 w-[1px] bg-white" />
        <div className="text-[10px] font-black uppercase tracking-widest text-white">
          RG INDUSTRIAL
          <br />
          ARCHIVE 2026
        </div>
      </div>
    </div>
  );
}
