/**
 * Функции для работы с данными Wildberries
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

/**
 * Получает базовую информацию о продавце
 * @param {Page} page - Экземпляр страницы Playwright
 * @param {Object} settings - Настройки приложения
 * @param {Object} messages - Сообщения
 * @param {Object} result - Объект для сохранения результатов
 * @param {Object} executionData - Данные о выполнении
 */
export async function getSellerBasic(page, settings, messages, result, executionData) {
  try {
    // Здесь будет логика получения базовой информации о продавце
    result.name = await page.$eval('h1.seller-info-title', el => el.textContent.trim());
    result.logo = await page.$eval('.seller-logo img', img => img.src);
    
    executionData.mark('getSellerBasic');
  } catch (error) {
    executionData.addError({ step: 'getSellerBasic', message: error.message });
    throw error;
  }
}

/**
 * Получает статистику продавца
 * @param {Page} page - Экземпляр страницы Playwright
 * @param {Object} settings - Настройки приложения
 * @param {Object} messages - Сообщения
 * @param {Object} result - Объект для сохранения результатов
 * @param {Object} executionData - Данные о выполнении
 */
export async function getSellerStats(page, settings, messages, result, executionData) {
  try {
    // Здесь будет логика получения статистики продавца
    const ratingElement = await page.$('.seller-info-rating');
    if (ratingElement) {
      result.rating = await ratingElement.evaluate(el => parseFloat(el.textContent.trim()));
    }
    
    executionData.mark('getSellerStats');
  } catch (error) {
    executionData.addError({ step: 'getSellerStats', message: error.message });
    throw error;
  }
}

/**
 * Получает информацию о продажах продавца
 * @param {Page} page - Экземпляр страницы Playwright
 * @param {Object} settings - Настройки приложения
 * @param {Object} messages - Сообщения
 * @param {Object} result - Объект для сохранения результатов
 * @param {Object} executionData - Данные о выполнении
 */
export async function getSellerSales(page, settings, messages, result, executionData) {
  try {
    // Здесь будет логика получения информации о продажах
    const salesElement = await page.$('.seller-sales');
    if (salesElement) {
      result.sales = await salesElement.evaluate(el => {
        const text = el.textContent.trim();
        return parseInt(text.replace(/\D/g, ''), 10);
      });
    }
    
    executionData.mark('getSellerSales');
  } catch (error) {
    executionData.addError({ step: 'getSellerSales', message: error.message });
    throw error;
  }
}

/**
 * Получает дополнительную информацию о продавце
 * @param {Page} page - Экземпляр страницы Playwright
 * @param {Object} settings - Настройки приложения
 * @param {Object} messages - Сообщения
 * @param {Object} result - Объект для сохранения результатов
 * @param {Object} executionData - Данные о выполнении
 */
export async function getSellerDetails(page, settings, messages, result, executionData) {
  try {
    // Здесь будет логика получения дополнительной информации о продавце
    const detailsElement = await page.$('.seller-details');
    if (detailsElement) {
      result.details = await detailsElement.evaluate(el => el.textContent.trim());
    }
    
    executionData.mark('getSellerDetails');
  } catch (error) {
    executionData.addError({ step: 'getSellerDetails', message: error.message });
    throw error;
  }
}

/**
 * Сохраняет HTML страницы для отладки
 * @param {Page} page - Экземпляр страницы Playwright
 * @param {string} prefix - Префикс для имени файла
 * @param {string} id - Идентификатор (например, ID продавца)
 * @param {Object} fs - Модуль fs для работы с файлами
 */
export async function htmlSave(page, prefix, id, fs) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const debugDir = path.join(__dirname, '../../../../debug');
    await fs.mkdir(debugDir, { recursive: true });
    
    const content = await page.content();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${prefix}_${id}_${timestamp}.html`;
    const filePath = path.join(debugDir, filename);
    
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Сохранена отладочная информация: ${filePath}`);
  } catch (error) {
    console.error('Ошибка при сохранении HTML:', error);
  }
}

// Экспортируем все функции
export default {
  getSellerBasic,
  getSellerStats,
  getSellerSales,
  getSellerDetails,
  htmlSave
};
