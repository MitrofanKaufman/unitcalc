// @ts-nocheck
// db/service.js — автоматически сконвертировано в TypeScript 2025-07-17.
// Логика сохранена, при необходимости уточнить типы.

// path: src/api/db/service.js
import db from '@/api/db/MySQLClient';

/**
 * Получает кэшированный продукт по userId и productId
 */
export async function getCachedProduct(userId, productId) {
    if (!productId) return null;

    const dataId = `wb-${productId}`;

    const [row] = await db.query(
      `SELECT payload FROM collected_data
     WHERE id = ? AND type = 'product'
     LIMIT 1`,
      [dataId]
    );

    if (!row?.payload) return null;
    // Если драйвер БД уже вернул объект – сразу отдаём его
    if (typeof row.payload === 'object') return row.payload;
    // Иначе считаем, что это строка JSON
    try {
        return JSON.parse(row.payload as string);
    } catch {
        // Некорректный JSON – логируем и возвращаем null
        console.warn('⚠️  Invalid JSON in cached product', dataId);
        return null;
    }
}

/**
 * Сохраняет данные о продукте
 */
export async function saveProduct(userId, productId, data) {
    const dataId = `wb-${productId}`;
    const payload = JSON.stringify(data.product);

    await db.query(`
    INSERT INTO collected_data (id, type, platform_code, payload)
    VALUES (?, 'product', 'wb', ?)
    ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = CURRENT_TIMESTAMP
  `, [dataId, payload]);

    // Привязка пользователя к продукту
    if (userId) {
        await db.query(`
      INSERT INTO user_data_links (user_id, data_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE linked_at = CURRENT_TIMESTAMP
    `, [userId, dataId]);
    }
}

/**
 * Сохраняет данные о продавце
 */
export async function saveSeller(userId, sellerId, data) {
    const dataId = `wb-seller-${sellerId}`;
    const payload = JSON.stringify(data.seller);

    await db.query(`
    INSERT INTO collected_data (id, type, platform_code, payload)
    VALUES (?, 'seller', 'wb', ?)
    ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = CURRENT_TIMESTAMP
  `, [dataId, payload]);

    if (userId) {
        await db.query(`
      INSERT INTO user_data_links (user_id, data_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE linked_at = CURRENT_TIMESTAMP
    `, [userId, dataId]);
    }
}

/**
 * Получает кэшированного продавца
 */
export async function getCachedSeller(userId, sellerId) {
    if (!sellerId) return null;

    const dataId = `wb-seller-${sellerId}`;

    const [row] = await db.query(
      `SELECT payload FROM collected_data
     WHERE id = ? AND type = 'seller'
     LIMIT 1`,
      [dataId]
    );

    if (!row?.payload) return null;
    // Если драйвер БД уже вернул объект – сразу отдаём его
    if (typeof row.payload === 'object') return row.payload;
    // Иначе считаем, что это строка JSON
    try {
        return JSON.parse(row.payload as string);
    } catch {
        // Некорректный JSON – логируем и возвращаем null
        console.warn('⚠️  Invalid JSON in cached seller', dataId);
        return null;
    }
}