import apiClient from './apiClient';

export interface Annotation {
  id: string;
  sessionId: string;
  authorId: string;
  author: {
    displayName: string;
    photoURL?: string;
  };
  type: 'point' | 'rect' | 'draw';
  data: string; // JSON string
  timestamp?: number;
  createdAt: string;
}

export interface ReviewSession {
  id: string;
  projectId: string;
  taskId?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  status: 'active' | 'closed';
  annotations: Annotation[];
  createdAt: string;
}

export const reviewService = {
  // 1. Get or Create Session
  async getOrCreateSession(params: {
    projectId: string;
    taskId?: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
  }): Promise<ReviewSession> {
    const { data } = await apiClient.post('/v1/review/sessions', params);
    return data.success ? data.data : null;
  },

  // 2. Add Annotation
  async addAnnotation(params: {
    sessionId: string;
    type: 'point' | 'rect' | 'draw';
    data: any; // { x, y, text }
    timestamp?: number;
  }): Promise<Annotation> {
    const { data } = await apiClient.post('/v1/review/annotations', params);
    return data.success ? data.data : null;
  },

  // 3. Get Session Annotations
  async getAnnotations(sessionId: string): Promise<Annotation[]> {
    const { data } = await apiClient.get(`/v1/review/sessions/${sessionId}/annotations`);
    return data.success ? data.data : [];
  },

  // 4. Close Session
  async closeSession(sessionId: string): Promise<ReviewSession> {
    const { data } = await apiClient.patch(`/v1/review/sessions/${sessionId}/close`);
    return data.success ? data.data : null;
  }
};
