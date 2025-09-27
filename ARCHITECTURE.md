// \ARCHITECTURE.md
// Архитектурная документация для WB Marketplace Calculator

# 🏗️ Архитектура WB Marketplace Calculator

## 📋 Обзор

WB Marketplace Calculator - это комплексное приложение для расчета потенциальной доходности товаров из Китая для продавцов маркетплейсов России с дополнительным функционалом анализа конкурентов, AI-ассистента и автоматизации процессов.

## 🎯 Цели архитектуры

1. **Масштабируемость** - поддержка роста от MVP до enterprise решения
2. **Отказоустойчивость** - изоляция сбоев компонентов
3. **Производительность** - оптимизация для мобильных устройств и слабых подключений
4. **Безопасность** - защита данных пользователей и бизнес-логики
5. **Удобство разработки** - четкое разделение ответственности и переиспользование кода

## 🏛️ Архитектурные принципы

### 1. Модульная архитектура
```
wb-marketplace-calculator/
├── 📦 apps/                    # Приложения (независимые точки входа)
├── 📦 packages/               # Переиспользуемые библиотеки
├── 📦 services/               # Серверные сервисы
└── 📦 infrastructure/         # Инфраструктурные сервисы
```

### 2. Domain-Driven Design (DDD)
- **Domain Layer** - бизнес-логика и правила
- **Application Layer** - координация и use cases
- **Infrastructure Layer** - внешние зависимости
- **Presentation Layer** - UI и API

### 3. Microservices Ready
- Каждый сервис может работать независимо
- Асинхронная коммуникация через message bus
- Независимое масштабирование

## 📁 Структура проекта

### Apps (Приложения)
```
apps/
├── web/                        # PWA веб-приложение
│   ├── src/
│   │   ├── features/          # Feature модули
│   │   ├── shared/            # Общие компоненты
│   │   ├── lib/               # Утилиты и конфигурация
│   │   └── pages/             # Страницы приложения
│   ├── public/                # Статические файлы
│   └── package.json
├── mobile/                     # React Native приложение
└── desktop/                    # Electron приложение
```

### Packages (Переиспользуемые библиотеки)
```
packages/
├── core/                      # Базовая логика расчета доходности
│   ├── src/
│   │   ├── domain/           # Доменные модели и правила
│   │   ├── services/         # Сервисы расчета
│   │   └── utils/            # Утилиты расчета
├── ui/                        # UI компоненты и дизайн-система
│   ├── src/
│   │   ├── components/       # Базовые компоненты
│   │   ├── theme/            # Тема и стили
│   │   └── icons/            # Иконки
├── api/                       # API клиенты и типы
│   ├── src/
│   │   ├── clients/          # HTTP клиенты
│   │   ├── types/            # API типы
│   │   └── interceptors/     # Перехватчики запросов
└── config/                    # Система конфигурации
    ├── src/
    │   ├── schemas/          # Схемы валидации
    │   ├── loaders/          # Загрузчики конфигурации
    │   └── validators/       # Валидаторы
```

### Services (Серверные сервисы)
```
services/
├── api-gateway/              # API шлюз и роутинг
├── calculator-service/       # Сервис расчета доходности
├── scraper-service/          # Сервис парсинга конкурентов
├── ai-service/               # AI сервис для обработки отзывов
├── analytics-service/        # Сервис аналитики
├── worker-service/           # Сервис фоновой обработки
└── notification-service/     # Сервис уведомлений
```

### Infrastructure (Инфраструктура)
```
infrastructure/
├── database/                 # Миграции и схемы БД
├── logging/                  # Система логирования
├── monitoring/               # Мониторинг и алертинг
├── deployment/               # Конфигурации деплоя
└── docker/                   # Docker файлы
```

## 🏢 Домены и бизнес-логика

### 1. Калькулятор доходности (Core Domain)
```
packages/core/src/domain/
├── entities/                 # Бизнес-сущности
│   ├── Product.ts           # Товар
│   ├── Supplier.ts          # Поставщик
│   ├── Marketplace.ts       # Маркетплейс
│   ├── Cost.ts              # Затраты
│   └── Profit.ts            # Доходность
├── value-objects/           # Объекты-значения
│   ├── Money.ts             # Деньги
│   ├── Percentage.ts        # Проценты
│   └── Weight.ts            # Вес
├── services/                # Доменные сервисы
│   ├── ProfitCalculator.ts  # Калькулятор доходности
│   ├── CostAnalyzer.ts      # Анализатор затрат
│   └── RiskAssessor.ts      # Оценщик рисков
└── repositories/            # Репозитории
    └── IProductRepository.ts
```

### 2. Анализ конкурентов
```
services/scraper-service/
├── crawlers/                # Парсеры сайтов
│   ├── alibaba.ts          # Alibaba парсер
│   ├── taobao.ts           # Taobao парсер
│   └── wb-competitors.ts   # Парсер конкурентов WB
├── analyzers/               # Анализаторы данных
│   ├── price-analyzer.ts   # Анализ цен
│   └── trend-analyzer.ts   # Анализ трендов
└── exporters/               # Экспортеры результатов
    └── csv-exporter.ts
```

