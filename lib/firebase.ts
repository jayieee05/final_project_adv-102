import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import {
  type Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyDsr1fkLCuXMVNAZtgFbN2K-qSr5UB2M7Q',
  authDomain: 'jewelryshopadv102.firebaseapp.com',
  projectId: 'jewelryshopadv102',
  storageBucket: 'jewelryshopadv102.firebasestorage.app',
  messagingSenderId: '294427608703',
  appId: '1:294427608703:web:c56bcea390d9245799214a',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;

function createAuth(): Auth {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
export { onAuthStateChanged };
