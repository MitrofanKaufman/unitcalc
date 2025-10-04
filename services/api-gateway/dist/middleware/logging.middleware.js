"use strict";
// \services\api-gateway\src\middleware\logging.middleware.ts
// Middleware для логирования запросов
// Отслеживает все входящие HTTP запросы
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logging_1 = require("@wb-calc/logging");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Логирование входящего запроса
    (0, logging_1.log)('Входящий запрос: ' + req.method + ' ' + req.url);
    // Логирование ответа
    res.on('finish', () => {
        const duration = Date.now() - start;
        (0, logging_1.log)(`Ответ отправлен: ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=logging.middleware.js.map