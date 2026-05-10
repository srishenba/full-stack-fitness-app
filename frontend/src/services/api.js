import axios from 'axios';
import { API_URL } from '../config/api'; // ✅ FIX

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let hooks = {
  getToken: () => localStorage.getItem('token'),
  onUnauthorized: () => {},
  beginLoading: () => {},
  endLoading: () => {},
};

export function setApiHooks(next) {
  hooks = { ...hooks, ...next };
}

function isAuthRequest(url) {
  if (!url) return false;
  const s = String(url);
  return (
    s.includes('/api/auth/signin') ||
    s.includes('/api/auth/signup') ||
    s.includes('/api/auth/login')
  );
}

api.interceptors.request.use((config) => {
  hooks.beginLoading();
  const token = hooks.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    hooks.endLoading();
    return response;
  },
  (error) => {
    hooks.endLoading();
    const status = error.response?.status;
    const url = error.config?.url || '';

    if (status === 401 && !isAuthRequest(url)) {
      hooks.onUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;