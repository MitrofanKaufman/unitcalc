#!/usr/bin/env node

/**
 * Скрипт для автоматизированного анализа файлов проекта
 * Извлекает функции, классы, интерфейсы и экспорты из TypeScript/JavaScript файлов
 */

const fs = require('fs');
const path = require('path');

// Функция для чтения файла
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error.message);
    return null;
  }
}

// Функция для анализа содержимого файла
function analyzeFile(filePath, content) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(process.cwd(), filePath);

  const analysis = {
    file: relativePath,
    functions: [],
    classes: [],
    interfaces: [],
    exports: [],
    imports: []
  };

  // Регулярные выражения для поиска различных элементов
  const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)|\b(\w+)\s*:\s*(?:\([^)]*\)|[^=]*)\s*=>|(?:export\s+)?const\s+(\w+)\s*=/g;
  const classRegex = /(?:export\s+)?class\s+(\w+)/g;
  const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/g;
  const exportRegex = /export\s+(?:const\s+)?(\w+)/g;
  const importRegex = /import\s+.*?from\s+['"](.+?)['"]/g;

  // Поиск функций
  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    const funcName = match[1] || match[2] || match[3];
    if (funcName && !['React', 'useState', 'useEffect'].includes(funcName)) {
      analysis.functions.push(funcName);
    }
  }

  // Поиск классов
  while ((match = classRegex.exec(content)) !== null) {
    analysis.classes.push(match[1]);
  }

  // Поиск интерфейсов
  while ((match = interfaceRegex.exec(content)) !== null) {
    analysis.interfaces.push(match[1]);
  }

  // Поиск экспортов
  while ((match = exportRegex.exec(content)) !== null) {
    if (match[1] && match[1] !== 'default') {
      analysis.exports.push(match[1]);
    }
  }

  // Поиск импортов
  while ((match = importRegex.exec(content)) !== null) {
    analysis.imports.push(match[1]);
  }

  return analysis;
}

// Функция для обработки директории рекурсивно
function processDirectory(dirPath) {
  const results = [];

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('dist')) {
        // Рекурсивно обрабатываем поддиректории
        results.push(...processDirectory(fullPath));
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
        // Обрабатываем файлы
        const content = readFile(fullPath);
        if (content) {
          const analysis = analyzeFile(fullPath, content);
          if (analysis.functions.length > 0 || analysis.classes.length > 0 || analysis.interfaces.length > 0) {
            results.push(analysis);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Ошибка обработки директории ${dirPath}:`, error.message);
  }

  return results;
}

// Основная функция
function main() {
  const projectRoot = process.cwd();
  const appDir = path.join(projectRoot, 'app');

  console.log('🚀 Начинаем анализ файлов проекта...\n');

  const results = processDirectory(appDir);

  // Сохраняем результаты в JSON файл для дальнейшей обработки
  const outputPath = path.join(projectRoot, 'analysis_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`✅ Анализ завершен! Найдено ${results.length} файлов с кодом.`);
  console.log(`📊 Результаты сохранены в: ${outputPath}`);

  // Выводим краткую статистику
  const totalFunctions = results.reduce((sum, file) => sum + file.functions.length, 0);
  const totalClasses = results.reduce((sum, file) => sum + file.classes.length, 0);
  const totalInterfaces = results.reduce((sum, file) => sum + file.interfaces.length, 0);

  console.log(`\n📈 Статистика:`);
  console.log(`   Функций: ${totalFunctions}`);
  console.log(`   Классов: ${totalClasses}`);
  console.log(`   Интерфейсов: ${totalInterfaces}`);
}

// Запускаем анализ
main();
