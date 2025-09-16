// path: src/db/seed/products.seed.ts
/**
 * Скрипт для заполнения базы данных тестовыми товарами
 */

import 'reflect-metadata';
import { Connection } from 'typeorm';
import { faker } from '@faker-js/faker/locale/ru';
import { Product } from '../entities/Product';

// Интерфейсы для типизации
interface IProductImage {
  url: string;
  isMain: boolean;
  order: number;
  altText: string;
}

interface IProductVariant {
  name: string;
  sku: string;
  barcode: string;
  price: number;
  stock: number;
  images: IProductImage[];
  attributes: Record<string, any>;
}

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
    barcode: faker.datatype.uuid(),
    price,
    stock: faker.datatype.number({ min: 0, max: 1000 }),
    images: Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }, (_, i) => 
      generateProductImage(i === 0)
    ),
    attributes: {
      color: faker.color.human(),
      size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL', 'XXL']),
      weight: faker.datatype.number({ min: 100, max: 5000 }),
      material: faker.commerce.productMaterial()
    }
  };
};

// Генерация случайного товара
const generateProduct = (): Partial<Product> => {
  const name = faker.commerce.productName();
  const price = parseFloat(faker.commerce.price(100, 10000));
  const discount = faker.datatype.boolean() ? faker.datatype.number({ min: 5, max: 70 }) : 0;
  const finalPrice = discount ? price * (1 - discount / 100) : price;
  
  return {
    name,
    description: faker.commerce.productDescription(),
    price,
    stock: faker.datatype.number({ min: 0, max: 1000 }),
    sku: faker.random.alphaNumeric(10).toUpperCase(),
    barcode: faker.datatype.uuid(),
    metadata: {
      category: faker.helpers.arrayElement([
        'Электроника', 'Одежда', 'Обувь', 'Аксессуары', 'Красота', 
        'Здоровье', 'Дом и сад', 'Детские товары', 'Спорт', 'Автотовары'
      ]),
      brand: faker.helpers.arrayElement([
        'Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Sony',
        'Nike', 'Adidas', 'Puma', 'Reebok', 'Zara',
        'H&M', 'Mango', 'Lacoste', 'Tommy Hilfiger', 'Calvin Klein'
      ]),
      rating: faker.datatype.number({ min: 0, max: 5, precision: 0.1 }),
      reviewsCount: faker.datatype.number(1000),
      isFeatured: faker.datatype.boolean(0.2), // 20% товаров - рекомендуемые
      discount,
      finalPrice,
      images: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, (_, i) => 
        generateProductImage(i === 0)
      ),
      variants: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, (_, i) => 
        generateProductVariant(i)
      ),
      attributes: {
        color: faker.color.human(),
        size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL', 'XXL']),
        weight: faker.datatype.number({ min: 100, max: 5000 }),
        material: faker.commerce.productMaterial(),
        country: faker.address.country(),
        warranty: faker.datatype.boolean() ? 
          `${faker.datatype.number({ min: 1, max: 36 })} месяцев` : 
          'Без гарантии'
      },
      seo: {
        title: name,
        description: faker.lorem.sentence(),
        keywords: Array.from({ length: faker.datatype.number({ min: 3, max: 8 }) }, () => 
          faker.commerce.productAdjective()
        ).join(', ')
      }
    },
    isActive: faker.datatype.boolean(0.9), // 90% товаров активны
    createdAt: faker.date.past(2),
    updatedAt: faker.date.recent()
  };
};

// Основная функция для заполнения базы данных
export const seedProducts = async (connection: Connection, count = 50) => {
  const queryRunner = connection.createQueryRunner();
  
  try {
    // Начинаем транзакцию
    await queryRunner.startTransaction();
    
    // Получаем репозиторий товаров
    const productRepository = connection.getRepository(Product);
    
    // Очищаем таблицу товаров
    await productRepository.clear();
    
    // Генерируем и сохраняем товары пакетами по 100 штук
    const batchSize = 100;
    let savedCount = 0;
    
    while (savedCount < count) {
      const batchCount = Math.min(batchSize, count - savedCount);
      const products = Array.from({ length: batchCount }, () => generateProduct());
      
      // Сохраняем пакет товаров
      await productRepository.save(products);
      savedCount += batchCount;
      
      console.log(`Создано ${savedCount} из ${count} товаров...`);
    }
    
    // Фиксируем транзакцию
    await queryRunner.commitTransaction();
    
    console.log(`Успешно создано ${count} тестовых товаров`);
    return savedCount;
    
  } catch (error) {
    // Откатываем изменения в случае ошибки
    await queryRunner.rollbackTransaction();
    console.error('Ошибка при заполнении базы данных товарами:', error);
    throw error;
    
  } finally {
    // Освобождаем ресурсы
    await queryRunner.release();
  }
};

// Запускаем заполнение базы данных
const count = process.argv[2] ? parseInt(process.argv[2], 10) : 50;
