// расположение: ./api/v1/functions/productScrapper.ts
// Логика получения и парсинга товара WB по ID с обработкой ошибок, кэшированием и сохранением seller

import path from 'path';
import { chromium } from 'playwright';
import Settings from '../../../../../settings';
import * as Logger from '../../../../../app/client/utils/logger';
import SmoothWeightedProgressReporter from './SmoothWeightedProgressReporter';
const Reporter = SmoothWeightedProgressReporter;
import * as fn from './index';
import { saveJson } from './saveJSON';
import { scrapeSellerById } from './scrapeSellerById';
import {
  getCachedProduct,
  saveProduct,
  saveSeller,
} from '@/api/db/service';

class ExecutionData {
  constructor() {
    this.steps = {};
    this.errors = [];
  }
  markCompleted(step) {
    this.steps[step] = true;
  }
  addError(obj) {
    this.errors.push(obj);
  }
  mark(step) {
    this.steps[step] = true;
  }
}

class ProductScraper {
  constructor(id, reporter, userId) {
    if (!/^[0-9]+$/.test(String(id))) throw new Error('Некорректный ID товара');
    this.id = String(id);
    this.userId = userId;
    this.url = `https://www.wildberries.ru/catalog/${this.id}/detail.aspx`;
    this.set = new Settings();
    this.rep = reporter;
    this.x = new ExecutionData();
    this.res = { id: this.id };
  }

  async step(key, text, fnStep) {
    this.rep?.start(key, text);
    try {
      const result = await fnStep();
      this.x.markCompleted(key);
      this.rep?.next(0.1);
      return result;
    } catch (error) {
      this.x.addError({ step: key, error });
      this.rep?.fail();
      throw error;
    }
  }

  async run() {
    try {
      // Здесь должна быть основная логика скраппинга товара
      // ...
      
      return this.res;
    } catch (error) {
      console.error(`Ошибка при скраппинге товара ${this.id}:`, error);
      throw error;
    }
  }
}

export async function scrapeProductById(productId, onStatus, userId = null) {
  const reporter = onStatus ? new Reporter(onStatus) : null;
  const scraper = new ProductScraper(productId, reporter, userId);
  
  try {
    const result = await scraper.run();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error(`Ошибка при получении данных товара ${productId}:`, error);
    return {
      success: false,
      error: error.message || 'Неизвестная ошибка при получении данных товара'
    };
  }
}

export default scrapeProductById;
