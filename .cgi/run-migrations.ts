#!/usr/bin/env node
/**
 * Скрипт для запуска миграций базы данных
 */

import 'dotenv/config';
import { DataSource } from 'typeorm';
import config from '../src/config/database';
import chalk from 'chalk';

async function runMigrations() {
  console.log(chalk.blue('🔍 Подготовка к выполнению миграций...'));
  
  try {
    // Создаем подключение к базе данных
    const connection = new DataSource({
      ...config,
      name: 'migration_connection',
    });
    
    await connection.initialize();
    console.log(chalk.green('✅ Успешное подключение к базе данных'));
    
    // Запускаем миграции
    console.log(chalk.blue('🔄 Запуск миграций...'));
    const migrations = await connection.runMigrations();
    
    if (migrations.length > 0) {
      console.log(chalk.green(`✅ Успешно применено ${migrations.length} миграций:`));
      migrations.forEach(migration => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log(chalk.yellow('ℹ️ Нет новых миграций для применения'));
    }
    
    await connection.destroy();
    
  } catch (error) {
    console.error(chalk.red('❌ Ошибка при выполнении миграций:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

// Запускаем миграции
runMigrations().catch(console.error);
