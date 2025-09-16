// path: scripts/update-imports.ts
// Скрипт для автоматического обновления импортов в проекте

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

// Маппинг старых путей на новые алиасы
const pathMappings = [
  { 
    // Обновление импортов из папки components
    pattern: /from ['"](?:\.\.\/)+components\/([^'"]+)['"]/g,
    replacement: "from '@components/$1'"
  },
  { 
    // Обновление импортов из папки pages
    pattern: /from ['"](?:\.\.\/)+pages\/([^'"]+)['"]/g,
    replacement: "from '@pages/$1'"
  },
  { 
    // Обновление импортов из папки utils
    pattern: /from ['"](?:\.\.\/)+utils\/([^'"]+)['"]/g,
    replacement: "from '@utils/$1'"
  },
  { 
    // Обновление импортов из папки hooks
    pattern: /from ['"](?:\.\.\/)+hooks\/([^'"]+)['"]/g,
    replacement: "from '@hooks/$1'"
  },
  { 
    // Обновление импортов из папки config
    pattern: /from ['"](?:\.\.\/)+config\/([^'"]+)['"]/g,
    replacement: "from '@config/$1'"
  },
  { 
    // Обновление импортов из папки db
    pattern: /from ['"](?:\.\.\/)+db\/([^'"]+)['"]/g,
    replacement: "from '@db/$1'"
  },
  { 
    // Обновление импортов из папки types
    pattern: /from ['"](?:\.\.\/)+types\/([^'"]+)['"]/g,
    replacement: "from '@types/$1'"
  },
  { 
    // Обновление импортов из папки assets
    pattern: /from ['"](?:\.\.\/)+assets\/([^'"]+)['"]/g,
    replacement: "from '@assets/$1'"
  },
  { 
    // Обновление импортов из папки api
    pattern: /from ['"](?:\.\.\/)+api\/([^'"]+)['"]/g,
    replacement: "from '@api/$1'"
  },
  { 
    // Обновление импортов из папки core
    pattern: /from ['"](?:\.\.\/)+core\/([^'"]+)['"]/g,
    replacement: "from '@core/$1'"
  }
];

// Функция для обновления импортов в файле
async function updateImportsInFile(filePath: string) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let updated = false;

    // Применяем все замены
    for (const { pattern, replacement } of pathMappings) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        updated = true;
        content = newContent;
      }
    }

    // Если были изменения, сохраняем файл
    if (updated) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`✅ Обновлены импорты в файле: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Ошибка при обновлении файла ${filePath}:`, error);
    return false;
  }
}

// Основная функция
async function main() {
  try {
    // Находим все TS/TSX файлы в проекте
    const files = await glob('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/dist/**'] });
    
    console.log(`🔍 Найдено ${files.length} файлов для проверки...`);
    
    let updatedFiles = 0;
    
    // Обновляем импорты в каждом файле
    for (const file of files) {
      const filePath = path.resolve(process.cwd(), file);
      const wasUpdated = await updateImportsInFile(filePath);
      if (wasUpdated) updatedFiles++;
    }
    
    console.log('\n🎉 Готово!');
    console.log(`📊 Обновлено файлов: ${updatedFiles} из ${files.length}`);
    
  } catch (error) {
    console.error('❌ Произошла ошибка:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
main();
