import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DebugContextType {
  isDebugMode: boolean;
  toggleDebug: () => void;
  log: (message: string, data?: any) => void;
  error: (message: string, error?: Error) => void;
  warn: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

interface DebugProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({
  children,
  enabled = false // Временно отключено для сборки
}) => {
  const [isDebugMode, setIsDebugMode] = useState(enabled);

  // Логирование для диагностики
  useEffect(() => {
    console.log('🐛 DebugProvider initialized:', {
      enabled,
      isDebugMode,
      env: import.meta.env?.MODE,
      dev: import.meta.env?.DEV
    });
  }, []);

  const log = (message: string, data?: any) => {
    if (isDebugMode) {
      console.log(`🐛 [DEBUG] ${message}`, data || '');
    }
  };

  const error = (message: string, error?: Error) => {
    if (isDebugMode) {
      console.error(`❌ [ERROR] ${message}`, error || '');
    }
  };

  const warn = (message: string, data?: any) => {
    if (isDebugMode) {
      console.warn(`⚠️ [WARN] ${message}`, data || '');
    }
  };

  const info = (message: string, data?: any) => {
    if (isDebugMode) {
      console.info(`ℹ️ [INFO] ${message}`, data || '');
    }
  };

  const toggleDebug = () => {
    console.log('🐛 Toggling debug mode:', !isDebugMode);
    setIsDebugMode(prev => !prev);
  };

  const value: DebugContextType = {
    isDebugMode,
    toggleDebug,
    log,
    error,
    warn,
    info,
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
