// \server\src\index.ts
// Главный файл серверной части - инициализация Express приложения и подключение всех компонентов

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'
import { createProductRoutes } from './routes/productRoutes'

// Загрузка переменных окружения
dotenv.config()

// Создание Express приложения
const app = express()
const PORT = process.env.SERVER_PORT || 3001

// Middleware для безопасности
app.use(helmet())

// Middleware для CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Middleware для логирования
app.use(morgan('combined'))

// Middleware для парсинга JSON
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    service: 'Marketplace Calculator API'
  })
})

// API маршруты
app.use('/api/products', createProductRoutes())

// Middleware для статических файлов (только для favicon.ico)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end()
})

// Middleware для обработки ошибок (должен быть последним)
app.use(notFoundHandler)
app.use(errorHandler)

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API документация: http://localhost:${PORT}/api-docs`)
})

export default app
