# @wb-calc/core

## 🎯 Назначение

Пакет `@wb-calc/core` содержит всю бизнес-логику приложения, включая:
- Доменные модели и сущности
- Бизнес-правила и валидацию
- Сервисы приложения
- Репозитории для работы с данными

## 🏗️ Архитектура

```
core/
├── domain/           # Доменные модели и сущности
│   ├── entities/     # Основные сущности
│   ├── value-objects/ # Объекты-значения
│   ├── services/     # Доменные сервисы
│   └── repositories/ # Интерфейсы репозиториев
├── application/      # Сценарии использования
└── infrastructure/   # Адаптеры и внешние сервисы
```

## 📦 Установка

```bash
# В корне монорепозитория
npm install @wb-calc/core
```

## 🚀 Использование

```typescript
import { Calculator } from '@wb-calc/core';

const calculator = new Calculator();
const result = calculator.calculatePrice({
  // параметры расчета
});
```

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Запуск тестов с покрытием
npm run test:coverage
```

## 📊 Модели данных

### Product
Основная сущность товара
- `id: string` - Уникальный идентификатор
- `name: string` - Название товара
- `price: number` - Цена
- `quantity: number` - Количество

## 🔄 Зависимости

- `@wb-calc/config` - Для доступа к настройкам приложения
- `zod` - Для валидации данных

## 📝 Лицензия

MIT
