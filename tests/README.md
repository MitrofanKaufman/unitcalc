# 📦 tests/

## 🎯 Назначение

Папка содержит **тесты** проекта - модульные, интеграционные, E2E тесты и тестовые данные.

## 📋 Содержимое

### Типы тестов
- `e2e/` - 🌐 End-to-end тесты
- `integration/` - 🔗 Интеграционные тесты
- `unit/` - 🧩 Модульные тесты
- `fixtures/` - 📦 Тестовые данные

## 🏗️ Структура тестов

### E2E Tests (End-to-end)
```
e2e/
├── user-flows/          # 👤 Пользовательские сценарии
│   ├── registration.spec.ts # 📝 Регистрация
│   ├── product-search.spec.ts # 🔍 Поиск товаров
│   └── calculation.spec.ts    # 🧮 Расчет доходности
├── api-tests/           # 🔌 API тесты
│   ├── auth.spec.ts     # 🔐 Аутентификация
│   ├── products.spec.ts # 📦 Товары
│   └── calculations.spec.ts # 🧮 Расчеты
├── visual-tests/        # 👁️  Визуальные тесты
│   ├── screenshots/     # 📸 Снимки экрана
│   └── visual-diff.spec.ts # 🔍 Сравнение визуалов
└── performance-tests/   # ⚡ Performance тесты
    └── load-test.spec.ts # 📈 Нагрузочные тесты
```

### Integration Tests
```
integration/
├── api-integration/     # 🔌 Интеграция API
│   ├── auth-flow.spec.ts # 🔐 Аутентификация
│   ├── data-sync.spec.ts # 🔄 Синхронизация
│   └── external-apis.spec.ts # 🌐 Внешние API
├── database-tests/      # 💾 Тесты БД
│   ├── migrations.spec.ts # 🗂️ Миграции
│   ├── queries.spec.ts   # 🔍 Запросы
│   └── transactions.spec.ts # 💰 Транзакции
└── service-integration/ # 🔧 Интеграция сервисов
    ├── calculator-service.spec.ts # 🧮 Калькулятор
    └── scraper-service.spec.ts   # 🔍 Парсер
```

### Unit Tests
```
unit/
├── components/          # 🧩 Компоненты
│   ├── Button.test.tsx  # 🔘 Кнопка
│   ├── Input.test.tsx   # 📝 Поле ввода
│   └── Calculator.test.tsx # 🧮 Калькулятор
├── services/            # 🔧 Сервисы
│   ├── ProfitCalculator.test.ts # 🧮 Калькулятор доходности
│   ├── AuthService.test.ts      # 🔐 Аутентификация
│   └── DataService.test.ts      # 💾 Сервис данных
├── utils/               # 🔧 Утилиты
│   ├── formatters.test.ts # 📝 Форматтеры
│   ├── validators.test.ts # ✅ Валидаторы
│   └── helpers.test.ts    # 🛠️  Хелперы
└── hooks/               # 🪝 Хуки
    ├── useAuth.test.ts  # 🔐 useAuth
    └── useProducts.test.ts # 📦 useProducts
```

### Test Fixtures
```
fixtures/
├── data/                # 📦 Тестовые данные
│   ├── users.json       # 👤 Пользователи
│   ├── products.json    # 📦 Товары
│   └── calculations.json # 🧮 Расчеты
├── mocks/               # 🎭 Моки
│   ├── api-responses.json # 🌐 API ответы
│   ├── external-apis.json # 🔗 Внешние API
│   └── services.json    # 🔧 Сервисы
└── setup/               # ⚙️  Настройка тестов
    ├── test-db.sql      # 💾 Тестовая БД
    └── config.json      # ⚙️  Конфигурация
```

## 🚀 Запуск тестов

### Все тесты
```bash
# Запуск всех тестов
npm test

# С покрытием
npm run test:coverage

# С watch режимом
npm run test:watch
```

### По типам
```bash
# Unit тесты
npm run test:unit

# Integration тесты
npm run test:integration

# E2E тесты
npm run test:e2e

# Performance тесты
npm run test:performance
```

### По компонентам
```bash
# Тесты конкретного пакета
cd packages/core && npm test

# Тесты конкретного сервиса
cd services/calculator-service && npm test

# Тесты конкретного приложения
cd apps/web && npm test
```

## 📝 Написание тестов

### Стандарты
```typescript
// 📦 packages/core/src/domain/services/ProfitCalculator.test.ts
// Модульные тесты для ProfitCalculator
// Проверяют корректность расчета доходности

import { describe, it, expect, beforeEach } from 'vitest'
import { ProfitCalculator } from './ProfitCalculator'
import { ProductCost } from '../entities/ProductCost'

describe('ProfitCalculator', () => {
  let mockProductCost: ProductCost

  beforeEach(() => {
    // Настройка моков
  })

  describe('calculateProfitability', () => {
    it('должен корректно рассчитывать маржинальность', () => {
      const result = ProfitCalculator.calculateProfitability(mockProductCost)

      expect(result.margin).toBeGreaterThan(0)
      expect(result.costPrice).toBeDefined()
    })

    it('должен учитывать все затраты', () => {
      // Тест валидации
    })
  })
})
```

### Best Practices
- **AAA паттерн** - Arrange, Act, Assert
- **Descriptive names** - понятные названия тестов
- **Single responsibility** - один тест = одна проверка
- **Edge cases** - тестирование граничных случаев

## 🛠️ Инструменты тестирования

### Фреймворки
- **Vitest** - быстрый тестовый раннер
- **Jest** - для Node.js сервисов
- **Playwright** - для E2E тестов
- **Cypress** - альтернативные E2E тесты

### Утилиты
- **Testing Library** - утилиты для тестирования React
- **MSW** - API mocking
- **Faker** - генерация тестовых данных
- **Supertest** - HTTP тестирование

### Конфигурация
```typescript
// vitest.config.ts
export default {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
}
```

## 📊 Покрытие кода

### Цели покрытия
- **Unit tests** - 80%+ покрытие
- **Integration tests** - 60%+ покрытие
- **E2E tests** - критические пути

### Отчеты
```bash
# Генерация отчета покрытия
npm run test:coverage

# Открытие отчета
open coverage/index.html
```

## 🔍 Отладка тестов

### Локальная отладка
```bash
# Запуск конкретного теста
npm test -- ProfitCalculator.test.ts

# С отладкой
npm test -- --inspect-brk ProfitCalculator.test.ts
```

### CI/CD интеграция
```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    npm test
    npm run test:coverage
```

## 📈 Качество тестов

### Метрики
- **Coverage** - покрытие кода
- **Maintainability** - поддерживаемость
- **Complexity** - сложность кода
- **Flaky tests** - нестабильные тесты

### Code Review
- **Test structure** - структура тестов
- **Assertions** - качество проверок
- **Mocking** - правильность моков
- **Documentation** - документирование

---

*Последнее обновление: Январь 2025*
