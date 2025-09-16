#!/usr/bin/env node
/**
 * Скрипт для добавления тестового товара в базу данных
 */

import { DataSource } from 'typeorm';
import path from 'path';
import config from '../src/config/database';
import { Product } from '../src/db/entities/Product';

async function addTestProduct() {
  const connection = new DataSource({
    ...config,
    name: 'test_connection',
    entities: [
      path.join(process.cwd(), 'src/db/entities/Product.ts')
    ],
  });

  try {
    await connection.initialize();
    console.log('✅ Подключение к базе данных установлено');

    const productRepository = connection.getRepository(Product);
    
    // Создаем тестовый товар
    const testProduct = productRepository.create({
      name: 'Тестовый товар',
      description: 'Это тестовый товар для проверки работы API',
      price: 999.99,
      stock: 100,
      sku: 'TEST-001',
      barcode: '1234567890123',
      metadata: {
        brand: 'Test Brand',
        category: 'Test Category',
        weight: 0.5,
        dimensions: '10x10x5',
      },
      isActive: true,
    });

    // Сохраняем товар в базу данных
    const savedProduct = await productRepository.save(testProduct);
    console.log('✅ Тестовый товар успешно добавлен:');
    console.log(savedProduct);
    
  } catch (error) {
    console.error('❌ Ошибка при добавлении тестового товара:');
    console.error(error);
  } finally {
    if (connection.isInitialized) {
      await connection.destroy();
      console.log('🔌 Соединение с базой данных закрыто');
    }
  }
}

// Запускаем добавление тестового товара
addTestProduct().catch(console.error);
