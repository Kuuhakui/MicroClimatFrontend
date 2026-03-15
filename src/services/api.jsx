import axios from 'axios';

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

// === AUTH SERVICE ===
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify'),
};

// === CORE SERVICE ===
export const coreApi = {
  getAllThresholds: () => api.get('/core/thresholds'),
  updateThreshold: (sensorType, threshold) => api.post(`/core/thresholds/${sensorType}`, threshold),
  getAllFeatures: () => api.get('/core/features'),
  updateFeature: (flag) => api.post('/core/features', flag),
  getModelConfig: (modelId) => api.get(`/core/models/config/${modelId}`),
  updateModelConfig: (config) => api.post('/core/models/config', config),
};

// === DATA STORAGE SERVICE ===
// Gateway: /data/sensors/ → http://data-storage-service:8003/data/sensors/
export const sensorApi = {
  getMeasurements: () => api.get('/data/sensors/'),
  getSensorById: (id) => api.get(`/data/sensors/${id}`),
};

// === ROOMS SERVICE ===
export const roomApi = {
  getRooms: () => api.get('/rooms/rooms/'),
  getRoom: (id) => api.get(`/rooms/rooms/${id}`),
};

// === EVENT LOG SERVICE ===
// Gateway: /events/ → event-log-service:8008/events/ ✅
export const eventApi = {
  getEvents: (limit = 100) => api.get(`/events/?skip=0&limit=${limit}`),
  createEvent: (event) => api.post('/events/', event),
};

// === ML SERVICE ===
// Gateway: /ml/health → ml-prediction-service:8005/ml/health ✅
export const mlApi = {
  healthCheck: () => api.get('/ml/health'),
  getPrediction: (data) => api.post('/ml/predict', data),
};

// === NOTIFICATIONS SERVICE ===
export const notifApi = {
  getStatus: () => api.get('/notifications/'),
};