// \services\api-gateway\src\app.ts
// Express приложение для API Gateway
// Настраивает middleware, маршруты и обработку ошибок

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { errorHandler } from './middleware/error.middleware'
import { notFoundHandler } from './middleware/notFound.middleware'
import { requestLogger } from './middleware/logging.middleware'
import { rateLimitMiddleware } from './middleware/rateLimit.middleware'

// Импорт маршрутов
import unitsRoutes from './routes/units.routes'
import currencyRoutes from './routes/currency.routes'
import calculationsRoutes from './routes/calculations.routes'
import scrapingRoutes from './routes/scraping.routes'

const app = express()

// Create HTTP server
const server = createServer(app)

// WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' })

// WebSocket connection handler
wss.on('connection', (ws) => {
  log('WebSocket client connected')

  ws.on('message', (message) => {
    log(`Received message: ${message}`)
    // Echo back the message
    ws.send(`Echo: ${message}`)
  })

  ws.on('close', () => {
    log('WebSocket client disconnected')
  })

  ws.on('error', (error) => {
    log(`WebSocket error: ${error}`)
  })
})

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use(requestLogger)

// Rate limiting
app.use('/api/', rateLimitMiddleware)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// Root endpoint with API information
app.get('/', (req, res) => {
  res.json({
    name: 'WB Marketplace Calculator API Gateway',
    version: process.env.npm_package_version || '1.0.0',
    description: 'API Gateway для калькулятора расчёта прибыльности товаров на Wildberries',
    endpoints: {
      health: '/health',
      apiDocs: '/api-docs',
      webSocket: '/ws',
      units: '/api/units/*',
      currency: '/api/currency/*',
      calculations: '/api/calculations/*',
      scraping: '/api/scraping/*'
    },
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api/units', unitsRoutes)
app.use('/api/currency', currencyRoutes)
app.use('/api/calculations', calculationsRoutes)
app.use('/api/scraping', scrapingRoutes)

// 404 handler
app.use(notFoundHandler)

// Error handling middleware
app.use(errorHandler)

export { app, server, wss }
