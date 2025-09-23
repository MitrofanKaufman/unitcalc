import { Router } from 'express';
import { BaseRouter } from '../../../../../src/core/base/BaseRouter';
import { ProductController } from './product.controller';

export class ProductRouter extends BaseRouter {
  private readonly controller: ProductController;

  constructor() {
    super('/products');
    this.controller = new ProductController();
    this.initializeRoutes();
    this.setupRoutes();
  }

  protected initializeRoutes(): void {
    // GET /api/v1/products - Получить список товаров
    this.get(
      '/',
      this.controller.getAllProducts.bind(this.controller),
      {
        description: 'Получить список товаров',
        middlewares: [
          // Можно добавить мидлвары, например, для аутентификации
          // authMiddleware,
          // validateRequest(schema)
        ]
      }
    );

    // GET /api/v1/products/:id - Получить товар по ID
    this.get(
      '/:id',
      this.controller.getProductById.bind(this.controller),
      {
        description: 'Получить товар по ID',
        // middlewares: [validateIdParam]
      }
    );

    // POST /api/v1/products - Создать новый товар
    this.post(
      '/',
      this.controller.createProduct.bind(this.controller),
      {
        description: 'Создать новый товар',
        // middlewares: [validateCreateProduct]
      }
    );

    // PUT /api/v1/products/:id - Обновить товар
    this.put(
      '/:id',
      this.controller.updateProduct.bind(this.controller),
      {
        description: 'Обновить товар',
        // middlewares: [validateIdParam, validateUpdateProduct]
      }
    );

    // DELETE /api/v1/products/:id - Удалить товар
    this.delete(
      '/:id',
      this.controller.deleteProduct.bind(this.controller),
      {
        description: 'Удалить товар',
        // middlewares: [validateIdParam, adminOnly]
      }
    );
  }
}
