// path: src/db/seed/index.ts
/**
 * Управление заполнением базы данных тестовыми данными
 * Предоставляет функции для инициализации, заполнения и очистки тестовых данных
 */

import { Command } from 'commander';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getConnection } from 'typeorm';
import { Product } from '../entities/Product';

// Определяем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем переменные окружения из файла .env
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Создаем экземпляр командной строки
const program = new Command();

program
  .name('db-seed')
  .description('Утилита для управления тестовыми данными в базе данных')
  .version('1.0.0');

// Команда для заполнения базы данных тестовыми товарами
program
  .command('products [count]')
  .description('Заполнить базу данных тестовыми товарами')
  .action(async (count = '50') => {
    try {
      // Подключаемся к базе данных
      const connection = await getConnection();
      
      // Динамический импорт для избежания циклических зависимостей
      const { seedProducts } = await import('./products.seed.js');
      await seedProducts(connection, parseInt(count, 10));
      
      console.log('База данных успешно заполнена тестовыми товарами');
      process.exit(0);
    } catch (error) {
      console.error('Ошибка при заполнении базы данных товарами:', error);
      process.exit(1);
    }
  });

// Команда для очистки всех тестовых данных
program
  .command('clean')
  .description('Очистить все тестовые данные из базы')
  .action(async () => {
    try {
      const connection = await getConnection();
      const productRepository = connection.getRepository(Product);
      
      // Очищаем таблицу товаров
      await productRepository.clear();
      
      console.log('Все тестовые данные успешно удалены');
      process.exit(0);
    } catch (error) {
      console.error('Ошибка при очистке базы данных:', error);
      process.exit(1);
    }
  });

// Обработка ошибок командной строки
program.parseAsync(process.argv).catch(error => {
  console.error('Ошибка при выполнении команды:', error);
  process.exit(1);
});

// Функция для запуска из других модулей
export async function runSeed(args: string[]) {
  program.parse(args);
}
};

// Запускаем CLI, если файл запущен напрямую
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  program.parse(process.argv);
}
