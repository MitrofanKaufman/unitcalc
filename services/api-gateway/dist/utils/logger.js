"use strict";
// \server\src\utils\logger.ts
// Система логирования на основе Winston
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logHttp = exports.logDebug = exports.logInfo = exports.logWarn = exports.logError = exports.expressLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// Уровни логирования
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Цвета для разных уровней
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
// Формат для консоли
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
        metaStr = `\n${JSON.stringify(meta, null, 2)}`;
    }
    return `${timestamp} ${level}: ${message}${metaStr}`;
}));
// Формат для файлов
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
// Создание директории для логов
const fs = require('fs');
const logDir = path_1.default.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
// Транспорты
const transports = [
    // Логи в консоль
    new winston_1.default.transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: consoleFormat,
        handleExceptions: true,
        handleRejections: true,
    }),
    // Логи ошибок в файл
    new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'error.log'),
        level: 'error',
        format: fileFormat,
        handleExceptions: true,
        handleRejections: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
    // Все логи в файл
    new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'combined.log'),
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
];
// Создание логгера
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    transports,
    exitOnError: false,
});
// Миддлвар для Express
exports.expressLogger = winston_1.default.createLogger({
    level: 'http',
    levels,
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                const statusCode = meta.statusCode || '???';
                const method = meta.method || '???';
                const url = meta.url || '???';
                const responseTime = meta.responseTime || '???';
                return `${timestamp} ${level}: ${method} ${url} ${statusCode} ${responseTime}ms`;
            }))
        })
    ]
});
// Функции-обертки для удобства
const logError = (message, error, meta) => {
    exports.logger.error(message, {
        error: error === null || error === void 0 ? void 0 : error.message,
        stack: error === null || error === void 0 ? void 0 : error.stack,
        ...meta
    });
};
exports.logError = logError;
const logWarn = (message, meta) => {
    exports.logger.warn(message, meta);
};
exports.logWarn = logWarn;
const logInfo = (message, meta) => {
    exports.logger.info(message, meta);
};
exports.logInfo = logInfo;
const logDebug = (message, meta) => {
    exports.logger.debug(message, meta);
};
exports.logDebug = logDebug;
const logHttp = (message, meta) => {
    exports.logger.http(message, meta);
};
exports.logHttp = logHttp;
//# sourceMappingURL=logger.js.map