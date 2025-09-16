// path: src/db/connection.ts
/**
 * Модуль для управления подключением к базе данных MongoDB
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Определяем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем переменные окружения из файла .env
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Получаем URI подключения из переменных окружения
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wb-calculator';

// Кэш подключения
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Подключается к базе данных MongoDB
 * @returns {Promise<mongoose.Connection>} Подключение к базе данных
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Используем IPv4, пропускаем IPv6
    };

    try {
      // Устанавливаем настройки mongoose
      mongoose.set('strictQuery', true);
      
      // Подключаемся к базе данных
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Успешное подключение к MongoDB');
        return mongoose.connection;
      });
    } catch (error) {
      console.error('Ошибка при подключении к MongoDB:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Закрывает соединение с базой данных
 */
async function closeDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('Соединение с MongoDB закрыто');
  }
}

// Обработка событий подключения
mongoose.connection.on('connected', () => {
  console.log('Mongoose подключен к базе данных');
});

mongoose.connection.on('error', (err) => {
  console.error('Ошибка подключения к базе данных:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose отключен от базы данных');
});

// Обработка завершения приложения
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

export { connectDB, closeDB };
