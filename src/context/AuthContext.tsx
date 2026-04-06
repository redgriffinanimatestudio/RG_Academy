import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  login: (login: string, pass: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  socialAuth: (data: any) => Promise<any>;
  onboard: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

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
      isOnboarded: dbUser.isOnboarded, // v2.29 Legal Protocol flag
      bio: dbUser.profile?.bio,
      country: dbUser.profile?.country,
      citizenship: dbUser.profile?.citizenship,
      linkedInUrl: dbUser.profile?.linkedInUrl,
      telegramHandle: dbUser.profile?.telegramHandle,
      portfolioUrl: dbUser.profile?.portfolioUrl,
      gender: dbUser.profile?.gender,
      dateOfBirth: dbUser.profile?.dateOfBirth,
      registrationStatus: dbUser.registrationStatus,
      selectedPath: dbUser.selectedPath,
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
    if (initialized.current) return;
    initialized.current = true;
    initAuth();
  }, []);

  const refreshProfile = async () => {
    await initAuth();
  };

  const logout = async () => {
    console.log("[AUTH] Logging out...");
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout request failed, proceeding to clear local state anyway.");
    }
    setProfile(null);
    setActiveRoleState(null);
    // Force a full clean reload to the login page
    sessionStorage.clear();
    localStorage.removeItem('rg_auth_session'); 
    
    // Extract lang from current path or default to eng
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentLang = (pathParts.length > 0 && pathParts[0].length === 3) ? pathParts[0] : 'eng';
    
    window.location.href = `/aca/${currentLang}/login`;
  };

  const login = async (loginStr: string, pass: string) => {
    setLoading(true);
    try {
      const result = await authService.login(loginStr, pass);
      await initAuth();
      return result;
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
        return result;
      } else {
        await initAuth();
        return null;
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
        return result;
      } else {
        await initAuth();
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  const onboard = async (data: any) => {
    setLoading(true);
    try {
      const result = await authService.onboard(data);
      if (result && result.user) {
        const mappedProfile = mapProfile(result.user);
        setProfile(mappedProfile);
        setActiveRoleState(mappedProfile.role as UserRole);
        return result;
      } else {
        await initAuth();
        return null;
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
      socialAuth,
      onboard
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
