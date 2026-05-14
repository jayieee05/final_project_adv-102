import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { API_URL } from '@/config/api';

export type User = {
  id?: string | number;
  name: string;
  email: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  isOwner: () => boolean;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const KEY_TOKEN = 'finesse_token';
const KEY_USER = 'finesse_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem(KEY_USER);
        if (savedUser) {
          setUser(JSON.parse(savedUser) as User);
        }
        const token = await AsyncStorage.getItem(KEY_TOKEN);
        if (!token) {
          setIsLoading(false);
          return;
        }
        const response = await fetch(`${API_URL}/auth/verify`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = (await response.json()) as {
          success?: boolean;
          user?: User;
        };
        if (cancelled) return;
        if (data.success && data.user) {
          const u = { ...data.user, role: data.user.role ?? 'user' };
          setUser(u);
          await AsyncStorage.setItem(KEY_USER, JSON.stringify(u));
        } else {
          await AsyncStorage.removeItem(KEY_TOKEN);
          await AsyncStorage.removeItem(KEY_USER);
          setUser(null);
        }
      } catch {
        if (!cancelled) {
          await AsyncStorage.removeItem(KEY_TOKEN);
          await AsyncStorage.removeItem(KEY_USER);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        user?: User;
        token?: string;
        error?: string;
      };
      if (data.success && data.user && data.token) {
        await AsyncStorage.setItem(KEY_TOKEN, data.token);
        await AsyncStorage.setItem(KEY_USER, JSON.stringify(data.user));
        setUser(data.user);
        return { success: true as const };
      }
      return { success: false as const, error: data.error ?? 'Login failed' };
    } catch {
      return { success: false as const, error: 'Network error. Please try again.' };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        user?: User;
        token?: string;
        error?: string;
      };
      if (data.success && data.user && data.token) {
        await AsyncStorage.setItem(KEY_TOKEN, data.token);
        await AsyncStorage.setItem(KEY_USER, JSON.stringify(data.user));
        setUser(data.user);
        return { success: true as const };
      }
      return { success: false as const, error: data.error ?? 'Signup failed' };
    } catch {
      return { success: false as const, error: 'Network error. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(KEY_TOKEN);
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch {
      /* ignore */
    } finally {
      await AsyncStorage.removeItem(KEY_TOKEN);
      await AsyncStorage.removeItem(KEY_USER);
      setUser(null);
    }
  }, []);

  const isAuthenticated = useCallback(() => user !== null, [user]);
  const isOwner = useCallback(() => user !== null && user.role === 'owner', [user]);
  const getToken = useCallback(() => AsyncStorage.getItem(KEY_TOKEN), []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated,
      isOwner,
      getToken,
    }),
    [user, isLoading, login, signup, logout, isAuthenticated, isOwner, getToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
