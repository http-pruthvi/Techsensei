import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
const mockFirebase = {
  initializeApp: () => ({}),
  getAuth: () => ({}),
  getFirestore: () => ({}),
  getFunctions: () => ({}),
  getStorage: () => ({}),
};

// Mock Firebase modules
vi.mock('firebase/app', () => mockFirebase);
vi.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  connectAuthEmulator: () => {},
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  connectFirestoreEmulator: () => {},
}));
vi.mock('firebase/functions', () => ({
  getFunctions: () => ({}),
  connectFunctionsEmulator: () => {},
}));
vi.mock('firebase/storage', () => ({
  getStorage: () => ({}),
  connectStorageEmulator: () => {},
}));

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    DEV: true,
    VITE_FIREBASE_API_KEY: 'test-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'test-project',
    VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
    VITE_FIREBASE_APP_ID: '1:123456789:web:test',
  },
  writable: true,
});