import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
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

const AuthContext = createContext<AuthState & { signInWithGoogle: () => Promise<void>; signOut: () => Promise<void>; refetchOrg: () => Promise<void> }>(null as unknown as AuthState & { signInWithGoogle: () => Promise<void>; signOut: () => Promise<void>; refetchOrg: () => Promise<void> });

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
        signOut,
        refetchOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
