import { Platform } from 'react-native';

/** In-app storage: localStorage on web, in-memory on native (no extra native modules). */
const memory = new Map<string, string>();

export async function storageGetItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return memory.get(key) ?? null;
}

export async function storageSetItem(key: string, value: string): Promise<void> {
  memory.set(key, value);
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export async function storageRemoveItem(key: string): Promise<void> {
  memory.delete(key);
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}
