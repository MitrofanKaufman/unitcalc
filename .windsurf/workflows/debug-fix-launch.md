---
description: detect and fix launch blocking issues
---
# Workflow: Автоматический поиск и исправление проблем, мешающих запуску приложения

> Используйте, когда `npm run start` падает. Сценарий делает снимок текущего состояния, пытается устранить распространённые ошибки и фиксирует результат.

## Шаги
1. Проверка чистоты рабочей директории и **pre-commit snapshot**
   ```bash
   git status --short
   git add -A
   git commit -m "chore(debug): snapshot before auto-fix"
   ```

2. Запуск приложения в фоновом режиме с лог-захватом
   ```bash
   npm run start &> debug.log || true
   ```
   Если процесс завершился ошибкой, в `debug.log` появятся детали.

// turbo
3. Попытка авто-исправления
   ```bash
   # a) Исправляем очевидные package-проблемы
   npm install --legacy-peer-deps --loglevel=error
   npm audit fix --force || true

   # b) ESLint / Prettier авто-фиксы
   npm run lint --fix || true

   # c) TypeScript compile-check без эмита
   npx tsc --noEmit || true
   ```

4. Ручная правка: откройте `debug.log` + вывод команд из шага 3, устраните оставшиеся ошибки в коде. После правок убедитесь, что `npm run start` выполняется без ошибок.

5. Повторный запуск для проверки
   ```bash
   npm run start
   ```
   Если сервер поднялся, переходим к финальному коммиту.

6. **Post-fix commit**
   ```bash
   git add -A
   git commit -m "fix: launch blocking issues resolved"
   ```

## Примечания
- Шаг 3 помечен `// turbo`, поэтому безопасные auto-fix команды выполняются без подтверждения.
- Если после шага 5 ошибок нет — workflow завершён.
- Для сложных случаев анализируйте `debug.log` вручную и повторяйте шаги.
