import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { requestLogger } from './middleware/logging.middleware';
import { rateLimitMiddleware } from './middleware/rateLimit.middleware';
import unitsRoutes from './routes/units.routes';
import currencyRoutes from './routes/currency.routes';
import calculationsRoutes from './routes/calculations.routes';
import scrapingRoutes from './routes/scraping.routes';
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send(`Echo: ${message}`);
    });
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
    ws.on('error', (error) => {
        console.log(`WebSocket error: ${error}`);
    });
});
app.use('/api/wildberries', async (req, res) => {
    try {
        const url = `https://catalog.wb.ru${req.path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
        const response = await fetch(url, {
            method: req.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
        });
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Ошибка проксирования к Wildberries API:', error);
        res.status(500).json({ error: 'Ошибка при запросе к Wildberries API' });
    }
});
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/api/', rateLimitMiddleware);
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});
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
    });
});
app.use('/api/units', unitsRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/calculations', calculationsRoutes);
app.use('/api/scraping', scrapingRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
export { app, server, wss };
