// path: src/api/v1/endpoints/tariffs/pallet.js
import express from 'express';
import WBTariffFetcher from '../../functions/WBTariffFetcher.js';

const router = express.Router();
const fetcher = new WBTariffFetcher();

// GET /api/tariffs/pallet
router.get('/', async (req, res) => {
    try {
        await fetcher.verifyToken();
        await fetcher.fetchPalletTariffs();
        res.json({ message: 'Тарифы хранения «паллет» обновлены' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
