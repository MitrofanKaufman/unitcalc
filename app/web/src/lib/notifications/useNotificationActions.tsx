import { useNotifications } from './NotificationSystem';

export const useNotificationActions = () => {
  const { showNotification } = useNotifications();

  const showSuccess = (title: string, message?: string, duration?: number) => {
    showNotification({
      type: 'success',
      title,
      message,
      duration
    });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    showNotification({
      type: 'error',
      title,
      message,
      duration: duration || 8000 // Ошибки показываем дольше
    });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    showNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    showNotification({
      type: 'info',
      title,
      message,
      duration
    });
  };

  const showPersistent = (title: string, message?: string, type: Notification['type'] = 'info') => {
    showNotification({
      type,
      title,
      message,
      persistent: true // Не исчезает автоматически
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPersistent
  };
};
