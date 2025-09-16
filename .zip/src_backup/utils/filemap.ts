// path: src/core/utils/filemap.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM: Получение __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Абсолютный путь к корню проекта
const rootDir = path.resolve(__dirname, "../../../");

// Относительный путь от корня
function getAllRelativePaths(
  baseDir: string,
  ignoreDirs: string[] = ["node_modules", ".git", "dist"]
): string[] {
  const result: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (ignoreDirs.includes(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);
      result.push(relativePath);

      if (entry.isDirectory()) {
        walk(fullPath);
      }
    }
  }

  walk(baseDir);
  return result;
}

// Получаем все относительные пути
const paths = getAllRelativePaths(rootDir);

// Путь к файлу вывода
const outputFilePath = path.join(rootDir, "filemap.txt");

// Сохраняем в файл
fs.writeFileSync(outputFilePath, paths.join("\n"), "utf-8");

console.log(`✅ ${paths.length} путей сохранено в: ${outputFilePath}`);
