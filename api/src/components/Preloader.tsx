import React from 'react';

interface PreloaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Preloader: React.FC<PreloaderProps> = ({
  message = "Loading...",
  size = 'md',
  className = ""
}) => {
  const sizeClasses = {
    sm: 'size-12',
    md: 'size-16',
    lg: 'size-20'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`min-h-[200px] font-sans text-white flex items-center justify-center bg-transparent ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className={`relative ${sizeClasses[size]}`}>
          <div className="absolute inset-0 rounded-2xl border-3 border-primary/20 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl border-t-3 border-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-black italic text-white ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>RG</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className={`font-black uppercase tracking-[0.3em] text-white/40 animate-pulse ${textSizeClasses[size]}`}>
            Red Griffin
          </span>
          <span className={`font-bold uppercase tracking-[0.2em] text-primary mt-1 ${size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : 'text-xs'}`}>
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;