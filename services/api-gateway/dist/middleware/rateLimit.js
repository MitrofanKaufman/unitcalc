"use strict";
// \server\src\middleware\rateLimit.ts
// Middleware для ограничения частоты запросов
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimit = exports.authRateLimit = exports.strictRateLimit = exports.rateLimit = void 0;
const rateLimitStore = new Map();
// Очистка устаревших записей каждые 5 минут
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);
const rateLimit = (options = {}) => {
    const { windowMs = 15 * 60 * 1000, // 15 минут
    maxRequests = 100, skipSuccessfulRequests = false, skipFailedRequests = false, message = 'Слишком много запросов, попробуйте позже', keyGenerator = (req) => {
        // По умолчанию используем IP адрес
        return req.ip || req.connection.remoteAddress || 'unknown';
    } } = options;
    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();
        const resetTime = now + windowMs;
        // Получаем или создаем запись для ключа
        let entry = rateLimitStore.get(key);
        if (!entry || now > entry.resetTime) {
            entry = {
                count: 0,
                resetTime
            };
            rateLimitStore.set(key, entry);
        }
        // Увеличиваем счетчик
        entry.count++;
        // Проверяем лимит
        if (entry.count > maxRequests) {
            // Устанавливаем заголовки для информации о лимите
            res.set({
                'X-RateLimit-Limit': maxRequests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
                'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString()
            });
            return res.status(429).json({
                success: false,
                error: {
                    message,
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: Math.ceil((entry.resetTime - now) / 1000)
                },
                timestamp: new Date().toISOString()
            });
        }
        // Устанавливаем заголовки для информации о лимите
        res.set({
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': (maxRequests - entry.count).toString(),
            'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
        });
        next();
    };
};
exports.rateLimit = rateLimit;
// Предустановленные конфигурации
exports.strictRateLimit = (0, exports.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 минут
    maxRequests: 50, // 50 запросов
    message: 'Превышен лимит запросов. Попробуйте через 15 минут.'
});
exports.authRateLimit = (0, exports.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 минут
    maxRequests: 5, // 5 попыток входа
    message: 'Слишком много попыток входа. Попробуйте через 15 минут.',
    keyGenerator: (req) => {
        var _a;
        // Для аутентификации используем комбинацию IP и email
        const email = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.email) || 'unknown';
        return `${req.ip || 'unknown'}:${email}`;
    }
});
exports.apiRateLimit = (0, exports.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 минут
    maxRequests: 100, // 100 запросов к API
    message: 'Превышен лимит API запросов. Попробуйте через 15 минут.'
});
//# sourceMappingURL=rateLimit.js.map