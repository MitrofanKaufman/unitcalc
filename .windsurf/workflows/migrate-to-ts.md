---
description: migrate selected folder to TypeScript
---

# Миграция выбранной папки проекта на TypeScript

> Этот workflow переводит файлы в указанной директории с **.js/.jsx** на **.ts/.tsx**, и настраивает окружение.
> Перед запуском убедитесь, что у вас есть резервная копия или активная ветка git.

## Параметры
- `$FOLDER` – абсолютный или относительный путь к папке, которую нужно конвертировать.
- Можно передавать **алиас** в форме `@name`. По умолчанию алиасы разворачиваются в `src/<name>`.

```bash
# Пример вызова с алиасом
/migrate-to-ts @functions   # будет преобразовано в src/functions
```

> Внутренняя логика workflow в начале выполняет:
> ```bash
> if [[ "$FOLDER" == @* ]]; then
>   FOLDER="src/${FOLDER#@}"
> fi
> ```
> чтобы получить фактический путь.
>
> ⚠️ Если алиас отсутствует в `vite.config.ts`, по умолчанию он разворачивается в `src/<alias>`.

// turbo-all

## Шаги
+0. **Определение пути и анализ текущего состояния**
+
+   ```bash
+   # Если указан алиас (@name), считываем путь из vite.config.ts
+   if [[ "$FOLDER" == @* ]]; then
+     ALIAS_NAME="${FOLDER#@}"
+     FOLDER=$(node - <<'NODE'
+       import { resolve } from 'node:path';
+       import { pathToFileURL } from 'node:url';
+       import viteConfig from './vite.config.ts';
+       const alias = viteConfig?.resolve?.alias || {};
+       const target = alias['@' + process.argv[1]];
+       if (!target) {
+         console.error('Alias not found in vite.config.ts');
+         process.exit(1);
+       }
+       console.log(resolve(process.cwd(), target));
+     NODE "$ALIAS_NAME")
+   fi
+
+   mkdir -p log
+   LOG_FILE="log/migrate-$(basename $FOLDER).log"
+   echo "Мигрируем папку: $FOLDER" | tee "$LOG_FILE"
+
+   # Предварительный анализ ESLint и TypeScript
+   npx eslint "$FOLDER" --ext .js,.jsx  -f table | tee -a "$LOG_FILE" || true
+   npx tsc --noEmit --allowJs --checkJs --project tsconfig.json 2>&1 | tee -a "$LOG_FILE" || true
+   echo "Отчёт сохранён в $LOG_FILE. Продолжить миграцию после ознакомления." | tee -a "$LOG_FILE"
+   # Windows PowerShell не читает <<'NODE', поэтому используйте Git-Bash или WSL.
+   # На Windows-only можно заменить вызов Node отдельным .js файлом.
+   ```

 1. Проверка git-статуса и создание новой ветки
   ```bash
   git status --short
   git checkout -b migrate-to-ts-$(basename $FOLDER)
   ```

// turbo
2. Установка зависимостей TypeScript
   ```bash
   npm install -D typescript @types/node ts-node tsx @vitejs/plugin-react-swc @types/react @types/react-dom
   ```

3. Создание базового `tsconfig.json` (если отсутствует)
   ```bash
   npx tsc --init --rootDir src --outDir dist --resolveJsonModule --esModuleInterop --skipLibCheck true --strict
   ```

4. Рекурсивное переименование файлов **по одному** (чтобы каждый файл фиксировался отдельным коммитом)
   ```bash
   for file in $(git ls-files $FOLDER | grep -E '\\.(js|jsx)$'); do
     npx rename 's/\.jsx?$/\.tsx/' "$file" && \
     git add "$file" && \
     git commit -m "chore(ts): migrate $(basename $file) to TS"
   done
   ```

5. Установка `ESLint` для TypeScript
   ```bash
   npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```
   Добавьте/обновите `.eslintrc.cjs`:
   ```js
   module.exports = {
     parser: '@typescript-eslint/parser',
     plugins: ['@typescript-eslint'],
     extends: [
       'eslint:recommended',
       'plugin:react/recommended',
       'plugin:@typescript-eslint/recommended'
     ],
     parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
     settings: { react: { version: 'detect' } },
   };
   ```

6. Автоматическое обновление импортов (с помощью `ts-migrate`)
   ```bash
   npx ts-migrate-full $FOLDER
   ```

7. **Рефакторинг под лучшие практики TypeScript**
   После автоматической миграции код содержит много `any`. Следуйте шагам:

   1. Запустите ESLint с флагом `--fix` для авто-правок:
      ```bash
      npx eslint $FOLDER --ext .ts,.tsx --fix
      ```

   2. Проанализируйте предупреждения `@typescript-eslint/no-explicit-any`, `no-unused-vars`, `no-implicit-any` — устраните их, добавляя явные типы и `unknown` вместо `any`.

   3. Используйте возможности TS:
      - Объявляйте `readonly` для неизменяемых массивов/объектов;
      - Применяйте `enum` или `union literal` типов вместо строк-констант;
      - Создавайте `type`/`interface` для сложных структур;
      - Заменяйте callback-основанное API на `async/await` с `Promise<ReturnType>`.

   4. Настройте строгий режим в `tsconfig.json` (если ещё нет):
      ```jsonc
      "strict": true,
      "noUncheckedIndexedAccess": true,
      "noImplicitOverride": true,
      "exactOptionalPropertyTypes": true
      ```

   5. Запустите `npx tsc --noEmit` до тех пор, пока список ошибок не станет пустым.

   Коммиты можно делать по файлу или функциональному блоку: `feat(ts): add explicit types to UserService`.

8. Запуск компиляции и фикс ошибок
   ```bash
   npx tsc --noEmit
   # исправьте ошибки в IDE / вручную, затем повторите
   ```

9. Обновление скриптов в `package.json` (пример)
   ```jsonc
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "start": "node dist/index.js"
   }
   ```

10. Запуск тестов/приложения
    ```bash
    npm run dev
    ```

11. Коммит изменений
    ```bash
    git add .
    git commit -m "chore: migrate $FOLDER to TypeScript"
    ```

12. PR / Merge на основную ветку.