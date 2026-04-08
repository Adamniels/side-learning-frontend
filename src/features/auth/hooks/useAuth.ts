import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../api';
import { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ id: string; name?: string } | null>(null);

  // Helper to parse JWT
  const getUserFromToken = (token: string | null) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub || payload.nameid,
        name: payload.name || payload.email
      };
    } catch {
      return null;
    }
  };

  // Sync auth state on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    setIsAuthenticated(!!token);
    setUser(getUserFromToken(token));
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const resp = await authApi.login(data);
      if (resp && resp.accessToken) {
         localStorage.setItem('accessToken', resp.accessToken);
         setUser(getUserFromToken(resp.accessToken));
      }
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const resp = await authApi.register(data);
      if (resp && resp.accessToken) {
         localStorage.setItem('accessToken', resp.accessToken);
         setUser(getUserFromToken(resp.accessToken));
      }
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
  };
};
