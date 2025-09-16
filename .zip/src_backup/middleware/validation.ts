// path: src/middleware/validation.ts
/**
 * Middleware для валидации входящих данных
 * Обеспечивает проверку и санитизацию входных данных
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body, param, query } from 'express-validator';
import { matchedData } from 'express-validator';
import { LIMITS, ERROR_CODES } from '../config/constants';
import ApiResponse from '../utils/apiResponse';

/**
 * Обработчик ошибок валидации
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Запускаем все валидации
    await Promise.all(validations.map(validation => validation.run(req)));

    // Получаем ошибки валидации
    const errors = validationResult(req);
    
    // Если есть ошибки, возвращаем их клиенту
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      }));
      
      return ApiResponse.validationError(
        res,
        'Ошибка валидации входящих данных',
        { errors: errorMessages }
      );
    }

    // Заменяем тело запроса на провалидированные данные
    req.body = matchedData(req, { locations: ['body'] });
    
    // Продолжаем выполнение
    next();
  };
};

/**
 * Правила валидации для аутентификации
 */
export const authValidation = {
  // Вход в систему
  login: validate([
    body('email')
      .trim()
      .notEmpty().withMessage('Email обязателен')
      .isEmail().withMessage('Некорректный формат email')
      .normalizeEmail(),
      
    body('password')
      .notEmpty().withMessage('Пароль обязателен')
      .isLength({ min: LIMITS.PASSWORD_MIN_LENGTH })
      .withMessage(`Пароль должен содержать минимум ${LIMITS.PASSWORD_MIN_LENGTH} символов`)
  ]),
  
  // Регистрация
  register: validate([
    body('name')
      .trim()
      .notEmpty().withMessage('Имя обязательно')
      .isLength({ min: 2, max: 50 })
      .withMessage('Имя должно содержать от 2 до 50 символов'),
      
    body('email')
      .trim()
      .notEmpty().withMessage('Email обязателен')
      .isEmail().withMessage('Некорректный формат email')
      .normalizeEmail(),
      
    body('password')
      .notEmpty().withMessage('Пароль обязателен')
      .isLength({ min: LIMITS.PASSWORD_MIN_LENGTH })
      .withMessage(`Пароль должен содержать минимум ${LIMITS.PASSWORD_MIN_LENGTH} символов`)
      .matches(/[0-9]/).withMessage('Пароль должен содержать хотя бы одну цифру')
      .matches(/[a-zA-Z]/).withMessage('Пароль должен содержать хотя бы одну букву')
  ]),
  
  // Обновление пароля
  updatePassword: validate([
    body('currentPassword')
      .notEmpty().withMessage('Текущий пароль обязателен'),
      
    body('newPassword')
      .notEmpty().withMessage('Новый пароль обязателен')
      .isLength({ min: LIMITS.PASSWORD_MIN_LENGTH })
      .withMessage(`Пароль должен содержать минимум ${LIMITS.PASSWORD_MIN_LENGTH} символов`)
      .matches(/[0-9]/).withMessage('Пароль должен содержать хотя бы одну цифру')
      .matches(/[a-zA-Z]/).withMessage('Пароль должен содержать хотя бы одну букву')
      .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
          throw new Error('Новый пароль должен отличаться от текущего');
        }
        return true;
      }),
      
    body('confirmPassword')
      .notEmpty().withMessage('Подтверждение пароля обязательно')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Пароли не совпадают');
        }
        return true;
      })
  ]),
  
  // Сброс пароля
  forgotPassword: validate([
    body('email')
      .trim()
      .notEmpty().withMessage('Email обязателен')
      .isEmail().withMessage('Некорректный формат email')
      .normalizeEmail()
  ]),
  
  // Подтверждение сброса пароля
  resetPassword: validate([
    body('token')
      .notEmpty().withMessage('Токен сброса пароля обязателен'),
      
    body('password')
      .notEmpty().withMessage('Пароль обязателен')
      .isLength({ min: LIMITS.PASSWORD_MIN_LENGTH })
      .withMessage(`Пароль должен содержать минимум ${LIMITS.PASSWORD_MIN_LENGTH} символов`)
  ])
};

/**
 * Правила валидации для товаров
 */
