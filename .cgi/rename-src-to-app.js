import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { readdir, stat, rename, readFile, writeFile } = fs;

// Функция для рекурсивного обхода файлов
async function processDirectory(directory) {
  if (!fs.access(directory).then(() => true).catch(() => false)) {
    console.log(`Directory does not exist: ${directory}`);
    return;
  }
  const files = await readdir(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      await processDirectory(filePath); // Рекурсивно обрабатываем подкаталоги
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.scss')) {
      await updateFileImports(filePath);
    }
  }
}

// Функция для обновления импортов в файле
async function updateFileImports(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    
    // Обновляем импорты с @/src/ на @/app/
    content = content.replace(/@\/src\//g, '@/');
    
    // Обновляем относительные импорты, начинающиеся с src/
    content = content.replace(/(from\s+['"])src\//g, '$1app/');
    
    // Обновляем импорты с @/components/ на @/app/components/
    content = content.replace(/@\/components\//g, '@/components/');
    
    // Обновляем импорты с @/pages/ на @/app/pages/
    content = content.replace(/@\/pages\//g, '@/pages/');
    
    // Записываем обновленное содержимое обратно в файл
    await writeFile(filePath, content, 'utf8');
    console.log(`Updated imports in: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Функция для проверки существования директории
async function directoryExists(path) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

// Основная функция
async function main() {
  try {
    // Пути к папкам
    const basePath = path.join(__dirname, '..');
    const srcPath = path.join(basePath, 'src');
    const appPath = path.join(basePath, 'app');
    
    // Проверяем, существует ли папка src
    const srcExists = await directoryExists(srcPath);
    const appExists = await directoryExists(appPath);
    
    if (srcExists) {
      if (appExists) {
        console.log('Both src and app directories exist. Please remove one of them.');
        return;
      }
      
      // Переименовываем папку
      console.log(`Renaming ${srcPath} to ${appPath}...`);
      await rename(srcPath, appPath);
      console.log('Directory renamed successfully!');
      
      // Обновляем импорты во всех файлах
      console.log('Updating imports in files...');
      await processDirectory(appPath);
      
      console.log('All imports have been updated successfully!');
    } else if (appExists) {
      console.log('app directory already exists. Updating imports...');
      await processDirectory(appPath);
      console.log('All imports have been updated successfully!');
    } else {
      console.log('Neither src nor app directory exists. Nothing to do.');
    }
  } catch (error) {
    console.error('Error during directory renaming:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
