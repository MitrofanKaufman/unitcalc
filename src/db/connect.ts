// path: src/db/connect.ts
/**
 * Модуль для подключения к базе данных
 * Обеспечивает установку и управление соединением с MongoDB
 */

import mongoose from 'mongoose';
import config from '../config';
import logger from '@utils/logger';

// Отключаем буферизацию команд Mongoose
mongoose.set('bufferCommands', false);

// Отключаем устаревшие опции
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Подключаем отладку запросов в режиме разработки
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    logger.debug(`MongoDB: ${collectionName}.${method}`, {
      collection: collectionName,
      method,
      query: JSON.stringify(query),
      doc: JSON.stringify(doc)
    });
  });
}

// Кэш соединения
let cachedConnection: mongoose.Connection | null = null;

/**
 * Подключается к MongoDB и возвращает соединение
 */
async function connectToDatabase(): Promise<mongoose.Connection> {
  // Если соединение уже установлено, возвращаем его
  if (cachedConnection) {
    return cachedConnection;
  }

  // Проверяем наличие URL подключения
  if (!config.db.uri) {
    throw new Error('MongoDB connection URI is not defined');
  }

  try {
    // Подключаемся к MongoDB
    const connection = await mongoose.createConnection(config.db.uri, {
      // Опции подключения
      autoIndex: process.env.NODE_ENV !== 'production',
      autoCreate: process.env.NODE_ENV !== 'production',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Используем IPv4
    });

    // Обработчики событий соединения
    connection.on('connected', () => {
      logger.info(`MongoDB connected to ${config.db.uri}`);
    });

    connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Кэшируем соединение
    cachedConnection = connection;
    return connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Закрывает соединение с базой данных
 */
async function closeDatabaseConnection(): Promise<void> {
  if (!cachedConnection) {
    return;
  }

  try {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed');
    cachedConnection = null;
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

/**
 * Возвращает текущее соединение с базой данных
 * @throws {Error} Если соединение не установлено
 */
function getDbConnection(): mongoose.Connection {
  if (!cachedConnection) {
    throw new Error('Database connection is not established');
  }
  return cachedConnection;
}

/**
 * Проверяет, активно ли соединение с базой данных
 */
function isConnected(): boolean {
  return !!cachedConnection && cachedConnection.readyState === 1;
}

export {
  connectToDatabase,
  closeDatabaseConnection,
  getDbConnection,
  isConnected,
};

// Экспортируем mongoose для использования в других модулях
export default mongoose;