### 3. AI Ассистент
```
services/ai-service/
├── models/                  # AI модели
│   ├── review-analyzer.ts  # Анализ отзывов
│   └── question-generator.ts # Генерация ответов
├── processors/              # Процессоры
│   ├── text-processor.ts    # Обработка текста
│   └── sentiment-analyzer.ts # Анализ настроений
└── integrations/            # Интеграции
    └── openai-integration.ts
```

## 🔧 Техническая архитектура

### Клиентская часть (Web App)
```
apps/web/src/
├── features/                # Feature модули
│   ├── calculator/         # Калькулятор доходности
│   ├── competitors/        # Анализ конкурентов
│   ├── ai-assistant/       # AI ассистент
│   └── analytics/          # Аналитика
├── shared/                  # Общие компоненты
│   ├── ui/                 # UI компоненты
│   ├── hooks/              # React хуки
│   └── utils/              # Утилиты
├── lib/                     # Библиотеки
│   ├── api/                # API клиент
│   ├── storage/            # Локальное хранилище
│   ├── sync/               # Синхронизация
│   └── offline/            # Оффлайн режим
└── pages/                   # Страницы
    └── routes.tsx
```

### Серверная часть
```
services/api-gateway/
├── controllers/            # API контроллеры
├── middleware/             # Middleware
├── routes/                 # Маршруты
├── services/               # Сервисы
├── validators/             # Валидаторы
└── interceptors/           # Перехватчики
```

## 📱 Мобильная ориентированность

### PWA Features
- Service Worker для оффлайн работы
- IndexedDB для локального хранения
- Push уведомления
- Responsive дизайн
- Touch-оптимизированные компоненты

### Mobile-First подход
- Адаптивный дизайн от 320px
- Touch-friendly интерфейс
- Оптимизированная навигация
- Быстрая загрузка на мобильных сетях

## 🔄 Оффлайн и синхронизация

### Offline-First стратегия
1. **Local Storage** - критичные данные
2. **IndexedDB** - большие объемы данных
3. **Service Worker** - кеширование запросов
4. **Background Sync** - синхронизация при подключении

### Conflict Resolution
- Автоматическое разрешение конфликтов
- Пользовательский контроль при конфликтах
- Аудит изменений

## ⚡ Производительность

### Frontend
- Code Splitting по маршрутам
- Lazy Loading компонентов
- Image optimization
- Bundle analysis
- Performance budgets

### Backend
- Redis кеширование
- Database query optimization
- CDN для статических файлов
- Horizontal scaling

## 🛡️ Безопасность

### Аутентификация и авторизация
- JWT токены
- Refresh token rotation
- Role-based access control (RBAC)
- API rate limiting

### Защита данных
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Content Security Policy

## 📊 Мониторинг и логирование

### Метрики
- Application Performance Monitoring (APM)
- Custom business metrics
- Error tracking
- User analytics

### Логирование
- Структурированные логи (JSON)
- Centralized logging
- Log aggregation
- Alerting на критические ошибки

## 🔧 Конфигурация

### Единая система конфигурации
```typescript
interface AppConfig {
  // API настройки
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }

  // UI настройки
  ui: {
    theme: 'light' | 'dark'
    language: string
    animations: boolean
  }

  // Бизнес настройки
  business: {
    defaultMargins: Record<string, number>
    taxRates: Record<string, number>
    shippingCosts: Record<string, number>
  }

  // Feature flags
  features: {
    aiAssistant: boolean
    competitorAnalysis: boolean
    offlineMode: boolean
  }
}
```

## 🚀 Деплой и DevOps

### Контейнеризация
- Multi-stage Docker builds
- Docker Compose для разработки
- Kubernetes для продакшена
- Helm charts для деплоя

### CI/CD Pipeline
- GitHub Actions
- Automated testing
- Security scanning
- Performance testing
- Multi-environment deployment

## 📈 Масштабирование

### Горизонтальное масштабирование
- Load balancing
- Database sharding
- CDN distribution
- Microservices decomposition

### Вертикальное масштабирование
- Performance optimization
- Memory management
- Database indexing
- Query optimization

## 🔄 Обновления и миграции

### Backward Compatibility
- API versioning
- Database migrations
- Feature toggles
- Graceful degradation

### Zero-Downtime Deployments
- Blue-green deployments
- Rolling updates
- Database migration strategies

## 📚 Документация

### Разработчик
- API документация (OpenAPI/Swagger)
- Архитектурные решения (ADRs)
- Coding standards
- Development guidelines

### Пользователь
- User guides
- Video tutorials
- FAQ
- Support documentation

---

*Последнее обновление: Январь 2025*
