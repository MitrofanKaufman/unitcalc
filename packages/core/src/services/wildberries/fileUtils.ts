// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\core\src\services\wildberries\fileUtils.ts
/**
 * path/to/file.ts
 * Описание: Утилиты для работы с файлами при сохранении результатов скрейпинга
 * Логика: Клиентская/Серверная (серверная логика сбора данных)
 * Зависимости: Node.js fs/promises модуль
 * Примечания: Содержит функции для сохранения данных в JSON формате
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Сохранение данных в JSON файл
 */
export async function saveJson(filename: string, data: any): Promise<void> {
  try {
    // Создаем папку data, если она не существует
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });

    const filePath = path.join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Ошибка при сохранении JSON файла:', error);
    throw error;
  }
}

/**
 * Загрузка данных из JSON файла
 */
export async function loadJson(filename: string): Promise<any> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, filename);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return null; // Файл не найден
    }
    console.error('Ошибка при загрузке JSON файла:', error);
    throw error;
  }
}

/**
 * Создание директорий для хранения результатов
 */
export async function ensureDirectories(): Promise<void> {
  const directories = [
    path.join(process.cwd(), 'data'),
    path.join(process.cwd(), 'data', 'products'),
    path.join(process.cwd(), 'data', 'sellers'),
    path.join(process.cwd(), 'data', 'logs')
  ];

  for (const dir of directories) {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Очистка старых файлов (опционально)
 */
export async function cleanupOldFiles(olderThanDays: number = 7): Promise<void> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const files = await fs.readdir(dataDir);

    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const stats = await fs.stat(filePath);

      if (stats.mtime.getTime() < cutoffTime) {
        await fs.unlink(filePath);
        console.log(`Удален старый файл: ${file}`);
      }
    }
  } catch (error) {
    console.error('Ошибка при очистке старых файлов:', error);
  }
}
