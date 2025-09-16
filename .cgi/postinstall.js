#!/usr/bin/env node
/**
 * Скрипт для выполнения задач после установки зависимостей
 * Автоматически создает необходимые директории и файлы
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Функция для создания директории, если она не существует
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Создана директория: ${dirPath}`);
  }
}

// Функция для копирования файла, если он не существует
function copyFileIfNotExists(source, target) {
  if (!fs.existsSync(target)) {
    fs.copyFileSync(source, target);
    console.log(`Создан файл: ${target}`);
  }
}

// Основная функция
async function main() {
  try {
    console.log('\n🔧 Выполнение postinstall скрипта...');

    // Создаем необходимые директории
    const requiredDirs = [
      'app/frontend/public',
      'app/backend/uploads',
      'logs',
      'config',
      'dev',
      'shared',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
    ];

    requiredDirs.forEach(dir => {
      ensureDirectoryExists(path.resolve(__dirname, '..', dir));
    });

    // Копируем примеры конфигурационных файлов, если их нет
    const configFiles = [
      { source: 'config/.env.example', target: '.env' },
      { source: 'config/.env.development.example', target: '.env.development' },
      { source: 'config/.env.production.example', target: '.env.production' },
    ];

    configFiles.forEach(({ source, target }) => {
      const sourcePath = path.resolve(__dirname, '..', source);
      const targetPath = path.resolve(__dirname, '..', target);
      
      if (fs.existsSync(sourcePath)) {
        copyFileIfNotExists(sourcePath, targetPath);
      }
    });

    // Устанавливаем хуки Git, если не установлены
    if (!fs.existsSync(path.resolve(__dirname, '..', '.git', 'hooks'))) {
      try {
        execSync('npx husky install', { stdio: 'inherit' });
        console.log('✅ Git хуки успешно установлены');
      } catch (error) {
        console.warn('⚠️ Не удалось установить Git хуки. Убедитесь, что Git инициализирован.');
      }
    }

    console.log('✅ Postinstall скрипт успешно выполнен\n');
  } catch (error) {
    console.error('❌ Ошибка при выполнении postinstall скрипта:', error);
    process.exit(1);
  }
}

// Запускаем основной процесс
main();
