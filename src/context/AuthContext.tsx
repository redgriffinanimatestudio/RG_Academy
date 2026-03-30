import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserProfile, UserRole } from '../services/userService';
import apiClient from '../services/apiClient';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const mapProfile = (dbUser: any): UserProfile => {
    console.log("[AUTH] Mapping DB User to Profile:", dbUser);
    // dbUser now comes with roles as array from backend (after parsing JSON)
    const profile = {
      id: dbUser.id || dbUser.uid,
      uid: dbUser.id || dbUser.uid,
      email: dbUser.email,
      displayName: dbUser.displayName,
      photoURL: dbUser.photoURL,
      role: dbUser.role, // Current active role in DB
      primaryRole: dbUser.primaryRole,
      roles: (() => {
        if (Array.isArray(dbUser.roles)) return dbUser.roles;
        try { return JSON.parse(dbUser.roles || '["student"]'); } catch { return [dbUser.role || 'student']; }
      })(),
      isAdmin: dbUser.isAdmin,
      isStudent: dbUser.isStudent,
      isLecturer: dbUser.isLecturer,
      isClient: dbUser.isClient,
      isExecutor: dbUser.isExecutor,
      isHr: dbUser.isHr,
      isFinance: dbUser.isFinance,
      isAgency: dbUser.isAgency,
      isSupport: dbUser.isSupport,
      balance: dbUser.balance || 0, // Phase 6.2 Financial Bridge
      createdAt: dbUser.createdAt
    };
    console.log("[AUTH] Mapped Profile:", profile);
    return profile;
  };

  const initAuth = async () => {
    try {
      console.log("[AUTH] Initializing Auth...");
      const response = await authService.getCurrentUser();
      console.log("[AUTH] Get Current User Response:", response);
      // Handle response wrapper { success: true, data: user }
      const user = response?.success ? response.data : response;
      
      if (user && (user.id || user.uid)) {
        console.log("[AUTH] Valid User Found:", user);
        const mappedProfile = mapProfile(user);
        setProfile(mappedProfile);
        setActiveRoleState(mappedProfile.role as UserRole);
      } else {
        console.log("[AUTH] No Valid User Found or Session Expired");
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
      const result = await authService.register(data);
      if (result && result.user) {
        const mappedProfile = mapProfile(result.user);
        setProfile(mappedProfile);
        setActiveRoleState(mappedProfile.role as UserRole);
      } else {
        await initAuth();
      }
    } finally {
      setLoading(false);
    }
  };

  const socialAuth = async (data: any) => {
    setLoading(true);
    try {
      const result = await authService.socialAuth(data);
      if (result && result.user) {
        const mappedProfile = mapProfile(result.user);
        setProfile(mappedProfile);
        setActiveRoleState(mappedProfile.role as UserRole);
      } else {
        await initAuth();
      }
    } finally {
      setLoading(false);
    }
  };

  const setActiveRole = async (role: UserRole) => {
    if (!profile || activeRole === role) return;
    
    try {
      console.log(`[AUTH] Requesting role switch to: ${role}`);
      const { data: result } = await apiClient.post('/switch-role', { role });

      if (result.success) {
        console.log(`[AUTH] Role switched successfully to: ${role}`);
        setActiveRoleState(role);
        // Deep refresh of the profile to sync all flags (isAdmin, isStudent, etc.)
        setProfile(prev => prev ? { ...prev, ...result.data, role } : null);
      } else {
        console.error(`[AUTH] Server rejected role switch: ${result.error}`);
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
