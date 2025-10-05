# 🛠️ Командная строка (CLI)

## 🚀 Основные команды

### 🏗️ Установка
```bash
# Установка зависимостей
npm ci

# Или с использованием Yarn
yarn install --frozen-lockfile
```

### 🚀 Запуск в режиме разработки
```bash
# Запуск всех сервисов
npm run dev

# Или выборочный запуск:
npm run dev:web      # Только веб-приложение
npm run dev:api      # Только API сервер
npm run dev:services # Только сервисы
```

### 🏗️ Сборка
```bash
# Сборка для продакшена
npm run build

# Сборка конкретных частей:
npm run build:web    # Сборка веб-приложения
npm run build:api    # Сборка API сервера
npm run build:all    # Сборка всего проекта
```

### 🧪 Тестирование
```bash
# Запуск всех тестов
npm test

# Запуск тестов с покрытием
npm run test:coverage

# Запуск e2e тестов
npm run test:e2e
```

## 🛠️ Утилиты

### 🔄 Миграции базы данных
```bash
# Создание новой миграции
npm run db:create-migration --name=init

# Применение миграций
npm run db:migrate

# Откат последней миграции
npm run db:rollback
```

### 🐳 Docker
```bash
# Сборка и запуск контейнеров
docker-compose up -d

# Остановка контейнеров
docker-compose down

# Просмотр логов
docker-compose logs -f
```

## 🔧 Вспомогательные команды

### 🔍 Анализ бандла
```bash
# Анализ размера бандла
npm run analyze

# Отчет о размере зависимостей
npm run size
```

### 🔄 Code Quality
```bash
# Проверка стиля кода
npm run lint

# Автоматическое исправление ошибок
npm run lint:fix

# Проверка типов TypeScript
npm run type-check

# Форматирование кода
npm run format
```

## 📦 Публикация

### 🚀 Публикация пакетов
```bash
# Сборка и публикация всех пакетов
npm run publish:all

# Публикация конкретного пакета
cd packages/package-name
npm publish
```

### 🔖 Управление версиями
```bash
# Создание новой версии (следует semantic-release)
npm run release

# Создание пререлиза
npm run release:prerelease
```
