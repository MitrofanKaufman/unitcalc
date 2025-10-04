// \server\src\utils\logger.ts
// Система логирования на основе Winston

import winston from 'winston'
import path from 'path'

// Уровни логирования
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Цвета для разных уровней
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

// Формат для консоли
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = ''
    if (Object.keys(meta).length > 0) {
      metaStr = `\n${JSON.stringify(meta, null, 2)}`
    }
    return `${timestamp} ${level}: ${message}${metaStr}`
  })
)

// Формат для файлов
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Создание директории для логов
const fs = require('fs')
const logDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Транспорты
const transports = [
  // Логи в консоль
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: consoleFormat,
    handleExceptions: true,
    handleRejections: true,
  }),

  // Логи ошибок в файл
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: fileFormat,
    handleExceptions: true,
    handleRejections: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // Все логи в файл
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
]

// Создание логгера
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  transports,
  exitOnError: false,
})

// Миддлвар для Express
export const expressLogger = winston.createLogger({
  level: 'http',
  levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const statusCode = meta.statusCode || '???'
          const method = meta.method || '???'
          const url = meta.url || '???'
          const responseTime = meta.responseTime || '???'
          return `${timestamp} ${level}: ${method} ${url} ${statusCode} ${responseTime}ms`
        })
      )
    })
  ]
})

// Функции-обертки для удобства
export const logError = (message: string, error?: Error, meta?: any) => {
  logger.error(message, {
    error: error?.message,
    stack: error?.stack,
    ...meta
  })
}

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta)
}

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta)
}

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta)
}

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta)
}
