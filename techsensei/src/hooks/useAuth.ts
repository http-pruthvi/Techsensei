import { useEffect, useState } from 'react';
import {
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GithubAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import type { User, UserProfile, UserPreferences, LearningProgress } from '../types';

export interface AuthError {
  code: string;
  message: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  contentPreference: 'visual' | 'textual' | 'mixed';
}

export interface SignInData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setLoading, setError } = useAppStore();
  const [initializing, setInitializing] = useState(true);

  // Sign up with email and password
  const signUp = async (data: SignUpData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: data.displayName
      });

      // Create user profile in Firestore with initial preferences
      const userData = {
        profile: {
          displayName: data.displayName,
          currentLevel: data.currentLevel,
          skillAreas: [],
          goals: []
        },
        preferences: {
          contentPreference: data.contentPreference,
          defaultLevel: data.currentLevel,
          notificationSettings: {
            email: true,
            push: false,
            learningReminders: true,
            weeklyProgress: true
          },
          themePreference: 'system' as const
        },
        progress: createDefaultProgress(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // The auth state change listener will handle setting the user
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const authError: AuthError = {
        code: firebaseError.code || 'auth/unknown-error',
        message: getAuthErrorMessage(firebaseError.code || '')
      };
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (data: SignInData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await signInWithEmailAndPassword(auth, data.email, data.password);
      // The auth state change listener will handle setting the user
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const authError: AuthError = {
        code: firebaseError.code || 'auth/unknown-error',
        message: getAuthErrorMessage(firebaseError.code || '')
      };
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with GitHub
  const signInWithGitHub = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const provider = new GithubAuthProvider();
      provider.addScope('repo');
      provider.addScope('read:user');

      await signInWithPopup(auth, provider);
      // The auth state change listener will handle setting the user
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const authError: AuthError = {
        code: firebaseError.code || 'auth/unknown-error',
        message: getAuthErrorMessage(firebaseError.code || '')
      };
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const authError: AuthError = {
        code: firebaseError.code || 'auth/unknown-error',
        message: getAuthErrorMessage(firebaseError.code || '')
      };
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const authError: AuthError = {
        code: firebaseError.code || 'auth/unknown-error',
        message: getAuthErrorMessage(firebaseError.code || '')
      };
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('No authenticated user');

    try {
      setLoading(true);

      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        profile: { ...user.profile, ...updates },
        updatedAt: new Date()
      });

      // Update local state
      setUser({
        ...user,
        profile: { ...user.profile, ...updates },
        updatedAt: new Date()
      });
    } catch (error: unknown) {
      setError('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user preferences
  const updateUserPreferences = async (updates: Partial<UserPreferences>): Promise<void> => {
    if (!user) throw new Error('No authenticated user');

    try {
      setLoading(true);

      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        preferences: { ...user.preferences, ...updates },
        updatedAt: new Date()
      });

      // Update local state
      setUser({
        ...user,
        preferences: { ...user.preferences, ...updates },
        updatedAt: new Date()
      });
    } catch (error: unknown) {
      setError('Failed to update preferences');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await convertFirebaseUser(firebaseUser);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error: unknown) {
        console.error('Auth state change error:', error);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    initializing,
    signUp,
    signIn,
    signInWithGitHub,
    signOut: signOutUser,
    resetPassword,
    updateUserProfile,
    updateUserPreferences
  };
};

// Helper functions moved outside component
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      // Create default user profile if it doesn't exist
      const defaultUser = await createUserProfile(firebaseUser);
      return defaultUser;
    }

    const userData = userDoc.data();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: firebaseUser.displayName || userData.profile?.displayName || '',
      profile: userData.profile || createDefaultProfile(),
      preferences: userData.preferences || createDefaultPreferences(),
      progress: userData.progress || createDefaultProgress(),
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error converting Firebase user:', error);
    // If Firestore fails (e.g. offline, permission denied), we should NOT return null
    // Returning null will cause the app to think the user is logged out and redirect to /login
    // Instead, we return a fallback user object so the user can at least access the app
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      profile: createDefaultProfile(),
      preferences: createDefaultPreferences(),
      progress: createDefaultProgress(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
};

const createUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
  const defaultProfile = createDefaultProfile();
  const defaultPreferences = createDefaultPreferences();
  const defaultProgress = createDefaultProgress();

  const userData = {
    profile: {
      ...defaultProfile,
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
    },
    preferences: defaultPreferences,
    progress: defaultProgress,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userData);

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    username: userData.profile.displayName,
    profile: userData.profile,
    preferences: userData.preferences,
    progress: userData.progress,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt
  };
};

const createDefaultProfile = (): UserProfile => ({
  displayName: '',
  currentLevel: 'beginner',
  skillAreas: [],
  goals: []
});

const createDefaultPreferences = (): UserPreferences => ({
  contentPreference: 'mixed',
  defaultLevel: 'beginner',
  notificationSettings: {
    email: true,
    push: false,
    learningReminders: true,
    weeklyProgress: true
  },
  themePreference: 'system'
});

const createDefaultProgress = (): LearningProgress => ({
  completedRoadmaps: [],
  currentRoadmaps: [],
  skillLevels: {},
  achievements: [],
  totalLearningTime: 0,
  streakDays: 0
});

// Get user-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};