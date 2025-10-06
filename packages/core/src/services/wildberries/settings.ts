// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\core\src\services\wildberries\settings.ts
/**
 * path/to/file.ts
 * Описание: Настройки и конфигурация для скрейпера Wildberries
 * Логика: Клиентская/Серверная (серверная логика сбора данных)
 * Зависимости: Базовые типы TypeScript
 * Примечания: Содержит настройки браузера, таймауты и сообщения для процесса сбора
 */

import type { ScraperSettings } from './types';

class Settings {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    this.scrapeTimeout = 30000; // 30 секунд
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 секунда

    this.messages = {
      pageLoad: 'Перехожу на страницу товара…',
      captchaCheck: 'Проверяю наличие капчи…',
      title: 'Изучаю товар…',
      price: 'Прицениваюсь к товару…',
      ratingAndReviews: 'Читаю отзывы товара…',
      questions: 'Определяю заинтересованность покупателей…',
      image: 'Сохраняю изображение товара…',
      productParameters: 'Собираю характеристики товара…',
      originalMark: 'Проверяю оригинальность товара…',
      sellerId: 'Определяю продавца…',
      sellerInfo: 'Собираю информацию о продавце…',
      completed: 'Сбор данных завершен',
      error: 'Произошла ошибка при сборе данных',
      timeout: 'Превышено время ожидания',
      captcha: 'Обнаружена капча, повторяю попытку...'
    };
  }

  // Свойства доступны для чтения
  public readonly userAgent: string;
  public readonly scrapeTimeout: number;
  public readonly retryAttempts: number;
  public readonly retryDelay: number;
  public readonly messages: Record<string, string>;

  // Метод для обновления настроек (если потребуется)
  updateSettings(newSettings: Partial<ScraperSettings>): void {
    Object.assign(this, newSettings);
  }
}

export default Settings;
