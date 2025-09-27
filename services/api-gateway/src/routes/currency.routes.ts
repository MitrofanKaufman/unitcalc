// \services\api-gateway\src\routes\currency.routes.ts
// Маршруты для функций валютных операций
// Импортирует функции из отдельных файлов

import { Router } from 'express'

const router = Router()

// GET /api/currency/rates
router.get('/rates', async (req, res) => {
  try {
    // Заглушка для получения курсов валют
    res.json({
      message: 'Currency rates endpoint - заглушка',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/currency/convert
router.get('/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query

    if (!from || !to || !amount) {
      return res.status(400).json({
        error: 'Отсутствуют обязательные параметры: from, to, amount'
      })
    }

    // Заглушка для конвертации валют
    res.json({
      from: from,
      to: to,
      amount: Number(amount),
      result: Number(amount) * 1.0, // Заглушка с курсом 1:1
      rate: 1.0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
