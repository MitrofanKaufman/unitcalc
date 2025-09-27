// \services\api-gateway\src\routes\calculations.routes.ts
// Маршруты для функций расчетов
// Импортирует функции из отдельных файлов

import { Router } from 'express'

const router = Router()

// POST /api/calculations/profit
router.post('/profit', async (req, res) => {
  try {
    const { productData } = req.body

    if (!productData) {
      return res.status(400).json({
        error: 'Отсутствуют данные продукта'
      })
    }

    // Заглушка для расчета прибыли
    res.json({
      message: 'Profit calculation endpoint - заглушка',
      productData: productData,
      calculatedProfit: 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/calculations/margin
router.get('/margin', async (req, res) => {
  try {
    const { cost, price } = req.query

    if (!cost || !price) {
      return res.status(400).json({
        error: 'Отсутствуют обязательные параметры: cost, price'
      })
    }

    const costNum = Number(cost)
    const priceNum = Number(price)
    const margin = ((priceNum - costNum) / priceNum) * 100

    res.json({
      cost: costNum,
      price: priceNum,
      margin: margin,
      marginPercent: `${margin.toFixed(2)}%`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
