import { Request, Response, NextFunction } from 'express';
export interface RateLimitOptions {
    windowMs?: number;
    maxRequests?: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    message?: string;
    keyGenerator?: (req: Request) => string;
}
export declare const rateLimit: (options?: RateLimitOptions) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const strictRateLimit: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authRateLimit: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const apiRateLimit: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
