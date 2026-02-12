import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Clinic {
  id: string;
  name: string;
  audience: number;
  visits: number;
  staff: string[];
}

const MOCK_CLINICS: Clinic[] = [
  { id: 'tpe', name: '台北大安總院', audience: 1240, visits: 12, staff: ['Alice', 'Bob'] },
  { id: 'khh', name: '高雄分院', audience: 850, visits: 3, staff: ['Alice'] },
];

type ClinicContextValue = {
  clinics: Clinic[];
  currentClinic: Clinic;
  switchClinic: (id: string) => void;
  isStaff: boolean;
};

const ClinicContext = createContext<ClinicContextValue | null>(null);

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [currentId, setCurrentId] = useState<string>('tpe');
  const currentClinic = MOCK_CLINICS.find((c) => c.id === currentId) ?? MOCK_CLINICS[0];
  const isStaff = false;

  const switchClinic = useCallback((id: string) => {
    if (MOCK_CLINICS.some((c) => c.id === id)) setCurrentId(id);
  }, []);

  return (
    <ClinicContext.Provider
      value={{
        clinics: MOCK_CLINICS,
        currentClinic,
        switchClinic,
        isStaff,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error('useClinic must be used within ClinicProvider');
  return ctx;
}
