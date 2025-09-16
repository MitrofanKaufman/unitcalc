#!/usr/bin/env ts-node
/**
 * Скрипт для проверки подключения к базе данных
 * Использование: npx ts-node scripts/check-db.ts
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../src/config/database';
import { logger } from '../src/utils/logger';
import { table } from 'table';

async function checkDatabaseConnection() {
  logger.info('🔍 Проверка подключения к базе данных...');
  
  const dataSource = new DataSource({
    ...config,
    name: 'health-check',
  });

  try {
    // Пытаемся подключиться к базе данных
    await dataSource.initialize();
    logger.info('✅ Успешное подключение к базе данных');
    
    // Получаем информацию о версии сервера
    const [version] = await dataSource.query('SELECT VERSION() as version');
    logger.info(`📊 Версия сервера: ${version[0].version}`);
    
    // Получаем список баз данных
    const [databases] = await dataSource.query('SHOW DATABASES');
    logger.info('📂 Доступные базы данных:');
    
    // Выводим список баз данных в виде таблицы
    const data = [
      ['База данных'],
      ...databases.map((db: any) => [Object.values(db)[0]])
    ];
    
    console.log(table(data, {
      header: {
        alignment: 'center',
        content: 'ДОСТУПНЫЕ БАЗЫ ДАННЫХ'
      }
    }));
    
    // Получаем список таблиц в текущей базе данных
    const [tables] = await dataSource.query(`
      SELECT 
        TABLE_NAME as name,
        TABLE_ROWS as rows,
        DATA_LENGTH as data_size,
        INDEX_LENGTH as index_size,
        CREATE_TIME as created,
        UPDATE_TIME as updated
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = '${config.database}'
      ORDER BY DATA_LENGTH + INDEX_LENGTH DESC
    `);
    
    if (tables.length > 0) {
      logger.info(`📊 Таблицы в базе данных '${config.database}':`);
      
      const tableData = [
        ['Таблица', 'Записей', 'Размер данных', 'Размер индексов', 'Создана', 'Обновлена'],
        ...tables.map((tbl: any) => [
          tbl.name,
          parseInt(tbl.rows).toLocaleString(),
          formatBytes(tbl.data_size),
          formatBytes(tbl.index_size),
          new Date(tbl.created).toLocaleString(),
          tbl.updated ? new Date(tbl.updated).toLocaleString() : 'N/A'
        ])
      ];
      
      console.log(table(tableData, {
        header: {
          alignment: 'center',
          content: `ТАБЛИЦЫ В БАЗЕ ДАННЫХ '${config.database.toUpperCase()}'`
        },
        columns: [
          { alignment: 'left' },
          { alignment: 'right' },
          { alignment: 'right' },
          { alignment: 'right' },
          { alignment: 'left' },
          { alignment: 'left' }
        ]
      }));
    } else {
      logger.warn(`⚠️ В базе данных '${config.database}' нет таблиц`);
    }
    
    return true;
  } catch (error) {
    logger.error('❌ Ошибка подключения к базе данных:', error.message);
    return false;
  } finally {
    // Закрываем соединение
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

/**
 * Форматирует размер в байтах в читаемый вид
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Запускаем проверку
checkDatabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Непредвиденная ошибка:', error);
    process.exit(1);
  });
