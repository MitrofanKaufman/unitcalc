import { Router } from 'express';
import { convertUnits } from '../functions/units/convert';
import { getUnitCategories } from '../functions/units/categories';
const router = Router();
router.get('/convert', async (req, res) => {
    try {
        const { from, to, value } = req.query;
        if (!from || !to || !value) {
            return res.status(400).json({
                error: 'Отсутствуют обязательные параметры: from, to, value'
            });
        }
        const result = await convertUnits(from, to, Number(value));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/categories', async (req, res) => {
    try {
        const categories = await getUnitCategories();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
