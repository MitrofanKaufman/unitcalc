import React, { ReactNode } from 'react';
interface DebugContextType {
    isDebugMode: boolean;
    toggleDebug: () => void;
    log: (message: string, data?: any) => void;
    error: (message: string, error?: Error) => void;
    warn: (message: string, data?: any) => void;
    info: (message: string, data?: any) => void;
}
interface DebugProviderProps {
    children: ReactNode;
    enabled?: boolean;
}
export declare const DebugProvider: React.FC<DebugProviderProps>;
export declare const useDebug: () => DebugContextType;
export {};
