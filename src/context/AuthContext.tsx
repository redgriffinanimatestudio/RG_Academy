import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserProfile, UserRole } from '../services/userService';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole) => void;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  login: (login: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALL_ROLES: UserRole[] = [
  'admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const mapProfile = (dbUser: any): UserProfile => {
    const SUPER_ADMIN_EMAIL = 'super@redgriffin.academy';
    const isSuperAdmin = dbUser.email === SUPER_ADMIN_EMAIL;
    
    let finalRoles: UserRole[] = [];
    if (isSuperAdmin) {
      finalRoles = ALL_ROLES;
    } else {
      finalRoles = [dbUser.role || 'student'];
    }

    return {
      uid: dbUser.id,
      email: dbUser.email,
      displayName: dbUser.displayName,
      photoURL: dbUser.photoURL,
      roles: finalRoles,
      createdAt: dbUser.createdAt,
      isAdmin: isSuperAdmin || dbUser.role === 'admin'
    };
  };

  const initAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const mappedProfile = mapProfile(user);
        setProfile(mappedProfile);
        
        const savedRole = localStorage.getItem(`rg_active_role_${mappedProfile.uid}`) as UserRole;
        setActiveRoleState(savedRole && mappedProfile.roles.includes(savedRole) ? savedRole : mappedProfile.roles[0]);
      } else {
        setProfile(null);
        setActiveRoleState(null);
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const refreshProfile = async () => {
    await initAuth();
  };

  const logout = async () => {
    await authService.logout();
    setProfile(null);
    setActiveRoleState(null);
    window.location.href = '/';
  };

  const login = async (loginStr: string, pass: string) => {
    setLoading(true);
    try {
      await authService.login(loginStr, pass);
      await initAuth();
    } finally {
      setLoading(false);
    }
  };

  const setActiveRole = (role: UserRole) => {
    if (profile?.roles.includes(role)) {
      setActiveRoleState(role);
      localStorage.setItem(`rg_active_role_${profile.uid}`, role);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user: profile, // using profile as the user object for simplicity
      profile, 
      loading, 
      activeRole, 
      setActiveRole,
      refreshProfile,
      logout,
      login
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
