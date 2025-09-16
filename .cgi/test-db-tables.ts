#!/usr/bin/env node
/**
 * Скрипт для проверки подключения к базе данных и вывода списка таблиц
 */

import 'dotenv/config';
import { DataSource } from 'typeorm';
import config from '../src/config/database';
import chalk from 'chalk';

async function testDatabaseConnection() {
  console.log(chalk.blue('🔍 Проверка подключения к базе данных...'));
  
  try {
    // Создаем подключение без указания базы данных
    const adminConfig = {
      ...config,
      database: undefined, // Без указания базы данных
      name: 'admin_test', // Уникальное имя подключения
    };

    const adminConnection = new DataSource(adminConfig);
    await adminConnection.initialize();
    
    console.log(chalk.green('✅ Успешное подключение к серверу MySQL'));
    
    // Проверяем существование базы данных
    const dbName = config.database as string;
    const [dbExists] = await adminConnection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`
    );

    if (!dbExists) {
      console.log(chalk.yellow(`⚠️  База данных '${dbName}' не существует`));
      await adminConnection.destroy();
      return;
    }
    
    console.log(chalk.green(`✅ База данных '${dbName}' существует`));
    
    // Подключаемся к конкретной базе данных
    await adminConnection.destroy();
    const connection = new DataSource({
      ...config,
      name: 'test_connection',
    });
    
    await connection.initialize();
    console.log(chalk.green(`✅ Успешное подключение к базе данных '${dbName}'`));
    
    // Получаем список таблиц
    const tables = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${dbName}'`
    );
    
    console.log('\n📋 Список таблиц в базе данных:');
    if (tables.length === 0) {
      console.log(chalk.yellow('   Нет таблиц в базе данных'));
    } else {
      tables.forEach((table: any) => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
    }
    
    await connection.destroy();
    
  } catch (error) {
    console.error(chalk.red('❌ Ошибка при подключении к базе данных:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    
    if (error instanceof Error && 'code' in error) {
      switch (error.code) {
        case 'ECONNREFUSED':
          console.error(chalk.red('Сервер MySQL недоступен. Проверьте хост и порт.'));
          break;
        case 'ER_ACCESS_DENIED_ERROR':
          console.error(chalk.red('Ошибка доступа. Проверьте имя пользователя и пароль.'));
          break;
        case 'ER_BAD_DB_ERROR':
          console.error(chalk.red('Указанная база данных не существует.'));
          break;
      }
    }
  }
}

// Запускаем проверку
testDatabaseConnection().catch(console.error);
