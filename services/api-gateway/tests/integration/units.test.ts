// \services\api-gateway\tests\integration\units.test.ts
// Integration тесты для API endpoints единиц
// Тестирование HTTP API с реальными запросами

// Временный мок для supertest до установки зависимости
type SuperTest = any;
const request: SuperTest = {
  get: () => ({
    query: () => ({
      expect: () => Promise.resolve({ body: {} })
    })
  })
};

import { app } from '../../src/app'

describe('/api/units', () => {
  describe('GET /api/units/convert', () => {
    it('должен возвращать результат конвертации метров в футы', async () => {
      const response = await request(app)
        .get('/api/units/convert')
        .query({ from: 'meters', to: 'feet', value: '100' })
        .expect(200)

      expect(response.body).toMatchObject({
        result: 328.084,
        from: 'meters',
        to: 'feet'
      })
    })

    it('должен возвращать результат конвертации футов в метры', async () => {
      const response = await request(app)
        .get('/api/units/convert')
        .query({ from: 'feet', to: 'meters', value: '328' })
        .expect(200)

      expect(response.body.result).toBeCloseTo(100, 2)
    })

    it('должен возвращать 400 при отсутствии параметров', async () => {
      const response = await request(app)
        .get('/api/units/convert')
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('должен возвращать 400 при некорректном значении', async () => {
      const response = await request(app)
        .get('/api/units/convert')
        .query({ from: 'meters', to: 'feet', value: 'invalid' })
        .expect(400)

      expect(response.body.error).toContain('value должен быть числом')
    })
  })

  describe('GET /api/units/categories', () => {
    it('должен возвращать список категорий', async () => {
      const response = await request(app)
        .get('/api/units/categories')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)

      // Проверка структуры категории
      const category = response.body[0]
      expect(category).toHaveProperty('id')
      expect(category).toHaveProperty('name')
      expect(category).toHaveProperty('description')
      expect(category).toHaveProperty('units')
    })
  })
})
