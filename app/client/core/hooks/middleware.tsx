// src/middleware/index.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { logger } from '../../utils/logger';
import { AppConfig } from '../../config';

export function applyMiddleware(app: Application, config: AppConfig) {
  // Security headers - excluding health endpoint to avoid 426 errors
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip helmet for health check and API endpoints to avoid 426 Upgrade Required
    if (req.path === '/health' || req.path.startsWith('/api/')) {
      // Apply only basic security headers for API endpoints
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      return next();
    }
    // Apply full helmet for other routes
    helmet({
      crossOriginEmbedderPolicy: false, // Disable COEP to avoid 426 errors
      crossOriginOpenerPolicy: false,   // Disable COOP to avoid 426 errors
    })(req, res, next);
  });

  // Compression
  app.use(compression());

  // JSON parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // CORS
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
    })
  );

  // Rate limiting
  if (process.env.NODE_ENV === 'production') {
    app.use(
      '/api/',
      rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
      })
    );
  }

  // Request logging
  if (process.env.NODE_ENV !== 'test') {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`HTTP ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      });
      next();
    });
  }
}