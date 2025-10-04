"use strict";
// \services\api-gateway\src\routes\units.routes.ts
// Маршруты для функций единиц измерения
// Импортирует функции из отдельных файлов
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const convert_1 = require("../functions/units/convert");
const categories_1 = require("../functions/units/categories");
const router = (0, express_1.Router)();
// GET /api/units/convert
router.get('/convert', async (req, res) => {
    try {
        const { from, to, value } = req.query;
        if (!from || !to || !value) {
            res.status(400).json({
                error: 'Отсутствуют обязательные параметры: from, to, value'
            });
            return;
        }
        const result = await (0, convert_1.convertUnits)(from, to, Number(value));
        res.json(result);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
// GET /api/units/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await (0, categories_1.getUnitCategories)();
        res.json(categories);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=units.routes.js.map