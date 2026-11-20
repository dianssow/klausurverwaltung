import axios from 'axios';

export const STORAGE_KEY = 'klausur_auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Ajoute le token JWT à chaque requête
api.interceptors.request.use((cfg) => {
  try {
    const auth = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (auth?.token) cfg.headers.Authorization = `Bearer ${auth.token}`;
  } catch {
  }
  return cfg;
});



export const get = (url) => api.get(url).then((r) => r.data);
export default api;
