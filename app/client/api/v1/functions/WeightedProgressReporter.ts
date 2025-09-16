// path: src/api/v1/functions/WeightedProgressReporter.js
/* eslint-disable no-console */
/**
 * WeightedProgressReporter
 * ------------------------
 * Репортёр, рассчитывающий процент выполнения на основе весов шагов,
 * описанных в JSON-конфигурации `progressWeights.json`.
 *
 * Если файла нет, он создаётся автоматически с равномерно распределёнными
 * весами для всех известных шагов. Благодаря этому проект «заводится»
 * «из коробки» и легко калибруется вручную — достаточно отредактировать
 * сгенерированный JSON-файл.
 */

import fs   from 'fs';
import path from 'path';

const WEIGHT_CONFIG_PATH = path.resolve('progressWeights.json');

/** Шаги по умолчанию (если JSON ещё не создан). */
const DEFAULT_STEPS = {
  productInfo: [
    'title',
    'description',
    'price',
    'ratingAndReviews',
    'questions',
    'image',
    'productParameters',
    'originalMark'
  ],
  sellerInfo: [
    'seller.open',
    'seller.basic',
    'seller.stats',
    'seller.sales',
    'seller.details'
  ]
};

export class WeightedProgressReporter {
  /**
   * @param {function|WeightedProgressReporter} consumer
   *        – callback ({percent,text})  или внешний репортёр
   * @param {object} [options]
   * @param {string[]} [options.categories=['productInfo','sellerInfo']]
   *        – какие категории шагов учитывать при расчёте прогресса
   */
  constructor(consumer = console.log, options = {}) {
    /* ── определяем callback (или проксируем в родителя) ── */
    if (typeof consumer === 'function') {
      this._cb = consumer;
    } else if (consumer instanceof WeightedProgressReporter) {
      this._cb = payload => consumer._cb(payload);
    } else {
      throw new TypeError(
        'WeightedProgressReporter: consumer должен быть функцией или WeightedProgressReporter'
      );
    }

    /* ── загружаем/создаём конфигурацию весов ── */
    const categories = options.categories || ['productInfo', 'sellerInfo'];
    const weightConfig = this._ensureWeights(categories);

    /* ── плоское отображение шаг → вес ── */
    this._weights = {};
    this._totalWeight = 0;
    for (const cat of categories) {
      const catWeights = weightConfig[cat] || {};
      for (const [stepKey, w] of Object.entries(catWeights)) {
        this._weights[stepKey] = w;
        this._totalWeight += w;
      }
    }
    if (this._totalWeight === 0) this._totalWeight = 100;  // защита от /0

    /* ── внутреннее состояние ── */
    this._completedWeight = 0;
    this._completedSteps = new Set();
    this._lastSent = null;
    this._text = '';
  }

  /*───────────────────────────────────────────────────────────*/
  /*                       API: шаги                           */
  /*───────────────────────────────────────────────────────────*/

  /** Объявляем старт шага. */
  start(stepKey, text = '') {
    if (!this._weights.hasOwnProperty(stepKey) && stepKey !== 'run') {
      // шаг не описан в конфигурации — добавляем нулевой вес,
      // чтобы показывать статус, но не двигать прогресс
      this._weights[stepKey] = 0;
    }
    this._text = text;
    this._push();
  }

  /** Отмечаем завершение шага. */
  finish(stepKey) {
    if (stepKey === 'run') {
      this._completedWeight = this._totalWeight;  // доводим до 100 %
    } else if (!this._completedSteps.has(stepKey)) {
      this._completedSteps.add(stepKey);
      this._completedWeight += this._weights[stepKey] || 0;
      if (this._completedWeight > this._totalWeight) {
        this._completedWeight = this._totalWeight;
      }
    }
    this._push();
  }

  /*───────────────────────────────────────────────────────────*/
  /*                   Внутренние методы                       */
  /*───────────────────────────────────────────────────────────*/

  /**
   * Проверяет существование файла весов, а при отсутствии
   * создаёт его с равномерным распределением.
   * @param {string[]} categories
   * @returns {object} – конфигурация весов
   */
  _ensureWeights(categories) {
    if (fs.existsSync(WEIGHT_CONFIG_PATH)) {
      try {
        return JSON.parse(fs.readFileSync(WEIGHT_CONFIG_PATH, 'utf-8'));
      } catch (err) {
        console.warn(
          'WeightedProgressReporter: повреждён progressWeights.json – будет пересоздан.'
        );
      }
    }

    // Создаём новый файл с равномерными весами
    const config = {};
    let totalSteps = 0;

    // считаем общее количество шагов по активным категориям
    for (const cat of categories) {
      totalSteps += (DEFAULT_STEPS[cat] || []).length;
    }
    if (totalSteps === 0) totalSteps = 1; // защита

    const weightPerStep = +(100 / totalSteps).toFixed(2);

    for (const cat of categories) {
      config[cat] = {};
      for (const step of DEFAULT_STEPS[cat] || []) {
        config[cat][step] = weightPerStep;
      }
    }

    try {
      fs.writeFileSync(WEIGHT_CONFIG_PATH, JSON.stringify(config, null, 2));
      console.log(
        `WeightedProgressReporter: создан progressWeights.json с равными весами (${weightPerStep} % на шаг).`
      );
    } catch (err) {
      console.error('Не удалось записать progressWeights.json:', err.message);
    }

    return config;
  }

  /**
   * Отправляет наружу обновление, если изменились процент или текст.
   * Формат: { percent: <number>, text: <string> }
   */
  _push() {
    const cleanText = typeof this._text === 'string'
      ? this._text
      : (this._text?.message || this._text?.text || '[object]');

    const percent = Math.min(
      100,
      (this._completedWeight / this._totalWeight) * 100
    );
    const rounded = +percent.toFixed(1);

    if (
      this._lastSent &&
      this._lastSent.percent === rounded &&
      this._lastSent.text === cleanText
    ) {
      return; // ничего нового
    }

    this._lastSent = { percent: rounded, text: cleanText };
    this._cb(this._lastSent);
  }
}

// Экспорт по умолчанию для удобства импорта
export default WeightedProgressReporter;
