# 🛍️ Калькулятор рентабельности Wildberries

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

Современный калькулятор рентабельности для маркетплейса Wildberries с современным интерфейсом и расширенной аналитикой.

## 🌐 Доступные версии документации

- **📖 [README.html](./README.html)** - Интерактивная HTML версия с переключением языков
- **🇷🇺 [README.ru.md](./README.ru.md)** - Полная документация на русском языке
- **🇺🇸 [README.en.md](./README.en.md)** - Full documentation in English

<!-- prettier-ignore-start -->

<details open>
  <summary><strong>📚 Быстрая навигация</strong></summary>

| Раздел | Описание |
|--------|----------|
| [Обзор](docs/overview.md) | Назначение проекта, ключевые фичи |
| [Установка и запуск](docs/setup.md) | Требования, настройка окружения, скрипты |
| [Архитектура](docs/architecture.md) | Структура каталогов, основные модули, паттерны |
| [API](docs/api.md) | Эндпоинты бекенда, форматы запрос/ответ |
| [UI-компоненты](docs/ui-components.md) | Библиотеки, принципы стилизации, примеры |
| [Тестирование](docs/testing.md) | Стратегия, примеры unit/integration/E2E |
| [Dev-процессы](docs/dev-process.md) | Git flow, линтинг, форматирование, CI |
| [История изменений](CHANGELOG.md) | Журнал всех изменений проекта |
| [Частые вопросы](docs/faq.md) | Ответы на FAQ |

</details>

> 💡 **Новая интерактивная документация**: Используйте [README.html](./README.html) для удобной навигации между всеми документами проекта с поддержкой переключения между русским и английским языками.

<!-- prettier-ignore-end -->

## 📋 Содержание (быстрое оглавление этой страницы)

