// app.ts
import 'reflect-metadata';
import http from 'http';
import express, { Application } from 'express';
import { fileURLToPath } from 'url';

// Core imports
import { logger } from '@utils/logger';
import { config } from './app/config';

// Server imports
import { applyMiddleware } from './app/client/core/hooks/middleware';
import { errorHandler } from './app/client/core/hooks/errorHandler';
import { RouteManager } from './app/client/core/RouteManager';
import { PortManager } from './app/client/core/utils/PortManager';
import { SignalHandler } from './app/client/core/services/SignalHandler';

export class AppServer {
  private readonly app: Application;
  private server: http.Server | null = null;
  private isInitialized = false;

  constructor() {
    this.app = express();
    this.initialize().catch((error) => {
      logger.fatal('Failed to initialize application', { error });
      process.exit(1);
    });
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Apply middleware
    applyMiddleware(this.app, config);

    // Initialize routes
    await RouteManager.initializeRoutes(this.app);

    // Error handling (must be last)
    this.app.use(errorHandler);

    this.isInitialized = true;
  }

  public async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const port = await PortManager.getAvailablePort(config.port);

    return new Promise((resolve, reject) => {
      // Create HTTP server with explicit HTTP/1.1 settings
      this.server = http.createServer({
        keepAlive: true,
        keepAliveMsecs: 10000,
        maxHeadersCount: 0, // No limit on headers
        // Disable HTTP/2
        maxHeaderSize: 16384, // 16KB
        insecureHTTPParser: false // Use strict HTTP/1.1 parsing
      }, this.app);

      // Start listening
      this.server.listen(port, () => {
        logger.info(`Server running on port ${port} in ${config.env} mode`);
        logger.info('Using HTTP/1.1 protocol');
        resolve();

        // Set up signal handlers after server starts
        const signalHandler = new SignalHandler(() => this.shutdown());
      });

      this.server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.syscall !== 'listen') {
          return reject(error);
        }

        switch (error.code) {
          case 'EACCES':
            logger.fatal(`Port ${port} requires elevated privileges`);
            break;
          case 'EADDRINUSE':
            logger.fatal(`Port ${port} is already in use`);
            break;
          default:
            logger.fatal('Failed to start server', { error });
        }

        process.exit(1);
      });
    });
  }

  public async shutdown(signal?: string): Promise<void> {
    if (signal) {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
    }

    if (!this.server) {
      return process.exit(0);
    }

    return new Promise((resolve) => {
      this.server?.close(() => {
        logger.info('Server stopped');
        resolve();
      });

      // Force shutdown after timeout
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    });
  }
}

// Start the server if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = new AppServer();
  server.start().catch((error) => {
    logger.fatal('Failed to start server', { error });
    process.exit(1);
  });
}