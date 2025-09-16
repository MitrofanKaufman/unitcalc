// Файл для запуска сервера с использованием esbuild
// Компилирует TypeScript код в JavaScript и запускает сервер

const { build } = require('esbuild');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Путь к скомпилированному файлу
const outfile = path.join(__dirname, 'dist', 'server.mjs');

// Функция для сборки приложения
async function buildApp() {
  try {
    console.log('🛠️  Компиляция TypeScript кода...');
    
    // Создаем папку dist, если её нет
    if (!fs.existsSync(path.dirname(outfile))) {
      fs.mkdirSync(path.dirname(outfile), { recursive: true });
    }
    
    // Настраиваем алиасы путей
    const alias = {
      // Основные алиасы
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@db': path.resolve(__dirname, 'src/db'),
      '@types': path.resolve(__dirname, 'src/types'),
      
      // Алиасы для файлов
      '@settings': path.resolve(__dirname, 'settings.js'),
      '@api/messages': path.resolve(__dirname, 'src/api/messages.js'),
      '@api/product': path.resolve(__dirname, 'app/src/api/product.js'),
      '@db/service': path.resolve(__dirname, 'src/db/service.js'),
      
      // Алиасы для функций
      '@function': path.resolve(__dirname, 'src/api/v1/functions'),
      '@function/SmoothWeightedProgressReporter': path.resolve(__dirname, 'src/api/v1/functions/SmoothWeightedProgressReporter.js'),
      '@function/index': path.resolve(__dirname, 'src/api/v1/functions/index.js'),
      '@function/saveJson': path.resolve(__dirname, 'src/api/v1/functions/saveJSON.js'),
      '@function/scrapeSellerById': path.resolve(__dirname, 'src/api/v1/functions/scrapeSellerById.js'),
      '@function/productScrapper': path.resolve(__dirname, 'src/api/v1/functions/productScrapper.js'),
      '@function/WBPvzFetcher': path.resolve(__dirname, 'src/api/v1/functions/WBPvzFetcher.js'),
      '@function/WBTariffFetcher': path.resolve(__dirname, 'src/api/v1/functions/WBTariffFetcher.js'),
      '@function/WeightedProgressReporter': path.resolve(__dirname, 'src/api/v1/functions/WeightedProgressReporter.js')
    };
    
    // Внешние зависимости, которые не нужно бандлить
    const external = [
      // Node.js built-in modules
      ...require('module').builtinModules,
      
      // NPM packages
      'express',
      'cors',
      'body-parser',
      'morgan',
      'helmet',
      'compression',
      'winston',
      'playwright',
      'puppeteer',
      'axios',
      'uuid',
      'dotenv',
      'source-map-support',
      'tsconfig-paths',
      'fs-extra',
      'path-browserify',
      'crypto-browserify',
      'stream-browserify',
      'os-browserify',
      'stream-http',
      'https-browserify',
      'browserify-zlib',
      'timers-browserify',
      'tty-browserify',
      'vm-browserify',
      'events',
      'url',
      'querystring',
      'string_decoder',
      'assert',
      'readline',
      'module',
      'perf_hooks',
      'async_hooks',
      'inspector',
      'v8',
      'worker_threads',
      'wasi',
      'diagnostics_channel',
      'trace_events',
      
      // Наши модули
      '@settings',
      '@api/messages',
      '@api/product',
      '@db/service',
      '@function/SmoothWeightedProgressReporter',
      '@function/index'
    ];
    
    await build({
      entryPoints: ['app.ts'],
      bundle: true,
      platform: 'node',
      target: 'node16',
      outfile,
      format: 'esm', // Используем ESM формат
      sourcemap: true,
      // Разрешаем использование top-level await
      banner: {
        js: '// @ts-nocheck\n'
      },
      // Настраиваем алиасы путей
      alias,
      external,
      loader: {
        '.ts': 'ts',
        '.js': 'jsx',
      },
      tsconfig: './tsconfig.json',
      // Включаем поддержку JSX
      jsx: 'automatic',
      // Игнорируем предупреждения о require
      logOverride: { 'require-resolve-not-external': 'silent' },
    });

    console.log('✅ Сборка завершена успешно');
    return true;
  } catch (error) {
    console.error('❌ Ошибка при сборке приложения:', error);
    return false;
  }
}

