// path: src/config/validation.ts
/**
 * Конфигурация валидации с использованием Joi
 * Определяет схемы валидации для всех входных данных API
 */

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { UserRole } from '../db/models/User';

// Расширяем типы Joi для поддержки валидации ObjectId
const JoiObjectId = require('joi-objectid')(Joi);

// Кастомные валидаторы
const customValidators = {
  // Валидация пароля
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .message(
      'Пароль должен содержать минимум 8 символов, хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
    ),

  // Валидация email
  email: Joi.string().email().lowercase().trim(),

  // Валидация ObjectId
  objectId: JoiObjectId(),

  // Валидация номера телефона (международный формат)
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),

  // Валидация URL
  url: Joi.string().uri({
    scheme: ['http', 'https'],
  }),

  // Валидация даты в формате ISO
  dateISO: Joi.date().iso(),

  // Валидация валюты (положительное число с 2 знаками после запятой)
  currency: Joi.number().positive().precision(2),

  // Валидация рейтинга (от 1 до 5)
  rating: Joi.number().min(1).max(5),

  // Валидация координат (широта, долгота)
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
};

// Схемы валидации для разных сущностей
const schemas = {
  // Аутентификация
  auth: {
    register: Joi.object({
      email: customValidators.email.required(),
      password: customValidators.password.required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      username: Joi.string().min(3).max(30).required(),
      firstName: Joi.string().min(2).max(50),
      lastName: Joi.string().min(2).max(50),
      acceptTerms: Joi.boolean().valid(true).required(),
    }),

    login: Joi.object({
      email: customValidators.email.required(),
      password: Joi.string().required(),
      rememberMe: Joi.boolean().default(false),
    }),

    refreshToken: Joi.object({
      refreshToken: Joi.string().required(),
    }),

    forgotPassword: Joi.object({
      email: customValidators.email.required(),
    }),

    resetPassword: Joi.object({
      token: Joi.string().required(),
      password: customValidators.password.required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    }),
  },

  // Пользователи
  users: {
    createUser: Joi.object({
      email: customValidators.email.required(),
      password: customValidators.password.required(),
      username: Joi.string().min(3).max(30).required(),
      firstName: Joi.string().min(2).max(50),
      lastName: Joi.string().min(2).max(50),
      role: Joi.string().valid(...Object.values(UserRole)),
      isActive: Joi.boolean(),
    }),

    updateUser: Joi.object({
      email: customValidators.email,
      username: Joi.string().min(3).max(30),
      firstName: Joi.string().min(2).max(50),
      lastName: Joi.string().min(2).max(50),
      role: Joi.string().valid(...Object.values(UserRole)),
      isActive: Joi.boolean(),
    }).min(1), // Хотя бы одно поле должно быть указано

    updateProfile: Joi.object({
      email: customValidators.email,
      username: Joi.string().min(3).max(30),
      firstName: Joi.string().min(2).max(50),
      lastName: Joi.string().min(2).max(50),
      phone: customValidators.phone,
      avatar: customValidators.url,
    }).min(1),

    changePassword: Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: customValidators.password.required(),
      confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
    }),
  },

  // Товары
  products: {
    createProduct: Joi.object({
      name: Joi.string().min(3).max(255).required(),
      description: Joi.string().allow(''),
      shortDescription: Joi.string().max(1000).allow(''),
      sku: Joi.string().min(3).max(100),
      barcode: Joi.string().allow(''),
      price: Joi.number().positive().precision(2).required(),
      compareAtPrice: Joi.number().positive().precision(2).greater(Joi.ref('price')),
      cost: Joi.number().positive().precision(2).required(),
      taxRate: Joi.number().min(0).max(100).precision(2),
      categories: Joi.array().items(customValidators.objectId),
      tags: Joi.array().items(Joi.string().min(2).max(50)),
      brand: Joi.string().max(100).allow(''),
      model: Joi.string().max(100).allow(''),
      isActive: Joi.boolean(),
      isFeatured: Joi.boolean(),
      isDigital: Joi.boolean(),
      isDownloadable: Joi.boolean(),
      requiresShipping: Joi.boolean(),
      isGiftCard: Joi.boolean(),
      seoTitle: Joi.string().max(70).allow(''),
      seoDescription: Joi.string().max(320).allow(''),
      seoKeywords: Joi.array().items(Joi.string().min(2).max(50)),
      externalId: Joi.string().allow(''),
      externalSource: Joi.string().valid('wildberries', 'ozon', 'yandex-market', 'sbermegamarket'),
    }),

    updateProduct: Joi.object({
      name: Joi.string().min(3).max(255),
      description: Joi.string().allow(''),
      shortDescription: Joi.string().max(1000).allow(''),
      sku: Joi.string().min(3).max(100),
      barcode: Joi.string().allow(''),
      price: Joi.number().positive().precision(2),
      compareAtPrice: Joi.number().positive().precision(2).greater(Joi.ref('price')),
      cost: Joi.number().positive().precision(2),
      taxRate: Joi.number().min(0).max(100).precision(2),
      categories: Joi.array().items(customValidators.objectId),
      tags: Joi.array().items(Joi.string().min(2).max(50)),
      brand: Joi.string().max(100).allow(''),
      model: Joi.string().max(100).allow(''),
      isActive: Joi.boolean(),
      isFeatured: Joi.boolean(),
      isDigital: Joi.boolean(),
      isDownloadable: Joi.boolean(),
      requiresShipping: Joi.boolean(),
      isGiftCard: Joi.boolean(),
      seoTitle: Joi.string().max(70).allow(''),
      seoDescription: Joi.string().max(320).allow(''),
      seoKeywords: Joi.array().items(Joi.string().min(2).max(50)),
      externalId: Joi.string().allow(''),
      externalSource: Joi.string().valid('wildberries', 'ozon', 'yandex-market', 'sbermegamarket'),
    }).min(1),

    // Валидация параметров запроса для поиска товаров
    queryParams: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      sort: Joi.string().pattern(/^[a-zA-Z0-9_,.\s-]+$/),
      fields: Joi.string().pattern(/^[a-zA-Z0-9_,\s]+$/),
      q: Joi.string().min(1).max(255),
      category: customValidators.objectId,
      brand: Joi.string(),
      minPrice: Joi.number().positive(),
      maxPrice: Joi.number().positive(),
      inStock: Joi.boolean(),
      isActive: Joi.boolean(),
      isFeatured: Joi.boolean(),
      externalSource: Joi.string().valid('wildberries', 'ozon', 'yandex-market', 'sbermegamarket'),
    }),
  },

  // Заказы
  orders: {
    createOrder: Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            productId: customValidators.objectId.required(),
            variantId: customValidators.objectId,
            quantity: Joi.number().integer().min(1).required(),
            price: Joi.number().positive().precision(2).required(),
          }),
        )
        .min(1)
        .required(),
      shippingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address1: Joi.string().required(),
        address2: Joi.string().allow(''),
        city: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
        phone: customValidators.phone.required(),
      }).required(),
      billingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        company: Joi.string().allow(''),
        address1: Joi.string().required(),
        address2: Joi.string().allow(''),
        city: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
        phone: customValidators.phone.required(),
        email: customValidators.email.required(),
      }).required(),
      paymentMethod: Joi.string().required(),
      shippingMethod: Joi.string().required(),
      customerNote: Joi.string().allow(''),
      createAccount: Joi.boolean(),
      termsAccepted: Joi.boolean().valid(true).required(),
    }),

    updateOrderStatus: Joi.object({
      status: Joi.string()
        .valid('pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed')
        .required(),
      note: Joi.string().allow(''),
      notifyCustomer: Joi.boolean(),
    }),

    queryParams: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      sort: Joi.string().pattern(/^[a-zA-Z0-9_,.\s-]+$/),
      status: Joi.string().valid(
        'pending',
        'processing',
        'on-hold',
        'completed',
        'cancelled',
        'refunded',
        'failed',
      ),
      customer: Joi.string(),
      dateFrom: customValidators.dateISO,
      dateTo: customValidators.dateISO,
    }),
  },

  // Отзывы
  reviews: {
    createReview: Joi.object({
      productId: customValidators.objectId.required(),
      rating: customValidators.rating.required(),
      title: Joi.string().max(100).allow(''),
      comment: Joi.string().max(2000).required(),
      images: Joi.array().items(customValidators.url),
      isAnonymous: Joi.boolean(),
    }),

    updateReview: Joi.object({
      rating: customValidators.rating,
      title: Joi.string().max(100).allow(''),
      comment: Joi.string().max(2000),
      images: Joi.array().items(customValidators.url),
    }).min(1),

    queryParams: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      sort: Joi.string().pattern(/^[a-zA-Z0-9_,.\s-]+$/),
      rating: Joi.number().integer().min(1).max(5),
      product: customValidators.objectId,
      user: customValidators.objectId,
      verified: Joi.boolean(),
      withImages: Joi.boolean(),
    }),
  },

  // Расчеты рентабельности
  calculations: {
    calculateProfitability: Joi.object({
      productId: customValidators.objectId.required(),
      price: Joi.number().positive().precision(2).required(),
      quantity: Joi.number().integer().min(1).default(1),
      shippingCost: Joi.number().min(0).precision(2).default(0),
      promotionCost: Joi.number().min(0).precision(2).default(0),
      otherCosts: Joi.number().min(0).precision(2).default(0),
      taxRate: Joi.number().min(0).max(100).precision(2),
      isFbo: Joi.boolean().default(true),
      includeVat: Joi.boolean().default(false),
    }),

    batchCalculate: Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            productId: customValidators.objectId.required(),
            price: Joi.number().positive().precision(2).required(),
            quantity: Joi.number().integer().min(1).default(1),
          }),
        )
        .min(1)
        .max(100)
        .required(),
      shippingCost: Joi.number().min(0).precision(2).default(0),
      promotionCost: Joi.number().min(0).precision(2).default(0),
      otherCosts: Joi.number().min(0).precision(2).default(0),
      taxRate: Joi.number().min(0).max(100).precision(2),
      isFbo: Joi.boolean().default(true),
      includeVat: Joi.boolean().default(false),
    }),
  },

  // Интеграция с Wildberries
  wildberries: {
    syncProducts: Joi.object({
      dateFrom: customValidators.dateISO.required(),
      dateTo: customValidators.dateISO,
      limit: Joi.number().integer().min(1).max(1000).default(100),
      skip: Joi.number().integer().min(0).default(0),
      isNewOnly: Joi.boolean().default(false),
    }),

    updateStocks: Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            barcode: Joi.string().required(),
            warehouseId: Joi.number().integer().required(),
            amount: Joi.number().integer().min(0).required(),
          }),
        )
        .min(1)
        .required(),
    }),

    updatePrices: Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            barcode: Joi.string().required(),
            price: Joi.number().positive().precision(2).required(),
            discount: Joi.number().min(0).max(100).precision(2).default(0),
          }),
        )
        .min(1)
        .required(),
    }),

    getAnalytics: Joi.object({
      dateFrom: customValidators.dateISO.required(),
      dateTo: customValidators.dateISO.required(),
      limit: Joi.number().integer().min(1).max(1000).default(100),
      skip: Joi.number().integer().min(0).default(0),
      orderBy: Joi.string().valid('date', 'ordersCount', 'revenue', 'profit').default('date'),
      orderDirection: Joi.string().valid('asc', 'desc').default('desc'),
      barcode: Joi.string(),
      category: Joi.string(),
      brand: Joi.string(),
    }),
  },
};

/**
 * Middleware для валидации входящих данных
 * @param schema Схема валидации Joi
 * @param source Источник данных (body, query, params, headers)
 * @returns Middleware функцию для Express
 */
const validate = (schema: Joi.Schema, source: 'body' | 'query' | 'params' | 'headers' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Возвращать все ошибки, а не только первую
      allowUnknown: true, // Разрешать неизвестные поля
      stripUnknown: true, // Удалять неизвестные поля
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/["']/g, ''),
        type: detail.type,
      }));

      return next(new ApiError('Ошибка валидации', 422, 'VALIDATION_ERROR', { errors }));
    }

    // Заменяем валидированные данные
    req[source] = value;
    next();
  };
};

// Экспортируем схемы и утилиты
export { schemas, customValidators, validate };

export default {
  schemas,
  validators: customValidators,
  validate,
};
