/**
 * Класс Messages
 * Управление системными сообщениями с поддержкой локализации.
 */

export default class Messages {
  /**
   * Конструктор класса Messages
   * @param {string} locale - Локаль (по умолчанию 'ru')
   */
  constructor(locale = 'ru') {
    this.locale = locale;
    this.messages = {
      ru: {
        // Общие сообщения
        error: {
          unknown: 'Произошла неизвестная ошибка',
          notFound: 'Ресурс не найден',
          validation: 'Ошибка валидации',
          unauthorized: 'Не авторизован',
          forbidden: 'Доступ запрещен',
          serverError: 'Внутренняя ошибка сервера',
          timeout: 'Превышено время ожидания ответа',
          network: 'Ошибка сети',
        },
        
        // Сообщения для работы с API
        api: {
          success: 'Запрос выполнен успешно',
          invalidResponse: 'Некорректный ответ от сервера',
          rateLimit: 'Превышено количество запросов',
          maintenance: 'Сервис временно недоступен',
        },
        
        // Сообщения для работы с данными
        data: {
          saved: 'Данные успешно сохранены',
          deleted: 'Данные успешно удалены',
          notFound: 'Данные не найдены',
          invalid: 'Некорректные данные',
        },
      },
      
      // Английская локаль (можно добавить другие языки)
      en: {
        error: {
          unknown: 'An unknown error occurred',
          notFound: 'Resource not found',
          validation: 'Validation error',
          unauthorized: 'Unauthorized',
          forbidden: 'Forbidden',
          serverError: 'Internal server error',
          timeout: 'Request timeout',
          network: 'Network error',
        },
        api: {
          success: 'Request completed successfully',
          invalidResponse: 'Invalid server response',
          rateLimit: 'Too many requests',
          maintenance: 'Service temporarily unavailable',
        },
        data: {
          saved: 'Data saved successfully',
          deleted: 'Data deleted successfully',
          notFound: 'Data not found',
          invalid: 'Invalid data',
        },
      },
    };
  }

  /**
   * Получить сообщение по ключу
   * @param {string} key - Ключ сообщения (например, 'error.unauthorized')
   * @param {Object} [params] - Параметры для подстановки в сообщение
   * @returns {string} - Локализованное сообщение
   */
  get(key, params = {}) {
    const keys = key.split('.');
    let message = this.messages[this.locale] || this.messages.ru; // По умолчанию русский
    
    // Ищем вложенные свойства
    for (const k of keys) {
      if (message && message[k] !== undefined) {
        message = message[k];
      } else {
        // Если сообщение не найдено, возвращаем ключ
        return key;
      }
    }
    
    // Подставляем параметры в сообщение
    if (typeof message === 'string' && Object.keys(params).length > 0) {
      return Object.entries(params).reduce(
        (msg, [param, value]) => msg.replace(new RegExp(`{{${param}}}`, 'g'), value),
        message
      );
    }
    
    return message || key;
  }
  
  /**
   * Установить локаль
   * @param {string} locale - Новая локаль (например, 'ru', 'en')
   */
  setLocale(locale) {
    if (this.messages[locale]) {
      this.locale = locale;
    }
    return this;
  }
  
  /**
   * Получить все сообщения для текущей локали
   * @returns {Object} - Объект с сообщениями
   */
  getAll() {
    return this.messages[this.locale] || this.messages.ru;
  }
  
  /**
   * Добавить или обновить сообщения для локали
   * @param {string} locale - Локаль
   * @param {Object} messages - Объект с сообщениями
   */
  setMessages(locale, messages) {
    if (!this.messages[locale]) {
      this.messages[locale] = {};
    }
    
    // Рекурсивное слияние объектов
    const merge = (target, source) => {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) {
            target[key] = {};
          }
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      });
      return target;
    };
    
    this.messages[locale] = merge(this.messages[locale], messages);
    return this;
  }
}

// Создаем экземпляр по умолчанию
export const messages = new Messages();

// Хелперы для быстрого доступа к сообщениям
export const t = (key, params) => messages.get(key, params);
export const setLocale = (locale) => messages.setLocale(locale);
export const getMessages = () => messages.getAll();
export const setMessages = (locale, messages) => messages.setMessages(locale, messages);
