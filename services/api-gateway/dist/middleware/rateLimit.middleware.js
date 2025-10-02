import rateLimit from 'express-rate-limit';
export const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Слишком много запросов с этого IP адреса, попробуйте позже',
        retryAfter: '15 минут'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Слишком много запросов',
            message: 'Превышен лимит запросов. Попробуйте через 15 минут.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60)
        });
    },
    skip: (req) => req.path === '/health'
});
