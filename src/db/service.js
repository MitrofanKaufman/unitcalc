/**
 * Сервис для работы с базой данных
 * Предоставляет базовые CRUD-операции и кэширование
 */

import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/core/utils/logger';

// Инициализируем in-memory хранилище (в продакшене заменить на реальную БД)
const db = new Map();

/**
 * Сохранить данные в БД
 * @param {string} collection - Название коллекции
 * @param {Object} data - Данные для сохранения
 * @param {string} [id] - ID записи (если не указан, будет сгенерирован)
 * @returns {Promise<{id: string, data: Object}>} - Сохраненные данные с ID
 */
export async function save(collection, data, id) {
  try {
    const recordId = id || uuidv4();
    const record = { id: recordId, ...data, updatedAt: new Date().toISOString() };
    
    if (!db.has(collection)) {
      db.set(collection, new Map());
    }
    
    db.get(collection).set(recordId, record);
    logger.debug(`Сохранена запись в коллекцию ${collection} с ID: ${recordId}`);
    
    return { id: recordId, data: record };
  } catch (error) {
    logger.error(`Ошибка при сохранении в коллекцию ${collection}:`, error);
    throw error;
  }
}

/**
 * Получить данные по ID
 * @param {string} collection - Название коллекции
 * @param {string} id - ID записи
 * @returns {Promise<Object|null>} - Найденные данные или null
 */
export async function getById(collection, id) {
  try {
    if (!db.has(collection) || !db.get(collection).has(id)) {
      return null;
    }
    
    return db.get(collection).get(id);
  } catch (error) {
    logger.error(`Ошибка при получении записи ${id} из коллекции ${collection}:`, error);
    throw error;
  }
}

/**
 * Найти записи по условию
 * @param {string} collection - Название коллекции
 * @param {Function} predicate - Функция-предикат для фильтрации
 * @returns {Promise<Array>} - Массив найденных записей
 */
export async function find(collection, predicate = () => true) {
  try {
    if (!db.has(collection)) {
      return [];
    }
    
    const records = Array.from(db.get(collection).values());
    return records.filter(predicate);
  } catch (error) {
    logger.error(`Ошибка при поиске в коллекции ${collection}:`, error);
    throw error;
  }
}

/**
 * Удалить запись по ID
 * @param {string} collection - Название коллекции
 * @param {string} id - ID записи
 * @returns {Promise<boolean>} - true, если запись была удалена
 */
export async function remove(collection, id) {
  try {
    if (!db.has(collection) || !db.get(collection).has(id)) {
      return false;
    }
    
    db.get(collection).delete(id);
    logger.debug(`Удалена запись ${id} из коллекции ${collection}`);
    return true;
  } catch (error) {
    logger.error(`Ошибка при удалении записи ${id} из коллекции ${collection}:`, error);
    throw error;
  }
}

/**
 * Очистить коллекцию
 * @param {string} collection - Название коллекции
 * @returns {Promise<void>}
 */
export async function clearCollection(collection) {
  try {
    if (db.has(collection)) {
      db.get(collection).clear();
      logger.debug(`Коллекция ${collection} очищена`);
    }
  } catch (error) {
    logger.error(`Ошибка при очистке коллекции ${collection}:`, error);
    throw error;
  }
}

/**
 * Получить все записи из коллекции
 * @param {string} collection - Название коллекции
 * @returns {Promise<Array>} - Массив всех записей
 */
export async function getAll(collection) {
  try {
    if (!db.has(collection)) {
      return [];
    }
    
    return Array.from(db.get(collection).values());
  } catch (error) {
    logger.error(`Ошибка при получении всех записей из коллекции ${collection}:`, error);
    throw error;
  }
}

// Экспортируем все функции для удобства
const dbService = {
  save,
  getById,
  find,
  remove,
  clearCollection,
  getAll,
};

export default dbService;
