import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
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
