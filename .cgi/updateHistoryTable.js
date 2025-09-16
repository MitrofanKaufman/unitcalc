#!/usr/bin/env node
/**
 * updateHistoryTable.js
 * 
 * Читает все JSON-файлы в `.log/history/`, генерирует Markdown-страницу
 * `README_HISTORY.md` c HTML-таблицей, которую можно сортировать и фильтровать.
 */

import fs from 'node:fs';
import path from 'node:path';

const LOG_DIR = path.resolve('.log', 'history');
const OUTPUT = path.resolve('README_HISTORY.md');

function readLogs() {
  if (!fs.existsSync(LOG_DIR)) return [];
  return fs
    .readdirSync(LOG_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(LOG_DIR, f), 'utf8'));
      return { ...data, file: f };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildTable(rows) {
  const header = `| Дата | Описание | Файл |\n|---|---|---|`;
  const body = rows
    .map((r) => {
      const fileLink = `${LOG_DIR.replace(/\\/g, '/')}/${r.file}`;
      return `| ${new Date(r.date).toLocaleString('ru-RU')} | ${r.task} | [${r.file}](${fileLink}) |`;
    })
    .join('\n');
  return `${header}\n${body}`;
}

function buildPage(rows) {
  const tableMd = buildTable(rows);
  return `<!-- Автогенерируется, редактировать не нужно -->
# История изменений проекта

> Файлы JSON в директории .log/history

<input type="text" id="searchInput" placeholder="Поиск..." style="margin-bottom:10px; padding:4px; width:250px;" />

<table id="historyTable" class="sortable">
${tableMd}
</table>

<script>
// Простая фильтрация таблицы
const input = document.getElementById('searchInput');
input.addEventListener('input', () => {
  const filter = input.value.toLowerCase();
  document.querySelectorAll('#historyTable tbody tr').forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(filter) ? '' : 'none';
  });
});
// Сортировка (lite)
function sortTable(n) {
  const table = document.getElementById('historyTable');
  let switching = true, dir = 'asc', switchcount = 0;
  while (switching) {
    switching = false;
    const rows = table.rows;
    for (let i = 1; i < rows.length - 1; i++) {
      let shouldSwitch = false;
      let x = rows[i].cells[n];
      let y = rows[i + 1].cells[n];
      if (dir === 'asc' ? x.textContent > y.textContent : x.textContent < y.textContent) {
        shouldSwitch = true;
        break;
      }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else if (switchcount === 0 && dir === 'asc') {
      dir = 'desc';
      switching = true;
    }
   }
  }
}
document.querySelectorAll('#historyTable thead th').forEach((th, idx) => th.addEventListener('click', () => sortTable(idx)));
</script>
`; // end template
}

function main() {
  const rows = readLogs();
  const content = buildPage(rows);
  fs.writeFileSync(OUTPUT, content, 'utf8');
  console.log(`History table updated: ${OUTPUT}`);
}

main();
