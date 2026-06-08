import axios from 'axios';

const normalizeApiUrl = (url) => {
  if (!url || url === '/api') return '/api';

  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const resolveApiUrl = () => {
  // Production uses same-origin /api (proxied to Render via vercel.json) — avoids CORS entirely.
  if (import.meta.env.PROD) return '/api';

  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return normalizeApiUrl(envUrl);

  return '/api';
};

const API_URL = resolveApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getBelowPrice: (price) => api.get(`/products/price/below/${price}`),
  getAboveRating: (rating) => api.get(`/products/rating/above/${rating}`),
};

export default api;
