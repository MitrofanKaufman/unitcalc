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
  console.log('WebSocket client connected')

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`)
    // Echo back the message
    ws.send(`Echo: ${message}`)
  })

  ws.on('close', () => {
    console.log('WebSocket client disconnected')
  })

  ws.on('error', (error) => {
    console.log(`WebSocket error: ${error}`)
  })
})

// Body parsing middleware (нужен до прокси)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Прокси для Wildberries API (упрощенная версия для отладки)
app.use(['/api/wildberries', '/api/suggests'], async (req, res) => {
  try {
    console.log(`Прокси запрос: ${req.method} ${req.path}${req.url}`);

    // Определяем целевой URL в зависимости от пути
    let targetUrl: string;

    if (req.path.startsWith('/api/suggests')) {
      // Для подсказок
      targetUrl = `https://u-suggests.wb.ru${req.path.replace('/api/suggests', '')}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    } else {
      // Для каталога товаров
      targetUrl = `https://catalog.wb.ru${req.path.replace('/api/wildberries', '')}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    }

    console.log(`Целевой URL: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data = await response.text();
    console.log(`Ответ от внешнего API: ${data.substring(0, 100)}`);

    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.send(data);

  } catch (error) {
    console.error('Ошибка прокси:', error);
    res.status(500).json({ error: 'Ошибка прокси' });
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Request logging
app.use(requestLogger)

// Rate limiting (только для API путей, не затрагивающих прокси)
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
      scraping: '/api/scraping/*',
      wildberries: '/api/wildberries/*',
      suggests: '/api/suggests/*'
    },
    timestamp: new Date().toISOString()
  })
})

// API routes (после прокси)
app.use('/api/units', unitsRoutes)
app.use('/api/currency', currencyRoutes)
app.use('/api/calculations', calculationsRoutes)
app.use('/api/scraping', scrapingRoutes)

// 404 handler
app.use(notFoundHandler)

// Error handling middleware
app.use(errorHandler)

export { app, server, wss }
