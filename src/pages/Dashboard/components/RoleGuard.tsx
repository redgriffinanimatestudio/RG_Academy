import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Navigate, useParams } from 'react-router-dom';
import Preloader from '../../../components/Preloader';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

/**
 * Higher-Order Component to protect role-specific dashboard perspectives.
 * Verifies if the authenticated user has the required role in their profile.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { profile, loading } = useAuth();
  const { lang } = useParams();

  if (loading) return <Preloader message="Verifying security nodes..." />;

  if (!profile) {
    return <Navigate to={`/${lang || 'eng'}/login`} replace />;
  }

  // Admins are omnipotent in the dashboard ecosystem
  const hasAccess = profile.isAdmin || allowedRoles.some(role => profile.roles.includes(role));

  if (!hasAccess) {
    console.warn(`[Security] Unauthorized access attempt to restricted perspective. Required: ${allowedRoles.join(', ')}`);
    return (
      <div className="min-h-[60vh] flex flex-center flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="size-24 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-2xl shadow-rose-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 4-4"/><path d="m9 17 2 2 4-4"/><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/></svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white italic">Access Denied</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
            Permission Level Insufficient • Security Node: 403-FORBIDDEN
          </p>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          Return to Safe Zone
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
