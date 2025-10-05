<<<<<<< HEAD
import { logger } from '@wb-calc/logging';
export const errorHandler = (err, req, res, next) => {
    logger.error('API Error', {
        error: err.message,
=======
"use strict";
// \services\api-gateway\src\middleware\error.middleware.ts
// Централизованная обработка ошибок
// Обеспечивает консистентный формат ответов об ошибках
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logging_1 = require("@wb-calc/logging");
const errorHandler = (err, req, res, next) => {
    (0, logging_1.error)('API Error', {
        message: err.message,
>>>>>>> fix/dependencies-update
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    // Определение типа ошибки
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: 'Ошибка валидации',
            message: err.message
        });
        return;
    }
    if (err.name === 'CastError') {
        res.status(400).json({
            error: 'Неверный формат данных',
            message: 'Проверьте корректность ID или параметров'
        });
        return;
    }
    // Общая ошибка сервера
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: 'Произошла непредвиденная ошибка'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map