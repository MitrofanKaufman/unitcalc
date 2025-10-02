import { Router } from 'express';
const router = Router();
router.get('/rates', async (req, res) => {
    try {
        res.json({
            message: 'Currency rates endpoint - заглушка',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/convert', async (req, res) => {
    try {
        const { from, to, amount } = req.query;
        if (!from || !to || !amount) {
            return res.status(400).json({
                error: 'Отсутствуют обязательные параметры: from, to, amount'
            });
        }
        res.json({
            from: from,
            to: to,
            amount: Number(amount),
            result: Number(amount) * 1.0,
            rate: 1.0,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
