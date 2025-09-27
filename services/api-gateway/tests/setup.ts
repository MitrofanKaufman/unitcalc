// \services\api-gateway\tests\setup.ts
// Настройка тестовой среды
// Подготовка моков и конфигурации для тестов

import { jest } from '@jest/globals'

// Моки для внешних зависимостей
jest.mock('@wb-calc/logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}))

// Глобальная настройка таймаутов
jest.setTimeout(30000)

// Очистка между тестами
afterEach(() => {
  jest.clearAllMocks()
})
