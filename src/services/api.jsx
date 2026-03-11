import axios from 'axios';

// Убедись, что в .env файле VITE_API_BASE_URL=http://localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Перехватчик для токена
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок (401 - вылет на логин)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// === AUTH SERVICE (Port 8001) ===
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify'),
};

// === CORE SERVICE (Port 8002) ===
export const coreApi = {
  getAllThresholds: () => api.get('/core/thresholds'),
  updateThreshold: (sensorType, threshold) => api.post(`/core/thresholds/${sensorType}`, threshold),
  getAllFeatures: () => api.get('/core/features'),
  updateFeature: (flag) => api.post('/core/features', flag),
  getModelConfig: (modelId) => api.get(`/core/models/config/${modelId}`),
  updateModelConfig: (config) => api.post('/core/models/config', config),
};

// === SENSOR & ROOM SERVICES (Ports 8004, 8006, 8003) ===
export const sensorApi = {
  getMeasurements: () => api.get('/sensors'), // Будет проксироваться через шлюз
  getRoomStatus: () => api.get('/rooms/status'),
};

// === EVENT LOG SERVICE (Port 8008) ===
export const eventApi = {
  getEvents: () => api.get('/events'),
  updateEvent: (eventId, updates) => api.patch(`/events/${eventId}`, updates),
};

// === ML SERVICE (Port 8005) ===
export const mlApi = {
  healthCheck: () => api.get('/ml/health'),
  getPrediction: (data) => api.post('/ml/predict', data),
};