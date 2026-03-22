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
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [devUser, setDevUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('rg_dev_user');
    if (stored) {
      try {
        setDevUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('rg_dev_user');
      }
    }
  }, []);

  useEffect(() => {
    if (devUser) {
      const devProfile: UserProfile = {
        uid: devUser.id,
        email: devUser.email,
        displayName: devUser.displayName,
        photoURL: devUser.photoURL || 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
        roles: ['student', 'lecturer', 'client', 'executor', 'chief_manager', 'admin'],
        createdAt: new Date() as any,
        updatedAt: new Date() as any
      };
      setProfile(devProfile);
      if (!activeRole) setActiveRoleState('admin');
    } else if (user) {
      setProfileLoading(true);
      userService.getProfile(user.uid).then(p => {
        if (p) {
          setProfile(p);
          if (!activeRole && p.roles.length > 0) setActiveRoleState(p.roles[0]);
        }
        setProfileLoading(false);
      }).catch(() => setProfileLoading(false));
    } else {
      setProfile(null);
      setActiveRoleState(null);
    }
  }, [user, devUser]);

  const loginAsGuest = async () => {
    localStorage.setItem('rg_dev_user', JSON.stringify({
      id: 'admin_dev',
      email: 'admin@redgriffin.academy',
      displayName: 'System Admin'
    }));
    window.location.reload();
  };

  const logout = async () => {
    localStorage.removeItem('rg_dev_user');
    setDevUser(null);
    await auth.signOut();
  };

  const setActiveRole = (role: UserRole) => {
    if (profile?.roles.includes(role)) {
      setActiveRoleState(role);
    }
  };

  const hasRole = (role: UserRole) => profile?.roles.includes(role) || false;

  const isStaff = profile?.roles.some(r => 
    ['admin', 'manager', 'moderator', 'chief_manager'].includes(r)
  ) || false;

  const effectiveUser = user || (devUser ? {
    uid: devUser.id,
    email: devUser.email,
    displayName: devUser.displayName,
    isDev: true
  } : null);

  // Loading state: only true if we don't have a devUser AND firebase is loading
  const isLoading = devUser ? false : (loading || profileLoading);

  return (
    <AuthContext.Provider value={{ 
      user: effectiveUser, 
      profile, 
      loading: isLoading, 
      activeRole, 
      setActiveRole,
      hasRole,
      isStaff,
      loginAsGuest,
      logout
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