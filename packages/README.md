# 📦 packages/

## 🎯 Назначение

Папка содержит **переиспользуемые библиотеки** - модули бизнес-логики, UI компоненты и утилиты, которые могут использоваться несколькими приложениями.

## 📋 Содержимое

### Библиотеки
- `config/` - ⚙️ Система конфигурации и валидации
- `core/` - 🏢 Бизнес-логика и доменные модели
- `ui/` - 🎨 Дизайн-система и UI компоненты
- `api/` - 🔌 API клиенты и типы

## 🏗️ Архитектура библиотек

### Config (Система конфигурации)
```
config/
├── src/
│   ├── index.ts         # 🎯 Основной экспорт
│   ├── schemas/         # 📋 Zod схемы валидации
│   ├── loaders/         # 📥 Загрузчики конфигурации
│   └── validators/      # ✅ Валидаторы
└── package.json         # 📦 Метаданные
```

### Core (Бизнес-логика)
```
core/
├── src/
│   ├── domain/          # 🏛️  Доменные модели
│   │   ├── entities/    # 🧩 Сущности (Product, User)
│   │   ├── value-objects/ # 💎 Объекты-значения (Money, Weight)
│   │   ├── services/    # 🔧 Сервисы (ProfitCalculator)
│   │   └── repositories/ # 💾 Репозитории
│   ├── application/     # 🎯 Use cases и команды
│   └── infrastructure/  # 🏗️  Адаптеры и внешние зависимости
└── package.json         # 📦 Метаданные
```

### UI (Дизайн-система)
```
ui/
├── src/
│   ├── components/      # 🧩 Базовые UI компоненты
│   │   ├── Button.tsx   # 🔘 Кнопка
│   │   ├── Input.tsx    # 📝 Поле ввода
│   │   └── Card.tsx     # 🃏 Карточка
│   ├── tokens/          # 🎯 Дизайн-токены
│   │   ├── colors.json  # 🎨 Цвета
│   │   ├── spacing.json # 📏 Отступы
│   │   └── typography.json # ✏️ Типографика
│   └── themes/          # 🌙 Темы
│       ├── light.json   # ☀️ Светлая тема
│       └── dark.json    # 🌙 Темная тема
└── package.json         # 📦 Метаданные
```

### API (API клиенты)
```
api/
├── src/
│   ├── clients/         # 🌐 HTTP клиенты
│   │   ├── rest.ts      # 🌐 REST клиент
│   │   └── graphql.ts   # 🔺 GraphQL клиент
│   ├── interceptors/    # 🔍 Перехватчики запросов
│   │   ├── auth.ts      # 🔐 Аутентификация
│   │   └── logging.ts   # 📝 Логирование
│   └── types/           # 📋 API типы
│       ├── auth.ts      # 🔐 Типы аутентификации
│       └── products.ts  # 📦 Типы товаров
└── package.json         # 📦 Метаданные
```

## 🚀 Использование библиотек

### Установка
```bash
# Установка всех библиотек
npm install

# Установка конкретной библиотеки
cd packages/core
npm install
```

### Импорт
```typescript
// Импорт из config
import { configLoader } from '@wb-calc/config'

// Импорт из core
import { ProfitCalculator } from '@wb-calc/core'

// Импорт из ui
import { Button } from '@wb-calc/ui'

// Импорт из api
import { apiClient } from '@wb-calc/api'
```

## 🔗 Связи

- **Используется**: `apps/` - приложениями
- **Зависит от**: внешних библиотек (zod, react, etc.)
- **Тестируется**: `tests/` - unit тестами

## 📦 Публикация

### NPM публикация
```bash
# Сборка всех библиотек
npm run build:packages

# Публикация в NPM
cd packages/core && npm publish
cd packages/ui && npm publish
cd packages/api && npm publish
cd packages/config && npm publish
```

### Локальная разработка
```bash
# Ссылка на локальную версию
cd apps/web
npm link ../packages/core
npm link ../packages/ui
```

## 🧪 Тестирование

### Unit тесты
```bash
# Тесты для всех библиотек
npm run test:packages

# Тесты для конкретной библиотеки
cd packages/core && npm test
```

### Типы
- **Сборка** - проверка TypeScript типов
- **Линтинг** - ESLint правила
- **Форматирование** - Prettier

## 📊 Мониторинг

- **Bundle size** - размер бандлов
- **Performance** - время загрузки
- **Usage** - статистика использования

---

*Последнее обновление: Январь 2025*
