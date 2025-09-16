// path: src/config/queue.ts
/**
 * Конфигурация системы очередей задач с использованием Bull
 * Позволяет выполнять длительные задачи асинхронно в фоновом режиме
 */

import Queue, { Queue as QueueType, Job, JobOptions, QueueOptions } from 'bull';
import { RedisOptions } from 'ioredis';
import config from './config';
import logger from '../utils/logger';

// Интерфейс для задачи
interface IQueueTask<T = any> {
  name: string;
  data: T;
  options?: JobOptions;
}

// Интерфейс для обработчика очереди
interface IQueueHandler<T = any> {
  (job: Job<T>): Promise<void>;
}

// Интерфейс для подписчика на события очереди
interface IQueueSubscriber {
  (event: string, job: Job): void;
}

// Класс для управления очередями
class QueueManager {
  private static instance: QueueManager;
  private queues: Map<string, QueueType> = new Map();
  private redisOptions: RedisOptions;
  
  private constructor() {
    this.redisOptions = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 1000, 10000);
        return delay;
      },
    };
    
    this.setupEventListeners();
  }
  
  // Получить экземпляр QueueManager (синглтон)
  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }
  
  // Настройка обработчиков событий для всех очередей
  private setupEventListeners(): void {
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }
  
  // Плавное завершение работы с очередями
  private async gracefulShutdown(): Promise<void> {
    logger.info('Завершение работы очередей...');
    
    const closePromises = Array.from(this.queues.values()).map(queue => {
      return new Promise<void>((resolve) => {
        queue.close().then(() => {
          logger.info(`Очередь ${queue.name} остановлена`);
          resolve();
        }).catch((error) => {
          logger.error(`Ошибка при остановке очереди ${queue.name}:`, error);
          resolve();
        });
      });
    });
    
    await Promise.all(closePromises);
    logger.info('Все очереди остановлены');
    process.exit(0);
  }
  
  // Создать или получить очередь
  public getQueue<T = any>(name: string): QueueType<T> {
    const normalizedName = this.normalizeQueueName(name);
    
    if (!this.queues.has(normalizedName)) {
      const queueOptions: QueueOptions = {
        redis: this.redisOptions,
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: 100, // Сохранять последние 100 неудачных задач
          attempts: 3, // Количество попыток повторного выполнения
          backoff: {
            type: 'exponential',
            delay: 5000, // Начальная задержка 5 секунд
          },
        },
        settings: {
          // Настройки для повторных попыток
          maxStalledCount: 1,
          retryProcessDelay: 5000,
          // Настройки для обработчиков
          lockDuration: 30000, // Время блокировки задачи (30 секунд)
          stalledInterval: 30000, // Проверка зависших задач (30 секунд)
          // Настройки для производительности
          drainDelay: 5, // Задержка между опросами (5 мс)
          lockRenewTime: 15000, // Время обновления блокировки (15 секунд)
        },
      };
      
      const queue = new Queue<T>(normalizedName, queueOptions);
      
      // Настройка обработчиков событий для очереди
      this.setupQueueEventListeners(queue);
      
      this.queues.set(normalizedName, queue);
      logger.info(`Создана очередь: ${normalizedName}`);
    }
    
    return this.queues.get(normalizedName) as QueueType<T>;
  }
  
  // Нормализация имени очереди
  private normalizeQueueName(name: string): string {
    return `${config.app.name}:${name}`.toLowerCase().replace(/[^a-z0-9:_-]/g, '-');
  }
  
  // Настройка обработчиков событий для очереди
  private setupQueueEventListeners(queue: QueueType): void {
    queue.on('error', (error) => {
      logger.error(`Ошибка в очереди ${queue.name}:`, error);
    });
    
    queue.on('waiting', (jobId) => {
      logger.debug(`Задача ${jobId} ожидает выполнения в очереди ${queue.name}`);
    });
    
    queue.on('active', (job) => {
      logger.debug(`Задача ${job.id} начата в очереди ${queue.name}`);
    });
    
    queue.on('completed', (job, result) => {
      logger.info(`Задача ${job.id} успешно выполнена в очереди ${queue.name}`);
    });
    
    queue.on('failed', (job, error) => {
      const jobInfo = job ? `Задача ${job.id}` : 'Неизвестная задача';
      logger.error(`${jobInfo} завершилась с ошибкой в очереди ${queue.name}:`, error);
    });
    
    queue.on('stalled', (job) => {
      logger.warn(`Задача ${job.id} в очереди ${queue.name} зависла и будет перезапущена`);
    });
    
    queue.on('paused', () => {
      logger.info(`Очередь ${queue.name} приостановлена`);
    });
    
    queue.on('resumed', () => {
      logger.info(`Очередь ${queue.name} возобновлена`);
    });
    
    queue.on('cleaned', (jobs, type) => {
      logger.info(`Очищено ${jobs.length} задач типа ${type} из очереди ${queue.name}`);
    });
    
    queue.on('drained', () => {
      logger.debug(`Очередь ${queue.name} пуста, все задачи выполнены`);
    });
    
    queue.on('removed', (job) => {
      logger.debug(`Задача ${job.id} удалена из очереди ${queue.name}`);
    });
  }
  
  // Добавить задачу в очередь
  public async addTask<T = any>(queueName: string, data: T, options?: JobOptions): Promise<Job<T>> {
    const queue = this.getQueue<T>(queueName);
    return queue.add(data, options);
  }
  
  // Обработчик задач для очереди
  public processQueue<T = any>(
    queueName: string, 
    handler: IQueueHandler<T>,
    concurrency: number = 1
  ): void {
    const queue = this.getQueue<T>(queueName);
    
    queue.process(concurrency, async (job) => {
      const startTime = Date.now();
      
      try {
        logger.info(`Начало выполнения задачи ${job.id} в очереди ${queueName}`);
        await handler(job);
        const duration = Date.now() - startTime;
        logger.info(`Задача ${job.id} успешно выполнена за ${duration} мс`);
        return { success: true, duration };
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`Ошибка при выполнении задачи ${job.id} за ${duration} мс:`, error);
        throw error;
      }
    });
    
    logger.info(`Зарегистрирован обработчик для очереди ${queueName} с параллелизмом ${concurrency}`);
  }
  
  // Получить статистику по очереди
  public async getQueueStats(queueName: string): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
  }> {
    const queue = this.getQueue(queueName);
    
    const [
      waitingCount,
      activeCount,
      completedCount,
      failedCount,
      delayedCount,
      isPaused
    ] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
      queue.isPaused()
    ]);
    
    return {
      waiting: waitingCount,
      active: activeCount,
      completed: completedCount,
      failed: failedCount,
      delayed: delayedCount,
      paused: isPaused,
    };
  }
  
  // Очистить очередь
  public async cleanQueue(queueName: string, grace: number = 5000): Promise<void> {
    const queue = this.getQueue(queueName);
    
    // Очищаем завершенные задачи
    await queue.clean(grace, 'completed');
    
    // Очищаем проваленные задачи
    await queue.clean(grace, 'failed');
    
    logger.info(`Очередь ${queueName} очищена`);
  }
  
  // Приостановить очередь
  public async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.pause();
    logger.info(`Очередь ${queueName} приостановлена`);
  }
  
  // Возобновить очередь
  public async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.resume();
    logger.info(`Очередь ${queueName} возобновлена`);
  }
  
  // Получить список всех очередей
  public getQueueNames(): string[] {
    return Array.from(this.queues.keys());
  }
  
  // Закрыть все очереди
  public async closeAll(): Promise<void> {
    const closePromises = Array.from(this.queues.values()).map(queue => queue.close());
    await Promise.all(closePromises);
    this.queues.clear();
    logger.info('Все очереди закрыты');
  }
}

