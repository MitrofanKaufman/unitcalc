#!/usr/bin/env node
/**
 * historyLogger.js
 * 
 * Скрипт создаёт JSON-файлы-записи об изменениях в проекте, когда в plan.md
 * отмечается выполненная задача (чекбокс `[x]`). Записи помещаются в
 * директорию `.log/history/`.
 * 
 * Алгоритм:
 * 1. Получаем git-diff (index → HEAD) для `plan.md`.
 * 2. Находим строки, где добавилась отметка `- [x]` (плюс в диффе).
 * 3. Для каждой такой строки формируем объект `{ date, task, hash }`.
 * 4. Сохраняем в файл `.log/history/<ISO>_<hash>.json`.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function main() {
  let diff;
  try {
    diff = run('git diff --cached --unified=0 -- plan.md');
  } catch {
    return; // план не изменялся
  }

  const completedTasks = diff
    .split(/\r?\n/)
    .filter((l) => l.startsWith('+') && /- \[x\]/i.test(l))
    .map((l) => l.replace(/^\+\s*- \[x\]\s*/i, '').trim());

  if (completedTasks.length === 0) return;

  const logDir = path.resolve('.log', 'history');
  fs.mkdirSync(logDir, { recursive: true });

  const hash = run('git rev-parse --short HEAD');
  const dateISO = new Date().toISOString();

  completedTasks.forEach((task) => {
    const record = { date: dateISO, task, hash };
    const filename = `${dateISO.replace(/[:.]/g, '-')}_${hash}.json`;
    const filePath = path.join(logDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');
    console.log(`History log saved: ${filePath}`);
  });
}

main();
