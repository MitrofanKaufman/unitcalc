// расположение: ./api/v1/routes/parse/product.ts
// path: src/api/v1/routes/parse/product.js
import express from "express";
/**
 * Контроллер парсинга товара
 */
class ProductParserController {
  /**
   * Парсит данные по товару и возвращает результат
   * @param {express.Request} req
   * @param {express.Response} res
   */
  async handle(req, res) {
    const productId = req.params.id;
    if (!productId || isNaN(productId)) {
      return res.status(400).json({ error: "Некорректный ID товара" });
    }
    try {
      // Здесь вставить реальную логику парсинга (например, через Playwright)
      const data = await this.parseProductData(productId);
      res.json({ success: true, data });
    }
    catch (err) {
      console.error(`[ParseError] ${err.message}`);
      res
        .status(500)
        .json({ error: "Ошибка парсинга товара", details: err.message });
    }
  }
  /**
   * Заглушка: здесь будет реальный парсинг
   * @param {string} productId
   * @returns {Promise<Object>}
   */
  async parseProductData(productId) {
    // Вставь реальную логику парсинга данных по ID товара
    return {
      id: productId,
      name: "Пример товара",
      price: 1234,
      rating: 4.5,
      stock: 18,
    };
  }
}
// ───── Маршруты ─────
const router = express.Router();
const controller = new ProductParserController();
/**
 * GET /product/:id
 * Пример: /api/v1/parse/product/123456
 */
router.get("/:id", (req, res) => controller.handle(req, res));

// Экспортируем роутер по умолчанию
export default router;

// Дополнительно экспортируем функцию для использования в других частях приложения
export function parseProduct(productId: string, onStatus: (status: string) => void = () => {}, userId: string | null = null) {
  return scrapeProductById(productId, onStatus, userId);
}
