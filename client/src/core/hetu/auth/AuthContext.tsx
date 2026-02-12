import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app } from '../legacy/firebase';

function FirebaseUnavailable() {
  return (
    <div style={{ fontFamily: "'Noto Serif TC', serif", padding: 24, textAlign: 'center', color: '#1A434E' }}>
      Firebase 未初始化，請檢查 .env 設定。
    </div>
  );
}

export interface AuthState {
  user: User | null;
  orgId: string | null;
  loading: boolean;
  error: string | null;
}

type AuthActions = {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refetchOrg: () => Promise<void>;
};
const AuthContext = createContext<AuthState & AuthActions>(null as unknown as AuthState & AuthActions);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchOrg = async () => {
    if (!user) return;
    const ensureOrgForUser = httpsCallable<Record<string, never>, { org_id: string }>(
      getFunctions(app!),
      'ensureOrgForUser'
    );
    try {
      const res = await ensureOrgForUser();
      const data = res.data as { org_id?: string };
      if (data?.org_id) setOrgId(data.org_id);
    } catch {
      setOrgId(null);
    }
  };

  useEffect(() => {
    if (!app || !auth) return;
    const ensureOrgForUser = httpsCallable<Record<string, never>, { org_id: string }>(
      getFunctions(app!),
      'ensureOrgForUser'
    );
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setError(null);
      if (!u) {
        setOrgId(null);
        setLoading(false);
        return;
      }
      try {
        const res = await ensureOrgForUser();
        const data = res.data as { org_id?: string };
        setOrgId(data?.org_id ?? null);
      } catch (e) {
        setError((e as Error).message);
        setOrgId(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth!, provider);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth!, email.trim(), password);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth!, email.trim(), password);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      setOrgId(null);
    }
  };

  if (!app || !auth) {
    return <FirebaseUnavailable />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        orgId,
        loading,
        error,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refetchOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
