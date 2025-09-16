// path: src/routes/product.routes.ts
/**
 * Маршруты для работы с товарами
 * Определяет все API-эндпоинты, связанные с товарами
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import ProductController from '@core/controllers/ProductController';
import { authenticate } from '../../middleware/auth';
import { productValidation } from '../../middleware/validation';
import { LIMITS } from '../../config/constants';

// Создаем экземпляр роутера
const router = Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'temp');
    // Создаем директорию, если она не существует
    require('fs').mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Фильтр для проверки типов файлов
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла'));
  }
};

// Инициализируем загрузчик файлов
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: LIMITS.MAX_UPLOAD_FILE_SIZE,
  },
});

// Маршруты для поиска и получения информации о товарах (публичные)
router.get(
  '/search',
  productValidation.list,
  ProductController.searchProducts
);

router.get(
  '/:id',
  productValidation.idParam,
  ProductController.getProductById
);

// Маршруты, требующие аутентификации
router.use(authenticate);

// Расчет рентабельности
router.post(
  '/calculate-profitability',
  productValidation.calculateProfitability,
  ProductController.calculateProfitability
);

// CRUD операции с товарами
router.route('/')
  .get(
    productValidation.list,
    ProductController.searchProducts
  )
  .post(
    upload.array('images', 10),
    productValidation.createUpdate,
    ProductController.createProduct
  );

router.route('/:id')
  .put(
    upload.array('images', 10),
    productValidation.idParam,
    productValidation.createUpdate,
    ProductController.updateProduct
  )
  .delete(
    productValidation.idParam,
    ProductController.deleteProduct
  );

// Загрузка изображений
router.post(
  '/:productId/upload-image',
  upload.single('image'),
  productValidation.idParam,
  ProductController.uploadProductImage
);

// Импорт/экспорт товаров
router.post(
  '/import',
  upload.single('file'),
  ProductController.importProducts
);

router.get(
  '/export',
  ProductController.exportProducts
);

export default router;
