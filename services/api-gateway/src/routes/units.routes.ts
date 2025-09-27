// \services\api-gateway\src\routes\units.routes.ts
// Маршруты для функций единиц измерения
// Импортирует функции из отдельных файлов

import { Router } from 'express'
import { convertUnits } from '../functions/units/convert'
import { getUnitCategories } from '../functions/units/categories'

const router = Router()

// GET /api/units/convert
router.get('/convert', async (req, res) => {
  try {
    const { from, to, value } = req.query

    if (!from || !to || !value) {
      return res.status(400).json({
        error: 'Отсутствуют обязательные параметры: from, to, value'
      })
    }

    const result = await convertUnits(from as string, to as string, Number(value))
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/units/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await getUnitCategories()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
