// src/core/services/SignalHandler.ts
// Обрабатывает сигналы процесса для корректного завершения работы

import { logger } from '../../utils/logger';

export class SignalHandler {
  public handleExitSignals(shutdownCallback: (signal?: string) => Promise<void>): void {
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

    signals.forEach((signal) => {
      process.on(signal, async () => {
        await shutdownCallback(signal);
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      // Здесь можно добавить логику для более чистого завершения работы
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Здесь можно добавить логику для более чистого завершения работы
      process.exit(1);
    });
  }
}
