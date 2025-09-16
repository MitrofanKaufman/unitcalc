// path: src/config/logger.ts
/**
 * Конфигурация логгера приложения
 * Обеспечивает централизованное логирование с разными уровнями важности
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config';
import 'winston-daily-rotate-file';

// Получаем текущую директорию в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем цвета для разных уровней логирования
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Добавляем цвета в winston
winston.addColors(colors);

// Формат логов
const format = winston.format.combine(
  // Добавляем метку времени в формате ISO
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  
  // Форматируем вывод логов в консоль с цветами
  winston.format.colorize({ all: true }),
  
  // Определяем формат вывода логов
  winston.format.printf(
    (info) => {
      const { timestamp, level, message, ...meta } = info;
      let log = `${timestamp} [${level}]: ${message}`;
      
      // Добавляем метаданные, если они есть
      if (Object.keys(meta).length > 0) {
        log += `\n${JSON.stringify(meta, null, 2)}`;
      }
      
      return log;
    },
  ),
);

// Формат для записи в файл (без цветов)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json(),
);

// Определяем транспорты для логов
const transports = [
  // Вывод логов в консоль
  new winston.transports.Console({
    level: config.logs.level,
    format,
  }),
  
  // Запись ошибок в файл
  new winston.transports.DailyRotateFile({
    level: 'error',
    filename: path.join(__dirname, '../../logs/error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d', // Храним логи за 14 дней
    format: fileFormat,
  }),
  
  // Запись всех логов в файл
  new winston.transports.DailyRotateFile({
    level: 'debug',
    filename: path.join(__dirname, '../../logs/combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d', // Храним логи за 7 дней
    format: fileFormat,
  }),
];

// Создаем экземпляр логгера
const logger = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.json(),
  defaultMeta: { service: 'wb-calculator' },
  transports,
  
  // Обработка необработанных исключений
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/exceptions.log'),
    }),
  ],
  
  // Обработка необработанных обещаний
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/rejections.log'),
    }),
  ],
  
  // Выход при ошибке
  exitOnError: false,
});

// Если мы не в продакшене, логируем в консоль
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// Поток для Morgan (HTTP-логи)
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
