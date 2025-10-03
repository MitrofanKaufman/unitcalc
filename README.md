# 🚀 WB Marketplace Calculator

## 📋 Описание проекта

WB Marketplace Calculator - это комплексное приложение для расчета доходности товаров из Китая для продавцов маркетплейсов России. Проект включает PWA, мобильное приложение, серверные сервисы и enterprise-функционал.

## 🏗️ Архитектура проекта

Проект следует принципам чистой архитектуры с четким разделением на слои:
- **app/** - Клиентские приложения (веб, мобильное, десктопное)
- **packages/** - Переиспользуемые библиотеки и утилиты
- **services/** - Серверные микросервисы
- **infrastructure/** - Инфраструктурные компоненты
- **docs/** - Документация

Подробнее в [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)

## 🚀 Быстрый старт

### 🛠️ Предварительные требования

- Node.js 18+
- npm 8+ или yarn 1.22+
- Git 2.20+
- Docker 20.10+ (опционально, для контейнеризации)

### ⚙️ Установка и запуск

1. **Клонирование репозитория**
   ```bash
   git clone https://github.com/your-username/wb-calc.git
   cd wb-calc
   ```

2. **Установка зависимостей**
   ```bash
   # Установка корневых зависимостей
   npm install
   
   # Установка зависимостей для веб-приложения
   cd app/web
   npm install
   
   # Установка зависимостей для сервера
   cd ../../server
   npm install
   
   # Возвращаемся в корень проекта
   cd ..
   ```

3. **Настройка окружения**
   ```bash
   # Копируем примеры конфигурационных файлов
   cp .env.example .env
   cp .env.development.example .env.development
   
   # Настраиваем переменные окружения в файле .env
   # Убедитесь, что установлены правильные пути к базам данных и другие настройки
   # Отредактируйте файлы .env и .env.development
   ```

4. **Запуск в режиме разработки**
   
   #### Вариант 1: Запуск с помощью Docker (рекомендуется)
   ```bash
   # Сборка и запуск контейнеров
   docker-compose up --build
   
   # Или в фоновом режиме
   # docker-compose up -d
   ```
   
   #### Вариант 2: Ручной запуск
   
   **Запуск сервера:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Запуск веб-приложения (в отдельном терминале):**
   ```bash
   cd app/web
   npm run dev
   ```
   
   После этого:
   - Веб-приложение будет доступно по адресу: http://localhost:3000
   - API сервер будет доступен по адресу: http://localhost:3001

   # Запуск клиента (в другом терминале)
   cd client
   npm run dev
   ```

5. **Сборка для продакшена**
   
   #### Сборка с помощью Docker
   ```bash
   # Сборка образов
   docker-compose -f docker-compose.prod.yml build
   
   # Запуск в продакшн режиме
   docker-compose -f docker-compose.prod.yml up -d
   ```
   
   #### Ручная сборка
   
   **Сборка сервера:**
   ```bash
   cd server
   npm run build
   ```
   
   **Сборка веб-приложения:**
   ```bash
   cd app/web
   npm run build
   ```
   
   **Запуск продакшн сервера:**
   ```bash
   cd server
   npm start
   ```
   
   Приложение будет доступно на порту, указанном в настройках окружения (по умолчанию 3001).
   cd server
   npm run build
   npm start

   # Сборка клиента
   cd client
   npm run build
   ```

## 🔧 Конфигурация

### Переменные окружения

#### Сервер (.env)
- `SERVER_PORT` - порт сервера (по умолчанию: 3001)
- `NODE_ENV` - окружение (development/production)
- `DATABASE_URL` - путь к базе данных
- `JWT_SECRET` - секрет для JWT токенов
- `CLIENT_URL` - URL клиентского приложения

#### Клиент (.env)
- `VITE_API_URL` - URL API сервера
- `VITE_APP_TITLE` - заголовок приложения
- `VITE_APP_DESCRIPTION` - описание приложения

## 📚 API Документация

### Базовый URL
```
http://localhost:3001/api
```

### Эндпоинты

#### Единицы измерения
- `GET /api/units` - получить список единиц
- `GET /api/units/:id` - получить единицу по ID
- `POST /api/units` - создать новую единицу
- `PUT /api/units/:id` - обновить единицу
- `DELETE /api/units/:id` - удалить единицу

#### Конвертация
- `POST /api/convert` - конвертировать значение

#### Аутентификация
- `POST /api/auth/login` - вход в систему
- `POST /api/auth/register` - регистрация
- `POST /api/auth/refresh` - обновить токен

## 🎨 Компоненты клиентской части

### Layout компоненты
- `Navbar` - навигационная панель
- `Layout` - основной layout

### UI компоненты
- `Button` - универсальная кнопка
- `Input` - поле ввода
- `Select` - выпадающий список
- `Card` - карточка

### Feature компоненты
- `UnitConverter` - конвертер единиц
- `UnitList` - список единиц
- `CategoryFilter` - фильтр по категориям

## 🗄️ База данных

### Структура базы данных

#### Таблица units
```sql
CREATE TABLE units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  conversion_factor REAL,
  base_unit TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Таблица unit_conversions
```sql
CREATE TABLE unit_conversions (
  id TEXT PRIMARY KEY,
  from_unit_id TEXT NOT NULL,
  to_unit_id TEXT NOT NULL,
  factor REAL NOT NULL,
  formula TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_unit_id) REFERENCES units (id),
  FOREIGN KEY (to_unit_id) REFERENCES units (id)
);
```

## 🧪 Тестирование

### Запуск тестов
```bash
# Тесты сервера
cd server
npm test

# Тесты клиента
cd client
npm test
```

### E2E тесты
```bash
# Запуск Playwright тестов
npx playwright test
```

## 🚢 Деплой

### Docker
```dockerfile
# Dockerfile для сервера
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/dist ./dist
EXPOSE 3001
CMD ["npm", "start"]

# Dockerfile для клиента
FROM nginx:alpine
COPY client/dist /usr/share/nginx/html
EXPOSE 80
```

### PM2 (Process Manager)
```bash
# Установка PM2
npm install -g pm2

# Запуск сервера через PM2
cd server
pm2 start dist/index.js --name "wb-calc-server"
```

## 📝 Журнал изменений

Смотрите [CHANGELOG.md](./CHANGELOG.md) для детальной информации о версиях.

## 📄 Коммерческая лицензия

Все права защищены. Данный проект распространяется на условиях коммерческой лицензии. Любое использование, копирование, распространение, модификация или публикация кода без предварительного письменного разрешения правообладателя запрещено.
Для получения лицензии на использование проекта, включая право на интеграцию, модификацию или распространение в рамках коммерческих проектов, обратитесь к правообладателю.
Подробности и условия предоставления лицензии см. в файле [LICENSE](LICENSE.md)