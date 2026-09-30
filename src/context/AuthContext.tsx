import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthModal } from '../components/AuthModal';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
  company?: string;
  role?: string;
  createdAt?: unknown;
  lastLoginAt?: unknown;
}

export interface InitialAuthData {
  email?: string;
  name?: string;
  phone?: string;
  company?: string;
}

// Mock User type to replace firebase/auth User
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  initialAuthData?: InitialAuthData;
  openAuthModal: (mode?: 'signin' | 'signup', data?: InitialAuthData) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string, company?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [initialAuthData, setInitialAuthData] = useState<InitialAuthData | undefined>(undefined);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signup', data?: InitialAuthData) => {
    setAuthModalMode(mode);
    setInitialAuthData(data);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Sync user profile locally without Firestore data storage
  const syncUserProfile = async (localUser: User, extraData?: { name?: string; phone?: string; company?: string }) => {
    try {
      const stored = localStorage.getItem(`rudransh_profile_${localUser.uid}`);
      let existing: Partial<UserProfile> = {};
      if (stored) {
        try {
          existing = JSON.parse(stored);
        } catch {
          // ignore
        }
      }

      const profile: UserProfile = {
        uid: localUser.uid,
        email: localUser.email,
        displayName: extraData?.name || existing.displayName || localUser.displayName || 'Applicant',
        photoURL: localUser.photoURL || null,
        phone: extraData?.phone || existing.phone || '',
        company: extraData?.company || existing.company || '',
        role: 'applicant',
        lastLoginAt: new Date().toISOString(),
      };

      localStorage.setItem(`rudransh_profile_${localUser.uid}`, JSON.stringify(profile));
      setUserProfile(profile);
    } catch (err) {
      console.warn('Error saving local profile:', err);
      setUserProfile({
        uid: localUser.uid,
        email: localUser.email,
        displayName: extraData?.name || localUser.displayName || 'Applicant',
        photoURL: localUser.photoURL || null,
        phone: extraData?.phone || '',
        company: extraData?.company || '',
        role: 'applicant',
      });
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return;
    const stored = localStorage.getItem(`rudransh_profile_${user.uid}`);
    if (stored) {
      try {
        setUserProfile(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    // Mock onAuthStateChanged check local storage
    const storedUser = localStorage.getItem('mock_auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        syncUserProfile(parsedUser);
      } catch {
        setUser(null);
        setUserProfile(null);
      }
    } else {
      setUser(null);
      setUserProfile(null);
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    // Mock Google Sign-In
    const mockUser: User = {
      uid: 'google_mock_uid_123',
      email: 'mockuser@gmail.com',
      displayName: 'Mock Google User',
      photoURL: null,
    };
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
    await syncUserProfile(mockUser);
    closeAuthModal();
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const emailToUse = email.trim();
    // Mock email sign-in (accepts any email/pass for demo)
    const mockUser: User = {
      uid: `email_mock_${btoa(emailToUse)}`,
      email: emailToUse,
      displayName: emailToUse.split('@')[0],
      photoURL: null,
    };
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
    await syncUserProfile(mockUser);
    closeAuthModal();
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    phone?: string,
    company?: string
  ) => {
    const emailToUse = email.trim();
    const mockUser: User = {
      uid: `email_mock_${btoa(emailToUse)}`,
      email: emailToUse,
      displayName: name,
      photoURL: null,
    };
    localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
    await syncUserProfile(mockUser, { name, phone, company });
    closeAuthModal();
  };

  const signOutUser = async () => {
    localStorage.removeItem('mock_auth_user');
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authModalOpen,
        authModalMode,
        initialAuthData,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        refreshUserProfile,
      }}
    >
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
