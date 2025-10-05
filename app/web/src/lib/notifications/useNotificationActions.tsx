import { useNotifications } from './NotificationProvider';
import type { Notification } from './NotificationProvider';

export const useNotificationActions = () => {
  const { addNotification } = useNotifications();

  const showSuccess = (title: string, _message?: string, duration?: number) => {
    addNotification(title, 'success', duration);
  };

  const showError = (title: string, _message?: string, duration?: number) => {
    addNotification(title, 'error', duration || 8000);
  };

  const showWarning = (title: string, _message?: string, duration?: number) => {
    addNotification(title, 'warning', duration);
  };

  const showInfo = (title: string, _message?: string, duration?: number) => {
    addNotification(title, 'info', duration);
  };

  const showPersistent = (title: string, _message?: string, type: Notification['type'] = 'info') => {
    addNotification(title, type, 0); // Duration 0 means persistent
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPersistent
  };
};
