const fs = require('fs');
const path = require('path');

// Adjust this if your route files are elsewhere
const ROUTES_DIR = path.resolve(__dirname, '../../api/v1/routes');
const extensions = ['.js', '.ts'];

// Heuristics for bad route definitions
function isSuspicious(line) {
    return (
        /https?:\/\//.test(line) ||                          // Full URL
        /router\.(get|post|put|delete)\(\s*['"]https?:/.test(line) || // router.get("https://...")
        /\/::/.test(line) ||                                 // Double colon
        /\/:($|\W)/.test(line)                               // Incomplete named parameter
    );
}

// Reads and scans a single file
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

// Recursively walks a directory and scans .js/.ts files
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

// Run the scanner
console.log(`\n🔍 Проверяю маршруты в директории: ${ROUTES_DIR}`);
walkDir(ROUTES_DIR);
console.log('\n✅ Проверка маршрутов завершена!\n');
