import express from 'express';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';

/**
 * Прокси-роутер для работы с API Wildberries
 * Позволяет перенаправлять запросы к API Wildberries, избегая проблем с CORS
 */
const wbProxyRouter = express.Router();

// Базовый URL API Wildberries
const WB_API_BASE_URL = 'https://wbx-content-v2.wbstatic.net';

// Создаем прокси-мидлварь для перенаправления запросов к API Wildberries
const wbProxy = createProxyMiddleware({
  target: WB_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/wb': '' // Удаляем префикс маршрута при проксировании
  },
  onError: (err, req, res) => {
    console.error('WB Proxy Error:', err);
    res.status(500).json({ error: 'Ошибка при обращении к API Wildberries' });
  },
  logLevel: 'debug'
});

// Настраиваем маршрут для проксирования запросов к Wildberries API
wbProxyRouter.use('/', wbProxy);

export default wbProxyRouter;
