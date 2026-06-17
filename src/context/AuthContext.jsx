import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  profileLogin, profileSignup, forgotPassword,
  setSession, clearSession, getStoredToken, getStoredUser,
} from '../config/api.js';

/**
 * Auth for the Profilo builder — backed by the ISOLATED profile_users system
 * (separate from the main app's auth). Persists token + user in localStorage and
 * keeps tabs in sync.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount.
  useEffect(() => {
    if (getStoredToken()) setUser(getStoredUser());
    setLoading(false);
  }, []);

  // Cross-tab sync (login/logout in another tab).
  useEffect(() => {
    function onStorage(e) {
      if (e.key !== 'profilo_token') return;
      setUser(e.newValue ? getStoredUser() : null);
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(async (username, password) => {
    const { token, user: u } = await profileLogin(username, password);
    setSession(token, u);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async ({ username, password, otp, email, name }) => {
    const { token, user: u } = await profileSignup(username, password, otp, { email, name });
    setSession(token, u);
    setUser(u);
    return u;
  }, []);

  const resetPassword = useCallback(
    (username, otp, newPassword) => forgotPassword(username, otp, newPassword),
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, signup, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
