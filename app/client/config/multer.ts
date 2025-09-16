// path: src/config/multer.ts
/**
 * Конфигурация загрузки файлов с помощью Multer
 * Обеспечивает безопасную загрузку и валидацию файлов
 */

import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from './config';
import ApiError from '@utils/ApiError';

// Создаем директорию для загрузок, если она не существует
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройки хранилища
const storage = multer.diskStorage({
  // Определяем путь для сохранения файла
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    // Определяем подкаталог в зависимости от типа файла
    let subfolder = 'other';
    
    if (file.mimetype.startsWith('image/')) {
      subfolder = 'images';
    } else if (file.mimetype.startsWith('video/')) {
      subfolder = 'videos';
    } else if (file.mimetype.startsWith('audio/')) {
      subfolder = 'audio';
    } else if (file.mimetype.includes('spreadsheet') || file.mimetype.includes('excel') || file.mimetype.includes('csv')) {
      subfolder = 'spreadsheets';
    } else if (file.mimetype.includes('pdf')) {
      subfolder = 'documents';
    } else if (file.mimetype.includes('zip') || file.mimetype.includes('compressed')) {
      subfolder = 'archives';
    }
    
    // Создаем подкаталог, если он не существует
    const dir = path.join(uploadDir, subfolder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  
  // Определяем имя файла
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Генерируем уникальное имя файла
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// Фильтр файлов
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Разрешенные MIME-типы
  const allowedMimeTypes = [
    // Изображения
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Документы
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
    
    // Архивы
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
    
    // Видео
    'video/mp4',
    'video/webm',
    'video/ogg',
    
    // Аудио
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
  ];
  
  // Максимальный размер файла (10 МБ по умолчанию)
  const maxSize = 10 * 1024 * 1024; // 10 МБ
  
  // Проверяем MIME-тип
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new ApiError('Недопустимый тип файла', 400, 'INVALID_FILE_TYPE'));
  }
  
  // Проверяем размер файла
  if (file.size > maxSize) {
    return cb(new ApiError('Размер файла превышает допустимый лимит', 400, 'FILE_TOO_LARGE'));
  }
  
  // Проверяем расширение файла
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [
    // Изображения
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    // Документы
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt',
    // Архивы
    '.zip', '.rar', '.7z', '.tar', '.gz',
    // Видео
    '.mp4', '.webm', '.ogv',
    // Аудио
    '.mp3', '.ogg', '.wav',
  ];
  
  if (!allowedExtensions.includes(ext)) {
    return cb(new ApiError('Недопустимое расширение файла', 400, 'INVALID_FILE_EXTENSION'));
  }
  
  // Если все проверки пройдены, принимаем файл
  cb(null, true);
};

// Настройки Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 МБ
    files: 5, // Максимальное количество файлов
  },
});

// Middleware для загрузки одиночного файла
const uploadSingle = (fieldName: string) => {
  return (req: Request, res: any, next: any) => {
    upload.single(fieldName)(req, res, (err: any) => {
      handleUploadError(err, req, res, next);
    });
  };
};

// Middleware для загрузки нескольких файлов
const uploadArray = (fieldName: string, maxCount: number = 5) => {
  return (req: Request, res: any, next: any) => {
    upload.array(fieldName, maxCount)(req, res, (err: any) => {
      handleUploadError(err, req, res, next);
    });
  };
};

// Middleware для загрузки файлов с определенными именами полей
const uploadFields = (fields: multer.Field[]) => {
  return (req: Request, res: any, next: any) => {
    upload.fields(fields)(req, res, (err: any) => {
      handleUploadError(err, req, res, next);
    });
  };
};

// Обработчик ошибок загрузки файлов
const handleUploadError = (err: any, req: Request, res: any, next: any) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError('Размер файла превышает допустимый лимит', 400, 'FILE_TOO_LARGE'));
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ApiError('Превышено максимальное количество файлов', 400, 'TOO_MANY_FILES'));
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ApiError('Недопустимое поле для загрузки файла', 400, 'INVALID_FIELD_NAME'));
    }
    
    if (err instanceof ApiError) {
      return next(err);
    }
    
    return next(new ApiError('Ошибка при загрузке файла', 500, 'UPLOAD_ERROR', { error: err.message }));
  }
  
  next();
};

// Утилита для удаления файла
const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(uploadDir, filePath);
    
    fs.unlink(fullPath, (err) => {
      if (err) {
        // Если файл не найден, считаем, что он уже удален
        if (err.code === 'ENOENT') {
          return resolve();
        }
        return reject(err);
      }
      resolve();
    });
  });
};

// Утилита для проверки существования файла
const fileExists = (filePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(uploadDir, filePath);
    
    fs.access(fullPath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

// Утилита для получения URL файла
const getFileUrl = (filePath: string): string => {
  if (!filePath) return '';
  
  // Если это уже полный URL, возвращаем как есть
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // Иначе формируем URL относительно корня загрузок
  const relativePath = path.relative(uploadDir, filePath);
  return `${config.api.baseUrl}/uploads/${relativePath.replace(/\\/g, '/')}`;
};

export {
  upload,
  uploadSingle,
  uploadArray,
  uploadFields,
  deleteFile,
  fileExists,
  getFileUrl,
  uploadDir,
};

export default {
  upload,
  uploadSingle,
  uploadArray,
  uploadFields,
  deleteFile,
  fileExists,
  getFileUrl,
  uploadDir,
};
