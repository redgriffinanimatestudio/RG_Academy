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
  const [devUser, setDevUser] = useState<any>(JSON.parse(localStorage.getItem('rg_dev_user') || 'null'));

  useEffect(() => {
    if (devUser) {
      const devProfile: UserProfile = {
        uid: devUser.id,
        email: devUser.email,
        displayName: devUser.displayName,
        photoURL: devUser.photoURL || 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
        roles: ['student', 'lecturer', 'client', 'executor', 'chief_manager', 'admin'],
        createdAt: new Date(devUser.createdAt) as any,
        updatedAt: new Date(devUser.updatedAt) as any
      };
      setProfile(devProfile);
      if (!activeRole) setActiveRoleState('admin');
      return;
    }

    if (user) {
      setProfileLoading(true);
      userService.getProfile(user.uid).then(async p => {
        let currentProfile = p;
        
        if (!currentProfile) {
          // Create a new profile if it doesn't exist
          await userService.createProfile(
            user.uid,
            user.email || '',
            user.displayName,
            user.photoURL
          );
          currentProfile = await userService.getProfile(user.uid);
        }

        if (currentProfile) {
          // For development purposes, we grant all roles to the user
          const allRoles: UserRole[] = ['student', 'lecturer', 'client', 'executor', 'chief_manager', 'admin'];
          const enhancedProfile = { 
            ...currentProfile, 
            roles: Array.from(new Set([...(currentProfile.roles || []), ...allRoles])) 
          };
          setProfile(enhancedProfile);
          
          if (!activeRole && enhancedProfile.roles.length > 0) {
            setActiveRoleState(enhancedProfile.roles[0]);
          }
        }
        setProfileLoading(false);
      }).catch(err => {
        console.error("Error fetching/creating profile:", err);
        setProfileLoading(false);
      });
    } else {
      setProfile(null);
      setActiveRoleState(null);
    }
  }, [user, devUser]);

  const loginAsGuest = async () => {
    try {
      const response = await fetch('/api/dev/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'dev@redgriffin.academy',
          displayName: 'Dev Administrator'
        })
      });
      const data = await response.json();
      localStorage.setItem('rg_dev_user', JSON.stringify(data));
      setDevUser(data);
    } catch (error) {
      console.error("Dev login failed:", error);
    }
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading: loading || profileLoading, 
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
