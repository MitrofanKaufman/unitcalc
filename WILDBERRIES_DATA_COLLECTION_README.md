# Полная система сбора данных товаров Wildberries

## Обзор

Создана комплексная система для автоматизированного сбора данных о товарах с сайта Wildberries. Система включает в себя:

1. **Бэкенд модуль** - сбор данных с сайта Wildberries
2. **API эндпоинты** - REST API для управления данными
3. **Фронтенд компоненты** - визуализация процесса и результатов
4. **Типизация** - полная типизация на TypeScript

## Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   API Gateway   │    │   Wildberries   │
│                 │    │                 │    │      Site       │
│ • ProgressIndicator │  │ • /product/:id  │    │                 │
│ • ProductDataDisplay│  │ • /get/:id      │    │ • Playwright    │
│ • DataCollectionDemo│  │ • /calc/:id     │    │ • Data Collectors│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                        ┌─────────────────┐
                        │   Core Module   │
                        │                 │
                        │ • ProductScraper│
                        │ • ProgressReporter│
                        │ • DataCollectors│
                        │ • Types & Utils │
                        └─────────────────┘
```

## Структура файлов

### Бэкенд модуль (packages/core/src/services/wildberries/)
```
├── types.ts              # Интерфейсы и типы данных
├── settings.ts           # Конфигурация скрейпера
├── progressReporter.ts   # Репортёр прогресса
├── dataCollectors.ts     # Функции сбора данных
├── productScraper.ts     # Основной класс скрейпера
├── fileUtils.ts         # Утилиты для файлов
├── index.ts             # Главный экспорт модуля
└── README.md           # Документация модуля
```

### API слой (services/api-gateway/src/)
```
├── controllers/
│   └── wildberriesController.ts  # Контроллер API
├── services/
│   └── WildberriesService.ts     # Локальный сервис сбора данных
└── routes/
    └── wildberries.routes.ts     # Маршруты API
```

### UI компоненты (packages/ui/src/components/DataCollection/)
```
├── ProgressIndicator.tsx    # Компонент прогресса
├── ProductDataDisplay.tsx   # Отображение данных
├── DataCollectionDemo.tsx   # Демо страница
└── index.ts                # Экспорт компонентов
```

### Получение данных товара
```http
GET /api/wildberries/product/:id
```
Возвращает базовую информацию о товаре.

> Возвращает полную информацию с аналитикой.

### Расчет доходности
```http
GET /api/wildberries/calc/:id?purchasePrice=1000&logistics=200&desiredMargin=30
```
Рассчитывает доходность товара с учетом затрат.

## 📚 API Документация

Полная интерактивная документация API доступна через **Swagger UI**:

### 🌐 Доступ к документации:
```
http://localhost:3000/api-docs
```

### ✨ Возможности Swagger UI:
- **Интерактивное тестирование** всех эндпоинтов
- **Автоматическая генерация** примеров запросов
- **Валидация параметров** и ответов
- **Детальное описание** всех схем данных
- **Примеры кода** для различных языков программирования

## Использование

### Базовый сбор данных
```typescript
import { scrapeProductById } from './wildberries';

const result = await scrapeProductById('220156288');

if (result.success) {
  console.log('Товар:', result.product);
}
```

### Использование в React компоненте
```typescript
import { DataCollectionDemo } from './DataCollection';

// В вашем компоненте
<DataCollectionDemo />
```

### Расчет доходности
```typescript
const profitability = await calculateProfitability('220156288', {
  purchasePrice: 200,
  logistics: 50,
  desiredMargin: 25
});

console.log('Рекомендуемая цена:', profitability.recommendedPrice);
```

## Возможности системы

### ✅ Сбор данных
- Название товара
- Цена и скидки
- Рейтинг и отзывы
- Вопросы покупателей
- Изображения
- Характеристики
- Информация о продавце
- Проверка оригинальности

### ✅ Мониторинг процесса
- Прогресс-бар с процентами
- Текущий этап выполнения
- Отображение ошибок
- Частичные результаты

### ✅ Расчеты и аналитика
- Доходность товара
- Точка безубыточности
- Рекомендуемые цены
- Анализ маржи

### ✅ Визуализация
- Красивый интерфейс
- Адаптивный дизайн
- Реальное время обновлений
- Подробная информация

## Безопасность

- Headless браузер для скрытного сбора
- Настройка User-Agent для имитации пользователя
- Обработка капчи и повторные попытки
- Валидация входных данных

## Производительность

- Асинхронная обработка шагов
- Взвешенный прогресс
- Автоматическое закрытие ресурсов
- Оптимизированные селекторы

## Расширение функционала

Для добавления новых возможностей:

1. **Новые данные**: Добавить функцию в `dataCollectors.ts`
2. **Новый API**: Добавить эндпоинт в контроллер
3. **Новая визуализация**: Создать компонент в UI
4. **Новые типы**: Обновить `types.ts`

## 🚀 **Быстрый запуск:**

### 1. Установка зависимостей:
```bash
# В корне проекта
npm install

# В папке api-gateway дополнительно
cd services/api-gateway
npm install swagger-jsdoc swagger-ui-express @types/ws
```

### 2. Запуск сервера:
```bash
cd services/api-gateway
npm run dev
```

### 3. Доступ к API:
- **Основной API:** `http://localhost:3000`
- **Swagger документация:** `http://localhost:3000/api-docs`
- **Health check:** `http://localhost:3000/health`

### 4. Тестирование API:
```bash
# Получение данных товара
curl http://localhost:3000/api/wildberries/product/220156288

# Расчет доходности
curl "http://localhost:3000/api/wildberries/calc/220156288?purchasePrice=200&logistics=50&desiredMargin=30"
```
