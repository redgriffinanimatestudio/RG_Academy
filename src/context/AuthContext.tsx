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
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALL_ROLES: UserRole[] = [
  'admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, fbLoading] = useAuthState(auth);
  
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
          roles: ALL_ROLES,
          createdAt: new Date(),
          isAdmin: true
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

  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfileFromBackend = async (uid: string) => {
    try {
      const response = await fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${uid}` }
      });
      
      if (response.ok) {
        const dbRes = await response.json();
        const dbUser = dbRes.data;
        
        const isAdmin = dbUser.role === 'admin' || dbUser.role === 'chief_manager' || dbUser.email === 'super@redgriffin.academy';
        let finalRoles: UserRole[] = isAdmin ? ALL_ROLES : (dbUser.roles || [dbUser.role || 'student']);

        const mappedProfile: UserProfile = {
          uid: dbUser.remoteId || dbUser.id,
          email: dbUser.email,
          displayName: dbUser.displayName,
          photoURL: dbUser.photoURL,
          roles: finalRoles,
          createdAt: dbUser.createdAt,
          isAdmin: isAdmin
        };

        setProfile(mappedProfile);
        
        const savedRole = localStorage.getItem(`rg_active_role_${mappedProfile.uid}`) as UserRole;
        setActiveRoleState(savedRole && finalRoles.includes(savedRole) ? savedRole : finalRoles[0]);
      } else {
        const firestoreProfile = await userService.getProfile(uid);
        if (firestoreProfile) {
          const isAdmin = firestoreProfile.roles?.includes('admin') || firestoreProfile.email === 'super@redgriffin.academy';
          let finalRoles = isAdmin ? ALL_ROLES : (firestoreProfile.roles || ['student']);
          
          const mappedProfile: UserProfile = {
            ...firestoreProfile,
            roles: finalRoles as UserRole[],
            isAdmin: isAdmin
          };
          
          setProfile(mappedProfile);
          const savedRole = localStorage.getItem(`rg_active_role_${mappedProfile.uid}`) as UserRole;
          setActiveRoleState(savedRole && finalRoles.includes(savedRole) ? savedRole : finalRoles[0]);
        }
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (localStorage.getItem('rg_dev_user')) {
        setProfileLoading(false);
        return;
      }

      if (!fbLoading) {
        if (fbUser) {
          await fetchProfileFromBackend(fbUser.uid);
        } else {
          setProfile(null);
          setActiveRoleState(null);
        }
        setProfileLoading(false);
      }
    };

    initAuth();
  }, [fbUser, fbLoading]);

  const refreshProfile = async () => {
    if (fbUser) await fetchProfileFromBackend(fbUser.uid);
  };

  const logout = async () => {
    const currentLang = window.location.pathname.split('/')[1] || 'eng';
    const uid = profile?.uid;
    localStorage.removeItem('rg_dev_user');
    localStorage.removeItem('rg_auth_active');
    if (uid) localStorage.removeItem(`rg_active_role_${uid}`);
    await auth.signOut();
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
      user: fbUser, 
      profile, 
      loading: profileLoading, 
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
