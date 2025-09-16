// path: src/api/v1/endpoints/tariffs/return.js
import express from 'express';
import WBTariffFetcher from '../../functions/WBTariffFetcher.ts';

const router = express.Router();
const fetcher = new WBTariffFetcher();

// GET /api/tariffs/return
router.get('/', async (req, res) => {
    try {
        await fetcher.verifyToken();
        await fetcher.fetchReturnTariffs();
        res.json({ message: 'Тарифы на возврат обновлены' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
