import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10s timeout to prevent Initializing hang
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
