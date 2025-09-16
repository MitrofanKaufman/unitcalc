// path: src/config/cache.ts
/**
 * Конфигурация кэширования приложения
 * Обеспечивает кэширование часто запрашиваемых данных для повышения производительности
 */

import NodeCache from 'node-cache';
import Redis from 'ioredis';
import { RedisOptions } from 'ioredis';
import config from './config';
import logger from '../utils/logger';

// Интерфейс для кэша
interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  del(key: string | string[]): Promise<number>;
  flush(): Promise<void>;
  keys(pattern: string): Promise<string[]>;
  ttl(key: string): Promise<number>;
  close(): Promise<void>;
}

// Реализация кэша на основе node-cache (память)
class MemoryCache implements ICache {
  private cache: NodeCache;
  
  constructor(ttlSeconds: number = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
    
    logger.info('Инициализирован кэш в памяти');
  }
  
  async get<T>(key: string): Promise<T | null> {
    return this.cache.get<T>(key) || null;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return ttl 
      ? this.cache.set(key, value, ttl)
      : this.cache.set(key, value);
  }
  
  async del(key: string | string[]): Promise<number> {
    return this.cache.del(key);
  }
  
  async flush(): Promise<void> {
    this.cache.flushAll();
  }
  
  async keys(pattern: string): Promise<string[]> {
    return this.cache.keys();
  }
  
  async ttl(key: string): Promise<number> {
    return this.cache.getTtl(key) || 0;
  }
  
  async close(): Promise<void> {
    // node-cache не требует явного закрытия
  }
}

// Реализация кэша на основе Redis
class RedisCache implements ICache {
  private client: Redis.Redis;
  private connected: boolean = false;
  
  constructor(options: RedisOptions) {
    this.client = new Redis(options);
    
    this.client.on('connect', () => {
      this.connected = true;
      logger.info('Подключение к Redis установлено');
    });
    
    this.client.on('error', (error) => {
      logger.error('Ошибка подключения к Redis:', error);
      this.connected = false;
    });
    
    this.client.on('end', () => {
      this.connected = false;
      logger.warn('Соединение с Redis закрыто');
    });
    
    this.client.on('reconnecting', () => {
      logger.info('Повторное подключение к Redis...');
    });
  }
  
  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Нет подключения к Redis');
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    this.ensureConnected();
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    this.ensureConnected();
    const stringValue = JSON.stringify(value);
    
    if (ttl) {
      await this.client.setex(key, ttl, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
    
    return true;
  }
  
  async del(key: string | string[]): Promise<number> {
    this.ensureConnected();
    return this.client.del(Array.isArray(key) ? key : [key]);
  }
  
  async flush(): Promise<void> {
    this.ensureConnected();
    await this.client.flushdb();
  }
  
  async keys(pattern: string = '*'): Promise<string[]> {
    this.ensureConnected();
    return this.client.keys(pattern);
  }
  
  async ttl(key: string): Promise<number> {
    this.ensureConnected();
    return this.client.ttl(key);
  }
  
  async close(): Promise<void> {
    await this.client.quit();
  }
}

// Фабрика для создания экземпляра кэша
const createCache = (): ICache => {
  const { enabled, type, ttl, redis } = config.cache;
  
  // Если кэширование отключено, возвращаем заглушку
  if (!enabled) {
    return {
      get: async () => null,
      set: async () => true,
      del: async () => 0,
      flush: async () => {},
      keys: async () => [],
      ttl: async () => -1,
      close: async () => {},
    };
  }
  
  // Создаем экземпляр кэша в зависимости от типа
  switch (type) {
    case 'redis':
      return new RedisCache({
        host: redis.host,
        port: redis.port,
        password: redis.password,
        db: redis.db,
        connectTimeout: redis.timeout,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });
      
    case 'memory':
    default:
      return new MemoryCache(ttl);
  }
};

// Создаем экземпляр кэша
export const cache = createCache();

// Middleware для кэширования ответов API
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: any, res: any, next: any) => {
    // Кэшируем только GET-запросы
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      // Пытаемся получить данные из кэша
      const cachedData = await cache.get(key);
      
      if (cachedData) {
        logger.debug(`Cache hit for ${key}`);
        return res.json(cachedData);
      }
      
      // Сохраняем оригинальный метод res.json
      const originalJson = res.json;
      
      // Переопределяем res.json для кэширования ответа
      res.json = (data: any) => {
        // Кэшируем ответ
        cache.set(key, data, ttl).catch((error) => {
          logger.error('Ошибка при кэшировании:', error);
        });
        
        // Вызываем оригинальный res.json
        originalJson.call(res, data);
      };
      
      next();
    } catch (error) {
      logger.error('Ошибка при работе с кэшем:', error);
      next();
    }
  };
};

// Утилита для инвалидации кэша по шаблону ключа
export const invalidateCache = async (pattern: string): Promise<void> => {
  try {
    const keys = await cache.keys(pattern);
    
    if (keys.length > 0) {
      await cache.del(keys);
      logger.debug(`Инвалидирован кэш для ключей: ${keys.join(', ')}`);
    }
  } catch (error) {
    logger.error('Ошибка при инвалидации кэша:', error);
  }
};

export default {
  cache,
  cacheMiddleware,
  invalidateCache,
};
