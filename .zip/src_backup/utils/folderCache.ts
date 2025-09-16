// path: src/core/utils/folderCache.ts
import fs from "fs";
import path from "path";

let cache: string | null = null;

function generateStructure(dir: string, prefix = ""): string {
  let result = "";
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      result += `${prefix}📁 ${file}/\n`;
      result += generateStructure(fullPath, prefix + "  ");
    } else {
      result += `${prefix}📄 ${file}\n`;
    }
  }
  return result;
}

export function getCachedStructure(dir = "src/pages"): string {
  if (!cache) {
    console.log("🧠 Кеш пуст. Генерируем структуру...");
    cache = generateStructure(dir);
  } else {
    console.log("📦 Структура загружена из кеша.");
  }
  return cache;
}
