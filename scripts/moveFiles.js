const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

async function moveFile(source, target) {
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(source, target);
  await unlink(source);
  console.log(`Moved: ${source} -> ${target}`);
}

async function moveFiles() {
  const sourceDir = path.join(__dirname, '../app/web/src/components/Layout');
  const targetDir = path.join(__dirname, '../app/web/src/components/layout');
  
  try {
    // Создаем целевую директорию, если она не существует
    await mkdir(targetDir, { recursive: true });
    
    // Получаем список файлов и папок в исходной директории
    const files = await readdir(sourceDir);
    
    // Перемещаем каждый файл/папку
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      const stats = await stat(sourcePath);
      
      if (stats.isDirectory()) {
        // Рекурсивно перемещаем подпапки
        await moveFilesRecursive(sourcePath, targetPath);
        // Удаляем пустую исходную папку
        await rmdir(sourcePath);
      } else {
        // Перемещаем файл
        await moveFile(sourcePath, targetPath);
      }
    }
    
    // Удаляем исходную папку, если она пуста
    try {
      await rmdir(sourceDir);
    } catch (err) {
      console.warn(`Не удалось удалить исходную папку: ${sourceDir}. Возможно, она не пуста.`);
    }
    
    console.log('Все файлы успешно перемещены!');
  } catch (err) {
    console.error('Ошибка при перемещении файлов:', err);
  }
}

async function moveFilesRecursive(source, target) {
  await mkdir(target, { recursive: true });
  const files = await readdir(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    const stats = await stat(sourcePath);
    
    if (stats.isDirectory()) {
      await moveFilesRecursive(sourcePath, targetPath);
      await rmdir(sourcePath);
    } else {
      await moveFile(sourcePath, targetPath);
    }
  }
}

// Запускаем скрипт
moveFiles().catch(console.error);
