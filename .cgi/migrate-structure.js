#!/usr/bin/env node

/**
 * Скрипт для миграции с исходной структуры на новую
 * Переносит файлы из src/ в новую структуру с app/, server/, shared/ и т.д.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Пути к директориям
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const OLD_DIR = path.join(ROOT, '.old-structure');

// Сопоставление старых путей с новыми
const MAPPING = {
  // Клиентская часть
  'assets': 'app/assets',
  'components': 'app/components',
  'pages': 'app/pages',
  'hooks': 'app/hooks',
  'styles': 'app/styles',
  'utils': 'app/utils',
  
  // Общие ресурсы
  'types': 'shared/types',
  'constants': 'shared/constants',
  'lib': 'shared/lib',
  
  // Серверная часть
  'api': 'server/api',
  'controllers': 'server/controllers',
  'middleware': 'server/middleware',
  'models': 'server/models',
  'routes': 'server/routes',
  'services': 'server/services',
  'db': 'server/db',
  
  // Конфигурация
  'config': 'config/app'
};

// Функция для безопасного копирования файлов
async function migrateFiles() {
  console.log('🚀 Начало миграции файлов...');
  
  // Создаем резервную копию старой структуры
  if (!fs.existsSync(OLD_DIR)) {
    console.log(`🔧 Создаем резервную копию старой структуры в ${OLD_DIR}`);
    await fs.copy(SRC_DIR, OLD_DIR);
  }
  
  // Копируем файлы в соответствии с маппингом
  for (const [src, dest] of Object.entries(MAPPING)) {
    const srcPath = path.join(SRC_DIR, src);
    const destPath = path.join(ROOT, dest);
    
    if (fs.existsSync(srcPath)) {
      console.log(`📁 Копируем ${src} -> ${dest}`);
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(srcPath, destPath, { overwrite: true });
    }
  }
  
  // Копируем корневые файлы
  const rootFiles = ['App.tsx', 'main.tsx', 'index.css', 'vite-env.d.ts'];
  for (const file of rootFiles) {
    const srcPath = path.join(SRC_DIR, file);
    if (fs.existsSync(srcPath)) {
      console.log(`📄 Копируем корневой файл ${file} -> app/`);
      await fs.copy(srcPath, path.join(ROOT, 'app', file));
    }
  }
  
  console.log('✅ Миграция файлов завершена!');
}

// Функция для обновления импортов в файлах
async function updateImports() {
  console.log('🔄 Обновление импортов...');
  
  // Обновляем алиасы в соответствии с новой структурой
  const importMappings = {
    // Заменяем старые алиасы на новые
    "from 'src/": "from '@/",
    "from '~/": "from '@/"
  };
  
  // Проходим по всем файлам в новой структуре
  const files = await glob('**/*.{ts,tsx,js,jsx}', { cwd: ROOT, ignore: ['node_modules/**', 'dist/**'] });
  
  for (const file of files) {
    const filePath = path.join(ROOT, file);
    let content = await fs.readFile(filePath, 'utf-8');
    let updated = false;
    
    // Применяем замены
    for (const [from, to] of Object.entries(importMappings)) {
      if (content.includes(from)) {
        content = content.replace(new RegExp(from, 'g'), to);
        updated = true;
      }
    }
    
    // Сохраняем изменения, если они были
    if (updated) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`   Обновлены импорты в ${file}`);
    }
  }
  
  console.log('✅ Импорты обновлены!');
}

// Функция для поиска файлов по шаблону
function glob(pattern, options = {}) {
  return new Promise((resolve, reject) => {
    const glob = require('glob');
    glob(pattern, options, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

// Основная функция
async function main() {
  try {
    console.log('🔄 Начало миграции проекта на новую структуру...');
    
    // 1. Копируем файлы
    await migrateFiles();
    
    // 2. Обновляем импорты
    await updateImports();
    
    console.log('\n🎉 Миграция успешно завершена!');
    console.log('💡 Не забудьте проверить изменения и закоммитить их в систему контроля версий.');
    console.log('   Старая структура сохранена в .old-structure/');
    
  } catch (error) {
    console.error('❌ Ошибка при миграции:', error);
    process.exit(1);
  }
}

// Запускаем миграцию
main();
