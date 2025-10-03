📁 Файловая структура проекта
````
/ # корневая папка проекта
├── 📦 app/                          # 🏃‍♂️ Приложения (точки входа)
│   ├── web/                         # 🌐 PWA веб-приложение
│   │   ├── public/                  # 🖼️  Статические файлы
│   │   ├── src/                     # 📝 Исходный код веб-приложения
│   │   │   ├── components/          # 🧩 React компоненты
│   │   │   │   ├── layout/          # 🏗️  Layout компоненты
│   │   │   │   ├── ui/              # 🎨 UI компоненты
│   │   │   │   ├── features/        # ✨ Feature компоненты
│   │   │   │   └── shared/          # 🤝 Общие компоненты
│   │   │   ├── pages/               # 📄 Страницы приложения
│   │   │   │   ├── auth/            # 🔐 Аутентификация
│   │   │   │   ├── dashboard/       # 📊 Дашборды
│   │   │   │   └── [feature]/       # 🛠️  Feature страницы
│   │   │   ├── lib/                 # 🛠️  Библиотеки и утилиты
│   │   │   │   ├── api/             # 🔌 API клиенты
│   │   │   │   ├── storage/         # 💾 Локальное хранилище
│   │   │   │   ├── sync/            # 🔄 Синхронизация
│   │   │   │   ├── offline/         # 📴 Оффлайн режим
│   │   │   │   ├── error-handling/  # ❌ Обработка ошибок
│   │   │   │   ├── background/      # ⚙️  Фоновые задачи
│   │   │   │   └── [domain]/        # 🏢 Доменные библиотеки
│   │   │   ├── hooks/               # 🪝 React хуки
│   │   │   ├── stores/              # 🗂️  Управление состоянием
│   │   │   ├── styles/              # 🎨 Стили и темы
│   │   │   ├── types/               # 📋 TypeScript типы
│   │   │   └── utils/               # 🔧 Утилиты
│   │   ├── index.html               # 🏠 Главная HTML страница
│   │   ├── vite.config.ts           # ⚙️  Vite конфигурация
│   │   └── package.json             # 📦 Зависимости
│   ├── mobile/                      # 📱 React Native приложение
│   └── desktop/                     # 🖥️  Electron приложение
├── 📦 packages/                     # 📚 Переиспользуемые библиотеки
│   ├── config/                      # ⚙️  Система конфигурации
│   │   ├── src/                     # 📝 Исходный код
│   │   │   ├── schemas/             # 📋 Схемы валидации
│   │   │   ├── loaders/             # 📥 Загрузчики
│   │   │   └── validators/          # ✅ Валидаторы
│   │   └── package.json             # 📦 Метаданные
│   ├── core/                        # 🏢 Бизнес-логика
│   │   ├── src/                     # 📝 Исходный код
│   │   │   ├── domain/              # 🏛️  Доменные модели
│   │   │   │   ├── entities/        # 🧩 Сущности
│   │   │   │   ├── value-objects/   # 💎 Объекты-значения
│   │   │   │   ├── services/        # 🔧 Сервисы
│   │   │   │   └── repositories/    # 💾 Репозитории
│   │   │   ├── application/         # 🎯 Use cases
│   │   │   └── infrastructure/      # 🏗️  Инфраструктура
│   │   └── package.json             # 📦 Метаданные
│   ├── ui/                          # 🎨 Дизайн-система
│   │   ├── src/                     # 📝 Исходный код
│   │   │   ├── components/          # 🧩 Компоненты
│   │   │   ├── tokens/              # 🎯 Дизайн-токены
│   │   │   └── themes/              # 🌙 Темы
│   │   └── package.json             # 📦 Метаданные
│   └── api/                         # 🔌 API клиенты
│       ├── src/                     # 📝 Исходный код
│       │   ├── clients/             # 🌐 HTTP клиенты
│       │   ├── interceptors/        # 🔍 Перехватчики
│       │   └── types/               # 📋 Типы API
│       └── package.json             # 📦 Метаданные
├── 📦 services/                     # 🖥️  Серверные сервисы
│   ├── api-gateway/                 # 🚪 API шлюз
│   │   ├── src/                     # 📝 Исходный код
│   │   │   ├── controllers/         # 🎮 Контроллеры
│   │   │   ├── middleware/          # 🛡️  Middleware
│   │   │   ├── routes/              # 🛣️  Маршруты
│   │   │   └── services/            # 🔧 Сервисы
│   │   └── package.json             # 📦 Метаданные
│   ├── calculator-service/          # 🧮 Сервис расчета
│   ├── scraper-service/             # 🔍 Сервис парсинга
│   ├── ai-service/                  # 🤖 AI сервис
│   └── notification-service/        # 📢 Сервис уведомлений
├── 📦 infrastructure/               # 🏭 Инфраструктура
│   ├── database/                    # 💾 База данных
│   │   ├── migrations/              # 🗂️  Миграции
│   │   └── seeds/                   # 🌱 Начальные данные
│   ├── logging/                     # 📝 Логирование
│   │   ├── config/                  # ⚙️  Конфигурация
│   │   └── handlers/                # 🔧 Обработчики
│   ├── monitoring/                  # 📊 Мониторинг
│   │   ├── metrics/                 # 📈 Метрики
│   │   └── alerts/                  # 🚨 Оповещения
│   ├── deployment/                  # 🚀 Деплой
│   │   ├── docker/                  # 🐳 Docker
│   │   ├── k8s/                     # ☸️  Kubernetes
│   │   └── scripts/                 # 📜 Скрипты
│   └── security/                    # 🔒 Безопасность
│       ├── auth/                    # 🔐 Аутентификация
│       └── encryption/              # 🔐 Шифрование
├── 📦 docs/                         # 📚 Документация
│   ├── api/                         # 🔌 API документация
│   ├── guides/                      # 📖 Руководства
│   ├── architecture/                # 🏗️  Архитектура
│   └── development/                 # 💻 Разработка
├── 📦 scripts/                      # 📜 Скрипты
│   ├── build/                       # 🔨 Сборка
│   ├── deploy/                      # 🚀 Деплой
│   ├── test/                        # 🧪 Тестирование
│   └── utils/                       # 🔧 Утилиты
├── 📦 tests/                        # 🧪 Тесты
│   ├── e2e/                         # 🌐 End-to-end
│   ├── integration/                 # 🔗 Интеграционные
│   ├── unit/                        # 🧩 Модульные
│   └── fixtures/                    # 📦 Тестовые данные
└── 📦 tools/                        # 🔧 Инструменты разработки
    ├── dev-server/                  # 🖥️  Сервер разработки
    ├── code-generator/              # 🤖 Генератор кода
    └── analyzer/                    # 📊 Анализатор
```

