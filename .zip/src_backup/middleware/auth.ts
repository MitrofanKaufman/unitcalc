// path: src/middleware/auth.ts
/**
 * Middleware для аутентификации и авторизации
 * Обеспечивает защиту маршрутов и проверку прав доступа
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { AUTH, USER_ROLES, HTTP_STATUS_CODES, ERROR_CODES } from '../config/constants';
import ApiResponse from '../utils/apiResponse';
import { User } from '../db/models/User';

// Расширяем интерфейс Request для добавления пользовательских полей
declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}

// Асинхронная версия jwt.verify
const verifyToken = promisify(jwt.verify) as (
  token: string,
  secret: string,
  options?: jwt.VerifyOptions
) => Promise<any>;

/**
 * Middleware для проверки аутентификации пользователя
 * Проверяет наличие и валидность JWT токена
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Получаем токен из заголовка Authorization
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies[AUTH.COOKIE_NAME]) {
      // Или из куки, если используется браузерная аутентификация
      token = req.cookies[AUTH.COOKIE_NAME];
    }

    // 2) Проверяем наличие токена
    if (!token) {
      return ApiResponse.unauthorized(
        res,
        'Вы не авторизованы. Пожалуйста, войдите в систему.'
      );
    }

    // 3) Верифицируем токен
    const decoded = await verifyToken(token, AUTH.JWT_SECRET);

    // 4) Проверяем, существует ли пользователь (в реальном приложении - запрос к БД)
    // Здесь должен быть запрос к базе данных для поиска пользователя по ID
    // const currentUser = await User.findById(decoded.id);
    const currentUser = { id: decoded.id, role: decoded.role }; // Заглушка

    if (!currentUser) {
      return ApiResponse.unauthorized(
        res,
        'Пользователь, принадлежащий этому токену, больше не существует.'
      );
    }

    // 5) Проверяем, не менял ли пользователь пароль после выдачи токена
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   return ApiResponse.unauthorized(
    //     res,
    //     'Пользователь недавно изменил пароль. Пожалуйста, войдите снова.'
    //   );
    // }

    // 6) Добавляем пользователя в объект запроса
    req.user = currentUser;
    req.token = token;

    // 7) Продолжаем выполнение
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Неверный токен. Пожалуйста, войдите снова.');
    }
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(
        res,
        'Ваша сессия истекла. Пожалуйста, войдите снова.'
      );
    }
    
    // Логируем ошибку для отладки
    console.error('Ошибка аутентификации:', error);
    
    // Возвращаем общую ошибку сервера
    return ApiResponse.error(
      res,
      'Произошла ошибка при аутентификации',
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR
    );
  }
};

/**
 * Middleware для проверки прав доступа на основе ролей
 * @param roles Массив разрешенных ролей
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1) Проверяем, что пользователь аутентифицирован
    if (!req.user) {
      return ApiResponse.unauthorized(
        res,
        'Необходима аутентификация для доступа к этому ресурсу.'
      );
    }

    // 2) Проверяем, есть ли у пользователя необходимая роль
    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        'У вас нет прав для выполнения этого действия.'
      );
    }

    // 3) Продолжаем выполнение, если проверка пройдена
    next();
  };
};

/**
 * Middleware для защиты от CSRF атак
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Пропускаем GET, HEAD, OPTIONS запросы
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Проверяем заголовок Origin или Referer
  const origin = req.get('origin') || req.get('referer');
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-production-domain.com',
  ];

  if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return ApiResponse.forbidden(
      res,
      'Запрос с этого источника не разрешен.'
    );
  }

  // Проверяем CSRF-токен для форм
  if (req.is('application/x-www-form-urlencoded') || req.is('multipart/form-data')) {
    const csrfToken = req.body._csrf || req.headers['x-csrf-token'];
    
    if (!csrfToken || csrfToken !== req.csrfToken?.()) {
      return ApiResponse.forbidden(
        res,
        'Неверный CSRF-токен. Пожалуйста, обновите страницу и попробуйте снова.'
      );
    }
  }

  next();
};

/**
 * Middleware для ограничения количества запросов с одного IP
 */
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // лимит запросов с одного IP
  message: 'Слишком много запросов с вашего IP. Пожалуйста, повторите попытку позже.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware для проверки API-ключа
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  // В реальном приложении нужно проверить ключ в базе данных
  const validApiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey !== validApiKey) {
    return ApiResponse.unauthorized(
      res,
      'Неверный или отсутствующий API-ключ.'
    );
  }
  
  next();
};

/**
 * Middleware для проверки прав доступа к ресурсу
 * @param resourceOwnerId ID владельца ресурса (например, ID пользователя)
 */
export const checkOwnership = (resourceOwnerId: string | number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Проверяем, что пользователь аутентифицирован
    if (!req.user) {
      return ApiResponse.unauthorized(
        res,
        'Необходима аутентификация для доступа к этому ресурсу.'
      );
    }
    
    // Админы имеют доступ ко всему
    if (req.user.role === USER_ROLES.ADMIN) {
      return next();
    }
    
    // Проверяем, является ли пользователь владельцем ресурса
    if (String(req.user.id) !== String(resourceOwnerId)) {
      return ApiResponse.forbidden(
        res,
        'У вас нет прав для доступа к этому ресурсу.'
      );
    }
    
    next();
  };
};