export const productValidation = {
  // Получение списка товаров
  list: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Номер страницы должен быть положительным числом')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Лимит должен быть числом от 1 до 100')
      .toInt(),
    query('sort')
      .optional()
      .isString().withMessage('Поле сортировки должно быть строкой')
  ],

  // Валидация параметра ID
  idParam: [
    param('id')
      .exists().withMessage('ID товара обязателен')
      .isMongoId().withMessage('Неверный формат ID товара')
  ],

  // Получение товара по ID (аналог getById)
  getById: [
    param('id')
      .exists().withMessage('ID товара обязателен')
      .isMongoId().withMessage('Неверный формат ID товара'),
    query('fields')
      .optional()
      .isString().withMessage('Поля должны быть строкой')
      .matches(/^[\w\s,]+$/).withMessage('Недопустимый формат полей')
  ],

  // Валидация для расчета рентабельности
  calculateProfitability: [
    body('price')
      .exists().withMessage('Цена обязательна')
      .isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
    body('cost')
      .exists().withMessage('Себестоимость обязательна')
      .isFloat({ min: 0 }).withMessage('Себестоимость должна быть положительным числом'),
    body('commission')
      .optional()
      .isFloat({ min: 0, max: 100 }).withMessage('Комиссия должна быть в диапазоне от 0 до 100%'),
    body('logistics')
      .optional()
      .isFloat({ min: 0 }).withMessage('Стоимость логистики должна быть положительным числом')
  ],

  // Поиск товаров
  search: [
    query('query')
      .exists().withMessage('Поисковый запрос обязателен')
      .isString().withMessage('Поисковый запрос должен быть строкой')
      .trim()
      .isLength({ min: 2 }).withMessage('Минимальная длина поискового запроса - 2 символа'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Лимит должен быть числом от 1 до 100')
      .toInt(),
    query('offset')
      .optional()
      .isInt({ min: 0 }).withMessage('Смещение должно быть положительным числом')
      .toInt()
  ],

  // Создание/обновление товара
  createUpdate: validate([
    body('name')
      .trim()
      .notEmpty().withMessage('Название товара обязательно')
      .isLength({ max: 255 })
      .withMessage('Название товара не должно превышать 255 символов'),
      
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Описание не должно превышать 1000 символов'),
      
    body('price')
      .notEmpty().withMessage('Цена обязательна')
      .isFloat({ min: 0.01 })
      .withMessage('Цена должна быть больше 0')
      .toFloat(),
      
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Количество не может быть отрицательным')
      .toInt(),
      
    body('category')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Название категории не должно превышать 100 символов'),
      
    body('images')
      .optional()
      .isArray()
      .withMessage('Изображения должны быть массивом')
      .custom((images) => {
        if (images.length > 10) {
          throw new Error('Максимальное количество изображений - 10');
        }
        return true;
      })
  ]),
  
  // Получение товаров с пагинацией
  list: validate([
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Номер страницы должен быть положительным числом')
      .toInt()
      .default(1),
      
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Лимит должен быть от 1 до 100')
      .toInt()
      .default(10),
      
    query('sort')
      .optional()
      .trim()
      .isIn(['price', '-price', 'name', '-name', 'createdAt', '-createdAt'])
      .withMessage('Некорректное поле для сортировки'),
      
    query('category')
      .optional()
      .trim(),
      
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Поисковый запрос не должен превышать 100 символов')
  ]),
  
  // Импорт товаров
  import: validate([
    body('products')
      .isArray()
      .withMessage('Необходим массив товаров')
      .isArray({ min: 1, max: 1000 })
      .withMessage('Можно импортировать от 1 до 1000 товаров за раз'),
      
    body('products.*.name')
      .trim()
      .notEmpty().withMessage('Название товара обязательно')
      .isLength({ max: 255 })
      .withMessage('Название товара не должно превышать 255 символов'),
      
    body('products.*.price')
      .notEmpty().withMessage('Цена обязательна')
      .isFloat({ min: 0.01 })
      .withMessage('Цена должна быть больше 0')
  ])
};

/**
 * Правила валидации для заказов
 */
