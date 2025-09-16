// path: src/api/v1/endpoints/tariffs/commission.js
import express from 'express';
import WBTariffFetcher from '../../functions/WBTariffFetcher.js';

const router = express.Router();
const fetcher = new WBTariffFetcher();

// GET /api/tariffs/commission
router.get('/', async (req, res) => {
    try {
        await fetcher.verifyToken();
        await fetcher.fetchCommission('ru');
        res.json({ message: 'Комиссии обновлены' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
