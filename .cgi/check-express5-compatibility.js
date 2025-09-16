#!/usr/bin/env node
/**
 * Скрипт для проверки совместимости с Express 5
 * Проверяет:
 * - Использование устаревших паттернов маршрутов
 * - Неименованные параметры в маршрутах
 * - Некорректные регулярные выражения
 * - Устаревшие middleware и методы
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Конфигурация
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'src');
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', 'coverage'];
const FILE_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];

// Паттерны для поиска потенциальных проблем
const PATTERNS = {
  // Проверка на использование устаревших паттернов маршрутов
  CATCH_ALL: /\.(get|post|put|delete|all|use)\s*\(\s*['"](\*|\/\*)[^\/]/,
  
  // Проверка на неименованные параметры
  UNNAMED_PARAMS: /\.(get|post|put|delete|all|use)\s*\([^)]*['"]\/(:)[^\/\s'"]/,
  
  // Проверка на устаревшие middleware
  DEPRECATED_MIDDLEWARE: /\.(bodyParser|urlencoded|json|multipart)\(/,
  
  // Проверка на использование устаревших методов
  DEPRECATED_METHODS: /\.(param|app\.param|app\.del|app\.all)\s*\(/,
  
  // Проверка на использование устаревшего синтаксиса маршрутов
  LEGACY_ROUTE_SYNTAX: /\/\*\*\//
};

// Функция для рекурсивного поиска файлов
async function findFiles(dir, fileList = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        await findFiles(fullPath, fileList);
      }
    } else if (FILE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      fileList.push(fullPath);
    }
  }
  
  return fileList;
}

// Функция для проверки файла на проблемы совместимости
async function checkFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  const issues = [];
  let lineNumber = 0;

  // Разбиваем файл на строки и проверяем каждую
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    lineNumber = i + 1;
    const line = lines[i];
    
    // Пропускаем комментарии
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      continue;
    }
    
    // Проверяем все паттерны
    for (const [type, pattern] of Object.entries(PATTERNS)) {
      if (pattern.test(line)) {
        issues.push({
          type,
          line: lineNumber,
          code: line.trim(),
          file: relativePath
        });
      }
    }
  }
  
  return issues;
}

// Функция для форматирования отчета
function formatReport(issues) {
  if (issues.length === 0) {
    console.log('✅ Поздравляем! Проблем совместимости с Express 5 не обнаружено.');
    return;
  }
  
  console.log('\n🔍 Найдены потенциальные проблемы совместимости с Express 5:\n');
  
  // Группируем проблемы по файлам
  const issuesByFile = issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {});
  
  // Выводим отчет
  for (const [file, fileIssues] of Object.entries(issuesByFile)) {
    console.log(`📄 ${file}:`);
    
    for (const issue of fileIssues) {
      let message = '';
      
      switch(issue.type) {
        case 'CATCH_ALL':
          message = 'Использован устаревший catch-all маршрут (*) - замените на именованный параметр (например, /*splat) или конкретные маршруты';
          break;
        case 'UNNAMED_PARAMS':
          message = 'Найден неименованный параметр маршрута - в Express 5 все параметры должны быть именованными (например, /:id)';
          break;
        case 'DEPRECATED_MIDDLEWARE':
          message = 'Обнаружено использование устаревшего middleware - используйте express.json() и express.urlencoded()';
          break;
        case 'DEPRECATED_METHODS':
          message = 'Обнаружен устаревший метод - обновите код в соответствии с документацией Express 5';
          break;
        case 'LEGACY_ROUTE_SYNTAX':
          message = 'Обнаружен устаревший синтаксис маршрутов - обновите в соответствии с документацией Express 5';
          break;
        default:
          message = 'Потенциальная проблема совместимости';
      }
      
      console.log(`   • Строка ${issue.line}: ${message}`);
      console.log(`     ${issue.code}\n`);
    }
    
    console.log('');
  }
  
  console.log('ℹ️  Рекомендации по исправлению:');
  console.log('   • Замените catch-all маршруты (*) на именованные параметры (например, /*splat)');
  console.log('   • Убедитесь, что все параметры маршрутов имеют имена (например, /:id вместо /:)');
  console.log('   • Обновите устаревшие middleware (bodyParser → express.json/express.urlencoded)');
  console.log('   • Проверьте документацию Express 5 для обновления устаревших методов');
  console.log('   • Протестируйте все маршруты после внесения изменений\n');
  
  process.exit(1);
}

// Основная функция
async function main() {
  try {
    console.log('🔍 Поиск файлов для проверки...');
    const files = await findFiles(SOURCE_DIR);
    console.log(`Найдено ${files.length} файлов для проверки`);
    
    console.log('\n🔄 Проверка совместимости с Express 5...');
    let allIssues = [];
    
    for (const file of files) {
      const issues = await checkFile(file);
      allIssues = [...allIssues, ...issues];
      process.stdout.write('.');
    }
    
    console.log('\n\n✅ Проверка завершена');
    formatReport(allIssues);
    
  } catch (error) {
    console.error('\n❌ Ошибка при проверке совместимости:');
    console.error(error);
    process.exit(1);
  }
}

// Запускаем проверку
main();
