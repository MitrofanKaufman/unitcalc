"use strict";
// \services\api-gateway\src\middleware\rateLimit.middleware.ts
// Middleware для ограничения частоты запросов
// Предотвращает злоупотребления API через ограничение количества запросов
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Конфигурация rate limiting
exports.rateLimitMiddleware = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP за окно времени
    message: {
        error: 'Слишком много запросов с этого IP адреса, попробуйте позже',
        retryAfter: '15 минут'
    },
    standardHeaders: true, // Возвращать rate limit info в заголовках `RateLimit-*`
    legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
    handler: (req, res) => {
        res.status(429).json({
            error: 'Слишком много запросов',
            message: 'Превышен лимит запросов. Попробуйте через 15 минут.',
            retryAfter: Math.ceil((req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 / 60 : 15))
        });
    },
    // Пропускать rate limiting для health check
    skip: (req) => req.path === '/health'
});
//# sourceMappingURL=rateLimit.middleware.js.map