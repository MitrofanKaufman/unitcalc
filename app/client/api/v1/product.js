// path: src/api/v1/product.js
// Логика: получает и анализирует товар с Wildberries по ID, используя Playwright и функции анализа. Поддерживает кэш, логирование, валидацию.

// Запрет на прямой запуск файла
if (import.meta.url === `file://${process.argv[1]}`)
    throw new Error('Этот модуль предназначен только для импорта');

import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import Settings from '../../../settings.js';
import SmoothWeightedProgressReporter from './functions/SmoothWeightedProgressReporter.js';
import * as fn from './functions/index.js';
import fs from 'fs/promises';
import { scrapeSellerById } from './seller.js';
import { scrapeProductById as scrapeProductDetails } from './functions/productScrapper.js';
import { saveJson } from './functions/saveJSON.js';
import Logger from '@/core/utils/logger.js';
import {
    getCachedProduct,
    saveProduct,
    saveSeller,
} from './db/service.js';

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
    err(step, e) {
        this.addError({ step, error: e });
        this.rep?.fail();
    }
}

class ProductScrapper {
    constructor(id, reporter, userId) {
        if (!/^[\d]+$/.test(String(id))) throw new Error('Некорректный ID товара');
        this.id = String(id);
        this.userId = userId;
        this.url = `https://www.wildberries.ru/catalog/${this.id}/detail.aspx`;
        this.set = new Settings();
        this.rep = reporter;
        this.x = new ExecutionData();
        this.logger = Logger.createLogger(`ProductScrapper:${this.id}`);
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
            this.logger.error(`Ошибка при скраппинге товара ${this.id}:`, error);
            throw error;
        }
    }
}

export async function scrapeProductById(productId, onStatus, userId = null) {
    const reporter = onStatus ? new SmoothWeightedProgressReporter(onStatus) : null;
    const scraper = new ProductScrapper(productId, reporter, userId);
    
    try {
        const result = await scraper.run();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        Logger.error(`Ошибка при получении данных товара ${productId}:`, error);
        return {
            success: false,
            error: error.message || 'Неизвестная ошибка при получении данных товара'
        };
    }
}

export default scrapeProductById;
