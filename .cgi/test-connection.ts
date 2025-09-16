#!/usr/bin/env node
/**
 * Скрипт для тестирования подключения к базе данных MySQL
 */

import 'dotenv/config';
import { DataSource } from 'typeorm';
import chalk from 'chalk';
import config from '../src/config/database';

async function testConnection() {
  console.log(chalk.blue('🔄 Проверка подключения к базе данных...'));
  
  // Создаем подключение с настройками из конфига
  const dataSource = new DataSource(config);
  
  try {
    // Пробуем подключиться к базе данных
    await dataSource.initialize();
    
    // Получаем версию MySQL
    const result = await dataSource.query('SELECT VERSION() as version');
    const version = result[0]?.version || 'неизвестно';
    
    console.log(chalk.green(`✅ Подключение к MySQL успешно установлено!`));
    console.log(chalk.cyan(`📊 Версия сервера: ${version}`));
    console.log(chalk.cyan(`🔌 Хост: ${config.host}:${config.port}`));
    console.log(chalk.cyan(`💾 База данных: ${config.database}`));
    
    // Проверяем доступные таблицы
    const tables = await dataSource.query(
      `SELECT TABLE_NAME as name, TABLE_ROWS as rows, DATA_LENGTH as size 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = '${config.database}'`
    );
    
    if (tables.length > 0) {
      console.log('\n📋 Доступные таблицы:');
      console.table(tables.map(t => ({
        'Имя таблицы': t.name,
        'Кол-во строк': t.rows,
        'Размер (КБ)': Math.round(t.size / 1024)
      })));
    } else {
      console.log(chalk.yellow('ℹ️ В базе данных нет таблиц'));
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Ошибка подключения к базе данных:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    return false;
  } finally {
    // Закрываем соединение
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// Запускаем тест подключения
(async () => {
  try {
    await testConnection();
    process.exit(0);
  } catch (error) {
    console.error('Неожиданная ошибка:', error);
    process.exit(1);
  }
})();
