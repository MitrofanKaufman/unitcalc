// path: src/api/v1/endpoints/pvz.js
import express from 'express';
import WBPvzFetcher from '../functions/WBPvzFetcher.ts';

const router = express.Router();
const fetcher = new WBPvzFetcher();

// GET /api/pvz
router.get('/', async (req, res) => {
    try {
        await fetcher.fetchPvzList();
        res.json({ message: 'Список ПВЗ обновлён' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
