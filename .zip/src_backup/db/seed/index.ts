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
      // Динамический импорт для избежания циклических зависимостей
      const { seedProducts } = await import('./products.seed.js');
      await seedProducts(parseInt(count, 10));
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
      const { connectDB } = await import('../connection.js');
      const { default: Product } = await import('../models/Product.js');
      
      await connectDB();
      await Product.deleteMany({});
      
      console.log('Все тестовые данные успешно удалены');
      process.exit(0);
    } catch (error) {
      console.error('Ошибка при очистке тестовых данных:', error);
      process.exit(1);
    }
  });

// Обработка ошибок командной строки
program.parseAsync(process.argv).catch(error => {
  console.error('Ошибка при выполнении команды:', error);
  process.exit(1);
});

// Экспортируем функцию для запуска из других модулей
export const runSeed = async (args: string[]) => {
  await program.parseAsync(args, { from: 'user' });
};

// Запускаем CLI, если файл запущен напрямую
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  program.parse(process.argv);
}
