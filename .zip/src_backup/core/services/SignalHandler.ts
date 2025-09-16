// path: src/core/services/SignalHandler.ts
/**
 * Класс для обработки сигналов завершения работы приложения
 * Обеспечивает корректное завершение работы при получении сигналов ОС
 */

export class SignalHandler {
  private isShuttingDown = false;
  private readonly onShutdown: () => Promise<void> | void;

  /**
   * Создает экземпляр обработчика сигналов
   * @param onShutdown Функция, которая будет вызвана при получении сигнала завершения
   */
  constructor(onShutdown: () => Promise<void> | void) {
    this.onShutdown = onShutdown;
    this.setupSignalHandlers();
  }

  /**
   * Настраивает обработчики сигналов
   * @private
   */
  private setupSignalHandlers(): void {
    // Обработка необработанных исключений
    process.on('uncaughtException', async (error) => {
      console.error('⚠️ Необработанное исключение:', error);
      await this.handleShutdown('uncaughtException');
    });

    // Обработка необработанных промисов
    process.on('unhandledRejection', (reason, promise) => {
      console.error('⚠️ Необработанный промис:', promise, 'Причина:', reason);
    });

    // Обработка сигналов завершения
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];
    
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`📡 Получен сигнал ${signal}`);
        await this.handleShutdown(signal);
      });
    });
  }

  /**
   * Обрабатывает завершение работы приложения
   * @param signal Сигнал, вызвавший завершение
   * @private
   */
  private async handleShutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      console.log('🚧 Завершение уже выполняется...');
      return;
    }

    this.isShuttingDown = true;
    console.log(`🚦 Начало завершения работы (${signal})...`);

    try {
      // Вызываем переданную функцию завершения
      await Promise.resolve(this.onShutdown());
      
      console.log('👋 Приложение успешно завершило работу');
      process.exit(0);
    } catch (error) {
      console.error('❌ Ошибка при завершении работы:', error);
      process.exit(1);
    }
  }
}
