// src/middleware/index.ts
import { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';
import { AppConfig } from '../config';

export function applyMiddleware(app: Application, config: AppConfig) {
  // Security headers
  app.use(helmet());

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
        logger.http({
          method: req.method,
          path: req.path,
          status: res.statusCode,
          duration: `${duration}ms`,
        });
      });
      next();
    });
  }
}