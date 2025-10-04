import React, { Component, ReactNode } from 'react';
interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: any) => void;
    resetOnPropsChange?: boolean;
    resetKeys?: Array<string | number>;
}
interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: any;
    errorId: string;
    retryCount: number;
}
/**
 * Error Boundary с автоматическим восстановлением
 */
export declare class ErrorBoundary extends Component<Props, State> {
    private resetTimeoutId;
    private maxRetries;
    constructor(props: Props);
    static getDerivedStateFromError(error: Error): Partial<State>;
    componentDidCatch(error: Error, errorInfo: any): void;
    componentDidUpdate(prevProps: Props): void;
    /**
     * Сброс Error Boundary
     */
    resetErrorBoundary: () => void;
    /**
     * Попытка восстановления
     */
    retry: () => void;
    /**
     * Логирование ошибки
     */
    private logError;
    /**
     * Планирование автоматического восстановления
     */
    private scheduleAutoRecovery;
    componentWillUnmount(): void;
    render(): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
}
export {};
