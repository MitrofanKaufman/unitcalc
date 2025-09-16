import { defineConfig, loadEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { compression } from 'vite-plugin-compression2';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загрузка конфигураций из папки config
const configPath = (filename: string) => path.resolve(__dirname, `./config/${filename}`);

// Пути в новой структуре проекта
const projectPaths = {
  frontend: path.resolve(__dirname, './app/frontend'),
  backend: path.resolve(__dirname, './app/backend'),
  shared: path.resolve(__dirname, './shared'),
  public: path.resolve(__dirname, './public'),
  config: path.resolve(__dirname, './config'),
  logs: path.resolve(__dirname, './logs'),
  dev: path.resolve(__dirname, './dev'),
};

// Получаем переменные окружения
const env = loadEnv('development', process.cwd(), '');

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
    const setTimeoutPromise = promisify(setTimeout);
    
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
  const isAnalyze = process.env.ANALYZE === 'true';

  // Очищаем порт только в режиме разработки
  if (isDev) {
    killPort(3000);
    await checkBackendConnection(3000);
  }

  return {
    // Базовый путь для продакшн-сборки
    base: isDev ? '/' : '/',
    
    // Плагины
    plugins: [
      // Базовые плагины React
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      
      // Поддержка SVG как компонентов React
      svgr({
        svgrOptions: {
          icon: true,
          svgProps: {
            className: 'svg-icon',
          },
        },
      }),
      
      // Иконки SVG
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'app/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      
      // Проверка типов и линтинг
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./app/frontend/**/*.{ts,tsx}"',
        },
        overlay: {
          initialIsOpen: false,
          position: 'br',
        },
      }),
      
      // PWA
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'WB Profit Calculator',
          short_name: 'WB Calc',
          description: 'Калькулятор рентабельности Wildberries',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      
      // HTML-шаблоны
      createHtmlPlugin({
        minify: isProd,
        inject: {
          data: {
            title: 'WB Profit Calculator',
            description: 'Калькулятор рентабельности Wildberries',
            themeColor: '#ffffff',
          },
        },
      }),
      
      // Сжатие ассетов
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\\.(br|gz)$/],
        deleteOriginalAssets: false,
      }),
      
      // Полифиллы для Node.js
      nodePolyfills({
        // Указываем только необходимые полифиллы
        include: ['buffer', 'process', 'util'],
        globals: {
          Buffer: true,
          process: true,
        },
      }),
      nodePolyfills({
        protocolImports: true,
      }),
      
      // Интеграция с Sentry (только для продакшна)
      isProd &&
        sentryVitePlugin({
          org: 'your-org-name',
          project: 'wb-profit-calculator',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          release: {
            name: `v${process.env.npm_package_version}`,
          },
        }),
      
      // Визуализатор бандла (только при флаге ANALYZE)
      isAnalyze &&
        visualizer({
          open: true,
          filename: 'bundle-analyzer-report.html',
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    
    // Разрешение модулей и алиасы
    resolve: {
      alias: {
        // Алиасы для фронтенда
        '@': projectPaths.frontend,
        '@app': path.resolve(projectPaths.frontend, 'app'),
        '@components': path.resolve(projectPaths.frontend, 'components'),
        '@pages': path.resolve(projectPaths.frontend, 'pages'),
        '@assets': path.resolve(projectPaths.frontend, 'assets'),
        '@styles': path.resolve(projectPaths.frontend, 'styles'),
        '@utils': path.resolve(projectPaths.frontend, 'utils'),
        '@hooks': path.resolve(projectPaths.frontend, 'hooks'),
        '@lib': path.resolve(projectPaths.frontend, 'lib'),
        
        // Алиасы для бэкенда (если понадобятся в клиентском коде)
        '@server': projectPaths.backend,
        '@api': path.resolve(projectPaths.backend, 'api'),
        
        // Общие алиасы
        '@shared': projectPaths.shared,
        '@config': projectPaths.config,
        '@tests': path.resolve(__dirname, './tests'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svg'],
    },
    
    // Настройки сервера разработки
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Прокси для API бэкенда
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''), // Удаляем префикс /api
        },
      },
      // Настройки для работы с новой структурой
      fs: {
        // Разрешаем обслуживать файлы из корня проекта и всех вложенных папок
        allow: [
          projectPaths.frontend,
          projectPaths.backend,
          projectPaths.shared,
          projectPaths.public,
          projectPaths.config,
        ],
      },
    },
    
    // Настройки превью
    preview: {
      port: 4000,
      strictPort: true,
      host: '0.0.0.0',
      https: false,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
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
        generateScopedName: isDev
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:5]',
        hashPrefix: 'prefix',
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
