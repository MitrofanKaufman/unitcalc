"use strict";
// \server\src\index.ts
// Главный файл серверной части - инициализация Express приложения и подключение всех компонентов
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFoundHandler_1 = require("./middleware/notFoundHandler");
const productRoutes_1 = require("./routes/productRoutes");
// Загрузка переменных окружения
dotenv_1.default.config();
// Создание Express приложения
const app = (0, express_1.default)();
const PORT = process.env.SERVER_PORT || 3001;
// Middleware для безопасности
app.use((0, helmet_1.default)());
// Middleware для CORS
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
// Middleware для логирования
app.use((0, morgan_1.default)('combined'));
// Middleware для парсинга JSON
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        service: 'Marketplace Calculator API'
    });
});
// API маршруты
app.use('/api/products', (0, productRoutes_1.createProductRoutes)());
// Middleware для статических файлов (только для favicon.ico)
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});
// Middleware для обработки ошибок (должен быть последним)
app.use(notFoundHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API документация: http://localhost:${PORT}/api-docs`);
});
exports.default = app;
//# sourceMappingURL=index.js.map