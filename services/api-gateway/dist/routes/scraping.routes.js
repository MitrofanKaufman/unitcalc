import { Router } from 'express';
const router = Router();
router.post('/product', async (req, res) => {
    try {
        const { url, productId } = req.body;
        if (!url && !productId) {
            res.status(400).json({
                error: 'Необходимо указать URL или ID продукта'
            });
            return;
        }
        res.json({
            message: 'Product scraping endpoint - заглушка',
            url: url,
            productId: productId,
            scrapedData: {
                title: 'Пример продукта',
                price: 1000,
                availability: true
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.get('/price', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            res.status(400).json({
                error: 'Необходимо указать URL продукта'
            });
            return;
        }
        res.json({
            url: url,
            price: 1000,
            currency: 'RUB',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
export default router;
