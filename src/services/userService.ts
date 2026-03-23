import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export type UserRole = 
  | 'student' 
  | 'lecturer' 
  | 'client' 
  | 'executor' 
  | 'admin' 
  | 'manager' 
  | 'moderator' 
  | 'chief_manager'
  | 'hr'
  | 'finance'
  | 'support';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  roles: UserRole[];
  bio?: string;
  createdAt: any;
  updatedAt?: any;
  isAdmin?: boolean;
}

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  async createProfile(uid: string, email: string, displayName: string | null, photoURL: string | null): Promise<void> {
    const docRef = doc(db, 'users', uid);
    const profile: UserProfile = {
      uid,
      email,
      displayName,
      photoURL,
      roles: ['student'], // Default roles
      createdAt: serverTimestamp(),
    };
    await setDoc(docRef, profile);
  },

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
  },

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return this.getProfile(user.uid);
  },

  async getUsers(uids: string[]): Promise<UserProfile[]> {
    const profiles: UserProfile[] = [];
    for (const uid of uids) {
      const profile = await this.getProfile(uid);
      if (profile) profiles.push(profile);
    }
    return profiles;
  }
};
