# Модуль сбора данных Wildberries

Модуль предоставляет функционал для автоматизированного сбора данных о товарах с сайта Wildberries.

## Структура модуля

```
packages/core/src/services/wildberries/
├── types.ts              # Определения типов и интерфейсов
├── settings.ts           # Настройки и конфигурация скрейпера
├── progressReporter.ts   # Репортёр прогресса сбора данных
├── dataCollectors.ts     # Функции сбора конкретных данных
├── productScraper.ts     # Основной класс скрейпера
├── fileUtils.ts         # Утилиты для работы с файлами
└── index.ts             # Главный файл экспорта
```

## Основные компоненты

### 1. ProductScraper

Основной класс для скрейпинга товаров. Координирует процесс сбора данных.

```typescript
import { ProductScraper } from './wildberries';

const scraper = new ProductScraper(
  '220156288',
  reporter,
  userId,
  options
);

const result = await scraper.scrape();
```

### 2. Функции сбора данных

Набор специализированных функций для извлечения различных типов данных:

- `getTitle()` - получение названия товара
- `getPrice()` - получение цены
- `getRatingAndReviews()` - получение рейтинга и отзывов
- `getQuestions()` - получение количества вопросов
- `getImg()` - получение изображений
- `getProductParameters()` - получение характеристик
- `getOriginalMark()` - проверка оригинальности
- `getSellerId()` - получение ID продавца

### 3. Репортёр прогресса

Система отслеживания прогресса с возможностью взвешенного учета шагов:

```typescript
import { SmoothWeightedProgressReporter } from './wildberries';

const reporter = new SmoothWeightedProgressReporter((progress) => {
  console.log(`${progress.percentage}% - ${progress.message}`);
});

reporter.setWeights({
  pageLoad: 10,
  title: 15,
  price: 20,
  // ...
});
```

## API эндпоинты

Модуль интегрируется с API gateway через контроллер:

### Получение данных товара
```
GET /api/wildberries/product/:id
```

### Получение детальной информации
```
GET /api/wildberries/get/:id
```

### Расчет доходности
```
GET /api/wildberries/calc/:id?purchasePrice=1000&logistics=200&desiredMargin=30
```

## Пример использования

```typescript
import { scrapeProductById, quickScrape } from './wildberries';

// Простой сбор данных
const result = await scrapeProductById('220156288', (progress) => {
  console.log(`Прогресс: ${progress.percentage}%`);
});

// Быстрый сбор с настройками по умолчанию
const quickResult = await quickScrape('220156288');

if (quickResult.success) {
  console.log('Товар:', quickResult.product);
  console.log('Время выполнения:', quickResult.executionTime, 'мс');
}
```

## Настройки

Модуль использует настройки по умолчанию, которые можно изменить:

```typescript
import Settings from './wildberries/settings';

const settings = new Settings();
settings.updateSettings({
  scrapeTimeout: 45000,
  retryAttempts: 5
});
```

## Обработка ошибок

Модуль предоставляет детальную информацию об ошибках:

```typescript
const result = await scrapeProductById(productId);

if (!result.success) {
  console.error('Ошибки:', result.errors);
}

result.errors?.forEach(error => {
  console.log(`Шаг: ${error.step}, Ошибка: ${error.message}`);
});
```

## Расширение функционала

Для добавления новых типов данных:

1. Создайте функцию в `dataCollectors.ts`
2. Добавьте шаг в `ProductScraper`
3. Обновите веса в репортёре прогресса
4. Добавьте типы данных в `types.ts`

## Производительность

- Асинхронная обработка шагов
- Взвешенный прогресс для точного отслеживания
- Автоматическое закрытие ресурсов браузера
- Оптимизированные селекторы для быстрого поиска элементов

## Безопасность

- Использование headless браузера
- Настройка User-Agent для имитации реального пользователя
- Обработка капчи и повторные попытки
- Валидация входных данных
