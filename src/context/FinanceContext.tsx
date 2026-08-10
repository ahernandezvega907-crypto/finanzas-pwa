// src/context/FinanceContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface FinanceContextType {
  isSyncing: boolean;
  refreshData: () => Promise<void>;
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Usamos 'user' en lugar de 'isAuthenticated'
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const refreshData = async () => {
    if (!user) return; // Si no hay usuario, cancelamos la sincronización
    setIsSyncing(true);
    // Simulación de retraso de red para la PWA
    await new Promise((resolve) => setTimeout(resolve, 800)); 
    setIsSyncing(false);
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  return (
    <FinanceContext.Provider value={{ isSyncing, refreshData }}>
      {children}
    </FinanceContext.Provider>
  );
};