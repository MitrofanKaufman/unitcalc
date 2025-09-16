// path: src/types/express.d.ts
/**
 * Расширение типов Express для приложения
 */

import { User } from '@db/models/User';

declare global {
  namespace Express {
    // Расширяем интерфейс Request для добавления пользовательских полей
    interface Request {
      user?: User;
      requestId?: string;
      startTime?: number;
      // Добавьте здесь другие пользовательские поля, если необходимо
    }

    // Расширяем интерфейс Response для добавления пользовательских методов
    interface Response {
      success: (data?: any, message?: string) => void;
      error: (message: string, statusCode?: number, error?: any) => void;
    }
  }
}

// Объявляем модуль для работы с JSON-файлами
declare module '*.json' {
  const value: any;
  export default value;
}
