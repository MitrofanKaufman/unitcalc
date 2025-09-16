#!/usr/bin/env node
/**
 * Скрипт для обновления импортов в соответствии с новой структурой проекта
 * Автоматически находит и обновляет все импорты в файлах проекта
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Полифил для promisify
const promisify = (fn) => (...args) => 
  new Promise((resolve, reject) => 
    fn(...args, (err, result) => 
      err ? reject(err) : resolve(result)
    )
  );

// Обертки для совместимости
const readFile = fs.readFile;
const writeFile = fs.writeFile;

// Конфигурация путей и алиасов
const CONFIG = {
  // Расширения файлов для обработки
  extensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  
  // Директории для обработки
  sourceDirs: [
    'app/frontend',
    'app/backend',
    'shared',
    'tests',
    'scripts'
  ],
  
  // Игнорируемые директории
  ignoreDirs: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/.cache/**',
    '**/coverage/**',
    '**/logs/**',
    '**/public/**',
    '**/.git/**',
    '**/.idea/**',
    '**/.vscode/**'
  ],
  
  // Сопоставление старых путей с новыми алиасами
  pathMappings: [
    // Пример: { from: '^src/(.*)', to: '@/$1' },
    { from: '^@/components/(.*)', to: '@components/$1' },
    { from: '^@/pages/(.*)', to: '@pages/$1' },
    { from: '^@/assets/(.*)', to: '@assets/$1' },
    { from: '^@/styles/(.*)', to: '@styles/$1' },
    { from: '^@/utils/(.*)', to: '@utils/$1' },
    { from: '^@/hooks/(.*)', to: '@hooks/$1' },
    { from: '^@/lib/(.*)', to: '@lib/$1' },
    { from: '^@/api/(.*)', to: '@api/$1' },
    { from: '^@/config/(.*)', to: '@config/$1' },
    { from: '^@/tests/(.*)', to: '@tests/$1' },
    // Добавьте другие маппинги по необходимости
  ]
};

// Регулярные выражения для поиска импортов
const IMPORT_REGEX = /(?:import|from|require\s*\()\s*['"]([^'"]+)['"]/g;
const FROM_IMPORT_REGEX = /from\s+['"]([^'"]+)['"]/g;

/**
 * Проверяет, является ли путь относительным
 */
function isRelativePath(path) {
  return path.startsWith('./') || path.startsWith('../') || path === '.' || path === '..';
}

/**
 * Преобразует путь в соответствии с новыми алиасами
 */
function mapPath(filePath) {
  // Если путь относительный, оставляем как есть
  if (isRelativePath(filePath)) {
    return filePath;
  }
  
  // Применяем маппинг путей
  for (const mapping of CONFIG.pathMappings) {
    const regex = new RegExp(mapping.from);
    if (regex.test(filePath)) {
      return filePath.replace(regex, mapping.to);
    }
  }
  
  return filePath;
}

/**
 * Обрабатывает содержимое файла, обновляя импорты
 */
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let updated = false;
    
    // Функция для замены путей в строках импорта/экспорта
    const updateImports = (match, p1, offset, string) => {
      const newPath = mapPath(p1);
      if (newPath !== p1) {
        updated = true;
        return match.replace(p1, newPath);
      }
      return match;
    };
    
    // Обновляем импорты/экспорты
    let newContent = content
      .replace(IMPORT_REGEX, updateImports)
      .replace(FROM_IMPORT_REGEX, updateImports);
    
    // Если были изменения, сохраняем файл
    if (updated) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`✅ Обновлены импорты в: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Ошибка при обработке файла ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Основная функция
 */
async function main() {
  try {
    console.log('🔄 Начало обновления импортов...');
    
    // Получаем список всех файлов для обработки
    const patterns = CONFIG.sourceDirs.map(dir => `${dir}/**/*.{${CONFIG.extensions.join(',')}}`);
    
    // Используем glob в ESM режиме
    const files = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, { 
        ignore: CONFIG.ignoreDirs, 
        nodir: true,
        absolute: true
      });
      files.push(...matches);
    }
    
    console.log(`🔍 Найдено ${files.length} файлов для обработки`);
    
    // Обрабатываем каждый файл
    let updatedCount = 0;
    for (const file of files) {
      const wasUpdated = await processFile(path.resolve(file));
      if (wasUpdated) updatedCount++;
    }
    
    console.log(`\n✅ Обновление завершено!`);
    console.log(`   Всего обработано: ${files.length} файлов`);
    console.log(`   Обновлено: ${updatedCount} файлов`);
    console.log('\n💡 Рекомендуется запустить тесты и проверить работоспособность приложения.\n');
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
main();
