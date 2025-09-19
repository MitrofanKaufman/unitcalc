// path: src/config/swagger.ts
/**
 * Конфигурация Swagger/OpenAPI документации
 * Генерирует интерактивную документацию API
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';
import config from './config';

// Метаданные API
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wildberries Profitability Calculator API',
      version: '1.0.0',
      description: 'API для расчета рентабельности товаров на Wildberries',
      contact: {
        name: 'Техническая поддержка',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `${config.api.baseUrl}/api/v1`,
        description: 'Основной сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите JWT токен в формате: Bearer <token>',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API ключ для доступа к защищенным эндпоинтам',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Требуется аутентификация',
        },
        ForbiddenError: {
          description: 'Доступ запрещен',
        },
        NotFoundError: {
          description: 'Ресурс не найден',
        },
        ValidationError: {
          description: 'Ошибка валидации',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
        apiKeyAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Аутентификация и авторизация',
      },
      {
        name: 'Users',
        description: 'Управление пользователями',
      },
      {
        name: 'Products',
        description: 'Управление товарами',
      },
      {
        name: 'Calculations',
        description: 'Расчеты рентабельности',
      },
      {
        name: 'WB API',
        description: 'Интеграция с API Wildberries',
      },
    ],
  },
  // Пути к файлам с аннотациями JSDoc для Swagger
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../controllers/*.ts'),
    path.join(__dirname, '../models/*.ts'),
  ],
};

// Генерируем спецификацию Swagger
const specs = swaggerJsdoc(options);

/**
 * Настройка Swagger UI
 * @param app Экземпляр Express приложения
 * @param basePath Базовый путь для документации
 */
const setupSwagger = (app: Express, basePath = '/api-docs') => {
  // Отключаем Swagger в продакшене
  if (config.nodeEnv === 'production') {
    return;
  }
  
  // Настройка UI Swagger
  const options = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Wildberries Profitability Calculator API',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
    },
  };
  
  // Подключаем Swagger UI
  app.use(
    basePath,
    swaggerUi.serve,
    swaggerUi.setup(specs, options)
  );
  
  // Эндпоинт для получения спецификации в формате JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  
  console.log(`📚 Документация API доступна по адресу: http://localhost:${config.port}${basePath}`);
};

export { setupSwagger, specs };
