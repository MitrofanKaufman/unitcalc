// filename: fix-imports-alias.js
// Запуск: node fix-imports-alias.js

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Заменяем относительные импорты вида ../../ или ../ на алиас @/
  content = content.replace(
    /from\s+['"](\.\.\/)+/g,
    match => match.replace(/(\.\.\/)+/, '@/')
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      processFile(fullPath);
    }
  });
}

walkDir(appDir);
console.log('All imports fixed!');
