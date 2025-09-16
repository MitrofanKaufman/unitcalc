// path: src/db/init.ts
/**
 * Модуль инициализации базы данных
 * Выполняет настройку подключения и применяет миграции при старте приложения
 * Поддерживает опциональное подключение к БД через переменную окружения DISABLE_DATABASE
 * Совместим с ES модулями и CommonJS
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { logger } from '@utils/logger.js';
import config from '../../app/client/config/database.ts';
import { isDatabaseAvailable, disableDatabase } from './connection.js';

// Флаг для отслеживания состояния инициализации
let isInitialized = false;

// Текущий экземпляр DataSource
let dataSourceInstance: DataSource | null = null;

/**
 * Получает текущий экземпляр DataSource
 * @returns {DataSource | null} Текущий экземпляр DataSource или null, если БД отключена
 */
export function getDataSource(): DataSource | null {
  return dataSourceInstance;
}

/**
 * Инициализирует подключение к базе данных и применяет миграции
 * @returns {Promise<DataSource | null>} Экземпляр DataSource или null, если БД отключена
 * @throws {Error} Если произошла ошибка при инициализации
 */
export async function initializeDatabase(): Promise<DataSource | null> {
  if (isInitialized && dataSourceInstance) {
    return dataSourceInstance;
  }

  // Проверяем, отключена ли БД
  if (!isDatabaseAvailable()) {
    logger.warn('Использование базы данных отключено (DISABLE_DATABASE=true)');
    return null;
  }

  logger.info('🔄 Инициализация подключения к базе данных...');

  try {
    // Создаем новое подключение
    dataSourceInstance = new DataSource({
      ...config,
      name: 'default',
    });

    // Инициализируем подключение с таймаутом
    await Promise.race([
      dataSourceInstance.initialize(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Таймаут подключения к базе данных')), 30000)
      )
    ]);
    
    logger.info('✅ Подключение к базе данных установлено');
    
    // Применяем миграции, если это указано в настройках
    if (process.env.RUN_MIGRATIONS === 'true') {
      await runMigrations(dataSourceInstance);
    }
    
    isInitialized = true;
    return dataSourceInstance;
  } catch (error: any) {
    const errorMessage = error.message || 'Неизвестная ошибка';
    logger.error(`❌ Ошибка при инициализации базы данных: ${errorMessage}`);
    
    // Отключаем БД при ошибке, чтобы приложение могло продолжить работу
    disableDatabase();
    
    // Пробрасываем ошибку с более информативным сообщением
    const newError = new Error(`Не удалось инициализировать базу данных: ${errorMessage}`);
    newError.name = 'DatabaseInitializationError';
    newError.cause = error;
    
    throw newError;
  }
}

/**
 * Применяет все ожидающие миграции
 */
async function runMigrations(dataSource: DataSource): Promise<void> {
  try {
    logger.info('🔄 Проверка наличия ожидающих миграций...');
    
    const hasPendingMigrations = await dataSource.showMigrations();
    
    if (hasPendingMigrations) {
      logger.info('🔄 Обнаружены ожидающие миграции, применяем...');
      const migrations = await dataSource.runMigrations({ transaction: 'each' });
      
      if (migrations && migrations.length > 0) {
        logger.info(`✅ Успешно применено ${migrations.length} миграций:`);
        migrations.forEach(migration => {
          logger.info(`   - ${migration.name}`);
        });
      } else {
        logger.info('✅ Нет ожидающих миграций');
      }
    } else {
      logger.info('✅ Нет ожидающих миграций');
    }
  } catch (error) {
    logger.error('❌ Ошибка при применении миграций:', error);
    
    // Пробрасываем ошибку с более информативным сообщением
    const newError = new Error(`Не удалось применить миграции: ${error.message}`);
    newError.name = 'MigrationError';
    newError.cause = error;
    
    throw newError;
  }
}

/**
 * Закрывает все соединения с базой данных
 */
export async function closeDatabaseConnection(): Promise<void> {
  // Если БД отключена или не инициализирована, ничего не делаем
  if (!isInitialized || !isDatabaseAvailable() || !dataSourceInstance) {
    return;
  }
  
  try {
    logger.info('🔄 Закрытие соединений с базой данных...');
    
    if (dataSourceInstance.isInitialized) {
      await dataSourceInstance.destroy();
      dataSourceInstance = null;
    }
    
    logger.info('✅ Соединения с базой данных закрыты');
  } catch (error) {
    logger.error('❌ Ошибка при закрытии соединений с базой данных:', error);
    
    // Пробрасываем ошибку с более информативным сообщением
    const newError = new Error(`Не удалось закрыть соединения с базой данных: ${error.message}`);
    newError.name = 'DatabaseCloseError';
    newError.cause = error;
    
    throw newError;
  } finally {
    // Всегда сбрасываем флаг инициализации
    isInitialized = false;
  }
}

// Обработка завершения приложения
const handleShutdown = async () => {
  try {
    await closeDatabaseConnection();
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при завершении работы:', error);
    process.exit(1);
  }
};

// Обработчики сигналов завершения работы
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Обработка необработанных исключений
process.on('uncaughtException', async (error) => {
  console.error('Необработанное исключение:', error);
  await handleShutdown();
});

// Обработка необработанных промисов
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Необработанный промис:', promise, 'Причина:', reason);
  await handleShutdown();
});

// Экспортируем функции по умолчанию
export default {
  initialize: initializeDatabase,
  close: closeDatabaseConnection,
};
