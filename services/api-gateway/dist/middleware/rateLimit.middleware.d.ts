declare global {
    namespace Express {
        interface Request {
            rateLimit?: {
                resetTime?: number;
            };
        }
    }
}
export declare const rateLimitMiddleware: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimit.middleware.d.ts.map