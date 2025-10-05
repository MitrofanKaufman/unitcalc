import React, { createContext, useContext, ReactNode, useCallback, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  title?: string;
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  defaultDuration?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  defaultDuration = 5000,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = 'info', duration: number = defaultDuration) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = { id, message, type, duration };

      setNotifications((prev: Notification[]) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [defaultDuration]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev: Notification[]) => prev.filter((n: Notification) => n.id !== id));
  }, []);

  const showNotification = useCallback((notificationData: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = { id, ...notificationData };

    setNotifications((prev: Notification[]) => [...prev, notification]);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  }, []);

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
