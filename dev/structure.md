unit-calculator-starter/
├── README.md                # Инструкции для разработчиков
├── openapi.yaml             # API спецификация
├── tokens.json              # Design tokens (для Figma и Tailwind)
├── package.json             # Зависимости проекта
├── vite.config.ts           # Конфиг Vite
├── tailwind.config.js       # Конфиг Tailwind с токенами
├── postcss.config.js        # PostCSS
├── tsconfig.json            # TypeScript конфиг
├── src/
│   ├── main.tsx             # Точка входа React
│   ├── App.tsx              # Основной layout
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx   # Навигация
│   │   └── ui/
│   │       └── Button.tsx   # Универсальная кнопка
│   ├── styles/
│   │   ├── index.css        # Tailwind импорты
│   │   └── variables.css    # CSS переменные из tokens.json
│   └── api/
│       └── client.ts        # Axios клиент для API
└── public/
└── manifest.json        # PWA манифест
