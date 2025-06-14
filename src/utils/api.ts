// src/api/api.ts
import axios from 'axios';

const env = import.meta.env.VITE_ACTIVE_ENV;

let baseURL = '';

switch (env) {
  case 'local':
    baseURL = import.meta.env.VITE_LOCAL_SERVER_API;
    break;
  case 'tunnel':
    baseURL = import.meta.env.VITE_TUNNEL_SERVER_API;
    break;
  case 'prod':
    baseURL = import.meta.env.VITE_PROD_SERVER_API;
    break;
  default:
    baseURL = import.meta.env.VITE_LOCAL_SERVER_API;
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};