// path: src/db/seed/products.seed.ts
/**
 * Скрипт для заполнения базы данных тестовыми товарами
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker/locale/ru';
import Product, { IProduct, IProductImage, IProductVariant } from '../models/Product';
import { connectDB } from '../connection';

// Загружаем переменные окружения
dotenv.config();

// Категории товаров
const CATEGORIES = [
  'Электроника',
  'Одежда',
  'Обувь',
  'Аксессуары',
  'Красота',
  'Здоровье',
  'Дом и сад',
  'Детские товары',
  'Спорт',
  'Автотовары'
];

// Бренды
const BRANDS = [
  'Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Sony',
  'Nike', 'Adidas', 'Puma', 'Reebok', 'Zara',
  'H&M', 'Mango', 'Lacoste', 'Tommy Hilfiger', 'Calvin Klein'
];

// Генерация случайного изображения товара
const generateProductImage = (isMain = false): IProductImage => ({
  url: faker.image.imageUrl(800, 800, 'product', true),
  isMain,
  order: isMain ? 0 : faker.datatype.number({ min: 1, max: 10 }),
  altText: faker.commerce.productName()
});

// Генерация случайного варианта товара
const generateProductVariant = (index: number): IProductVariant => {
  const price = parseFloat(faker.commerce.price(100, 10000));
  
  return {
    name: `Вариант ${index + 1}`,
    sku: faker.random.alphaNumeric(10).toUpperCase(),
    price,
    compareAtPrice: faker.datatype.boolean(0.3) ? price * 1.3 : undefined,
    cost: price * 0.6,
    barcode: faker.datatype.uuid(),
    quantity: faker.datatype.number({ min: 0, max: 1000 }),
    weight: faker.datatype.number({ min: 50, max: 5000 }),
    dimensions: {
      length: faker.datatype.number({ min: 5, max: 100 }),
      width: faker.datatype.number({ min: 5, max: 100 }),
      height: faker.datatype.number({ min: 5, max: 100 })
    },
    options: {
      color: faker.color.human(),
      size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
    }
  };
};

// Генерация случайного товара
const generateProduct = (): Partial<IProduct> => {
  const hasVariants = faker.datatype.boolean(0.3);
  const variantsCount = hasVariants ? faker.datatype.number({ min: 1, max: 5 }) : 0;
  const imagesCount = faker.datatype.number({ min: 1, max: 5 });
  
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    shortDescription: faker.lorem.sentence(),
    sku: faker.random.alphaNumeric(10).toUpperCase(),
    barcode: faker.datatype.uuid(),
    price: parseFloat(faker.commerce.price(100, 10000)),
    compareAtPrice: faker.datatype.boolean(0.3) ? parseFloat(faker.commerce.price(150, 15000)) : undefined,
    cost: parseFloat(faker.commerce.price(50, 5000)),
    taxRate: faker.helpers.arrayElement([0, 10, 18, 20]),
    categories: [],
    tags: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => 
      faker.commerce.productAdjective()
    ),
    images: Array.from({ length: imagesCount }, (_, i) => 
      generateProductImage(i === 0)
    ),
    hasVariants,
    variants: hasVariants ? Array.from({ length: variantsCount }, (_, i) => 
      generateProductVariant(i)
    ) : [],
    brand: faker.helpers.arrayElement(BRANDS),
    model: faker.vehicle.model(),
    specifications: {
      material: faker.commerce.productMaterial(),
      color: faker.color.human(),
      weight: faker.datatype.number({ min: 50, max: 5000 }),
      dimensions: {
        length: faker.datatype.number({ min: 5, max: 100 }),
        width: faker.datatype.number({ min: 5, max: 100 }),
        height: faker.datatype.number({ min: 5, max: 100 })
      }
    },
    isActive: faker.datatype.boolean(0.9), // 90% товаров активны
    isFeatured: faker.datatype.boolean(0.2),
    isDigital: faker.datatype.boolean(0.1),
    isDownloadable: faker.datatype.boolean(0.05),
    requiresShipping: faker.datatype.boolean(0.9),
    isGiftCard: faker.datatype.boolean(0.05),
    seoTitle: faker.lorem.words(5),
    seoDescription: faker.lorem.sentence(),
    seoKeywords: Array.from({ length: faker.datatype.number({ min: 3, max: 10 }) }, () => 
      faker.commerce.productAdjective()
    ),
    slug: '', // Будет сгенерирован в pre-save хуке
    reviews: [],
    averageRating: 0,
    reviewCount: 0
  };
};

// Основная функция для заполнения базы данных
const seedProducts = async (count = 50) => {
  try {
    // Подключаемся к базе данных
    await connectDB();
    
    // Очищаем коллекцию товаров
    console.log('Очистка коллекции товаров...');
    await Product.deleteMany({});
    
    // Генерируем тестовые товары
    console.log(`Генерация ${count} тестовых товаров...`);
    const products = Array.from({ length: count }, () => generateProduct());
    
    // Сохраняем товары в базу данных
    console.log('Сохранение товаров в базу данных...');
    await Product.insertMany(products);
    
    console.log(`Успешно создано ${count} тестовых товаров`);
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении базы данных тестовыми товарами:', error);
    process.exit(1);
  }
};

// Запускаем заполнение базы данных
const count = process.argv[2] ? parseInt(process.argv[2], 10) : 50;
seedProducts(count);
