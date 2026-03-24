import React, { createContext, useContext, useState } from 'react';

interface PlatformData {
  enrollments: any[];
  contracts: any[];
  projects: any[];
  notifications: any[];
  stats: any;
  isOffline: boolean;
}

interface PlatformContextType {
  data: PlatformData;
  setData: React.Dispatch<React.SetStateAction<PlatformData>>;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PlatformData>({
    enrollments: [],
    contracts: [],
    projects: [],
    notifications: [],
    stats: {},
    isOffline: false
  });

  return (
    <PlatformContext.Provider value={{ data, setData }}>
      {children}
    </PlatformContext.Provider>
  );
}

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error('usePlatform must be used within a PlatformProvider');
  return context;
};
