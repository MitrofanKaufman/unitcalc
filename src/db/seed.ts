// path: src/db/seed.ts
/**
 * Скрипт для начального наполнения базы данных
 * Содержит функции для создания тестовых данных
 */

import { connectToDatabase, closeDatabaseConnection } from './connect';
import { User, Product, UserRole } from './models';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import logger from '@utils/logger';

/**
 * Создает тестовых пользователей
 */
async function seedUsers() {
  try {
    logger.info('Начало создания тестовых пользователей...');
    
    // Проверяем, есть ли уже пользователи в базе
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      logger.info('Пропускаем создание тестовых пользователей: база уже содержит пользователей');
      return;
    }
    
    // Хешируем пароли
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const userPassword = await bcrypt.hash('user123', saltRounds);
    
    // Массив тестовых пользователей
    const users = [
      {
        email: 'admin@example.com',
        username: 'admin',
        passwordHash: adminPassword,
        role: UserRole.ADMIN,
        isActive: true,
        firstName: 'Администратор',
        lastName: 'Системы',
        settings: {
          theme: 'dark',
          language: 'ru',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
      },
      {
        email: 'user@example.com',
        username: 'user',
        passwordHash: userPassword,
        role: UserRole.USER,
        isActive: true,
        firstName: 'Пользователь',
        lastName: 'Тестовый',
        settings: {
          theme: 'light',
          language: 'ru',
          notifications: {
            email: true,
            push: false,
            sms: false,
          },
        },
      },
    ];
    
    // Сохраняем пользователей в базу
    await User.insertMany(users);
    
    logger.info('Тестовые пользователи успешно созданы');
  } catch (error) {
    logger.error('Ошибка при создании тестовых пользователей:', error);
    throw error;
  }
}

/**
 * Создает тестовые товары
 */