- [🚀 Возможности](#-возможности)
- [🛠 Технологический стек](#-технологический-стек)
- [🏗 Структура проекта](#-структура-проекта)
- [🚀 Начало работы](#-начало-работы)
  - [Требования](#-требования)
  - [Установка](#-установка)
  - [Настройка окружения](#-настройка-окружения)
  - [Запуск](#-запуск)
- [🧪 Тестирование](#-тестирование)
- [📦 Сборка для продакшена](#-сборка-для-продакшена)
- [🕑 История изменений](#-история-изменений)
- [🤝 Вклад в проект](#-вклад-в-проект)
- [📄 Лицензия](#-лицензия)

## 🚀 Возможности

- 🔍 **Поиск товаров** по названию с автодополнением
- 📊 **Детальный анализ** рентабельности товаров
- 💾 **Кеширование данных** для ускорения работы
- 📱 **Адаптивный дизайн** для всех устройств
- 🎨 **Современный UI/UX** с неоморфным дизайном
- 🌓 **Поддержка тем** (светлая/темная/системная)
- 📈 **Расширенная аналитика** по продажам
- 🏷 **Гибкая настройка** параметров расчета
- 🔄 **Оффлайн-доступ** к недавним запросам
- ⚡ **Быстрый отклик** благодаря оптимизированному коду

## 🛠 Технологический стек

### Фронтенд
- **Языки**: TypeScript 5.x, JavaScript (ES2022+)
- **UI-фреймворк**: React 18+ с хуками
- **Маршрутизация**: React Router 6
- **Стилизация**: 
  - TailwindCSS 3.x
  - PostCSS
  - Autoprefixer
- **Управление состоянием**:
  - React Query 4.x (удаленные данные)
  - Zustand (клиентское состояние)
- **UI-компоненты**:
  - Radix UI (доступные примитивы)
  - Framer Motion (анимации)
  - Headless UI (невидимые компоненты)
- **Формы и валидация**:
  - React Hook Form
  - Zod (валидация схем)
- **Утилиты**:
  - date-fns (работа с датами)
  - lodash (утилиты)
  - axios (HTTP-клиент)

### Бэкенд
- **Среда**: Node.js 18+
- **Фреймворк**: Express 4.x
- **Язык**: TypeScript 5.x
- **База данных**:
  - MySQL 8.0+ (основное хранилище)
  - Redis 7.x (кеширование, очереди)
- **ORM/ODM**:
  - TypeORM 0.3.x
  - Redis-ом (кеш-клиент)
- **Аутентификация**:
  - JWT (JSON Web Tokens)
  - bcrypt (хеширование)
- **Валидация**:
  - class-validator
  - class-transformer
- **Документация**:
  - Swagger/OpenAPI
  - JSDoc

### Инструменты разработки
- **Сборка**:
  - Vite 4.x (сборщик)
  - esbuild (ускорение сборки)
  - Rollup (бандлинг)
- **Линтеры и форматеры**:
  - ESLint 8.x
  - Prettier 3.x
  - Stylelint 15.x (стили)
  - MarkdownLint (разметка)
- **Тестирование**:
  - Vitest (юнит-тесты)
  - React Testing Library
  - MSW (мок API)
  - Playwright (e2e тесты)
- **Git-хуки**:
  - Husky 8.x
  - lint-staged 13.x
  - commitlint (проверка коммитов)
- **CI/CD**:
  - GitHub Actions
  - Docker + Docker Compose
  - Jest + React Testing Library
  - Docker + Docker Compose

## 🚀 Начало работы

### 📋 Требования

- Node.js 18+
- MySQL 8.0+
- npm 9+ или yarn 1.22+
- Git

### ⚙️ Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/yourusername/wb-calculator.git
   cd wb-calculator
   ```

2. Установите зависимости:
   ```bash
   npm install
   # или
   yarn
   ```

### 🗄️ Настройка базы данных

1. Создайте файл `.env` в корне проекта, скопировав настройки из `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Настройте параметры подключения к базе данных в файле `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=wb_calculator
   ```

3. Установите MySQL и создайте базу данных:
   ```sql
   CREATE DATABASE wb_calculator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Примените миграции:
   ```bash
   npm run db:migrate
   ```

5. (Опционально) Заполните базу тестовыми данными:
   ```bash
   npm run db:seed:products 50  # Создаст 50 тестовых товаров
   ```

### 🚀 Запуск

1. Запустите сервер разработки:
   ```bash
   npm run dev:all
   ```

2. Откройте [http://localhost:4000](http://localhost:4000) в браузере.

## 📂 Структура проекта

```
wb-calculator/
├── src/
│   ├── api/              # API эндпоинты и контроллеры
│   ├── components/       # Переиспользуемые компоненты
│   ├── db/              
│   │   ├── entities/     # Сущности базы данных
│   │   ├── migrations/   # Миграции базы данных
│   │   └── seed/        # Наполнители тестовыми данными
│   ├── hooks/           # Кастомные React хуки
│   ├── pages/           # Страницы приложения
│   ├── services/        # Бизнес-логика и работа с API
│   ├── styles/          # Глобальные стили
│   ├── types/           # Типы TypeScript
│   └── utils/           # Вспомогательные функции
├── public/              # Статические файлы
├── .env.example         # Пример файла конфигурации
└── package.json         # Зависимости и скрипты
```

## 🏗 Структура проекта

```
unit.calculator/
├── app/                  # Клиентская часть приложения
│   ├── assets/           # Статические ресурсы (изображения, шрифты)
│   ├── components/       # Переиспользуемые React-компоненты
│   ├── pages/            # Страницы приложения
│   ├── hooks/            # Кастомные React-хуки
│   ├── lib/              # Вспомогательные библиотеки
│   ├── styles/           # Глобальные стили и темы
│   └── utils/            # Вспомогательные утилиты
│
├── server/               # Серверная часть приложения
│   ├── api/              # API-эндпоинты
│   ├── controllers/      # Контроллеры для обработки запросов
│   ├── middleware/       # Промежуточное ПО Express
│   ├── models/           # Модели данных
│   ├── routes/           # Определения маршрутов
│   └── services/         # Бизнес-логика
│
├── shared/               # Общий код между клиентом и сервером
│   ├── constants/        # Константы приложения
│   ├── types/            # Общие типы TypeScript
│   └── utils/            # Общие утилиты
│
├── config/               # Конфигурационные файлы
│   ├── app/             # Конфигурация приложения
│   ├── db/              # Конфигурация базы данных
│   ├── env/             # Переменные окружения
│   └── vite/            # Конфигурация Vite
│
├── docs/                # Документация
│   ├── api/             # API документация
│   ├── guides/          # Руководства
│   └── diagrams/        # Диаграммы архитектуры
│
├── logs/                # Логи приложения
│   ├── app/             # Логи приложения
│   ├── db/              # Логи базы данных
│   └── errors/          # Логи ошибок
│
├── public/              # Статические файлы
└── tests/               # Тесты
    ├── unit/            # Модульные тесты
    ├── integration/     # Интеграционные тесты
    └── e2e/             # End-to-end тесты
```

## 🚀 Начало работы

### 📋 Требования

- Node.js 18.0.0 или выше
- MySQL 8.0 или выше
- Redis 7.0 или выше
- npm 9.0.0 или выше

### ⚙️ Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/yourusername/unit.calculator.git
   cd unit.calculator
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

### 🔧 Настройка окружения

1. Скопируйте файл окружения:
   ```bash
   cp .env.example .env
   ```

2. Отредактируйте `.env` файл, указав свои настройки:
   ```env
   # Базовые настройки
   NODE_ENV=development
   PORT=3000
   
   # База данных
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=wb_calculator
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ```

### 🚀 Запуск

1. Запустите сервер разработки:
   ```bash
   # Запуск клиента (порт 3000)
   npm run dev
   
   # Или запуск сервера (порт 3001)
   npm run dev:server
   ```

2. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск юнит-тестов
npm run test:unit

# Запуск интеграционных тестов
npm run test:integration

# Запуск e2e тестов
npm run test:e2e

# Проверка покрытия кода
npm run test:coverage
```

## 📦 Сборка для продакшена

```bash
# Сборка клиентской части
npm run build

# Сборка серверной части
npm run build:server

# Запуск в production режиме
npm run start
```

## 🕑 История изменений

Подробная таблица всех выполненных задач формируется автоматически и располагается в отдельном файле [`README_HISTORY.md`](README_HISTORY.md). Таблица поддерживает сортировку и поиск по описанию и дате.

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для вашей функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте изменения в форк (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется по лицензии MIT. См. файл [LICENSE](LICENSE) для дополнительной информации.

---

<div align="center">
  <p>Создано с ❤️ для продавцов Wildberries</p>
  <p>Вопросы и предложения: <a href="mailto:support@wb-calculator.ru">support@wb-calculator.ru</a></p>
</div>

## 💾 Работа с базой данных

### Миграции

- **Создать новую миграцию**:
  ```bash
  npm run typeorm migration:create src/db/migrations/NameOfMigration
  ```
  ```bash
  npm run typeorm migration:create src/db/migrations/NameOfMigration
  ```

- **Применить миграции**:
  ```bash
  npm run db:migrate
  ```

- **Откатить последнюю миграцию**:
  ```bash
  npm run db:revert
  ```

- **Проверить статус миграций**:
  ```bash
  npm run db:status
  ```

### Сидирование данных

- **Заполнить базу тестовыми товарами**:
  ```bash
  npm run db:seed:products 100  # Создаст 100 тестовых товаров
  ```

- **Очистить тестовые данные**:
  ```bash
  npm run db:clean
  ```

### Резервное копирование

Для создания резервной копии базы данных используйте утилиту `mysqldump`:

```bash
mysqldump -u username -p wb_calculator > backup_$(date +%Y%m%d_%H%M%S).sql
```

Для восстановления из резервной копии:

```bash
mysql -u username -p wb_calculator < backup_file.sql
```

## 🛠 Разработка

- **Запуск линтеров**:
  ```bash
  npm run lint
  ```

- **Запуск тестов**:
  ```bash
  npm test
  ```

- **Сборка для продакшена**:
  ```bash
  npm run build
  ```

## 📝 Документация

### Сервис работы с продуктами

`src/services/productService.ts` - сервис для работы с данными о товарах:

- `getProduct(productId)` - получение данных о товаре (сначала из кеша, затем из БД)
- `analyzeProduct(productId)` - инициирование сбора данных о товаре
- `getFromCache(productId)` - получение данных из кеша
- `saveToCache(productId, data)` - сохранение данных в кеш

### Компоненты

- `ProductCard` - карточка товара в списке результатов
- `ProductDetails` - детальная страница товара
- `ProductAnalyse` - страница сбора и анализа данных о товаре
- `CalculatorForm` - форма поиска и отображения результатов

## 📄 Лицензия

MIT
