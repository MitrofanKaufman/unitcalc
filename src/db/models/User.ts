// path: src/db/models/User.ts
/**
 * Модель пользователя
 * Определяет структуру и типы данных для пользователей приложения
 */

// Роли пользователей в системе
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  MODERATOR = 'moderator'
}

// Настройки пользователя
export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  // Дополнительные настройки
  [key: string]: any;
}

// Основной интерфейс пользователя
export interface User {
  id: number | string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Дополнительные поля
  firstName?: string;
  lastName?: string;
  avatar?: string;
  settings?: UserSettings;
}

// Данные для аутентификации пользователя
export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Данные для регистрации нового пользователя
export interface RegisterData extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'isActive' | 'role' | 'passwordHash'> {
  password: string; // Пароль (не хеш)
  confirmPassword: string;
  acceptTerms: boolean;
}

// Обновленные данные пользователя
export type UpdateUserData = Partial<Omit<User, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'>>;
