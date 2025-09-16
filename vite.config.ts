import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Project paths
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

// Основная конфигурация Vite
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isProd = mode === 'production';

  // Переменные окружения
  const env = loadEnv(mode, process.cwd(), '');
  const devPort = parseInt(env.PORT || '5173', 10);

  // Настройки прокси для API
  const apiProxy = {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
    ws: true,
    xfwd: true,
    logLevel: 'warn',
    timeout: 30000,
    proxyTimeout: 30000,
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

  return {
    base: isProd ? '/dist/' : '/',
    root: __dirname,

    server: {
      port: devPort,
      strictPort: true,
      open: isDev,
      host: '0.0.0.0',
      proxy: {
        '/api': apiProxy,
      },
      fs: {
        allow: ['..'],
        cachedChecks: true,
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: devPort,
      },
      cors: true,
    },

    preview: {
      port: devPort + 1,
      open: false,
      cors: true,
      proxy: {
        '/api': apiProxy,
      },
    },

    plugins: [
      react(),
    ],

    resolve: {
      alias: [
        { find: '@', replacement: projectPaths.client },
        { find: '@root', replacement: projectPaths.root },
        { find: '@app', replacement: path.resolve(projectPaths.client, 'app') },
        { find: '@components', replacement: path.resolve(projectPaths.client, 'components') },
        { find: '@pages', replacement: path.resolve(projectPaths.client, 'pages') },
        { find: '@assets', replacement: path.resolve(projectPaths.client, 'assets') },
        { find: '@styles', replacement: path.resolve(projectPaths.client, 'styles') },
        { find: '@utils', replacement: path.resolve(projectPaths.client, 'utils') },
        { find: '@hooks', replacement: path.resolve(projectPaths.client, 'hooks') },
        { find: '@lib', replacement: path.resolve(projectPaths.client, 'lib') },
        { find: '@server', replacement: projectPaths.server },
        { find: '@api', replacement: path.resolve(projectPaths.server, 'api/v1') },
        { find: '@shared', replacement: projectPaths.shared },
        { find: '@config', replacement: projectPaths.config },
        { find: '@tests', replacement: path.resolve(__dirname, 'tests') },
        { find: '@public', replacement: path.resolve(projectPaths.client, 'public') },
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.svg'],
    },

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
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
              return `assets/images/[name].[hash][ext]`;
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
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

    define: {
      'process.env': {},
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __MODE__: JSON.stringify(mode),
    },

    css: {
      devSourcemap: isDev,
      postcss: './postcss.config.cjs',
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

    cacheDir: './node_modules/.vite',
    logLevel: isDev ? 'info' : 'warn',
    clearScreen: !isDev,
  };
});
