// path: src/api/v1/routes/json/results.js
/**
 * Упрощенный роутер для получения результатов расчета рентабельности
 * Возвращает тестовые данные вместо реальных
 */

import { Router } from 'express';

const router = Router();

// Тестовые данные для результатов
const testResults = {
    id: '12345',
    name: 'Тестовый товар',
    price: 1000,
    commission: 200,
    logistics: 100,
    profit: 700,
    roi: 70,
    margin: 70,
    breakeven: 30,
    timestamp: new Date().toISOString(),
    details: {
        seller: {
            id: '54321',
            name: 'Тестовый продавец',
            rating: 4.8,
            reviews: 1245
        },
        calculations: {
            totalCost: 300,
            netProfit: 700,
            expenses: {
                commission: 200,
                logistics: 100,
                other: 0
            }
        }
    }
};

/**
 * GET /results
 * Возвращает результаты расчета рентабельности для товара
 * 
 * @query {string} id - ID товара на Wildberries
 * @returns {Object} Данные о рентабельности товара
 */
router.get('/results', async (req, res) => {
    const { id } = req.query;
    
    if (!id) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Не указан ID товара' 
        });
    }

    try {
        // Возвращаем тестовые данные с переданным ID
        return res.json({
            status: 'success',
            data: {
                ...testResults,
                id: id.toString(),
                details: {
                    ...testResults.details,
                    seller: {
                        ...testResults.details.seller,
                        id: `seller_${id}`
                    }
                }
            }
        });
    } catch (error) {
        console.error('Ошибка при получении результатов:', error);
        return res.status(500).json({ 
            status: 'error',
            message: 'Внутренняя ошибка сервера',
            error: error.message 
        });
    }
});

export default router;
