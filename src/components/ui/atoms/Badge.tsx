import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost' | 'outline' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const variantClasses: Record<BadgeVariant, string> = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    neutral: 'badge-neutral bg-white/5 border-white/10 text-white/60',
    ghost: 'badge-ghost',
    outline: 'badge-outline',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  const sizeClasses: Record<BadgeSize, string> = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg p-3 h-8',
  };

  return (
    <div className={`
      badge 
      ${variantClasses[variant]} 
      ${sizeClasses[size]} 
      rounded-lg font-black uppercase tracking-[0.2em] text-[8px] sm:text-[9px] italic transition-all duration-300
      ${className}
    `}>
      {dot && <span className="size-1 rounded-full bg-current mr-1.5 animate-pulse" />}
      {children}
    </div>
  );
};

export default Badge;
