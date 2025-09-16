// расположение: ./api/v1/routes/product.ts
import express from 'express';
import scrapeProductById from '../product.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const data = await scrapeProductById(productId);
        if (data?.error) {
            res.status(500).json({ error: data.message });
        } else {
            res.json(data);
        }
    } catch (err) {
        console.error('❌ Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера', details: err.message });
    }
});

export default router;
