import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, UserPlus, DollarSign, LifeBuoy, Video, Box, Zap, GraduationCap, Target, LayoutDashboard, X
} from 'lucide-react';

interface PerspectiveSwitcherProps {
  currentPerspective: string | null;
  activeRole: string | null;
}

const PERSPECTIVES = [
  { id: 'admin', icon: Shield, label: 'Master Admin', color: '#ef4444' },
  { id: 'hr', icon: UserPlus, label: 'HR Talent', color: '#378add' },
  { id: 'finance', icon: DollarSign, label: 'Treasury', color: '#1d9e75' },
  { id: 'support', icon: LifeBuoy, label: 'User Support', color: '#7f77dd' },
  { id: 'lecturer', icon: Video, label: 'Instructor', color: '#1d9e75' },
  { id: 'client', icon: Box, label: 'Client Node', color: '#ef9f27' },
  { id: 'executor', icon: Zap, label: 'Freelance Node', color: '#e24b4a' },
  { id: 'student', icon: GraduationCap, label: 'Student Nexus', color: '#378add' },
  { id: 'chief_manager', icon: Target, label: 'Strategic Hub', color: '#7f77dd' },
  { id: 'manager', icon: LayoutDashboard, label: 'Operations', color: '#1d9e75' }
];

const PerspectiveSwitcher: React.FC<PerspectiveSwitcherProps> = ({ currentPerspective, activeRole }) => {
  const [searchParams] = useSearchParams();
  const { lang } = useParams();

  const getPerspectiveUrl = (id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id === 'admin') {
      params.delete('perspective');
    } else {
      params.set('perspective', id);
    }
    return `/dashboard?${params.toString()}`;
  };

  const getResetUrl = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('perspective');
    return `/dashboard?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl">
      {/* Active Perspective Indicator */}
      <div className="px-3 py-1.5 border-r border-white/5 mr-1 hidden lg:block">
        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Perspective View</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[400px] lg:max-w-none">
        {PERSPECTIVES.map((p) => {
          const isActive = (currentPerspective === p.id) || (!currentPerspective && p.id === 'admin');
          return (
            <Link
              key={p.id}
              to={getPerspectiveUrl(p.id)}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-lg border border-white/10' 
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                }`}
                title={p.label}
              >
                <p.icon size={14} style={{ color: isActive ? p.color : 'inherit' }} />
                <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap transition-all duration-300 ${isActive ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0 overflow-hidden'}`}>
                  {p.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 rounded-xl opacity-20 pointer-events-none blur-md"
                    style={{ backgroundColor: p.color }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <AnimatePresence>
        {currentPerspective && (
          <Link to={getResetUrl()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-2 p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/10 transition-all flex items-center gap-2"
            >
              <X size={12} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Reset</span>
            </motion.div>
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerspectiveSwitcher;
