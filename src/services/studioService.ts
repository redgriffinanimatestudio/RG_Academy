import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, serverTimestamp, addDoc, orderBy, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  executorId?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  urgency: 'urgent' | 'normal';
  budget: number;
  tags: string[];
  participants: string[]; // uids
  createdAt: Timestamp;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assigneeId: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: Timestamp | null;
  files: string[]; // URLs
  createdAt: Timestamp;
}

export interface Application {
  id: string;
  projectId: string;
  executorId: string;
  coverLetter: string;
  bid: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}

export interface Contract {
  id: string;
  projectId: string;
  clientId: string;
  executorId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'active' | 'completed' | 'disputed' | 'refunded';
  milestones: {
    id: string;
    title: string;
    amount: number;
    status: 'pending' | 'released';
  }[];
  stripePaymentIntentId?: string;
  createdAt: Timestamp;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  executorId: string;
  price: number;
  category: string;
  tags: string[];
  rating: number;
  createdAt: Timestamp;
}

export interface FileAsset {
  id: string;
  refId: string; // Project or Task ID
  name: string;
  url: string;
  type: string; // psd, mp4, zip, etc.
  size: number;
  uploadedBy: string;
  createdAt: Timestamp;
}

export const studioService = {
  // --- Projects Module ---
  async getProjects(filters?: { status?: string, urgency?: string }): Promise<Project[]> {
    let q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    if (filters?.status) q = query(q, where('status', '==', filters.status));
    if (filters?.urgency) q = query(q, where('urgency', '==', filters.urgency));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  },

  async getProject(projectId: string): Promise<Project | null> {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  },

  async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...project,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // --- Tasks Module ---
  async getTasks(projectId: string): Promise<Task[]> {
    const q = query(collection(db, `projects/${projectId}/tasks`), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  },

  async updateTask(projectId: string, taskId: string, data: Partial<Task>): Promise<void> {
    const docRef = doc(db, `projects/${projectId}/tasks`, taskId);
    await updateDoc(docRef, data);
  },

  // --- Services Module ---
  async getServices(category?: string): Promise<Service[]> {
    const q = category 
      ? query(collection(db, 'services'), where('category', '==', category), orderBy('createdAt', 'desc'))
      : query(collection(db, 'services'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  },

  async createService(service: Omit<Service, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'services'), {
      ...service,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // --- Applications Module ---
  async applyToProject(application: Omit<Application, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, `projects/${application.projectId}/applications`), {
      ...application,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getApplications(projectId: string): Promise<Application[]> {
    const q = query(collection(db, `projects/${projectId}/applications`));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
  },

  // --- Contracts Module ---
  async createContract(contract: Omit<Contract, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'contracts'), {
      ...contract,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getContract(contractId: string): Promise<Contract | null> {
    const docRef = doc(db, 'contracts', contractId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Contract) : null;
  },

  async getContracts(userId: string, role: 'client' | 'executor'): Promise<Contract[]> {
    const q = query(
      collection(db, 'contracts'),
      where(role === 'client' ? 'clientId' : 'executorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contract));
  },

  // --- Files Module ---
  async uploadFileAsset(asset: Omit<FileAsset, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'assets'), {
      ...asset,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getFiles(refId: string): Promise<FileAsset[]> {
    const q = query(collection(db, 'assets'), where('refId', '==', refId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FileAsset));
  }
};
