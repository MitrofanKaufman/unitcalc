"use strict";
// \services\api-gateway\src\routes\currency.routes.ts
// Маршруты для функций валютных операций
// Импортирует функции из отдельных файлов
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /api/currency/rates
router.get('/rates', async (req, res) => {
    try {
        // Заглушка для получения курсов валют
        res.json({
            message: 'Currency rates endpoint - заглушка',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
// GET /api/currency/convert
router.get('/convert', async (req, res) => {
    try {
        const { from, to, amount } = req.query;
        if (!from || !to || !amount) {
            res.status(400).json({
                error: 'Отсутствуют обязательные параметры: from, to, amount'
            });
            return;
        }
        // Заглушка для конвертации валют
        res.json({
            from: from,
            to: to,
            amount: Number(amount),
            result: Number(amount) * 1.0, // Заглушка с курсом 1:1
            rate: 1.0,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=currency.routes.js.map