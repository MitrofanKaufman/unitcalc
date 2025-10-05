import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // Прокси для API поиска Wildberries
            '/api/wb': {
                target: 'https://search.wb.ru',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/wb/, ''),
                secure: false,
            },
            // Прокси для изображений Wildberries
            '/wb-images': {
                target: 'https://basket-01.wb.ru',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/wb-images\//, ''),
            },
        },
        cors: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@app': path.resolve(__dirname, '../../app'),
            '@packages': path.resolve(__dirname, '../../packages'),
            '@services': path.resolve(__dirname, '../../services'),
            '@tests': path.resolve(__dirname, '../../tests'),
        },
    },
    build: {
        rollupOptions: {
            external: [],
            output: {
                globals: {}
            }
        }
    }
});
