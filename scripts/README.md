# 📦 scripts/

## 🎯 Назначение

Папка содержит **исполняемые скрипты** - утилиты для сборки, деплоя, тестирования и других задач разработки.

## 📋 Содержимое

### Типы скриптов
- `build/` - 🔨 Скрипты сборки
- `deploy/` - 🚀 Скрипты деплоя
- `test/` - 🧪 Тестовые скрипты
- `utils/` - 🔧 Утилитарные скрипты

## 🏗️ Структура скриптов

### Build Scripts
```
build/
├── bundle-analyzer.js   # 📊 Анализатор бандлов
├── docker-build.sh      # 🐳 Сборка Docker образов
├── package-build.js     # 📦 Сборка пакетов
└── production-build.sh  # 🚀 Продакшн сборка
```

### Deploy Scripts
```
deploy/
├── k8s-deploy.sh        # ☸️ Деплой в Kubernetes
├── docker-deploy.sh     # 🐳 Деплой с Docker
├── rollback.sh          # ⏪ Откат версии
└── health-check.sh      # 🏥 Проверка здоровья
```

### Test Scripts
```
test/
├── e2e-test.sh          # 🌐 End-to-end тесты
├── load-test.sh         # 📈 Нагрузочные тесты
├── unit-test.sh         # 🧩 Модульные тесты
└── integration-test.sh  # 🔗 Интеграционные тесты
```

### Utility Scripts
```
utils/
├── database-setup.js    # 💾 Настройка БД
├── generate-config.js   # ⚙️ Генерация конфигурации
├── lint-fix.js          # 🔧 Автоисправление линтинга
└── version-bump.js      # 📈 Обновление версии
```

## 🚀 Использование скриптов

### Запуск скриптов
```bash
# NPM скрипты
npm run build          # Сборка проекта
npm run test           # Запуск тестов
npm run deploy         # Деплой приложения

# Прямой запуск
node scripts/build/package-build.js
bash scripts/deploy/k8s-deploy.sh
```

### Параметры скриптов
```bash
# Сборка с параметрами
npm run build -- --analyze --sourcemap

# Деплой в окружение
npm run deploy -- --env=production --region=eu-west
```

## 📝 Создание скриптов

### Стандарты
- **Node.js** - для JavaScript/TypeScript скриптов
- **Bash** - для shell скриптов
- **Python** - для сложных утилит
- **YAML** - для конфигурационных файлов

### Структура скрипта
```javascript
#!/usr/bin/env node

// 📦 scripts/example.js
// Описание скрипта и его назначения
// Используется для решения конкретной задачи

const { program } = require('commander')

program
  .name('example-script')
  .description('Описание скрипта')
  .option('-v, --verbose', 'подробный вывод')
  .option('-d, --dry-run', 'тестовый запуск')
  .parse()

async function main() {
  console.log('Запуск скрипта...')
  // Логика скрипта
}

main().catch(console.error)
```

## 🔧 Типы скриптов

### Скрипты сборки
- **Bundle** - сборка JavaScript/TypeScript
- **Docker** - сборка образов
- **Assets** - оптимизация ресурсов
- **Documentation** - генерация документации

### Скрипты деплоя
- **Environment** - настройка окружений
- **Database** - миграции и seed
- **Monitoring** - настройка мониторинга
- **Backup** - резервное копирование

### Скрипты тестирования
- **Unit tests** - модульные тесты
- **E2E tests** - сквозные тесты
- **Performance tests** - производительность
- **Security tests** - безопасность

### Утилитарные скрипты
- **Database utilities** - работа с БД
- **Code generation** - генерация кода
- **File operations** - файловые операции
- **Validation** - валидация данных

## 📊 Мониторинг скриптов

### Логирование
```bash
# Логи в файл
npm run build > build.log 2>&1

# Мониторинг выполнения
npm run build | tee build.log
```

### Метрики
- **Execution time** - время выполнения
- **Success rate** - частота успешных запусков
- **Error tracking** - отслеживание ошибок
- **Resource usage** - использование ресурсов

## 🔒 Безопасность скриптов

### Валидация входных данных
```javascript
const { z } = require('zod')

const schema = z.object({
  environment: z.enum(['development', 'staging', 'production']),
  region: z.string().min(1)
})

const options = schema.parse(program.opts())
```

### Обработка ошибок
```javascript
async function safeExecute() {
  try {
    await riskyOperation()
  } catch (error) {
    logger.error('Ошибка выполнения:', error)
    process.exit(1)
  }
}
```

## 🚀 CI/CD интеграция

### GitHub Actions
```yaml
# .github/workflows/build.yml
- name: Run build script
  run: |
    npm run build
    node scripts/build/bundle-analyzer.js
```

### Автоматизация
- **Pre-commit hooks** - проверка перед коммитом
- **Pre-push hooks** - валидация перед пушем
- **Scheduled scripts** - периодические задачи

## 📚 Документация скриптов

### Комментарии
- **Назначение** - что делает скрипт
- **Параметры** - входные параметры
- **Примеры** - примеры использования
- **Зависимости** - внешние зависимости

### README для сложных скриптов
```markdown
# 🔨 build/bundle-analyzer.js

## 📋 Назначение

Анализирует размер бандлов и предлагает оптимизации.

## 🚀 Использование

```bash
node scripts/build/bundle-analyzer.js --input=dist --output=report.html
```

## ⚙️ Параметры

- `--input` - путь к бандлу (по умолчанию: dist)
- `--output` - путь к отчету (по умолчанию: report.html)
- `--format` - формат отчета (html, json)
```

---

*Последнее обновление: Январь 2025*
