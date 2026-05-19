import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { validateLoginInput, validateSignupInput } from '@/lib/auth-validation';
import {
  fetchUserProfile,
  firebaseLogin,
  firebaseLogout,
  firebaseSignup,
  firebaseUserToAppUser,
  getFirebaseIdToken,
} from '@/lib/firebase-auth';
import { auth, onAuthStateChanged } from '@/lib/firebase';
import type { SignupInput, User } from '@/types/user';

export type { SignupInput, User };

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUser(firebaseUserToAppUser(firebaseUser, profile));
      } catch {
        setUser(firebaseUserToAppUser(firebaseUser, null));
      } finally {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const validationError = validateLoginInput(email, password);
    if (validationError) {
      return { success: false as const, error: validationError };
    }
    const result = await firebaseLogin(email, password);
    if (result.success) {
      setUser(result.user);
      return { success: true as const };
    }
    return { success: false as const, error: result.error };
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const validationError = validateSignupInput(input);
    if (validationError) {
      return { success: false as const, error: validationError };
    }
    const result = await firebaseSignup(input);
    if (result.success) {
      setUser(result.user);
      return { success: true as const };
    }
    return { success: false as const, error: result.error };
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseLogout();
    } catch {
      /* ignore */
    } finally {
      setUser(null);
    }
  }, []);

  const isAuthenticated = useCallback(() => user !== null, [user]);
  const isOwner = useCallback(() => user !== null && user.role === 'owner', [user]);
  const getToken = useCallback(() => getFirebaseIdToken(), []);

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
