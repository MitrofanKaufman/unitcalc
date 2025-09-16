// Файл для запуска сервера с использованием ES модулей
// Использует tsx для выполнения TypeScript кода

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Регистрируем алиасы путей из tsconfig.json
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Импортируем tsconfig-paths
import { register } from 'tsconfig-paths';

// Загружаем tsconfig.json
import { readFileSync } from 'fs';
const tsConfig = JSON.parse(readFileSync('./tsconfig.json', 'utf-8'));

// Регистрируем алиасы
register({
  baseUrl: tsConfig.compilerOptions.baseUrl || '.',
  paths: tsConfig.compilerOptions.paths,
});

// Загружаем TypeScript файл с помощью tsx
const { app } = await import('./app.ts');

// Получаем порт из аргументов командной строки или используем 3000 по умолчанию
const port = process.argv[2] ? parseInt(process.argv[2], 10) : 3000;

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
