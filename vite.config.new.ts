import { defineConfig, loadEnv } from 'vite';
import path from 'path';

// Aliases for imports
const aliases = {
  '@': path.resolve(__dirname, 'app/client'),
  '@client': path.resolve(__dirname, 'app/client'),
  '@server': path.resolve(__dirname, 'app/server'),
  '@shared': path.resolve(__dirname, 'shared'),
  '@components': path.resolve(__dirname, 'app/client/components'),
  '@core': path.resolve(__dirname, 'app/client/core'),
  '@utils': path.resolve(__dirname, 'app/client/core/utils'),
  '@public': path.resolve(__dirname, 'public'),
  '@config': path.resolve(__dirname, 'app/config'),
  '@logs': path.resolve(__dirname, 'logs'),
  '@dev': path.resolve(__dirname, 'dev'),
  '@hooks': path.resolve(__dirname, 'app/client/hooks'),
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

    // Build configuration
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProd,
      minify: isProd ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },

    // Resolve configuration
    resolve: {
      alias: aliases,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },

    // CSS configuration
    css: {
      devSourcemap: !isProd,
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },

    // Plugin configuration
    plugins: [
      // Add any Vite plugins here
    ],
  };
});
