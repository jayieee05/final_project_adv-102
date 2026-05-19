import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import type { SignupInput, User } from '@/types/user';
import { auth, db } from '@/lib/firebase';

const USERS_COLLECTION = 'users';
const OWNER_EMAIL = 'owner@finesse.com';

export type UserProfile = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  address?: string;
  role?: string;
};

export function mapFirebaseAuthError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again';
    default:
      return 'Something went wrong. Please try again.';
  }
}

function roleForEmail(email: string): string {
  return email.toLowerCase().trim() === OWNER_EMAIL ? 'owner' : 'user';
}

export function firebaseUserToAppUser(fbUser: FirebaseUser, profile: UserProfile | null): User {
  const email = fbUser.email ?? profile?.email ?? '';
  return {
    id: fbUser.uid,
    name: profile?.name ?? fbUser.displayName ?? email.split('@')[0] ?? 'User',
    email,
    role: profile?.role ?? roleForEmail(email),
    phone: profile?.phone,
    city: profile?.city,
    country: profile?.country,
    address: profile?.address,
  };
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function firebaseLogin(
  email: string,
  password: string,
): Promise<{ success: true; user: User } | { success: false; error: string }> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await fetchUserProfile(credential.user.uid);
    return { success: true, user: firebaseUserToAppUser(credential.user, profile) };
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
    return { success: false, error: mapFirebaseAuthError(code) };
  }
}

export async function firebaseSignup(
  input: SignupInput,
): Promise<{ success: true; user: User } | { success: false; error: string }> {
  const { name, email, password, phone, city, country, address } = input;
  const normalizedEmail = email.trim().toLowerCase();
  const profile: UserProfile = {
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    city: city.trim(),
    role: roleForEmail(normalizedEmail),
    ...(country?.trim() ? { country: country.trim() } : {}),
    ...(address?.trim() ? { address: address.trim() } : {}),
  };

  try {
    const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    await updateProfile(credential.user, { displayName: profile.name });
    await setDoc(doc(db, USERS_COLLECTION, credential.user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
    });
    return { success: true, user: firebaseUserToAppUser(credential.user, profile) };
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
    return { success: false, error: mapFirebaseAuthError(code) };
  }
}

export async function firebaseLogout(): Promise<void> {
  await signOut(auth);
}

export async function getFirebaseIdToken(): Promise<string | null> {
  const current = auth.currentUser;
  if (!current) return null;
  return current.getIdToken();
}
