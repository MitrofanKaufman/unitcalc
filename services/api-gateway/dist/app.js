import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { requestLogger } from './middleware/logging.middleware';
import { rateLimitMiddleware } from './middleware/rateLimit.middleware';
import unitsRoutes from './routes/units.routes';
import currencyRoutes from './routes/currency.routes';
import calculationsRoutes from './routes/calculations.routes';
import scrapingRoutes from './routes/scraping.routes';
const app = express();
app.use(helmet());
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
app.use('/api/units', unitsRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/calculations', calculationsRoutes);
app.use('/api/scraping', scrapingRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
export { app };
