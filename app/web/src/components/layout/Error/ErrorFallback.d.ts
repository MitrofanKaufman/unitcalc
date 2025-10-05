import React from 'react';
interface ErrorFallbackProps {
    error: Error;
    resetError: () => void;
    title?: string;
    showResetButton?: boolean;
}
export declare const ErrorFallback: React.FC<ErrorFallbackProps>;
export {};
