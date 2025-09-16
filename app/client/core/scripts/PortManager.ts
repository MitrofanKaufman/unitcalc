// path: src/core/scripts/PortManager.ts
/**
 * Класс для управления портами приложения
 * Позволяет находить и резервировать свободные порты
 */

export class PortManager {
  /**
   * Проверяет, доступен ли порт
   * @param port Номер порта для проверки
   * @returns Promise<boolean> true, если порт доступен
   */
  static async isPortAvailable(port: number): Promise<boolean> {
    try {
      const { default: net } = await import('net');
      return new Promise((resolve) => {
        const server = net.createServer();
        server.unref();
        
        server.on('error', () => {
          resolve(false);
        });
        
        server.listen({ port }, () => {
          server.close(() => {
            resolve(true);
          });
        });
      });
    } catch (error) {
      console.error('Ошибка при проверке порта:', error);
      return false;
    }
  }

  /**
   * Находит свободный порт, начиная с указанного
   * @param startPort Порт, с которого начинать поиск (по умолчанию 3000)
   * @param maxAttempts Максимальное количество попыток (по умолчанию 10)
   * @returns Promise<number> Номер свободного порта
   */
  static async getAvailablePort(
    startPort: number = 3000,
    maxAttempts: number = 10
  ): Promise<number> {
    let currentPort = startPort;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const isAvailable = await this.isPortAvailable(currentPort);
      
      if (isAvailable) {
        return currentPort;
      }
      
      currentPort++;
      attempts++;
    }

    throw new Error(`Не удалось найти свободный порт в диапазоне ${startPort}-${currentPort - 1}`);
  }

  /**
   * Пытается использовать указанный порт, если он занят - находит следующий свободный
   * @param preferredPort Предпочитаемый порт (по умолчанию 3000)
   * @returns Promise<number> Номер порта, который можно использовать
   */
  static async ensurePortAvailable(preferredPort: number = 3000): Promise<number> {
    const isAvailable = await this.isPortAvailable(preferredPort);
    
    if (isAvailable) {
      return preferredPort;
    }

    console.warn(`Порт ${preferredPort} занят, ищу свободный порт...`);
    return this.getAvailablePort(preferredPort + 1);
  }
}
