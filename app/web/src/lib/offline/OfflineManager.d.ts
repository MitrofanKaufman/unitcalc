import React from 'react';
interface OfflineContextType {
    isOnline: boolean;
    isOfflineMode: boolean;
    syncStatus: 'idle' | 'syncing' | 'error';
    lastSyncTime: Date | null;
    pendingChanges: number;
    queueSize: number;
    forceSync: () => Promise<void>;
    clearCache: () => Promise<void>;
}
interface OfflineManagerProps {
    children: React.ReactNode;
}
export declare const OfflineManager: React.FC<OfflineManagerProps>;
export declare const useOffline: () => OfflineContextType;
export {};
