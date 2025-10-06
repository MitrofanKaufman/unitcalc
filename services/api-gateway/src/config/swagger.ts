// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\services\api-gateway\src\config\swagger.ts
/**
 * path/to/file.ts
 * Описание: Конфигурация Swagger для документирования API
 * Логика: Серверная (конфигурация API документации)
 * Зависимости: swagger-jsdoc
 * Примечания: Настраивает спецификации OpenAPI для эндпоинтов Wildberries
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wildberries Data Collection API',
      version: '1.0.0',
      description: 'API для автоматизированного сбора данных о товарах с сайта Wildberries',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com/api',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        ProductData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор товара',
              example: '220156288',
            },
            title: {
              type: 'string',
              description: 'Название товара',
              example: 'Паста Птитим 1 кг.',
            },
            price: {
              type: 'number',
              description: 'Цена товара в рублях',
              example: 359,
            },
            rating: {
              type: 'number',
              description: 'Рейтинг товара',
              example: 4.9,
            },
            reviews: {
              type: 'number',
              description: 'Количество отзывов',
              example: 4748,
            },
            questions: {
              type: 'number',
              description: 'Количество вопросов',
              example: 23,
            },
            image: {
              type: 'string',
              description: 'URL изображения товара',
              example: 'https://basket-15.wbbasket.ru/vol2201/part220156/220156288/images/c246x328/1.webp',
            },
            description: {
              type: 'string',
              description: 'Описание товара',
            },
            parameters: {
              type: 'object',
              description: 'Характеристики товара',
              additionalProperties: {
                type: 'string',
              },
            },
            originalMark: {
              type: 'boolean',
              description: 'Является ли товар оригинальным',
              example: true,
            },
            sellerId: {
              type: 'string',
              description: 'ID продавца',
              example: '1420910',
            },
            collectedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Время сбора данных',
            },
            sourceUrl: {
              type: 'string',
              description: 'URL источника данных',
            },
          },
        },
        CollectionProgress: {
          type: 'object',
          properties: {
            currentStep: {
              type: 'string',
              description: 'Текущий шаг сбора',
              example: 'price',
            },
            totalSteps: {
              type: 'number',
              description: 'Общее количество шагов',
              example: 8,
            },
            percentage: {
              type: 'number',
              description: 'Процент выполнения',
              example: 75,
            },
            message: {
              type: 'string',
              description: 'Сообщение о текущем шаге',
              example: 'Собираю характеристики товара...',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Список ошибок',
            },
          },
        },
        ProfitabilityCalculation: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: 'ID товара',
              example: '220156288',
            },
            currentPrice: {
              type: 'number',
              description: 'Текущая цена товара',
              example: 359,
            },
            costs: {
              type: 'number',
              description: 'Общие затраты (закупка + логистика + прочие)',
              example: 250,
            },
            profit: {
              type: 'number',
              description: 'Прибыль',
              example: 109,
            },
            currentMargin: {
              type: 'string',
              description: 'Текущая маржа',
              example: '30.4%',
            },
            desiredMargin: {
              type: 'string',
              description: 'Желаемая маржа',
              example: '30%',
            },
            recommendedPrice: {
              type: 'number',
              description: 'Рекомендуемая цена для желаемой маржи',
              example: 357,
            },
            breakEvenPoint: {
              type: 'number',
              description: 'Точка безубыточности',
              example: 250,
            },
            isProfitable: {
              type: 'boolean',
              description: 'Выгодно ли продавать товар',
              example: true,
            },
            recommendation: {
              type: 'string',
              description: 'Рекомендация по продаже',
              example: 'Выгодно',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Сообщение об ошибке',
            },
            error: {
              type: 'string',
              description: 'Детали ошибки',
            },
          },
        },
      },
      parameters: {
        productId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID товара Wildberries',
          schema: {
            type: 'string',
            pattern: '^[0-9]+$',
            example: '220156288',
          },
        },
        purchasePrice: {
          name: 'purchasePrice',
          in: 'query',
          description: 'Цена закупки товара',
          schema: {
            type: 'number',
            minimum: 0,
            example: 200,
          },
        },
        logistics: {
          name: 'logistics',
          in: 'query',
          description: 'Стоимость логистики',
          schema: {
            type: 'number',
            minimum: 0,
            example: 50,
          },
        },
        otherCosts: {
          name: 'otherCosts',
          in: 'query',
          description: 'Прочие затраты',
          schema: {
            type: 'number',
            minimum: 0,
            example: 30,
          },
        },
        desiredMargin: {
          name: 'desiredMargin',
          in: 'query',
          description: 'Желаемая маржа в процентах',
          schema: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            example: 30,
          },
        },
        searchQuery: {
          name: 'query',
          in: 'query',
          required: true,
          description: 'Поисковый запрос',
          schema: {
            type: 'string',
            minLength: 1,
            example: 'смартфон',
          },
        },
      },
    },
    tags: [
      {
        name: 'Products',
        description: 'Операции с товарами Wildberries',
      },
      {
        name: 'Analytics',
        description: 'Аналитика и расчеты доходности',
      },
      {
        name: 'Search',
        description: 'Поиск и подсказки',
      },
    ],
  },
  apis: [
    './src/routes/wildberries.routes.ts',
    './src/controllers/wildberriesController.ts',
  ],
};

export const specs = swaggerJsdoc(options);
