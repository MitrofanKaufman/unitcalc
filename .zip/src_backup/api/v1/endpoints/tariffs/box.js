// path: src/api/v1/endpoints/tariffs/box.js
import express from 'express';
import WBTariffFetcher from '../../functions/WBTariffFetcher.ts';

const router = express.Router();
const fetcher = new WBTariffFetcher();

// GET /api/tariffs/box
router.get('/', async (req, res) => {
    try {
        await fetcher.verifyToken();
        await fetcher.fetchBoxTariffs();
        res.json({ message: 'Тарифы хранения «короб» обновлены' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
