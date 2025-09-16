// path: src/api/v1/functions/saveJSON.js
import path from 'path';
import fs from 'fs/promises';

/**
 * Сохраняет объект data в JSON-файл .data/{folder}/{id}.json
 */
export async function saveJson(folder, id, data) {
  // Директория: .data/{folder}
  const dirPath = path.resolve('public', folder);
  // Файл: .data/{folder}/{id}.json
  const filePath = path.join(dirPath, `${id}.json`);

  // Убеждаемся, что папка существует
  await fs.mkdir(dirPath, { recursive: true });
  // Записываем JSON
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}