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
  config: path.resolve(__dirname, 'app/config'),
  logs: path.resolve(__dirname, 'logs'),
  dev: path.resolve(__dirname, 'dev'),
  utils: path.resolve(__dirname, 'app/client/utils'),
  hooks: path.resolve(__dirname, 'app/client/hooks'),
  core: path.resolve(__dirname, 'app/client/core'),
};

// Main Vite configuration
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const env = loadEnv(mode, process.cwd(), '');
  const devPort = parseInt(env.PORT || '5173', 10);
  const apiTarget = 'http://localhost:3000';

  return {
    base: isProd ? '/dist/' : '/',
    root: __dirname,
    
    // Configure the development server
    server: {
      port: devPort,
      strictPort: true,
      // Disable HMR to prevent WebSocket issues
      hmr: false,
      // Configure proxy for API requests
      proxy: {
        '^/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          // Disable HTTP/2
          http2: false,
          // Configure request headers
          headers: {
            'Connection': 'keep-alive',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          // Configure proxy events
          configure: (proxy: any) => {
            // Log proxy requests
            proxy.on('proxyReq', (proxyReq: any) => {
              console.log(`[Vite Proxy] Proxying ${proxyReq.method} ${proxyReq.path}`);
              // Ensure we're using HTTP/1.1
              proxyReq.setHeader('Connection', 'keep-alive');
            });
            
            // Log proxy responses
            proxy.on('proxyRes', (proxyRes: any, req: any) => {
              console.log(`[Vite Proxy] Received ${proxyRes.statusCode} for ${req.url}`);
            });
          }
        }
      }
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'app/client'),
        '@client': path.resolve(__dirname, 'app/client'),
        '@server': path.resolve(__dirname, 'app/server'),
        '@shared': path.resolve(__dirname, 'shared'),
        '@components': path.resolve(__dirname, 'app/client/components'),
        '@core': path.resolve(__dirname, 'app/client/core'),
        '@utils': path.resolve(__dirname, 'app/client/core/utils'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.svg'],
    },

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
        { find: '@/client', replacement: projectPaths.client },
        { find: '@root', replacement: projectPaths.root },
        { find: '@app', replacement: path.resolve(projectPaths.client, 'app') },
        { find: '@server', replacement: projectPaths.server },
        { find: '@api', replacement: path.join(projectPaths.server, 'api') },
        { find: '@shared', replacement: projectPaths.shared },
        { find: '@config', replacement: projectPaths.config },
        { find: '@tests', replacement: path.join(projectPaths.root, 'tests') },
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
