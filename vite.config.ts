import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загрузка конфигураций из папки config
const _configPath = (filename: string) => path.resolve(__dirname, `./config/${filename}`);

// Пути в структуре проекта
const projectPaths = {
  root: __dirname,
  client: path.resolve(__dirname, 'app/client'),
  server: path.resolve(__dirname, 'app/server'),
  shared: path.resolve(__dirname, 'shared'),
  public: path.resolve(__dirname, 'public'),
  config: path.resolve(__dirname, 'config'),
  logs: path.resolve(__dirname, 'logs'),
  dev: path.resolve(__dirname, 'dev'),
};

// Получаем переменные окружения
const _env = loadEnv('development', process.cwd(), '');

// Автоматическая зачистка порта перед стартом
async function killPort(port: number) {
  try {
    const { exec } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execAsync = promisify(exec);
    
    try {
      const { stdout } = await execAsync(`lsof -i :${port} | grep LISTEN | awk '{print $2}'`);
      const pids = stdout.split('\n').filter(pid => pid.trim() !== '');
      
      for (const pid of pids) {
        try {
          process.kill(parseInt(pid, 10), 'SIGTERM');
          console.log(`Killed process ${pid} on port ${port}`);
        } catch (e) {
          console.error(`Failed to kill process ${pid}:`, e);
        }
      }
    } catch (e: any) {
      // Порт свободен или не удалось выполнить команду
      if (!e.message.includes('Command failed')) {
        console.error('Error killing port:', e);
      }
    }
  } catch (e) {
    console.error('Error importing required modules:', e);
  }
}

