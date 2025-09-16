#!/usr/bin/env ts-node
/**
 * Скрипт для проверки подключения к базе данных MySQL
 * Проверяет доступность сервера, список баз данных и версию сервера
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { table } from 'table';
import chalk from 'chalk';
import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из файла .env
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Конфигурация подключения к базе данных
const dbConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'wb_calculator',
  synchronize: false,
  logging: true,
};

/**
 * Основная функция проверки подключения
 */
async function checkDatabaseConnection() {
  console.log(chalk.blue('🔍 Проверка подключения к базе данных...'));
  
  try {
    // Создаем подключение без указания базы данных, чтобы проверить доступность сервера
    const adminDataSource = new DataSource({
      ...dbConfig,
      database: undefined, // Не указываем базу данных для проверки подключения к серверу
    });

    // Инициализируем подключение
    await adminDataSource.initialize();
    console.log(chalk.green('✅ Успешное подключение к серверу MySQL'));
    
    // Получаем информацию о версии сервера
    const [version] = await adminDataSource.query('SELECT VERSION() as version');
    console.log(chalk.blue(`📊 Версия сервера: ${version[0].version}`));
    
    // Получаем список баз данных
    const [databases] = await adminDataSource.query('SHOW DATABASES');
    console.log(chalk.blue('📂 Доступные базы данных:'));
    
    // Выводим список баз данных в виде таблицы
    const dbTableData = [
      [chalk.bold('База данных')],
      ...databases.map((db: any) => [chalk.cyan(Object.values(db)[0])])
    ];
    
    console.log(table(dbTableData));
    
    // Проверяем существование нужной базы данных
    const targetDb = dbConfig.database;
    const dbExists = databases.some((db: any) => Object.values(db)[0] === targetDb);
    
    if (dbExists) {
      console.log(chalk.green(`✅ База данных '${targetDb}' существует`));
      
      // Подключаемся к конкретной базе данных
      const appDataSource = new DataSource(dbConfig);
      await appDataSource.initialize();
      
      // Получаем список таблиц
      const [tables] = await appDataSource.query(`
        SELECT 
          TABLE_NAME as name,
          TABLE_ROWS as rows,
          DATA_LENGTH as data_size,
          INDEX_LENGTH as index_size,
          CREATE_TIME as created
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = '${targetDb}'
        ORDER BY DATA_LENGTH + INDEX_LENGTH DESC
      `);
      
      if (tables.length > 0) {
        console.log(chalk.blue(`📊 Таблицы в базе данных '${targetDb}':`));
        
        const tableData = [
          [
            chalk.bold('Таблица'), 
            chalk.bold('Записей'), 
            chalk.bold('Размер данных'), 
            chalk.bold('Размер индексов'),
            chalk.bold('Создана')
          ],
          ...tables.map((tbl: any) => [
            chalk.cyan(tbl.name),
            chalk.yellow(parseInt(tbl.rows).toLocaleString()),
            formatBytes(tbl.data_size),
            formatBytes(tbl.index_size),
            new Date(tbl.created).toLocaleString()
          ])
        ];
        
        console.log(table(tableData));
      } else {
        console.log(chalk.yellow(`⚠️ В базе данных '${targetDb}' нет таблиц`));
      }
      
      // Закрываем соединение
      await appDataSource.destroy();
    } else {
      console.log(chalk.yellow(`⚠️ База данных '${targetDb}' не существует`));
      console.log(chalk.blue('Для создания базы данных выполните команду:'));
      console.log(chalk.cyan(`  CREATE DATABASE \`${targetDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`));
    }
    
    // Закрываем соединение
    await adminDataSource.destroy();
    
    return true;
  } catch (error: any) {
    console.error(chalk.red('❌ Ошибка подключения к базе данных:'), error.message);
    
    // Проверяем, является ли ошибка ошибкой подключения
    if (error.code === 'ECONNREFUSED') {
      console.error(chalk.red('Не удалось подключиться к серверу MySQL. Убедитесь, что:'));
      console.error(`1. Сервер MySQL запущен на ${dbConfig.host}:${dbConfig.port}`);
      console.error('2. Указаны правильные учетные данные в файле .env');
      console.error('3. Пользователь имеет права на подключение с указанного хоста');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(chalk.red('Ошибка аутентификации. Проверьте имя пользователя и пароль в файле .env'));
    }
    
    return false;
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

// Запускаем проверку подключения
checkDatabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(chalk.red('❌ Непредвиденная ошибка:'), error);
    process.exit(1);
  });
