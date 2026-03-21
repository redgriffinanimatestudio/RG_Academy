import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp, 
  addDoc, 
  orderBy, 
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Connection {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Timestamp;
}

export type FeedEventType = 
  | 'follow' 
  | 'mention' 
  | 'portfolio_view' 
  | 'new_connection' 
  | 'project_posted' 
  | 'course_completed';

export interface FeedEvent {
  id: string;
  actorId: string;
  type: FeedEventType;
  refId: string; // ID of the related entity (project, course, profile)
  payload: any;
  createdAt: Timestamp;
}

export interface SearchIndex {
  userId: string;
  skills: string[];
  location: string;
  role: string;
  updatedAt: Timestamp;
}

export const networkingService = {
  // --- Connections Module ---
  async follow(followerId: string, followingId: string): Promise<void> {
    const connectionId = `${followerId}_${followingId}`;
    await setDoc(doc(db, 'connections', connectionId), {
      followerId,
      followingId,
      createdAt: serverTimestamp(),
    });
    
    // Track activity
    await this.trackActivity({
      actorId: followerId,
      type: 'follow',
      refId: followingId,
      payload: { followingId },
    });
  },

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const connectionId = `${followerId}_${followingId}`;
    await deleteDoc(doc(db, 'connections', connectionId));
  },

  async getFollowers(userId: string): Promise<string[]> {
    const q = query(collection(db, 'connections'), where('followingId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => (doc.data() as Connection).followerId);
  },

  async getFollowing(userId: string): Promise<string[]> {
    const q = query(collection(db, 'connections'), where('followerId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => (doc.data() as Connection).followingId);
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const connectionId = `${followerId}_${followingId}`;
    const docSnap = await getDoc(doc(db, 'connections', connectionId));
    return docSnap.exists();
  },

  // --- Feed Module ---
  async trackActivity(event: Omit<FeedEvent, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'feed_events'), {
      ...event,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getActivityFeed(userId: string, limitCount: number = 20): Promise<FeedEvent[]> {
    // In a real app with "Fan-out", we'd fetch from a pre-computed feed.
    // For now, we fetch events from people the user follows.
    const following = await this.getFollowing(userId);
    if (following.length === 0) return [];

    const q = query(
      collection(db, 'feed_events'),
      where('actorId', 'in', following),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedEvent));
  },

  // --- Discovery Module ---
  async searchProfiles(filters: { skills?: string[], role?: string, location?: string }): Promise<SearchIndex[]> {
    let q = query(collection(db, 'search_index'));
    
    if (filters.role) {
      q = query(q, where('role', '==', filters.role));
    }
    if (filters.location) {
      q = query(q, where('location', '==', filters.location));
    }
    // Note: Firestore has limitations on array-contains with multiple values or other filters.
    // Real search would use Algolia or ElasticSearch.
    
    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map(doc => doc.data() as SearchIndex);
    
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(profile => 
        filters.skills!.every(skill => profile.skills.includes(skill))
      );
    }
    
    return results;
  },

  async getRecommendations(userId: string): Promise<SearchIndex[]> {
    // Mock recommendations: just return latest profiles not followed
    const following = await this.getFollowing(userId);
    const q = query(collection(db, 'search_index'), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => doc.data() as SearchIndex)
      .filter(profile => profile.userId !== userId && !following.includes(profile.userId));
  }
};
