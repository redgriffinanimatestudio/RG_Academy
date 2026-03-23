import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, serverTimestamp, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  executorId?: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  budget: number;
  tags: string[];
  createdAt: any;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate?: any;
  createdAt: any;
}

export interface Application {
  id: string;
  projectId: string;
  executorId: string;
  coverLetter: string;
  bid: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
}

export interface Contract {
  id: string;
  projectId: string;
  clientId: string;
  executorId: string;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'disputed';
  milestones: any[];
  createdAt: any;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  executorId: string;
  price: number;
  category: string;
  tags: string[];
  createdAt: any;
}

export const studioService = {
  async getProjects(status: 'open' | 'in-progress' | 'completed' | 'cancelled' = 'open'): Promise<Project[]> {
    const q = query(collection(db, 'projects'), where('status', '==', status));
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

  async getTasks(projectId: string): Promise<Task[]> {
    const q = query(collection(db, `projects/${projectId}/tasks`));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  },

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
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Contract;
    }
    return null;
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

  async updateContractStatus(contractId: string, status: Contract['status']): Promise<void> {
    const docRef = doc(db, 'contracts', contractId);
    await updateDoc(docRef, { status });
  },

  async updateMilestoneStatus(contractId: string, milestoneIndex: number, status: string): Promise<void> {
    const contract = await this.getContract(contractId);
    if (!contract) return;

    const updatedMilestones = [...contract.milestones];
    if (updatedMilestones[milestoneIndex]) {
      updatedMilestones[milestoneIndex].status = status;
      if (status === 'paid') {
        updatedMilestones[milestoneIndex].paidAt = new Date().toISOString();
      }
    }

    const docRef = doc(db, 'contracts', contractId);
    await updateDoc(docRef, { milestones: updatedMilestones });
  },

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
  }
};
