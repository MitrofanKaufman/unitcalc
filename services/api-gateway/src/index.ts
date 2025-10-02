import { config } from 'dotenv'
import { server } from './app'

// Загрузка переменных окружения
config()

const PORT = process.env.PORT || 3001

// Запуск сервера
server.listen(PORT, () => {
  console.log(`API Gateway запущен на порту ${PORT}`)
  console.log(`Документация API: http://localhost:${PORT}/api-docs`)
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`)
})

// Обработка graceful shutdown
process.on('SIGTERM', () => {
  console.log('Получен сигнал SIGTERM, завершение работы...')
  server.close(() => {
    console.log('API Gateway остановлен')
  })
})

process.on('SIGINT', () => {
  console.log('Получен сигнал SIGINT, завершение работы...')
  server.close(() => {
    console.log('API Gateway остановлен')
  })
})
