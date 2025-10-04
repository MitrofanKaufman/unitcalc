import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000, // 5 секунд по умолчанию
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Автоматическое скрытие через duration, если не persistent
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      hideNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Компонент-контейнер для отображения уведомлений
const NotificationContainer: React.FC = () => {
  const { notifications, hideNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px'
    }}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Индивидуальный элемент уведомления
interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#e8f5e8'; // Зеленый
      case 'error': return '#ffebee';   // Красный
      case 'warning': return '#fff3e0'; // Оранжевый
      case 'info': return '#e3f2fd';    // Синий
      default: return '#e3f2fd';
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#4caf50'; // Зеленый
      case 'error': return '#f44336';   // Красный
      case 'warning': return '#ff9800'; // Оранжевый
      case 'info': return '#2196f3';    // Синий
      default: return '#2196f3';
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div
      style={{
        background: getBackgroundColor(notification.type),
        border: `2px solid ${getBorderColor(notification.type)}`,
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        minWidth: '250px',
        maxWidth: '350px'
      }}
      onClick={onClose}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <span style={{
          fontSize: '1.2em',
          flexShrink: 0
        }}>
          {getIcon(notification.type)}
        </span>

        <div style={{
          flex: 1,
          minWidth: 0
        }}>
          <div style={{
            fontWeight: 'bold',
            marginBottom: notification.message ? '4px' : '0',
            color: '#333',
            fontSize: '0.95em',
            wordBreak: 'break-word'
          }}>
            {notification.title}
          </div>

          {notification.message && (
            <div style={{
              color: '#666',
              fontSize: '0.85em',
              lineHeight: '1.3',
              wordBreak: 'break-word'
            }}>
              {notification.message}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2em',
            cursor: 'pointer',
            color: '#666',
            padding: '0',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};
