// \services\api-gateway\src\index.ts
// Точка входа API Gateway
// Запускает Express сервер с настроенными маршрутами

import { config } from 'dotenv'
import { server } from './app'
import { log } from '@wb-calc/logging'

// Загрузка переменных окружения
config()

const PORT = process.env.PORT || 3001

// Запуск сервера
server.listen(PORT, () => {
  log(`API Gateway запущен на порту ${PORT}`)
  log(`Документация API: http://localhost:${PORT}/api-docs`)
  log(`WebSocket endpoint: ws://localhost:${PORT}/ws`)
})

// Обработка graceful shutdown
process.on('SIGTERM', () => {
  log('Получен сигнал SIGTERM, завершение работы...')
  server.close(() => {
    log('API Gateway остановлен')
  })
})

process.on('SIGINT', () => {
  log('Получен сигнал SIGINT, завершение работы...')
  server.close(() => {
    log('API Gateway остановлен')
  })
})
