import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as fbUpdateProfile,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserProfile, getUserProfile } from '../lib/firestore';

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

function parseAuthError(code) {
  const map = {
    'auth/invalid-credential': 'Invalid email or password',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/popup-closed-by-user': 'Sign-in popup was closed',
    'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site',
    'auth/network-request-failed': 'Network error. Check your connection',
    'auth/operation-not-allowed': 'This sign-in method is not enabled',
  };
  return map[code] || 'An unexpected error occurred. Please try again';
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await fbUpdateProfile(cred.user, { displayName: name });
    const profile = await createUserProfile(cred.user.uid, {
      name,
      email,
      photoURL: cred.user.photoURL || '',
    });
    setUserProfile(profile);
    try {
      await sendEmailVerification(cred.user);
    } catch {
      // Email template may not be configured — non-critical
    }
    return cred.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await createUserProfile(cred.user.uid, {
      name: cred.user.displayName || '',
      email: cred.user.email,
      photoURL: cred.user.photoURL || '',
    });
    setUserProfile(profile);
    return cred.user;
  }, []);

  const googleLogin = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await createUserProfile(result.user.uid, {
      name: result.user.displayName || '',
      email: result.user.email,
      photoURL: result.user.photoURL || '',
    });
    setUserProfile(profile);
    return result.user;
  }, []);

  const forgotPassword = useCallback(async (email) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const profile = await getUserProfile(user.uid);
    setUserProfile(profile);
  }, [user]);

  const updateUserProfile = useCallback(async (data) => {
    if (!user) return;
    if (data.name || data.photoURL) {
      await fbUpdateProfile(user, {
        displayName: data.name || user.displayName,
        photoURL: data.photoURL || user.photoURL,
      });
    }
    await createUserProfile(user.uid, data);
    const profile = await getUserProfile(user.uid);
    setUserProfile(profile);
    return profile;
  }, [user]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  }, []);

  const resendVerification = useCallback(async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  }, [user]);

  const isEmailVerified = user?.emailVerified ?? false;

  const value = {
    user,
    userProfile,
    loading,
    isEmailVerified,
    register,
    login,
    googleLogin,
    forgotPassword,
    logout,
    updateUserProfile,
    refreshProfile,
    resendVerification,
    parseAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
