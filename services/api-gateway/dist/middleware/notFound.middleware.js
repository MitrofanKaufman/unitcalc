"use strict";
// \services\api-gateway\src\middleware\notFound.middleware.ts
// Обработка 404 ошибок
// Middleware для обработки несуществующих маршрутов
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: 'Маршрут не найден',
        message: `Маршрут ${req.method} ${req.path} не существует`,
        availableRoutes: {
            units: '/api/units/*',
            currency: '/api/currency/*',
            calculations: '/api/calculations/*',
            scraping: '/api/scraping/*'
        }
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFound.middleware.js.map