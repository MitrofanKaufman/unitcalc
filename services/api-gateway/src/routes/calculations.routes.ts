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
      res.status(400).json({
        error: 'Отсутствуют данные продукта'
      })
      return
    }

    // Заглушка для расчета прибыли
    res.json({
      message: 'Profit calculation endpoint - заглушка',
      productData: productData,
      calculatedProfit: 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ error: err.message })
  }
})

// GET /api/calculations/margin
router.get('/margin', async (req, res) => {
  try {
    const { cost, price } = req.query

    if (!cost || !price) {
      res.status(400).json({
        error: 'Отсутствуют обязательные параметры: cost, price'
      })
      return
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
    const err = error as Error
    res.status(500).json({ error: err.message })
  }
})

export default router
