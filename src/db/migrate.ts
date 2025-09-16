// path: src/db/migrate.ts
/**
 * Скрипт для управления миграциями базы данных
 * Позволяет применять и откатывать миграции, а также проверять статус
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Определяем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем переменные окружения
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Создаем подключение к базе данных
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Отключаем автоматическую синхронизацию
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, 'entities', '*.{js,ts}')],
  migrations: [path.join(__dirname, 'migrations', '*.{js,ts}')],
  migrationsTableName: 'migrations',
  charset: 'utf8mb4',
  timezone: 'Z',
  connectTimeout: 30000, // 30 секунд таймаута подключения
  acquireTimeout: 30000, // 30 секунд ожидания соединения
  extra: {
    connectionLimit: 10, // Максимальное количество соединений в пуле
  },
});

/**
 * Проверяет соединение с базой данных
 */
async function checkConnection() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Успешное подключение к базе данных MySQL');
    await AppDataSource.destroy();
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
    return false;
  }
}

/**
 * Применяет все ожидающие миграции
 */
async function runMigrations() {
  try {
    await AppDataSource.initialize();
    const migrations = await AppDataSource.runMigrations();
    
    if (migrations.length > 0) {
      console.log(`✅ Применено ${migrations.length} миграций:`);
      migrations.forEach(migration => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log('✅ Нет ожидающих миграций');
    }
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Ошибка при применении миграций:', error);
    process.exit(1);
  }
}

/**
 * Откатывает последнюю примененную миграцию
 */
async function undoLastMigration() {
  try {
    await AppDataSource.initialize();
    const migrations = await AppDataSource.undoLastMigration();
    
    if (migrations) {
      console.log(`✅ Отменена миграция: ${migrations.name}`);
    } else {
      console.log('❌ Нет примененных миграций для отката');
    }
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Ошибка при откате миграции:', error);
    process.exit(1);
  }
}

/**
 * Показывает статус миграций
 */
async function showMigrationsStatus() {
  try {
    await AppDataSource.initialize();
    const migrations = await AppDataSource.showMigrations();
    
    console.log('Статус миграций:');
    console.log(JSON.stringify(migrations, null, 2));
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Ошибка при получении статуса миграций:', error);
    process.exit(1);
  }
}

// Обработка аргументов командной строки
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      await checkConnection();
      break;
      
    case 'migrate':
      await runMigrations();
      break;
      
    case 'revert':
      await undoLastMigration();
      break;
      
    case 'status':
      await showMigrationsStatus();
      break;
      
    default:
      console.log('Использование:');
      console.log('  npm run db:check    - Проверить подключение к БД');
      console.log('  npm run db:migrate  - Применить все ожидающие миграции');
      console.log('  npm run db:revert   - Откатить последнюю миграцию');
      console.log('  npm run db:status   - Показать статус миграций');
      process.exit(1);
  }
  
  process.exit(0);
}

// Запускаем скрипт
main().catch(error => {
  console.error('❌ Непредвиденная ошибка:', error);
  process.exit(1);
});
