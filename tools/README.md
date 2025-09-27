# 📦 tools/

## 🎯 Назначение

Папка содержит **инструменты разработки** - утилиты, генераторы кода, анализаторы и вспомогательные инструменты для команды разработки.

## 📋 Содержимое

### Инструменты
- `dev-server/` - 🖥️ Сервер разработки
- `code-generator/` - 🤖 Генератор кода
- `analyzer/` - 📊 Анализатор кода и производительности

## 🏗️ Структура инструментов

### Dev Server
```
dev-server/
├── src/                 # 📝 Исходный код
│   ├── server.ts        # 🖥️  Сервер разработки
│   ├── middleware/      # 🛡️  Middleware
│   │   ├── hmr.ts       # 🔥 Hot Module Replacement
│   │   └── proxy.ts     # 🌐 Proxy для API
│   └── utils/           # 🔧 Утилиты
│       └── logger.ts    # 📝 Логирование
├── config/              # ⚙️  Конфигурация
│   ├── dev-server.json  # 🖥️  Настройки сервера
│   └── webpack.config.js # ⚙️  Webpack конфигурация
└── package.json         # 📦 Метаданные
```

### Code Generator
```
code-generator/
├── src/                 # 📝 Исходный код
│   ├── generators/      # 🤖 Генераторы
│   │   ├── component.ts # 🧩 Генератор компонентов
│   │   ├── page.ts      # 📄 Генератор страниц
│   │   └── service.ts   # 🔧 Генератор сервисов
│   ├── templates/       # 📋 Шаблоны
│   │   ├── component.hbs # 🧩 Шаблон компонента
│   │   └── page.hbs     # 📄 Шаблон страницы
│   └── utils/           # 🔧 Утилиты
│       ├── fs.ts        # 📁 Файловые операции
│       └── prompt.ts    # ❓ Вопросы пользователю
├── cli/                 # 🖥️  CLI интерфейс
│   ├── index.ts         # 🎯 Точка входа
│   └── commands/        # 📋 Команды
└── package.json         # 📦 Метаданные
```

### Analyzer
```
analyzer/
├── src/                 # 📝 Исходный код
│   ├── analyzers/       # 📊 Анализаторы
│   │   ├── bundle.ts    # 📦 Анализ бандлов
│   │   ├── performance.ts # ⚡ Анализ производительности
│   │   └── security.ts  # 🔒 Анализ безопасности
│   ├── reporters/       # 📋 Репортеры
│   │   ├── html.ts      # 🌐 HTML отчет
│   │   ├── json.ts      # 📄 JSON отчет
│   │   └── cli.ts       # 🖥️  CLI отчет
│   └── utils/           # 🔧 Утилиты
│       └── parser.ts    # 🔍 Парсер кода
├── config/              # ⚙️  Конфигурация
│   ├── analyzer.json    # 📊 Настройки анализатора
└── package.json         # 📦 Метаданные
```

## 🚀 Использование инструментов

### Dev Server
```bash
# Запуск сервера разработки
cd tools/dev-server
npm install
npm start

# Сборка для продакшена
npm run build
```

### Code Generator
```bash
# Генерация компонента
cd tools/code-generator
node cli/index.js generate component Button --type=ui

# Генерация страницы
node cli/index.js generate page Dashboard --layout=authenticated

# Генерация сервиса
node cli/index.js generate service UserService --domain=auth
```

### Analyzer
```bash
# Анализ бандла
cd tools/analyzer
npm run analyze -- --input=dist --output=report.html

# Анализ производительности
npm run performance -- --url=http://localhost:3000

# Анализ безопасности
npm run security -- --scan=all
```

## 📝 Создание инструментов

### Структура инструмента
```typescript
// 📦 tools/example-tool/src/index.ts
// Описание инструмента и его предназначения
// Используется для автоматизации задач разработки

interface ToolOptions {
  verbose?: boolean
  output?: string
  config?: string
}

export class ExampleTool {
  constructor(private options: ToolOptions) {}

  async run(): Promise<void> {
    console.log('Запуск инструмента...')
    // Логика инструмента
  }
}

// CLI интерфейс
if (require.main === module) {
  const tool = new ExampleTool(process.argv)
  tool.run().catch(console.error)
}
```

### Публикация инструмента
```json
{
  "name": "@wb-calc/example-tool",
  "version": "1.0.0",
  "bin": {
    "example-tool": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 🔧 Типы инструментов

### Инструменты разработки
- **Dev server** - сервер для разработки
- **Code generator** - генератор кода
- **Linter** - статический анализ кода
- **Formatter** - форматирование кода

### Инструменты анализа
- **Bundle analyzer** - анализ размера бандлов
- **Performance profiler** - профилирование производительности
- **Security scanner** - сканирование безопасности
- **Dependency analyzer** - анализ зависимостей

### Инструменты автоматизации
- **Migration generator** - генератор миграций
- **Test data generator** - генератор тестовых данных
- **Documentation generator** - генератор документации
- **Release manager** - управление релизами

## 📊 Мониторинг инструментов

### Метрики использования
- **Usage frequency** - частота использования
- **Performance** - производительность инструментов
- **Error rate** - частота ошибок
- **User satisfaction** - удовлетворенность пользователей

### Логирование
```typescript
import { logger } from '../utils/logger'

export class ToolRunner {
  async execute(): Promise<void> {
    logger.info('Начало выполнения инструмента', { tool: 'example' })

    try {
      await this.runTool()
      logger.info('Инструмент выполнен успешно')
    } catch (error) {
      logger.error('Ошибка выполнения инструмента', { error })
    }
  }
}
```

## 🔒 Безопасность инструментов

### Валидация входных данных
```typescript
const schema = z.object({
  input: z.string().min(1),
  output: z.string(),
  force: z.boolean().default(false)
})

const options = schema.parse(rawOptions)
```

### Обработка ошибок
```typescript
async function safeExecute() {
  try {
    await tool.execute()
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Ошибка валидации:', error.message)
    } else {
      console.error('Неизвестная ошибка:', error)
    }
    process.exit(1)
  }
}
```

## 🚀 CI/CD интеграция

### Автоматический запуск
```yaml
# .github/workflows/tools.yml
- name: Run code generator
  run: |
    cd tools/code-generator
    npm run generate -- --all

- name: Run bundle analyzer
  run: |
    cd tools/analyzer
    npm run analyze -- --output=report.html
```

### Публикация артефактов
```yaml
- name: Upload reports
  uses: actions/upload-artifact@v3
  with:
    name: analysis-reports
    path: tools/analyzer/reports/
```

## 📚 Документация инструментов

### README для каждого инструмента
```markdown
# 🔧 example-tool/

## 📋 Назначение

Автоматизирует задачу генерации кода.

## 🚀 Установка

```bash
npm install -g @wb-calc/example-tool
```

## 📖 Использование

### CLI
```bash
example-tool generate component Button
example-tool analyze bundle dist/
```

### Программный API
```typescript
import { ExampleTool } from '@wb-calc/example-tool'

const tool = new ExampleTool(options)
await tool.run()
```
```

### Справка
```bash
# Справка по инструменту
example-tool --help

# Справка по команде
example-tool generate --help
```

---

*Последнее обновление: Январь 2025*
