import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, UserProfile, UserRole } from '../services/userService';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole) => void;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const devStored = localStorage.getItem('rg_dev_user');
    if (devStored) {
      try {
        const dev = JSON.parse(devStored);
        return {
          uid: dev.id,
          email: dev.email,
          displayName: dev.displayName,
          photoURL: dev.photoURL || null,
          roles: ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client'],
          createdAt: new Date()
        };
      } catch (e) { return null; }
    }
    return null;
  });

  const [activeRole, setActiveRoleState] = useState<UserRole | null>(() => {
    const devStored = localStorage.getItem('rg_dev_user');
    if (devStored) {
      try {
        const dev = JSON.parse(devStored);
        return (localStorage.getItem(`rg_active_role_${dev.id}`) as UserRole) || 'admin';
      } catch (e) { return null; }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const refreshProfile = async () => {
    // Already loaded from localStorage in this version
  };

  const logout = async () => {
    const currentLang = window.location.pathname.split('/')[1] || 'eng';
    localStorage.removeItem('rg_dev_user');
    localStorage.removeItem('rg_auth_active');
    setProfile(null);
    setActiveRoleState(null);
    window.location.href = `/${currentLang}`;
  };

  const setActiveRole = (role: UserRole) => {
    if (profile?.roles.includes(role)) {
      setActiveRoleState(role);
      localStorage.setItem(`rg_active_role_${profile.uid}`, role);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user: profile, 
      profile, 
      loading, 
      activeRole, 
      setActiveRole,
      refreshProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
