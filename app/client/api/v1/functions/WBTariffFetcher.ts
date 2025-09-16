// path: src/api/v1/functions/WBTariffFetcher.js
// ──────────────────────────────────────────────────────────────
// Загрузка справочников тарифов WB (commission, box, pallet, return)
// Требуется токен с категорией “Tariffs”
// ──────────────────────────────────────────────────────────────

import dotenv from 'dotenv';
import axios  from 'axios';
import fs     from 'fs';
import path   from 'path';
import { fileURLToPath } from 'url';

/* опционально подключаем async-retry */
let retry;
try { retry = (await import('async-retry')).default; }
catch { retry = null; }          // если пакета нет — будет базовый повтор

dotenv.config();

/* текущий каталог */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* Сегодня YYYY-MM-DD */
const today = () => new Date().toISOString().slice(0, 10);

/* карты настроек для каждого энд-пойнта  ----------------------------------- */
const ENDPOINTS = {
  commission: {
    url: '/api/v1/tariffs/commission',
    file: locale => `commission_${locale}.json`,
    query: ({ locale }) => ({ locale })
  },
  box: {
    url: '/api/v1/tariffs/box',
    file: () => 'tariffs_box.json',
    query: () => ({ date: today() })
  },
  pallet: {
    url: '/api/v1/tariffs/pallet',
    file: () => 'tariffs_pallet.json',
    query: () => ({ date: today() })
  },
  return: {
    url: '/api/v1/tariffs/return',
    file: () => 'tariffs_return.json',
    query: () => ({ date: today() })
  }
};

/* ───────────────────────── JWT decoder без зависимостей ─────────────────── */
function decodeJwt(token) {
  const [, payload] = token.split('.');
  if (!payload) throw new Error('Некорректный JWT-токен');
  /* base64url → json */
  const json = Buffer.from(payload, 'base64url').toString('utf8');
  return JSON.parse(json);
}

/* ────────────────────────────── КЛАСС ───────────────────────────────────── */
export default class WBTariffFetcher {
  /**
   * Русские названия для каждого типа тарифа
   */
  static NAMES_RU = {
    commission: 'комиссий',
    box:        'хранения по типу "короб"',
    pallet:     'хранения по типу "паллет"',
    return:     'на возврат'
  };

  /**
   * @param {string} token JWT Wildberries (по умолчанию из process.env.WB_TOKEN)
   */
  constructor(token = process.env.WB_TOKEN) {
    if (!token) throw new Error('⛔ В .env отсутствует WB_TOKEN');

    this.token = token;
    this.base  = 'https://common-api.wildberries.ru';

    /* axios с авторизацией */
    this.http = axios.create({
      baseURL: this.base,
      headers: { Authorization: `Bearer ${this.token}` },
      timeout: 15_000
    });
  }

  /* ───────────── проверка токена: срок + доступ к Tariffs ───────────────── */
  async verifyToken() {
    const { exp } = decodeJwt(this.token);
    if (exp && exp < Date.now() / 1000) {
      throw new Error('⛔ Срок действия токена истёк');
    }
    /* commission гарантирует категорию Tariffs */
    await this._safeGet(ENDPOINTS.commission.url, { params: { locale: 'ru' } });
    console.log('✅ Токен действителен и имеет доступ к Tariffs');
    return true;
  }

  /* ───────────────────────── запрос с повтором ──────────────────────────── */
  async _safeGet(url, cfg) {
    const doRequest = () => this.http.get(url, cfg);

    if (retry) {
      return retry(async (bail) => {
        try {
          return await doRequest();
        } catch (err) {
          const st = err.response?.status;
          if (st === 401) bail(new Error('⛔ 401 Unauthorized — проверьте категорию Tariffs'));
          if (st !== 429) throw err;
          throw err;
        }
      }, { retries: 3, minTimeout: 1000 });
    } else {
      for (let attempt = 0; attempt < 3; attempt++) {
        try { return await doRequest(); }
        catch (err) {
          const st = err.response?.status;
          if (st === 401) throw new Error('⛔ 401 Unauthorized — проверьте категорию Tariffs');
          if (st !== 429 || attempt === 2) throw err;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  }

  /* ─────────────────────── универсальная загрузка ──────────────────────── */
  async _fetch(type, opts = {}) {
    const cfg = ENDPOINTS[type];
    if (!cfg) throw new Error(`Неизвестный тип тарифа: ${type}`);

    const res = await this._safeGet(cfg.url, { params: cfg.query(opts) });

    const outDir = path.resolve(__dirname, '../json');
    fs.mkdirSync(outDir, { recursive: true });

    const fileName = cfg.file(opts.locale ?? '');
    fs.writeFileSync(
      path.join(outDir, fileName),
      JSON.stringify(res.data, null, 2),
      'utf-8'
    );

    // Выводим в консоль русское название вместе с именем файла
    const nameRu = this.constructor.NAMES_RU[type] || type;
    console.log(`💾 Тарифы ${nameRu} (${fileName}) обновлены!`);

    return true;
  }

  /* ───────────────── публичные методы-обёртки ──────────────────────────── */
  fetchCommission(locale = 'ru') { return this._fetch('commission', { locale }); }
  fetchBoxTariffs()             { return this._fetch('box'); }
  fetchPalletTariffs()          { return this._fetch('pallet'); }
  fetchReturnTariffs()          { return this._fetch('return'); }
}

/* ───────────────────────────── CLI-запуск ─────────────────────────────── */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    const wb = new WBTariffFetcher();
    await wb.verifyToken();

    const ok = await Promise.all([
      wb.fetchCommission('ru'),
      wb.fetchBoxTariffs(),
      wb.fetchPalletTariffs(),
      wb.fetchReturnTariffs()
    ]);

    if (ok.every(Boolean)) {
      console.log('✅ Все тарифы успешно загружены');
    } else {
      console.error('❌ Справочники загружены не полностью');
      process.exit(1);
    }
  })().catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
