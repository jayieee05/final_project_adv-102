import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { localLogin, localLogout, localSignup, localVerify } from '@/lib/local-auth';
import { storageGetItem, storageRemoveItem, storageSetItem } from '@/lib/storage';

export type User = {
  id?: string | number;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  city?: string;
  country?: string;
  address?: string;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  country?: string;
  address?: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (input: SignupInput) => Promise<{ success: boolean; error?: string }>;
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
        const savedUser = await storageGetItem(KEY_USER);
        if (savedUser) {
          setUser(JSON.parse(savedUser) as User);
        }
        const token = await storageGetItem(KEY_TOKEN);
        if (!token) {
          return;
        }
        const data = await localVerify(token);
        if (cancelled) return;
        if (data.success) {
          const u = { ...data.user, role: data.user.role ?? 'user' };
          setUser(u);
          await storageSetItem(KEY_USER, JSON.stringify(u));
        } else {
          await storageRemoveItem(KEY_TOKEN);
          await storageRemoveItem(KEY_USER);
          setUser(null);
        }
      } catch {
        if (!cancelled) {
          await storageRemoveItem(KEY_TOKEN);
          await storageRemoveItem(KEY_USER);
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
      const data = await localLogin(email, password);
      if (data.success) {
        await storageSetItem(KEY_TOKEN, data.token);
        await storageSetItem(KEY_USER, JSON.stringify(data.user));
        setUser(data.user);
        return { success: true as const };
      }
      return { success: false as const, error: data.error };
    } catch {
      return { success: false as const, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const { name, email, password, phone, city, country, address } = input;
    const profile = {
      phone: phone.trim(),
      city: city.trim(),
      ...(country?.trim() ? { country: country.trim() } : {}),
      ...(address?.trim() ? { address: address.trim() } : {}),
    };
    try {
      const data = await localSignup(name, email, password, profile);
      if (data.success) {
        const userWithProfile: User = { ...data.user, ...profile };
        await storageSetItem(KEY_TOKEN, data.token);
        await storageSetItem(KEY_USER, JSON.stringify(userWithProfile));
        setUser(userWithProfile);
        return { success: true as const };
      }
      return { success: false as const, error: data.error };
    } catch {
      return { success: false as const, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = await storageGetItem(KEY_TOKEN);
      if (token) {
        await localLogout(token);
      }
    } catch {
      /* ignore */
    } finally {
      await storageRemoveItem(KEY_TOKEN);
      await storageRemoveItem(KEY_USER);
      setUser(null);
    }
  }, []);

  const isAuthenticated = useCallback(() => user !== null, [user]);
  const isOwner = useCallback(() => user !== null && user.role === 'owner', [user]);
  const getToken = useCallback(() => storageGetItem(KEY_TOKEN), []);

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
