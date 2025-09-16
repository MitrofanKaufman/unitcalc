// path: src/config/session.ts
/**
 * Конфигурация сессий для приложения
 * Обеспечивает безопасное хранение данных сессии
 */

import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import config from './config';

// Создаем хранилище сессий в MongoDB
const MongoStore = connectMongo(session);

// Настройки сессии
const sessionConfig: session.SessionOptions = {
  // Секретный ключ для подписи куки сессии
  secret: config.session.secret,
  
  // Настройки куки
  cookie: {
    // В продакшне должно быть true для работы только по HTTPS
    secure: config.nodeEnv === 'production',
    
    // Время жизни куки в миллисекундах (7 дней)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    
    // Запрещаем доступ к куки из JavaScript
    httpOnly: true,
    
    // Защита от CSRF-атак
    sameSite: 'lax', // или 'strict' для более строгой политики
    
    // Домен, для которого установлены куки
    domain: config.nodeEnv === 'production' ? '.yourdomain.com' : undefined,
    
    // Путь, для которого установлены куки
    path: '/',
  },
  
  // Имя куки сессии
  name: 'sid',
  
  // Принудительно сохранять сессию, даже если она не изменилась
  resave: false,
  
  // Сохранять неинициализированные сессии
  saveUninitialized: false,
  
  // Настройки хранилища сессий
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
    ttl: 7 * 24 * 60 * 60, // 7 дней
    autoRemove: 'native', // автоматическое удаление истекших сессий
    autoRemoveInterval: 60 * 24, // проверка каждые 24 часа
  }),
  
  // Функция для генерации ID сессии
  genid: (req: any) => {
    return require('crypto').randomBytes(16).toString('hex');
  },
  
  // Функция для валидации сессии
  rolling: true, // продлевать сессию при каждом запросе
  
  // Обработчик ошибок хранилища сессий
  unset: 'destroy', // удалять сессию при завершении ответа
};

// Middleware для инициализации сессии
export const sessionMiddleware = (req: any, res: any, next: any) => {
  // Пропускаем запросы к API, если это не аутентификация
  if (req.path.startsWith('/api/') && !req.path.includes('/auth/')) {
    return next();
  }
  
  return session(sessionConfig)(req, res, next);
};

// Функция для инициализации сессий
export const initializeSessions = (app: any) => {
  // Включаем доверенный прокси для работы за обратным прокси
  app.set('trust proxy', 1);
  
  // Подключаем middleware сессий
  app.use(sessionMiddleware);
  
  // Middleware для установки флага аутентификации в шаблонах
  app.use((req: any, res: any, next: any) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user || null;
    next();
  });
  
  return app;
};

export default sessionConfig;
