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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const mapProfile = (dbUser: any): UserProfile => {
    // dbUser now comes with roles as array from backend (after parsing JSON)
    return {
      id: dbUser.id,
      uid: dbUser.id,
      email: dbUser.email,
      displayName: dbUser.displayName,
      photoURL: dbUser.photoURL,
      role: dbUser.role, // Current active role in DB
      primaryRole: dbUser.primaryRole,
      roles: dbUser.roles || ['student'],
      isAdmin: dbUser.isAdmin,
      isStudent: dbUser.isStudent,
      isLecturer: dbUser.isLecturer,
      isClient: dbUser.isClient,
      isExecutor: dbUser.isExecutor,
      createdAt: dbUser.createdAt
    };
  };

  const initAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
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

  const setActiveRole = async (role: UserRole) => {
    if (!profile || activeRole === role) return;
    
    try {
      console.log(`[AUTH] Requesting role switch to: ${role}`);
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
          console.log(`[AUTH] Role switched successfully to: ${role}`);
          setActiveRoleState(role);
          // Глубокое обновление профиля для синхронизации всех флагов
          setProfile(prev => prev ? { ...prev, role } : null);
        } else {
          console.error(`[AUTH] Server rejected role switch: ${result.error}`);
        }
      } else {
        const errorData = await response.json();
        console.error(`[AUTH] Failed to switch role: ${response.status}`, errorData);
      }
    } catch (err) {
      console.error("[AUTH] Critical error during role switch:", err);
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
