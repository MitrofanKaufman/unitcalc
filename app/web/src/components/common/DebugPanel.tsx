// Простая реализация DebugPanel для решения проблем с типами
import React, { createContext, useContext } from 'react';

interface DebugContextType {
  enabled: boolean;
}

const DebugContext = createContext<DebugContextType>({ enabled: false });

interface DebugProviderProps {
  enabled?: boolean;
  children: React.ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({
  enabled = false,
  children
}) => {
  return (
    <DebugContext.Provider value={{ enabled }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => useContext(DebugContext);
