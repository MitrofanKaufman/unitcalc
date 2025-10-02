import { Router } from 'express';
const router = Router();
router.post('/product', async (req, res) => {
    try {
        const { url, productId } = req.body;
        if (!url && !productId) {
            return res.status(400).json({
                error: 'Необходимо указать URL или ID продукта'
            });
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
        res.status(500).json({ error: error.message });
    }
});
router.get('/price', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
                error: 'Необходимо указать URL продукта'
            });
        }
        res.json({
            url: url,
            price: 1000,
            currency: 'RUB',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
