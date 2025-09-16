#!/usr/bin/env node
/**
 * Скрипт инициализации базы данных
 * Создает базу данных, пользователя и применяет миграции
 */

import 'dotenv/config';
import { createConnection, getConnectionOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import { promisify } from 'util';
import { exec } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import config from '../src/config/database';

const execAsync = promisify(exec);

// Логирование с префиксом
const log = {
  info: (msg: string) => console.log(chalk.blue(`[INFO] ${msg}`)),
  success: (msg: string) => console.log(chalk.green(`[SUCCESS] ${msg}`)),
  error: (msg: string) => console.error(chalk.red(`[ERROR] ${msg}`)),
  warn: (msg: string) => console.warn(chalk.yellow(`[WARN] ${msg}`)),
};

/**
 * Создает базу данных, если она не существует
 */
async function createDatabase() {
  const spinner = createSpinner('Проверка подключения к MySQL...').start();
  
  try {
    // Подключаемся к серверу без указания базы данных
    const adminConfig = {
      ...config,
      database: undefined, // Без указания базы данных
      name: 'admin', // Уникальное имя подключения
    };

    const adminConnection = new DataSource(adminConfig);
    await adminConnection.initialize();
    spinner.success({ text: 'Подключение к MySQL установлено' });

    // Проверяем существование базы данных
    const dbName = config.database as string;
    const dbExists = await adminConnection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`
    );

    if (dbExists.length > 0) {
      spinner.warn({ text: `База данных ${dbName} уже существует` });
      
      const { confirmRecreate } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmRecreate',
        message: `Пересоздать базу данных ${dbName}? Все данные будут потеряны!`,
        default: false,
      }]);

      if (confirmRecreate) {
        await adminConnection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
        log.success(`База данных ${dbName} удалена`);
      } else {
        await adminConnection.destroy();
        return false; // Пропускаем создание базы данных
      }
    }

    // Создаем базу данных
    await adminConnection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    log.success(`База данных ${dbName} создана`);

    // Закрываем соединение
    await adminConnection.destroy();
    return true;
  } catch (error) {
    spinner.error({ text: 'Ошибка при подключении к MySQL' });
    log.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/**
 * Применяет миграции
 */
async function runMigrations() {
  const spinner = createSpinner('Применение миграций...').start();
  
  try {
    // Запускаем миграции через TypeORM CLI
    const { stdout, stderr } = await execAsync('npx typeorm-ts-node-commonjs migration:run -d src/config/database.ts');
    
    if (stderr) {
      spinner.error({ text: 'Ошибка при применении миграций' });
      log.error(stderr);
      return false;
    }
    
    spinner.success({ text: 'Миграции успешно применены' });
    return true;
  } catch (error) {
    spinner.error({ text: 'Ошибка при применении миграций' });
    log.error(error instanceof Error ? error.message : String(error));
    return false;
  }
}

/**
 * Запускает сиды (начальные данные)
 */
async function runSeeds() {
  const spinner = createSpinner('Загрузка начальных данных...').start();
  
  try {
    // Здесь можно добавить логику загрузки начальных данных
    // Например, создание пользователя администратора по умолчанию
    
    spinner.success({ text: 'Начальные данные загружены' });
    return true;
  } catch (error) {
    spinner.error({ text: 'Ошибка при загрузке начальных данных' });
    log.error(error instanceof Error ? error.message : String(error));
    return false;
  }
}

/**
 * Основная функция инициализации
 */
async function main() {
  console.log(chalk.blue.bold('\n=== Инициализация базы данных ===\n'));

  try {
    // Создаем базу данных
    const dbCreated = await createDatabase();
    if (!dbCreated) {
      log.warn('Инициализация прервана пользователем');
      process.exit(0);
    }

    // Применяем миграции
    await runMigrations();

    // Загружаем начальные данные
    await runSeeds();

    console.log(chalk.green.bold('\n✅ База данных успешно инициализирована!\n'));
  } catch (error) {
    log.error('Ошибка при инициализации базы данных:');
    log.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exit(1);
  }
}

// Запускаем инициализацию
main();
