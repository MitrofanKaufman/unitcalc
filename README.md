# Unit Calculator - Многофункциональный калькулятор единиц измерения

## 📋 Описание проекта

Unit Calculator - это полнофункциональное веб-приложение для конвертации различных единиц измерения. Приложение разделено на клиентскую и серверную части с четким разделением ответственности.

## 🏗️ Архитектура проекта

### Структура проекта

```
wb-calc/
├── 📁 client/              # Клиентская часть (React + TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 components/   # React компоненты
│   │   ├── 📁 services/     # API сервисы
│   │   ├── 📁 types/        # TypeScript типы
│   │   ├── 📁 hooks/        # React хуки
│   │   ├── 📁 utils/        # Утилиты
│   │   ├── 📁 stores/       # Состояние приложения
│   │   └── 📁 styles/       # Стили и CSS
│   ├── 📁 public/           # Статические файлы
│   └── package.json         # Зависимости клиента
│
├── 📁 server/              # Серверная часть (Node.js + TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 controllers/  # Контроллеры API
│   │   ├── 📁 models/       # Модели данных
│   │   ├── 📁 routes/       # Маршруты API
│   │   ├── 📁 services/     # Бизнес-логика
│   │   ├── 📁 middleware/   # Middleware
│   │   ├── 📁 utils/        # Утилиты
│   │   ├── 📁 config/       # Конфигурация
│   │   └── 📁 types/        # TypeScript типы
│   ├── package.json         # Зависимости сервера
│   └── tsconfig.json        # TypeScript конфигурация
│
├── 📁 docs/                # Документация проекта
├── 📁 dev/                 # Файлы разработки
└── 📄 README.md            # Этот файл
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- npm или yarn
- Git

### Установка и запуск

1. **Клонирование репозитория**
   ```bash
   git clone <repository-url>
   cd wb-calc
   ```

2. **Установка зависимостей**
   ```bash
   # Установка зависимостей для сервера
   cd server
   npm install

   # Установка зависимостей для клиента
   cd ../client
   npm install

   # Возврат в корневую директорию
   cd ..
   ```

3. **Настройка окружения**
   ```bash
   cp .env.example .env.development
   # Отредактируйте .env.development с вашими настройками
   ```

4. **Запуск в режиме разработки**
   ```bash
   # Запуск сервера (в одном терминале)
   cd server
   npm run dev

   # Запуск клиента (в другом терминале)
   cd client
   npm run dev
   ```

5. **Сборка для продакшена**
   ```bash
   # Сборка сервера
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