export const orderValidation = {
  // Создание заказа
  create: validate([
    body('items')
      .isArray({ min: 1 })
      .withMessage('Заказ должен содержать хотя бы один товар'),
      
    body('items.*.productId')
      .notEmpty().withMessage('ID товара обязательно')
      .isMongoId().withMessage('Некорректный формат ID товара'),
      
    body('items.*.quantity')
      .notEmpty().withMessage('Количество обязательно')
      .isInt({ min: 1 })
      .withMessage('Количество должно быть положительным числом')
      .toInt(),
      
    body('shippingAddress')
      .optional()
      .isObject()
      .withMessage('Адрес доставки должен быть объектом'),
      
    body('shippingAddress.street')
      .if(body('shippingAddress').exists())
      .notEmpty().withMessage('Улица обязательна')
      .trim(),
      
    body('shippingAddress.city')
      .if(body('shippingAddress').exists())
      .notEmpty().withMessage('Город обязателен')
      .trim(),
      
    body('shippingAddress.postalCode')
      .if(body('shippingAddress').exists())
      .notEmpty().withMessage('Почтовый индекс обязателен')
      .isPostalCode('any')
      .withMessage('Некорректный почтовый индекс')
  ]),
  
  // Обновление статуса заказа
  updateStatus: validate([
    body('status')
      .notEmpty().withMessage('Статус обязателен')
      .isIn(['processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Некорректный статус заказа')
  ])
};

/**
 * Правила валидации для работы с API Wildberries
 */
export const wbValidation = {
  // Поиск товаров
  searchProducts: validate([
    query('query')
      .trim()
      .notEmpty().withMessage('Поисковый запрос обязателен')
      .isLength({ min: 2, max: 100 })
      .withMessage('Поисковый запрос должен содержать от 2 до 100 символов'),
      
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Номер страницы должен быть положительным числом')
      .toInt()
      .default(1),
      
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Лимит должен быть от 1 до 50')
      .toInt()
      .default(20),
      
    query('sort')
      .optional()
      .trim()
      .isIn(['price', 'rating', 'reviewRating', 'orders'])
      .withMessage('Некорректное поле для сортировки')
  ]),
  
  // Расчет рентабельности
  calculateProfitability: validate([
    body('price')
      .notEmpty().withMessage('Цена обязательна')
      .isFloat({ min: 0.01 })
      .withMessage('Цена должна быть больше 0')
      .toFloat(),
      
    body('costPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Себестоимость не может быть отрицательной')
      .toFloat(),
      
    body('logisticsCost')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Стоимость логистики не может быть отрицательной')
      .toFloat(),
      
    body('storageDays')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Срок хранения должен быть положительным числом')
      .toInt()
  ])
};

/**
 * Валидация ID в параметрах запроса
 */
export const idParamValidation = validate([
  param('id')
    .notEmpty().withMessage('ID обязателен')
    .isMongoId().withMessage('Некорректный формат ID')
]);

/**
 * Валидация для загрузки файлов
 */
export const fileUploadValidation = (fieldName: string, maxFiles: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Проверяем, есть ли файлы в запросе
    if (!req.files || !req.files[fieldName]) {
      return ApiResponse.validationError(
        res,
        `Файл '${fieldName}' обязателен`,
        { field: fieldName }
      );
    }
    
    const files = Array.isArray(req.files[fieldName]) 
      ? req.files[fieldName] 
      : [req.files[fieldName]];
    
    // Проверяем количество файлов
    if (files.length > maxFiles) {
      return ApiResponse.validationError(
        res,
        `Максимальное количество файлов: ${maxFiles}`,
        { field: fieldName, maxFiles }
      );
    }
    
    // Проверяем размер и тип каждого файла
    for (const file of files) {
      // Проверка размера файла
      if (file.size > LIMITS.MAX_UPLOAD_FILE_SIZE) {
        return ApiResponse.validationError(
          res,
          `Файл '${file.name}' слишком большой. Максимальный размер: ${LIMITS.MAX_UPLOAD_FILE_SIZE / (1024 * 1024)}MB`,
          { 
            field: fieldName,
            file: file.name,
            maxSize: LIMITS.MAX_UPLOAD_FILE_SIZE 
          }
        );
      }
      
      // Проверка типа файла (можно добавить проверку по MIME-типу)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        return ApiResponse.validationError(
          res,
          `Неподдерживаемый тип файла: ${file.mimetype}. Разрешены: ${allowedTypes.join(', ')}`,
          { 
            field: fieldName,
            file: file.name,
            allowedTypes 
          }
        );
      }
    }
    
    // Если все проверки пройдены, сохраняем файлы в запросе
    req.uploadedFiles = files;
    next();
  };
};

/**
 * Middleware для валидации запросов
 * @param validations Массив правил валидации
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Запускаем все валидации
    await Promise.all(validations.map(validation => validation.run(req)));

    // Получаем ошибки валидации
    const errors = validationResult(req);
    
    // Если есть ошибки, возвращаем их клиенту
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      }));
      
      return ApiResponse.validationError(
        res,
        'Ошибка валидации входящих данных',
        { errors: errorMessages }
      );
    }

    // Заменяем тело запроса на провалидированные данные
    req.body = matchedData(req, { locations: ['body'] });
    
    // Продолжаем выполнение
    next();
  };
};

// Экспортируем validateRequest по умолчанию
export default validateRequest;
