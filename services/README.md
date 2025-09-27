# 📦 services/

## 🎯 Назначение

Папка содержит **серверные сервисы** - микросервисы, реализующие бизнес-логику и API endpoints.

## 📋 Содержимое

### Сервисы
- `api-gateway/` - 🚪 API шлюз и маршрутизация
- `calculator-service/` - 🧮 Сервис расчета доходности
- `scraper-service/` - 🔍 Сервис парсинга маркетплейсов
- `ai-service/` - 🤖 AI сервис для анализа и рекомендаций
- `notification-service/` - 📢 Сервис уведомлений

## 🏗️ Архитектура сервисов

### API Gateway
```
api-gateway/
├── src/
│   ├── controllers/     # 🎮 Контроллеры API
│   │   ├── auth.ts     # 🔐 Аутентификация
│   │   ├── products.ts  # 📦 Товары
│   │   └── calculations.ts # 🧮 Расчеты
│   ├── middleware/      # 🛡️ Middleware
│   │   ├── auth.ts      # 🔐 JWT валидация
│   │   ├── rate-limit.ts # 🚦 Ограничение запросов
│   │   └── validation.ts # ✅ Валидация
│   ├── routes/          # 🛣️ API маршруты
│   │   ├── auth.ts      # 🔐 Маршруты аутентификации
│   │   └── products.ts  # 📦 Маршруты товаров
│   └── services/        # 🔧 Сервисы
│       ├── auth.ts      # 🔐 Логика аутентификации
│       └── products.ts  # 📦 Логика товаров
└── package.json         # 📦 Метаданные
```

### Calculator Service
```
calculator-service/
├── src/
│   ├── controllers/     # 🎮 API контроллеры
│   ├── services/        # 🔧 Сервисы расчета
│   │   ├── profit-calculator.ts # 🧮 Калькулятор доходности
│   │   └── cost-analyzer.ts     # 💰 Анализатор затрат
│   ├── models/          # 📊 Модели данных
│   └── utils/           # 🔧 Утилиты
└── package.json         # 📦 Метаданные
```

### Scraper Service
```
scraper-service/
├── src/
│   ├── crawlers/        # 🕷️ Парсеры сайтов
│   │   ├── wildberries.ts # 🟣 Wildberries
│   │   ├── ozon.ts       # 🔵 Ozon
│   │   └── aliexpress.ts # 🟡 AliExpress
│   ├── analyzers/       # 📊 Анализаторы
│   │   ├── price-analyzer.ts   # 💰 Анализ цен
│   │   └── competitor-analyzer.ts # 🏆 Анализ конкурентов
│   ├── exporters/       # 📤 Экспортеры
│   └── storage/         # 💾 Хранилище данных
└── package.json         # 📦 Метаданные
```

### AI Service
```
ai-service/
├── src/
│   ├── models/          # 🤖 AI модели
│   │   ├── review-analyzer.ts  # 📝 Анализ отзывов
│   │   └── question-generator.ts # ❓ Генерация ответов
│   ├── processors/      # ⚙️ Процессоры
│   │   ├── text-processor.ts    # 📝 Обработка текста
│   │   └── sentiment-analyzer.ts # 😊 Анализ настроений
│   └── integrations/    # 🔗 Интеграции
│       ├── openai.ts     # 🤖 OpenAI
│       └── yandex.ts     # 🔍 Yandex GPT
└── package.json         # 📦 Метаданные
```

### Notification Service
```
notification-service/
├── src/
│   ├── channels/        # 📢 Каналы уведомлений
│   │   ├── email.ts     # 📧 Email
│   │   ├── push.ts      # 📱 Push
│   │   └── telegram.ts  # 💬 Telegram
│   ├── templates/       # 📋 Шаблоны
│   └── queue/           # 📬 Очередь уведомлений
└── package.json         # 📦 Метаданные
```

## 🚀 Запуск сервисов

### Разработка
```bash
# Запуск API Gateway
cd services/api-gateway
npm install
npm run dev

# Запуск Calculator Service
cd services/calculator-service
npm install
npm run dev

# Запуск всех сервисов
npm run dev:services
```

### Продакшн
```bash
# Сборка всех сервисов
npm run build:services

# Запуск с Docker
docker-compose up -d

# Масштабирование
docker-compose up -d --scale calculator-service=3
```

## 🔗 Связи

- **Использует**: `packages/` - переиспользуемые библиотеки
- **Зависит от**: `infrastructure/` - базы данных и логирования
- **Коммуницирует**: между собой через message bus

## 🔧 Конфигурация

Каждый сервис имеет свою конфигурацию:
- **Порт** - уникальный порт для каждого сервиса
- **База данных** - отдельная БД или схема
- **Логирование** - централизованное логирование
- **Мониторинг** - health checks и метрики

## 📊 Мониторинг

### Health Checks
```bash
# Проверка здоровья API Gateway
curl http://localhost:3001/health

# Проверка здоровья Calculator Service
curl http://localhost:3002/health
```

### Метрики
- **Response time** - время ответа
- **Throughput** - пропускная способность
- **Error rate** - частота ошибок
- **Resource usage** - использование ресурсов

## 🧪 Тестирование

### Integration тесты
```bash
# Тесты API Gateway
cd services/api-gateway && npm test

# Тесты Calculator Service
cd services/calculator-service && npm test
```

### Load тесты
- **Artillery** - нагрузочное тестирование
- **K6** - performance тестирование
- **JMeter** - enterprise нагрузочное тестирование

## 🚀 Деплой

### Docker
```yaml
# docker-compose.yml
version: '3.8'
services:
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3001:3001"
  calculator-service:
    build: ./services/calculator-service
    ports:
      - "3002:3002"
```

### Kubernetes
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: calculator-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: calculator-service
```

---

*Последнее обновление: Январь 2025*
