import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const metaEnv = typeof import.meta !== 'undefined' ? ((import.meta as unknown as { env?: Record<string, string> }).env || {}) : {};

// Support both AI Studio JSON configuration and Vercel/Production Vite env variables
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey || '',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain || '',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId || '',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket || '',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId || '',
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId || '',
};

const customDatabaseId = 
  metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID || 
  metaEnv.VITE_FIREBASE_FIRESTORE_ID ||
  firebaseConfigJson.firestoreDatabaseId || 
  '(default)';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if configured
export const db: Firestore = customDatabaseId && customDatabaseId !== '(default)'
  ? getFirestore(app, customDatabaseId)
  : getFirestore(app);

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId);
export const activeProjectId = firebaseConfig.projectId;
export const activeDatabaseId = customDatabaseId;

