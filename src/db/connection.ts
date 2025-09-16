// path: src/db/connection.ts
/**
 * Модуль для управления подключением к базе данных MySQL
 * Обеспечивает создание, кэширование и управление соединениями с БД
 * Подключение к БД является опциональным - приложение может работать и без БД
 * Совместим с ES модулями и CommonJS
 */

import 'reflect-metadata';
import { DataSource, EntityManager, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import config from '../../app/client/config/database.ts';
import { logger } from '@utils/logger.js';

// Интерфейс для кэша подключений
interface ConnectionCache {
  [key: string]: DataSource;
}

// Кэш подключений
const connectionCache: ConnectionCache = {};

// Активное подключение по умолчанию
let defaultConnection: DataSource | null = null;

// Флаг, указывающий на то, что подключение к БД отключено намеренно
let isDatabaseDisabled = false;

// Флаг, указывающий на наличие ошибки при подключении
let hasConnectionError = false;

/**
 * Отключает использование базы данных в приложении
 */
export function disableDatabase(): void {
  isDatabaseDisabled = true;
  logger.warn('Использование базы данных отключено в настройках приложения');
}

/**
 * Проверяет, доступна ли база данных
 */
export function isDatabaseAvailable(): boolean {
  return !isDatabaseDisabled && !hasConnectionError && !!defaultConnection?.isInitialized;
}

/**
 * Получает подключение из кэша или создает новое
 * @throws {Error} Если подключение к БД отключено намеренно или произошла ошибка подключения
 */
export async function getConnection(name: string = 'default'): Promise<DataSource> {
  // Проверяем, не отключена ли БД намеренно
  if (isDatabaseDisabled) {
    throw new Error('Использование базы данных отключено в настройках приложения');
  }

  // Возвращаем существующее подключение, если оно есть и инициализировано
  if (connectionCache[name]?.isInitialized) {
    return connectionCache[name];
  }

  logger.info(`🔌 Установка подключения к базе данных '${name}'...`);
  
  try {
    // Проверяем наличие необходимых переменных окружения
    const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      const errorMsg = `Отсутствуют обязательные переменные окружения для подключения к БД: ${missingVars.join(', ')}`;
      logger.warn(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Создаем новое подключение
    const connection = new DataSource({
      ...config,
      name,
    });

    // Инициализируем подключение с таймаутом
    await Promise.race([
      connection.initialize(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Таймаут подключения к базе данных')), 10000)
      )
    ]);
    
    // Сохраняем подключение в кэш
    connectionCache[name] = connection;
    
    // Устанавливаем как подключение по умолчанию, если оно первое
    if (!defaultConnection) {
      defaultConnection = connection;
    }
    
    hasConnectionError = false;
    logger.info(`✅ Успешное подключение к базе данных '${name}'`);
    
    return connection;
  } catch (error: any) {
    const errorMsg = `❌ Ошибка подключения к базе данных '${name}': ${error.message}`;
    logger.error(errorMsg);
    hasConnectionError = true;
    
    // Пробрасываем ошибку с более информативным сообщением
    const newError = new Error(`Не удалось подключиться к базе данных: ${error.message}`);
    newError.name = 'DatabaseConnectionError';
    throw newError;
  }
}

/**
 * Закрывает соединение с базой данных
 * @param name Имя подключения (по умолчанию 'default')
 */
export async function closeConnection(name: string = 'default'): Promise<void> {
  if (connectionCache[name]) {
    try {
      if (connectionCache[name].isInitialized) {
        await connectionCache[name].destroy();
        logger.info(`✅ Соединение с базой данных '${name}' закрыто`);
      }
      
      // Если закрыли подключение по умолчанию, обновляем указатель
      if (defaultConnection === connectionCache[name]) {
        defaultConnection = Object.values(connectionCache).find(conn => conn !== connectionCache[name]) || null;
      }
      
      delete connectionCache[name];
    } catch (error: any) {
      logger.error(`❌ Ошибка при закрытии соединения '${name}':`, error.message);
      throw error;
    }
  }
}

/**
 * Закрывает все соединения с базой данных
 */
export async function closeAllConnections(): Promise<void> {
  const closePromises = Object.keys(connectionCache).map(name => closeConnection(name));
  await Promise.all(closePromises);
  defaultConnection = null;
}

/**
 * Проверяет соединение с базой данных
 * @param name Имя подключения (по умолчанию 'default')
 * @returns {Promise<boolean>} true, если подключение активно, false в противном случае
 */
export async function checkConnection(name: string = 'default'): Promise<boolean> {
  // Если БД отключена намеренно, возвращаем false
  if (isDatabaseDisabled) {
    return false;
  }
  
  // Если есть активное подключение, проверяем его
  if (connectionCache[name]?.isInitialized) {
    try {
      await connectionCache[name].query('SELECT 1');
      return true;
    } catch (error) {
      logger.error('Ошибка проверки подключения к БД:', error);
      return false;
    }
  }
  
  // Если подключения нет, пробуем установить его
  try {
    await getConnection(name);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Выполняет код в контексте транзакции
 * @param callback Функция, выполняемая в контексте транзакции
 * @param connectionName Имя подключения (по умолчанию 'default')
 * @throws {Error} Если база данных недоступна
 */
export async function runInTransaction<T>(
  callback: (entityManager: EntityManager) => Promise<T>,
  connectionName: string = 'default'
): Promise<T> {
  if (!isDatabaseAvailable()) {
    throw new Error('Операция с базой данных невозможна: база данных недоступна');
  }
  
  const connection = await getConnection(connectionName);
  const queryRunner = connection.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  } finally {
    await queryRunner.release().catch(error => {
      logger.error('Ошибка при освобождении queryRunner:', error);
    });
  }
}

/**
 * Получает репозиторий для указанной сущности
 * @param entityClass Класс сущности
 * @param connectionName Имя подключения (по умолчанию 'default')
 * @throws {Error} Если база данных недоступна
 */
export async function getRepository<T extends ObjectLiteral>(
  entityClass: EntityTarget<T>,
  connectionName: string = 'default'
): Promise<Repository<T>> {
  if (!isDatabaseAvailable()) {
    throw new Error('Операция с базой данных невозможна: база данных недоступна');
  }
  
  const connection = await getConnection(connectionName);
  return connection.getRepository(entityClass);
}

/**
 * Получает менеджер сущностей
 * @param connectionName Имя подключения (по умолчанию 'default')
 * @throws {Error} Если база данных недоступна
 */
export async function getManager(connectionName: string = 'default'): Promise<EntityManager> {
  if (!isDatabaseAvailable()) {
    throw new Error('Операция с базой данных невозможна: база данных недоступна');
  }
  
  const connection = await getConnection(connectionName);
  return connection.manager;
}

/**
 * Обработка завершения работы приложения
 */
async function handleShutdown(): Promise<void> {
  logger.info('Завершение работы приложения...');
  
  try {
    await closeAllConnections();
    logger.info('Все соединения с базой данных закрыты');
    process.exit(0);
  } catch (error: any) {
    logger.error('Ошибка при завершении работы:', error.message);
    process.exit(1);
  }
}

// Обработчики событий завершения работы
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.on('uncaughtException', async (error) => {
  logger.error('Необработанное исключение:', error);
  await handleShutdown();
});

process.on('unhandledRejection', async (reason) => {
  logger.error('Необработанный промис:', reason);
  await handleShutdown();
});

// Экспортируем типы для удобства
export * from 'typeorm';

// Экспортируем утилиты для работы с базой данных
export default {
  getConnection,
  closeConnection,
  closeAllConnections,
  checkConnection,
  runInTransaction,
  getRepository,
  getManager,
};
