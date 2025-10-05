// Простая реализация NotificationProvider для решения проблем с типами
import React, { createContext, useContext } from 'react';

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {}
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children
}) => {
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // Простая реализация - можно заменить на более сложную логику уведомлений
    console.log(`Notification [${type}]: ${message}`);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