// Проверка доступности API перед запуском
async function checkBackendConnection(port: number = 3000): Promise<boolean> {
  try {
    const http = await import('node:http');
    const { promisify } = await import('node:util');
    const _setTimeoutPromise = promisify(setTimeout);
    
    return new Promise((resolve) => {
      const req = http.request(
        { host: 'localhost', port, method: 'HEAD', timeout: 2000 },
        () => {
          console.log(`Backend is running on port ${port}`);
          resolve(true);
        }
      );

      req.on('error', () => {
        console.warn(`Backend is not running on port ${port}, starting in frontend-only mode`);
        resolve(false);
      });

      req.on('timeout', () => {
        console.warn(`Backend connection timeout on port ${port}, starting in frontend-only mode`);
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  } catch (e) {
    console.error('Error checking backend connection:', e);
    return false;
  }
}

// Основная конфигурация Vite
export default defineConfig(async ({ mode }) => {
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  
  // PostCSS настройки теперь в postcss.config.cjs
  
  // Загружаем переменные окружения
  const env = loadEnv(mode, process.cwd(), '');
  
  // Базовый URL для API
  const apiBaseUrl = env.VITE_API_BASE_URL || (isDev ? 'http://localhost:3000' : '/api');
  
  // Порт для разработки
  const devPort = parseInt(env.PORT || '5173', 10);
  
  // Настройки прокси для API
  const apiProxy = {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
    // Не падать при ошибках подключения к бэкенду
    ws: true,
    xfwd: true,
    logLevel: 'warn',
    // Таймауты
    timeout: 30000,
    proxyTimeout: 30000,
    // Обработка ошибок
    onError: (err: Error, req: any, res: any) => {
      console.warn('[Vite Proxy] Backend connection error:', err.message);
      if (!res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({
        error: 'Backend is not available',
        message: 'The backend server is not running. Please start the backend server.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      }));
    }
  };

  // В режиме разработки проверяем доступность бэкенда, но не падаем при ошибке
  if (isDev) {
    killPort(3000);
    try {
      await checkBackendConnection(3000);
    } catch (error) {
      console.warn('Backend server is not available. The application will run in frontend-only mode.');
      console.warn('To enable full functionality, please start the backend server on port 3000');
    }
  }

  return {
    // Базовый путь для продакшн-сборки
    base: isProd ? '/dist/' : '/',
    
    // Корневая директория проекта
    root: __dirname,
    
    // Настройки сервера разработки
    server: {
      port: devPort,
      strictPort: true,
      open: isDev,
      host: '0.0.0.0', // Разрешаем доступ с других устройств в локальной сети
      proxy: {
        // Прокси для API
        '/api': apiProxy,
        // Правило для корректной загрузки статических файлов
        '^/app/client/(.*)': {
          target: `http://localhost:${devPort}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/app\/client\//, '/')
        }
      },
      fs: {
        // Разрешаем доступ к файлам за пределами корневой директории
        allow: ['..'],
        // Кешируем запросы к файловой системе
        cachedChecks: true
      },
      // Настройки HMR (Hot Module Replacement)
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: devPort
      },
      // Включить CORS для разработки
      cors: true,
    },
    
    // Настройки превью-сервера
    preview: {
      port: devPort + 1,
      open: false, // Не открывать автоматически в режиме превью
      cors: true,
      proxy: serverProxy,
    },
    
    // Плагины
    plugins: [
      // Базовые плагины React
      react({
        /* jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        }, */
      }),
      
      // Поддержка SVG как компонентов React
      /* svgr({
        svgrOptions: {
          icon: true,
          svgProps: {
            className: 'svg-icon',
          },
        },
      }), */
      
    ].filter(Boolean),
    
    // Настройка разрешения модулей и алиасов
    resolve: {
      alias: [
        // Основные алиасы
        { find: '@', replacement: projectPaths.client },
        { find: '@root', replacement: projectPaths.root },
        
        // Алиасы клиентской части
        { find: '@app', replacement: path.resolve(projectPaths.client, 'app') },
        { find: '@components', replacement: path.resolve(projectPaths.client, 'components') },
        { find: '@pages', replacement: path.resolve(projectPaths.client, 'pages') },
        { find: '@assets', replacement: path.resolve(projectPaths.client, 'assets') },
        { find: '@styles', replacement: path.resolve(projectPaths.client, 'styles') },
        { find: '@utils', replacement: path.resolve(projectPaths.client, 'utils') },
        { find: '@hooks', replacement: path.resolve(projectPaths.client, 'hooks') },
        { find: '@lib', replacement: path.resolve(projectPaths.client, 'lib') },
        
        // Алиасы бэкенда
        { find: '@server', replacement: projectPaths.server },
        { find: '@api', replacement: path.resolve(projectPaths.server, 'api/v1') },
        
        // Общие алиасы
        { find: '@shared', replacement: projectPaths.shared },
        { find: '@config', replacement: projectPaths.config },
        { find: '@tests', replacement: path.resolve(__dirname, 'tests') },
        { find: '@public', replacement: path.resolve(projectPaths.client, 'public') },
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.svg'],
    },
    
    // Оптимизация сборки
    build: {
      outDir: 'dist',
      sourcemap: isDev ? 'inline' : isProd ? 'hidden' : false,
      minify: isProd ? 'esbuild' : false,
      cssMinify: isProd,
      cssCodeSplit: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['lodash', 'axios', 'date-fns'],
            ui: ['@radix-ui/react-*'],
          },
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (/\\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
              return `assets/images/[name].[hash][ext]`;
            }
            
            if (/\\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name].[hash][ext]`;
            }
            
            if (ext === 'css') {
              return `assets/css/[name].[hash][ext]`;
            }
            
            return `assets/[name].[hash][ext]`;
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    
    // Глобальные переменные
    define: {
      'process.env': {},
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __MODE__: JSON.stringify(mode),
    },
    
    // Настройки CSS
    css: {
      devSourcemap: isDev,
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/_variables.scss";
            @import "@/styles/_mixins.scss";
          `,
        },
      },
    },
    
    // Настройки для тестов
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setup.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          '**/*.d.ts',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/*.spec.{js,jsx,ts,tsx}',
          '**/__tests__/**',
          '**/__mocks__/**',
        ],
      },
    },
    
    // Кеширование
    cacheDir: './node_modules/.vite',
    
    // Логи
    logLevel: isDev ? 'info' : 'warn',
    clearScreen: !isDev,
  };
});
