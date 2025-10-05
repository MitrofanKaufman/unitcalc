import winston from 'winston';
export declare const logger: winston.Logger;
export declare const expressLogger: winston.Logger;
export declare const logError: (message: string, error?: Error, meta?: any) => void;
export declare const logWarn: (message: string, meta?: any) => void;
export declare const logInfo: (message: string, meta?: any) => void;
export declare const logDebug: (message: string, meta?: any) => void;
export declare const logHttp: (message: string, meta?: any) => void;
