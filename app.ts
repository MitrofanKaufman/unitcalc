// app.ts
import 'reflect-metadata';
import http from 'http';
import express, { Application } from 'express';
import { logger } from './src/utils/logger';
import { config } from './src/config/config';
import { applyMiddleware } from './src/hooks/middleware';
import { errorHandler } from './src/hooks/errorHandler';
import { RouteRegistry } from './src/core/RouteRegistry';
import { PortManager } from './src/core/PortManager';
import { SignalHandler } from './src/core/services/SignalHandler';
import { fileURLToPath } from 'url';

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
    await RouteRegistry.initializeRoutes(this.app);

    // Error handling (must be last)
    this.app.use(errorHandler);

    this.isInitialized = true;
  }

  public async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const portManager = new PortManager();
    const port = await portManager.getAvailablePort(config.port);

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, () => {
        logger.info(`Server running on port ${port} in ${config.env} mode`);
        resolve();

        // Set up signal handlers after server starts
        const signalHandler = new SignalHandler();
        signalHandler.handleExitSignals(this.shutdown.bind(this));
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