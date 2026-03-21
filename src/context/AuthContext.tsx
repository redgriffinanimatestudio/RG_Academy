import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { userService, UserProfile, UserRole } from '../services/userService';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      userService.getProfile(user.uid).then(p => {
        setProfile(p);
        if (p && p.roles.length > 0) {
          // Set default active role from profile
          setActiveRoleState(p.roles[0]);
        }
        setProfileLoading(false);
      });
    } else {
      setProfile(null);
      setActiveRoleState(null);
    }
  }, [user]);

  const setActiveRole = (role: UserRole) => {
    if (profile?.roles.includes(role)) {
      setActiveRoleState(role);
    }
  };

  const hasRole = (role: UserRole) => profile?.roles.includes(role) || false;

  const isStaff = profile?.roles.some(r => 
    ['admin', 'manager', 'moderator', 'chief_manager'].includes(r)
  ) || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading: loading || profileLoading, 
      activeRole, 
      setActiveRole,
      hasRole,
      isStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
