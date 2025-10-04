"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// Middleware для CORS заголовков
const addCorsHeaders = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};
/**
 * Получение поисковых подсказок с Wildberries
 * GET /api/wildberries/suggest?query=текст
 */
router.get('/suggest', addCorsHeaders, async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Необходим параметр запроса',
            });
        }
        try {
            // Try to get suggestions from Wildberries API with more realistic browser headers
            const response = await axios_1.default.get('https://search.wb.ru/suggests/api/v2/hint', {
                params: {
                    query: query,
                    limit: 10,
                    lang: 'ru',
                    locale: 'ru',
                    dest: -1257786, // Moscow region
                    curr: 'rub',
                    spp: 0, // No premium user discount
                    nm: '' // No specific product filter
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Referer': 'https://www.wildberries.ru/',
                    'Origin': 'https://www.wildberries.ru',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-site',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'sec-ch-ua': '"Chromium";v="91", " Not;A Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'DNT': '1'
                },
                timeout: 3000
            });
            // Extract suggestions from response
            let suggestions = [];
            if (((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.queries) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                suggestions = response.data.queries.map((item) => item.value.trim());
            }
            else if (((_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.suggestions) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                // Alternative response format
                suggestions = response.data.suggestions.map((item) => item.trim());
            }
            return res.json({ success: true, data: suggestions });
        }
        catch (error) {
            console.warn('Не удалось загрузить подсказки с API Wildberries:', error);
            // Fallback to test data
            const suggestions = [
                `${query} ${query.endsWith('а') ? 'женская' : 'женский'}`,
                `${query} ${query.endsWith('а') ? 'мужская' : 'мужской'}`,
                `${query} 2025`,
                `${query} со скидкой`,
                `${query} купить`
            ];
            return res.json({ success: true, data: suggestions });
        }
    }
    catch (error) {
        console.error('Ошибка при получении подсказок:', error);
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка при получении подсказок',
            error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        });
    }
});
/**
 * Поиск товаров на Wildberries
 * GET /api/wildberries/search?query=текст
 */
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Необходим параметр запроса',
            });
        }
        // Здесь будет логика поиска товаров на Wildberries
        // Временная заглушка
        const products = [
            { id: 1, name: `${query} 1`, price: 1000 },
            { id: 2, name: `${query} 2`, price: 2000 },
            { id: 3, name: `${query} 3`, price: 1500 },
        ];
        res.json({
            success: true,
            data: products,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('Ошибка при поиске товаров:', error);
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка при поиске товаров',
            error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        });
    }
});
exports.default = router;
//# sourceMappingURL=wildberries.routes.js.map