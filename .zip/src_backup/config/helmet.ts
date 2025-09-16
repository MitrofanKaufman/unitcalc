// path: src/config/helmet.ts
/**
 * Конфигурация Helmet для настройки HTTP-заголовков безопасности
 * Защищает приложение от распространенных веб-уязвимостей
 */

import { HelmetOptions } from 'helmet';
import config from './config';

// Настройки CSP (Content Security Policy)
const cspDirectives = {
  defaultSrc: ["'self'"],
  baseUri: ["'self'"],
  blockAllMixedContent: [],
  fontSrc: ["'self'"],
  frameAncestors: ["'self'"],
  imgSrc: [
    "'self'",
    'data:',
    'blob:',
    'https://*.wildberries.ru',
    'https://*.wbstatic.net',
  ],
  objectSrc: ["'none'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'"
  ],
  scriptSrcAttr: ["'none'"],
  styleSrc: ["'self'"],
  upgradeInsecureRequests: [],
};

// Основные настройки Helmet
const helmetConfig: HelmetOptions = {
  // Устанавливает заголовок Content-Security-Policy
  contentSecurityPolicy: {
    useDefaults: true,
    directives: cspDirectives,
  },
  
  // Управляет заголовком X-DNS-Prefetch-Control
  dnsPrefetchControl: {
    allow: true, // Включить предварительную загрузку DNS
  },
  
  // Управляет заголовком Expect-CT
  expectCt: {
    maxAge: 0, // Отключен, так как устарел
  },
  
  // Управляет заголовком X-Frame-Options
  frameguard: {
    action: 'sameorigin', // Запрещаем встраивание в iframe с других доменов
  },
  
  // Управляет заголовком X-Powered-By
  hidePoweredBy: true, // Скрываем информацию о сервере
  
  // Управляет заголовком X-Download-Options
  ieNoOpen: true, // Запрещаем открытие загруженных файлов в контексте сайта
  
  // Управляет заголовком X-Content-Type-Options
  noSniff: true, // Запрещаем MIME-sniffing
  
  // Управляет заголовками X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none', // Запрещаем загрузку политик с других доменов
  },
  
  // Управляет заголовком Referrer-Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  
  // Управляет заголовком X-XSS-Protection
  xssFilter: true, // Включаем защиту от XSS
  
  // Управляет заголовком Cross-Origin-Embedder-Policy
  crossOriginEmbedderPolicy: {
    policy: 'require-corp',
  },
  
  // Управляет заголовком Cross-Origin-Opener-Policy
  crossOriginOpenerPolicy: {
    policy: 'same-origin',
  },
  
  // Управляет заголовком Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: {
    policy: 'same-site',
  },
  
  // Управляет заголовком Origin-Agent-Cluster
  originAgentCluster: true, // Включаем изоляцию процессов
  
  // Управляет заголовком X-Content-Type-Options
  noCache: false, // Кэширование включено, но можно отключить для API
  
  // Управляет заголовком X-DNS-Prefetch-Control
  dnsPrefetchControl: {
    allow: true, // Разрешаем предварительную загрузку DNS
  },
  
  // Управляет заголовком X-Download-Options
  ieNoOpen: true, // Запрещаем открытие загруженных файлов в контексте сайта
  
  // Управляет заголовком X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none', // Запрещаем загрузку политик с других доменов
  },
};

// Функция для получения конфигурации Helmet
export const getHelmetConfig = (): HelmetOptions => {
  // В режиме разработки ослабляем некоторые политики
  if (config.nodeEnv === 'development') {
    return {
      ...helmetConfig,
      contentSecurityPolicy: {
        ...helmetConfig.contentSecurityPolicy,
        directives: {
          ...helmetConfig.contentSecurityPolicy?.directives,
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'"
          ],
          connectSrc: [
            "'self'",
            'ws:',
            'wss:',
            'http://localhost:*',
            'http://127.0.0.1:*',
          ],
        },
      },
    };
  }
  
  // В продакшн режиме используем строгие настройки
  return helmetConfig;
};

export default helmetConfig;