async function seedProducts() {
  try {
    logger.info('Начало создания тестовых товаров...');
    
    // Проверяем, есть ли уже товары в базе
    const productCount = await Product.countDocuments();
    
    if (productCount > 0) {
      logger.info('Пропускаем создание тестовых товаров: база уже содержит товары');
      return;
    }
    
    // Получаем ID пользователя-администратора
    const admin = await User.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      throw new Error('Не найден пользователь-администратор для создания тестовых товаров');
    }
    
    // Массив тестовых товаров
    const products = [
      {
        name: 'Смартфон XYZ Pro',
        description: 'Мощный смартфон с отличной камерой и долгим временем работы от батареи',
        shortDescription: 'Флагманский смартфон',
        sku: `PHONE-${uuidv4().substring(0, 8).toUpperCase()}`,
        barcode: '1234567890123',
        price: 79990,
        compareAtPrice: 84990,
        cost: 50000,
        taxRate: 20,
        categories: [],
        tags: ['смартфон', 'мобильный', 'флагман'],
        images: [
          {
            url: '/uploads/products/phone-1.jpg',
            isMain: true,
            order: 1,
            altText: 'Смартфон XYZ Pro - вид спереди',
          },
          {
            url: '/uploads/products/phone-2.jpg',
            isMain: false,
            order: 2,
            altText: 'Смартфон XYZ Pro - вид сзади',
          },
        ],
        hasVariants: true,
        variants: [
          {
            name: '128 ГБ, черный',
            sku: `PHONE-${uuidv4().substring(0, 8).toUpperCase()}-128-BLK`,
            price: 79990,
            cost: 50000,
            quantity: 10,
            options: {
              storage: '128 ГБ',
              color: 'черный',
            },
          },
          {
            name: '256 ГБ, черный',
            sku: `PHONE-${uuidv4().substring(0, 8).toUpperCase()}-256-BLK`,
            price: 89990,
            cost: 55000,
            quantity: 5,
            options: {
              storage: '256 ГБ',
              color: 'черный',
            },
          },
        ],
        brand: 'XYZ',
        model: 'Pro',
        specifications: {
          'Экран': '6.7" AMOLED, 120 Гц',
          'Процессор': 'Snapdragon 8 Gen 2',
          'Оперативная память': '12 ГБ',
          'Встроенная память': '128/256 ГБ',
          'Основная камера': '108 Мп + 12 Мп + 12 Мп',
          'Фронтальная камера': '32 Мп',
          'Аккумулятор': '5000 мА·ч',
          'Операционная система': 'Android 13',
        },
        isActive: true,
        isFeatured: true,
        isDigital: false,
        isDownloadable: false,
        requiresShipping: true,
        isGiftCard: false,
        seoTitle: 'Купить смартфон XYZ Pro - официальный магазин',
        seoDescription: 'Флагманский смартфон XYZ Pro с камерой 108 Мп, экраном AMOLED 120 Гц и мощным процессором',
        seoKeywords: ['смартфон', 'xyz pro', 'флагман', 'камера 108 мп', 'amoled'],
        slug: 'smartfon-xyz-pro',
        reviews: [],
        averageRating: 4.8,
        reviewCount: 0,
        externalId: '12345',
        externalSource: 'wildberries',
        createdBy: admin._id,
        updatedBy: admin._id,
      },
      {
        name: 'Беспроводные наушники SoundMax',
        description: 'Наушники с шумоподавлением и чистым звуком',
        shortDescription: 'Беспроводные наушники с шумоподавлением',
        sku: `HEAD-${uuidv4().substring(0, 8).toUpperCase()}`,
        price: 12990,
        compareAtPrice: 14990,
        cost: 8000,
        categories: [],
        tags: ['наушники', 'беспроводные', 'soundmax'],
        images: [
          {
            url: '/uploads/products/headphones-1.jpg',
            isMain: true,
            order: 1,
            altText: 'Беспроводные наушники SoundMax',
          },
        ],
        hasVariants: false,
        variants: [],
        brand: 'SoundMax',
        model: 'Pro Wireless',
        specifications: {
          'Тип': 'Накладные беспроводные',
          'Активное шумоподавление': 'Да',
          'Время работы': 'до 30 часов',
          'Версия Bluetooth': '5.0',
          'Диапазон частот': '20 Гц - 20 кГц',
          'Импеданс': '32 Ом',
          'Вес': '250 г',
        },
        isActive: true,
        isFeatured: true,
        isDigital: false,
        isDownloadable: false,
        requiresShipping: true,
        isGiftCard: false,
        seoTitle: 'Беспроводные наушники SoundMax с шумоподавлением',
        seoDescription: 'Наушники SoundMax с активным шумоподавлением и временем работы до 30 часов',
        seoKeywords: ['наушники', 'беспроводные', 'шумоподавление', 'soundmax'],
        slug: 'besprovodnye-naushniki-soundmax',
        reviews: [],
        averageRating: 4.5,
        reviewCount: 0,
        externalId: '67890',
        externalSource: 'wildberries',
        createdBy: admin._id,
        updatedBy: admin._id,
      },
    ];
    
    // Сохраняем товары в базу
    await Product.insertMany(products);
    
    logger.info('Тестовые товары успешно созданы');
  } catch (error) {
    logger.error('Ошибка при создании тестовых товаров:', error);
    throw error;
  }
}

/**
 * Основная функция для заполнения базы данных
 */
async function seedDatabase() {
  try {
    logger.info('Начало заполнения базы данных тестовыми данными...');
    
    // Подключаемся к базе данных
    await connectToDatabase();
    
    // Запускаем создание тестовых данных
    await seedUsers();
    await seedProducts();
    
    logger.info('Заполнение базы данных тестовыми данными завершено успешно');
  } catch (error) {
    logger.error('Ошибка при заполнении базы данных тестовыми данными:', error);
    process.exit(1);
  } finally {
    // Закрываем соединение с базой данных
    await closeDatabaseConnection();
    process.exit(0);
  }
}

// Запускаем заполнение базы данных, если файл был вызван напрямую
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase, seedUsers, seedProducts };
