import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonNodeProps {
  className?: string;
  type?: 'card' | 'list' | 'text' | 'circle';
}

const SkeletonNode: React.FC<SkeletonNodeProps> = ({ className = '', type = 'card' }) => {
  const baseClass = "relative overflow-hidden bg-white/[0.03] border border-white/5";
  
  const renderContent = () => {
    switch (type) {
      case 'circle':
        return <div className="size-full rounded-full" />;
      case 'list':
        return (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-1/2 bg-white/5 rounded" />
                  <div className="h-2 w-1/4 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/5 rounded" />
            <div className="h-2 w-3/4 bg-white/5 rounded" />
          </div>
        );
      default: // card
        return (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="size-12 rounded-2xl bg-white/5" />
              <div className="h-2 w-20 bg-white/5 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-white/5 rounded-lg" />
              <div className="h-4 w-full bg-white/5 rounded shadow-inner" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-10 w-24 bg-white/5 rounded-xl" />
              <div className="h-10 w-20 bg-white/5 rounded-xl" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`${baseClass} ${className}`}>
      {renderContent()}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.02)]"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "linear" 
        }}
      />
    </div>
  );
};

export default SkeletonNode;
