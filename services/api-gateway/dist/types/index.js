"use strict";
// Типы для серверной части Marketplace Calculator
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.VALIDATION_RULES = exports.PRODUCT_CATEGORIES = exports.MARKETPLACE_COMMISSIONS = void 0;
// Константы маркетплейсов (для сервера)
exports.MARKETPLACE_COMMISSIONS = {
    wb: {
        base: 15,
        categoryMultiplier: {
            'electronics': 0.05,
            'clothing': 0.15,
            'home': 0.10,
        }
    },
    ozon: {
        base: 12,
        categoryMultiplier: {
            'electronics': 0.08,
            'books': 0.12,
            'toys': 0.15,
        }
    },
    yandex: {
        base: 8,
        categoryMultiplier: {
            'electronics': 0.05,
            'fashion': 0.12,
            'food': 0.08,
        }
    }
};
// Константы категорий товаров
exports.PRODUCT_CATEGORIES = [
    { id: 'electronics', name: 'Электроника' },
    { id: 'clothing', name: 'Одежда' },
    { id: 'home', name: 'Товары для дома' },
    { id: 'books', name: 'Книги' },
    { id: 'toys', name: 'Игрушки' },
    { id: 'fashion', name: 'Мода' },
    { id: 'food', name: 'Еда' },
];
// Валидационные правила
exports.VALIDATION_RULES = {
    productName: {
        minLength: 3,
        maxLength: 200,
        pattern: /^[a-zA-Zа-яА-Я0-9\s\-_()]{3,200}$/
    },
    price: {
        min: 0.01,
        max: 1000000
    },
    percentage: {
        min: 0,
        max: 100
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
};
// Коды ошибок API
exports.ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    CONFLICT: 'CONFLICT',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
};
//# sourceMappingURL=index.js.map