#!/usr/bin/env node
// path: src/api/v1/functions/WBPvzFetcher.js
// ──────────────────────────────────────────────────────────────
// Класс для загрузки списка ПВЗ (пунктов выдачи заказов) Wildberries
// + CLI-запуск при непосредственном вызове
// ──────────────────────────────────────────────────────────────

import axios from 'axios';
import fs    from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default class WBPvzFetcher {
  /**
   * @param {object} [opts]
   * @param {string} [opts.token] — JWT Wildberries (необязательно)
   */
  constructor(opts = {}) {
    this.token = opts.token || process.env.WB_TOKEN || '';
    this.http  = axios.create({
      baseURL: 'https://www.wildberries.ru',
      timeout: 15_000,
      headers: this.token
        ? { Authorization: `Bearer ${this.token}` }
        : {}
    });
  }

  /**
   * Загружает полный список ПВЗ и сохраняет его в json-файл.
   * @returns {Promise<boolean>}
   */
  async fetchPvzList() {
    const url = '/webapi/spa/modules/pickups';
    const res = await this.http.get(url, {
      headers: { 'x-requested-with': 'XMLHttpRequest' }
    });

    if (res.status !== 200) {
      throw new Error(`Ошибка загрузки списка ПВЗ: HTTP ${res.status}`);
    }

    const data = res.data;
    const outDir = path.resolve(__dirname, '../json');
    fs.mkdirSync(outDir, { recursive: true });

    const fileName = 'pvz_list.json';
    fs.writeFileSync(
      path.join(outDir, fileName),
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    console.log(`💾 Список ПВЗ (${fileName}) сохранён`);
    return true;
  }
}

// ───────────────────────── CLI-запуск ───────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    try {
      const fetcher = new WBPvzFetcher();
      await fetcher.fetchPvzList();
      console.log('✅ ПВЗ успешно загружены');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  })();
}
