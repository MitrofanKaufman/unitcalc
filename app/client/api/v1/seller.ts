// @ts-nocheck
// src/api/v1/seller.ts — сконвертировано из seller.js для корректного экспорта default
// Логика сохранена без строгой типизации. При необходимости уточнить типы позже.

import { chromium } from "playwright";
import Settings from "../../../settings";
import Messages from '@core/messages';
import SmoothWeightedProgressReporter from "./functions/SmoothWeightedProgressReporter";
const Reporter = SmoothWeightedProgressReporter;
import * as fn from "./functions/index";
import fs from "fs/promises";
import path from "path";
import { getCachedSeller, saveSeller } from '@db/service';

class ExecutionData {
  steps: Record<string, boolean> = {};
  errors: Array<{ step: string; message: string }> = [];

  markCompleted(step: string) {
    this.steps[step] = true;
  }
  addError(obj: { step: string; message: string }) {
    this.errors.push(obj);
  }
  mark(step: string) {
    this.markCompleted(step);
  }
  err(step: string, e: Error) {
    this.addError({ step, message: e.message });
  }
}

class SellerScraper {
  id: string;
  userId: string | null;
  url: string;
  set: Settings;
  msg: Messages;
  rep: Reporter;
  x: ExecutionData;
  res: any;

  constructor(id: string, reporter: Reporter, userId: string | null) {
    if (!/^\d+$/.test(String(id))) throw new Error("Некорректный ID продавца");
    this.id = String(id);
    this.userId = userId;
    this.url = `https://www.wildberries.ru/seller/${this.id}`;
    this.set = new Settings();
    this.msg = new Messages("ru");
    this.rep = reporter;
    this.x = new ExecutionData();
    this.res = {
      id: this.id,
      name: null,
      rating: null,
      reviews: null,
      logo: null,
      sales: null,
      buyoutRate: null,
      timeOnWB: null,
    };
  }

  async step(key: string, text: string, fnStep: () => Promise<void> | void) {
    this.rep.start(key, text);
    try {
      await fnStep();
      this.x.mark(key);
    } catch (e) {
      this.x.err(key, e as Error);
    } finally {
      this.rep.finish(key);
    }
  }

  async run() {
    const br = await chromium.launch({ headless: true });
    const ctx = await br.newContext({ userAgent: this.set.userAgent });
    const pg = await ctx.newPage();
    try {
      await this.step("seller.open", "Открываю страницу продавца…", async () => {
        await pg.goto(this.url, { timeout: this.set.scrapeTimeout * 1000 });
      });
      await this.step(
        "seller.pageLoad",
        "Ожидаю полную загрузку страницы…",
        async () => {
          await pg.waitForLoadState("load");
          // htmlSave assumed existing util; ignore typing
          // @ts-ignore
          await htmlSave(pg, "seller", this.id, fs);
        },
      );
      await this.step("seller.basic", "Собираю основную информацию о продавце…", () =>
        fn.getSellerBasic(pg, this.set, this.msg, this.res, this.x),
      );
      await this.step("seller.stats", "Определяю рейтинг и отзывы продавца…", () =>
        fn.getSellerStats(pg, this.set, this.msg, this.res, this.x),
      );
      await this.step("seller.sales", "Определяю объём продаж продавца…", () =>
        fn.getSellerSales(pg, this.set, this.msg, this.res, this.x),
      );
      await this.step("seller.details", "Собираю информацию о продавце…", () =>
        fn.getSellerDetails(pg, this.set, this.msg, this.res, this.x),
      );
      await this.step("seller.saveJson", "Сохраняю JSON результат…", async () => {
        const dir = path.resolve("public/seller");
        await fs.mkdir(dir, { recursive: true });
        const filePath = path.join(dir, `${this.id}.json`);
        await fs.writeFile(filePath, JSON.stringify({ seller: this.res }, null, 2), "utf8");
      });
    } finally {
      await br.close();
    }
    return this.x.errors.length ? { seller: this.res, errors: this.x.errors } : { seller: this.res };
  }
}

export default async function scrapeSellerById(
  sellerId: string,
  onStatus?: Reporter | ((p: any) => void),
  userId: string | null = null,
) {
  const reporter = onStatus instanceof Reporter ? onStatus : new Reporter(onStatus, { categories: ["sellerInfo"] });
  reporter.start("db.check", "Проверяю кэш продавца…");
  const cached = await getCachedSeller(userId, sellerId);
  reporter.finish("db.check");
  if (cached) {
    reporter.start("cache", "Данные из кэша");
    reporter.finish("cache");
    return cached;
  }
  const scraper = new SellerScraper(sellerId, reporter, userId);
  const data = await scraper.run();
  await saveSeller(userId, sellerId, data);
  return data;
}