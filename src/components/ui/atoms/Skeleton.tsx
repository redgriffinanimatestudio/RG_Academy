import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangle' | 'circle' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangle' 
}) => {
  const variantClasses = {
    rectangle: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4 w-full'
  };

  return (
    <div className={`
      animate-pulse bg-white/5 border border-white/5
      ${variantClasses[variant]}
      ${className}
    `} />
  );
};

export default Skeleton;
