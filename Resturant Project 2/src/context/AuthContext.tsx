import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, signOutUser, handleFirestoreError, OperationType } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isStaffMode: boolean;
  setIsStaffMode: (val: boolean) => void;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isStaffMode, setIsStaffMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if user is the designated owner/admin: kazi18296@gmail.com
        const adminEmail = 'kazi18296@gmail.com';
        const isOwner = user.email?.toLowerCase() === adminEmail.toLowerCase();
        
        let hasAdminDoc = false;
        try {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminSnap = await getDoc(adminDocRef);
          hasAdminDoc = adminSnap.exists();
        } catch {
          // If unauthenticated or no admin doc exists, ignore
        }

        const userIsAdmin = isOwner || hasAdminDoc;
        setIsAdmin(userIsAdmin);

        // Sync or register user profile document
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Distinguished Guest',
            photoURL: user.photoURL || '',
            role: userIsAdmin ? 'admin' : 'customer',
            lastActive: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          // Non-blocking user sync
          console.warn('User profile sync note:', err);
        }
      } else {
        setIsAdmin(false);
        setIsStaffMode(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isStaffMode,
        setIsStaffMode,
        loading,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
