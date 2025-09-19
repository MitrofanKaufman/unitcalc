/**
 * Типы данных для работы с настройками приложения
 */

export interface AppSettings {
  // API ключи
  api: {
    wildberriesApiKey: string;
  };
  
  // Параметры расчета
  calculation: {
    commissionRate: number;  // Процент комиссии Wildberries
    logisticsCost: number;   // Стоимость логистики
    storageCost: number;     // Стоимость хранения
    otherFees: number;       // Прочие расходы
  };
  
  // Настройки уведомлений
  notifications: {
    email: string;           // Email для уведомлений
    enableEmail: boolean;    // Включить email-уведомления
    enableBrowser: boolean;  // Включить браузерные уведомления
    lowStockThreshold: number; // Порог остатков для уведомлений
  };
  
  // Общие настройки
  general: {
    currency: string;        // Валюта по умолчанию
    language: string;        // Язык интерфейса
    theme: 'light' | 'dark' | 'system'; // Тема оформления
  };
}

// Настройки по умолчанию
export const defaultSettings: AppSettings = {
  api: {
    wildberriesApiKey: '',
  },
  calculation: {
    commissionRate: 15,
    logisticsCost: 0,
    storageCost: 0,
    otherFees: 0,
  },
  notifications: {
    email: '',
    enableEmail: true,
    enableBrowser: true,
    lowStockThreshold: 10,
  },
  general: {
    currency: 'RUB',
    language: 'ru',
    theme: 'system',
  },
};

// Валидация настроек
export function validateSettings(settings: Partial<AppSettings>): string | null {
  if (settings.calculation?.commissionRate < 0 || settings.calculation?.commissionRate > 100) {
    return 'Комиссия должна быть в диапазоне от 0 до 100%';
  }
  
  if (settings.notifications?.email && !/^\S+@\S+\.\S+$/.test(settings.notifications.email)) {
    return 'Некорректный формат email';
  }
  
  if (settings.notifications?.lowStockThreshold < 0) {
    return 'Порог остатков не может быть отрицательным';
  }
  
  return null; // Валидация пройдена
}
