// path: src/core/utils/scan-invalid-routes.js (ESM compatible)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_DIR = path.resolve(__dirname, '../../api/');
const extensions = ['.js', '.ts'];

function isSuspicious(line) {
    return (
        /https?:\/\//.test(line) ||
        /router\.(get|post|put|delete)\(\s*['"]https?:/.test(line) ||
        /\/::/.test(line) ||
        /\/:($|\W)/.test(line)
    );
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, i) => {
        if (isSuspicious(line)) {
            console.log(`\n[!] Подозрительный маршрут в ${filePath} в строке ${i + 1}:`);
            console.log(`    ${line.trim()}`);
        }
    });
}

function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath);
        } else if (extensions.includes(path.extname(entry.name))) {
            scanFile(fullPath);
        }
    }
}

console.log(`\n🔍 Проверяю маршруты в директории: ${ROUTES_DIR}`);
walkDir(ROUTES_DIR);
console.log('\n✅ Проверка маршрутов завершена!\n');