// Функция для запуска сервера
function startServer() {
  console.log('🚀 Запуск сервера...');
  
  // Используем node с флагами для поддержки ESM и TypeScript
  const args = [
    '--experimental-specifier-resolution=node',
    '--loader', 'ts-node/esm',
    '--experimental-vm-modules',
    '--no-warnings',
    '--no-deprecation',
    '--trace-warnings',
    '--unhandled-rejections=strict',
    '--es-module-specifier-resolution=node',
    '--experimental-json-modules',
    '--preserve-symlinks',
    '--preserve-symlinks-main',
    '--trace-uncaught',
    '--enable-source-maps',
    '--experimental-loader=ts-node/esm',
    `--require=${require.resolve('dotenv/config')}`,
    `--require=${require.resolve('source-map-support/register')}`,
    `--require=${require.resolve('tsconfig-paths/register')}`,
    `--require=${path.resolve(__dirname, 'tsconfig-paths.js')}`,
    '--trace-warnings',
    '--unhandled-rejections=strict',
    '--enable-source-maps',
    outfile,
    ...process.argv.slice(2)
  ];
  
  // Выводим команду для отладки
  console.log('🚀 Запуск сервера с аргументами:');
  console.log(args.map(arg => `  ${arg}`).join('\n'));
  
  console.log('🚀 Запуск сервера с аргументами:', args.join(' '));
  
  // Устанавливаем переменные окружения
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.PORT = process.env.PORT || '3000';
  
  // Добавляем пути для поиска модулей
  process.env.NODE_PATH = [
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules'),
    process.env.NODE_PATH || ''
  ].join(path.delimiter);

  // Создаем дочерний процесс с правильными переменными окружения
  const server = spawn('node', args, {
    stdio: 'inherit',
    shell: true,
    env: {
      // Копируем все существующие переменные окружения
      ...process.env,
      
      // Основные переменные окружения
      NODE_ENV: 'development',
      DEBUG: 'app:*',
      DEBUG_COLORS: 'true',
      FORCE_COLOR: 'true',
      
      // Настройки TypeScript
      TS_NODE_PROJECT: path.resolve(__dirname, 'tsconfig.json'),
      TS_NODE_TRANSPILE_ONLY: 'true',
      TS_NODE_FILES: 'true',
      
      // Пути для поиска модулей
      NODE_PATH: process.env.NODE_PATH,
      PATH: process.env.PATH,
      
      // Настройки приложения
      PORT: process.env.PORT || '3000',
      HOST: process.env.HOST || 'localhost',
      
      // Отключаем предупреждения
      NODE_NO_WARNINGS: '1',
      
      // Включаем source maps
      NODE_OPTIONS: process.env.NODE_OPTIONS,
      
      // Настройки для отладки
      NODE_DEBUG: 'module',
      DEBUG_DEPTH: '10',
      
      // Настройки для TypeScript
      TS_NODE_COMPILER_OPTIONS: JSON.stringify({
        module: 'esnext',
        moduleResolution: 'node',
        target: 'es2020',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
          '@api/*': ['./src/api/*'],
          '@core/*': ['./src/core/*'],
          '@utils/*': ['./src/utils/*'],
          '@db/*': ['./src/db/*'],
          '@function/*': ['./src/api/v1/functions/*']
        }
      })
    },
    cwd: process.cwd(),
    windowsHide: true,
    shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
    windowsVerbatimArguments: true,
    // Включаем наследование stdio для отладки
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  });

  server.on('error', (error) => {
    console.error('❌ Ошибка при запуске сервера:', error);
    process.exit(1);
  });

  server.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Сервер успешно завершил работу');
    } else {
      console.error(`❌ Сервер завершил работу с кодом ошибки: ${code}`);
    }
    process.exit(code);
  });

  // Обработка прерываний
  const shutdown = () => {
    console.log('🛑 Получен сигнал на завершение работы...');
    if (!server.killed) {
      server.kill('SIGTERM');
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Обработка необработанных исключений
  process.on('uncaughtException', (error) => {
    console.error('⚠️ Необработанное исключение:', error);
    shutdown();
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Необработанный промис:', reason);
    shutdown();
  });
}

// Основная функция
async function main() {
  const buildSuccess = await buildApp();
  if (buildSuccess) {
    startServer();
  } else {
    process.exit(1);
  }
}

// Запускаем приложение
main().catch(console.error);
