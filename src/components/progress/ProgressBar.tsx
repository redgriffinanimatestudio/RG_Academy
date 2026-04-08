import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  color = 'primary',
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  const colorClasses = {
    primary: 'bg-primary',
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
  };
  
  const glowColors = {
    primary: 'rgba(16, 185, 129, 0.4)',
    cyan: 'rgba(6, 182, 212, 0.4)',
    emerald: 'rgba(16, 185, 129, 0.4)',
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40 italic">
            Progress
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60 italic">
            {clampedPercentage}%
          </span>
        </div>
      )}
      <div className="relative h-2 w-full bg-bg-card rounded-full overflow-hidden border border-border-main">
        <div
          className={`absolute left-0 top-0 h-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary} transition-all duration-500 ease-out rounded-full`}
          style={{
            width: `${clampedPercentage}%`,
            boxShadow: `0 0 15px ${glowColors[color as keyof typeof glowColors] || glowColors.primary}`,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${glowColors[color as keyof typeof glowColors] || glowColors.primary} 50%, transparent 100%)`,
            animation: 'pulse-sweep 2s infinite linear',
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);