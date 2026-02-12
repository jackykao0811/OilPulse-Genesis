import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'HETU_PROFILE';

export interface PhysicianProfile {
  clinicName: string;
  bookingUrl: string;
  doctorSignature: string;
}

const defaultProfile: PhysicianProfile = {
  clinicName: '',
  bookingUrl: '',
  doctorSignature: '',
};

function loadProfile(): PhysicianProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PhysicianProfile>;
      return { ...defaultProfile, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...defaultProfile };
}

function saveProfile(profile: PhysicianProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

const ProfileContext = createContext<{
  profile: PhysicianProfile;
  setProfile: React.Dispatch<React.SetStateAction<PhysicianProfile>>;
  save: () => void;
} | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<PhysicianProfile>(loadProfile);

  const save = useCallback(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, save }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
