"use strict";
// \server\src\middleware\errorHandler.ts
// Middleware для обработки ошибок
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map