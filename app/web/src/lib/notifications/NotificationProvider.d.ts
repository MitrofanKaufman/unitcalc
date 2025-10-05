import React, { ReactNode } from 'react';
type NotificationType = 'success' | 'error' | 'info' | 'warning';
interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}
interface NotificationContextType {
    notifications: Notification[];
    addNotification: (message: string, type?: NotificationType, duration?: number) => void;
    removeNotification: (id: string) => void;
}
export declare const useNotifications: () => NotificationContextType;
interface NotificationProviderProps {
    children: ReactNode;
    defaultDuration?: number;
}
export declare const NotificationProvider: React.FC<NotificationProviderProps>;
export {};
