import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserProfile, UserRole } from '../services/userService';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  login: (login: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  socialAuth: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRoles = (roles: unknown): string[] => {
  if (Array.isArray(roles)) return roles;
  if (typeof roles === 'string' && roles.trim()) {
    try {
      const parsed = JSON.parse(roles);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return roles.split(',').map(role => role.trim()).filter(Boolean);
    }
  }
  return ['student'];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const mapProfile = (dbUser: any): UserProfile => {
    return {
      id: dbUser.id || dbUser.uid,
      uid: dbUser.id || dbUser.uid,
      email: dbUser.email,
      displayName: dbUser.displayName,
      photoURL: dbUser.photoURL,
      role: dbUser.role,
      primaryRole: dbUser.primaryRole,
      roles: normalizeRoles(dbUser.roles || dbUser.role),
      isAdmin: dbUser.isAdmin,
      isStudent: dbUser.isStudent,
      isLecturer: dbUser.isLecturer,
      isClient: dbUser.isClient,
      isExecutor: dbUser.isExecutor,
      profileData: dbUser.profile || {},
      createdAt: dbUser.createdAt
    };
  };

  const initAuth = async () => {
    try {
      const response = await authService.getCurrentUser();
      const user = response?.success ? response.data : response;
      
      if (user && (user.id || user.uid)) {
        const mappedProfile = mapProfile(user);
        setProfile(mappedProfile);
        setActiveRoleState(mappedProfile.role as UserRole);
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

  const register = async (data: any) => {
    setLoading(true);
    try {
      await authService.register(data);
      await initAuth();
    } finally {
      setLoading(false);
    }
  };

  const socialAuth = async (data: any) => {
    setLoading(true);
    try {
      await authService.socialAuth(data);
      await initAuth();
    } finally {
      setLoading(false);
    }
  };

  const setActiveRole = async (role: UserRole) => {
    if (!profile || activeRole === role) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/switch-role', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setActiveRoleState(role);
          setProfile(prev => prev ? { ...prev, role } : null);
        }
      }
    } catch (err) {
      console.error("[AUTH] Critical error during role switch:", err);
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
      logout,
      login,
      register,
      socialAuth
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