// Экспортируем экземпляр QueueManager
const queueManager = QueueManager.getInstance();

// Вспомогательные функции
export const addTask = queueManager.addTask.bind(queueManager);
export const processQueue = queueManager.processQueue.bind(queueManager);
export const getQueueStats = queueManager.getQueueStats.bind(queueManager);
export const cleanQueue = queueManager.cleanQueue.bind(queueManager);
export const pauseQueue = queueManager.pauseQueue.bind(queueManager);
export const resumeQueue = queueManager.resumeQueue.bind(queueManager);
export const getQueueNames = queueManager.getQueueNames.bind(queueManager);
export const closeAllQueues = queueManager.closeAll.bind(queueManager);

// Предопределенные очереди
export const QUEUE_NAMES = {
  EMAIL: 'email',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  DATA_SYNC: 'data-sync',
  IMAGE_PROCESSING: 'image-processing',
  SCHEDULED_TASKS: 'scheduled-tasks',};

// Инициализация очередей при старте приложения
const initializeQueues = async () => {
  // Очистка всех очередей при запуске в режиме разработки
  if (config.nodeEnv === 'development') {
    const queueNames = queueManager.getQueueNames();
    for (const name of queueNames) {
      await queueManager.cleanQueue(name);
    }
  }
  
  // Обработка непредвиденных отказов
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Неперехваченный отказ в очереди:', reason);
  });
  
  process.on('uncaughtException', (error) => {
    logger.error('Неперехваченное исключение в очереди:', error);
  });
};

// Экспортируем инициализацию
export { initializeQueues };

export default queueManager;
