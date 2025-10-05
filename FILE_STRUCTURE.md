📁 Актуальная файловая структура проекта WB Calculator
````
/ # корневая папка проекта
├── 📦 app/                          # 🏃‍♂️ Приложения (точки входа)
│   ├── web/                         # 🌐 PWA веб-приложение
│   │   ├── public/                  # 🖼️  Статические файлы
│   │   ├── src/                     # 📝 Исходный код веб-приложения
│   │   │   ├── components/          # 🧩 React компоненты
│   │   │   │   ├── layout/          # 🏗️  Layout компоненты
│   │   │   │   │   ├── MainLayout.tsx    # Основной лейаут
│   │   │   │   │   └── ResponsiveHeader.tsx # Адаптивный хедер
│   │   │   │   ├── common/          # 🤝 Общие компоненты
│   │   │   │   │   ├── DebugPanel.tsx    # Панель отладки
│   │   │   │   │   └── NotificationProvider.tsx # Провайдер уведомлений
│   │   │   │   ├── HomePage.tsx     # Главная страница
│   │   │   │   ├── ProductSearchPage.tsx # Страница поиска товаров
│   │   │   │   ├── AnalyticsPage.tsx # Страница аналитики
│   │   │   │   ├── ProductCard.tsx  # Карточка товара
│   │   │   │   └── ProgressBar.tsx  # Индикатор прогресса
│   │   │   ├── hooks/               # 🪝 React хуки
│   │   │   │   └── useWildberriesSearch.ts # Хук для поиска WB
│   │   │   ├── services/            # 🔧 Сервисы API
│   │   │   │   └── wildberries.ts  # Сервис Wildberries API
│   │   │   ├── styles.css           # 🎨 Глобальные стили
│   │   │   └── App.tsx              # 🏠 Главный компонент приложения
│   │   ├── index.html               # 🏠 Главная HTML страница
│   │   ├── vite.config.ts           # ⚙️  Vite конфигурация
│   │   └── package.json             # 📦 Зависимости
├── 📦 services/                     # 🖥️  Серверные сервисы
│   ├── api-gateway/                 # 🚪 API шлюз
│   ├── calculator-service/          # 🧮 Сервис расчета
│   └── scraper-service/             # 🔍 Сервис парсинга
├── 📦 packages/                     # 📚 Переиспользуемые библиотеки
├── 📦 docs/                         # 📚 Документация
├── 📦 scripts/                      # 📜 Скрипты сборки и деплоя
├── 📦 tests/                        # 🧪 Тесты
└── 📦 [корневые конфиги]           # ⚙️ Конфигурационные файлы
```

```

