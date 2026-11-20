import { createContext, useCallback, useContext, useState } from 'react';
import api, { STORAGE_KEY } from '../api/client';

const Ctx = createContext(null);

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export const homeFor = (role) =>
  ({ ADMIN: '/admin', PROFESSOR: '/professor', STUDENT: '/student' }[role] ?? '/login');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(read);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  // Le backend ne renvoie pas de nouveau token , ca passe 
  const passwordChanged = useCallback(() => {
    setUser((u) => {
      const next = { ...u, mustChangePassword: false };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, login, logout, passwordChanged }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
