// path: src/api/v1/functions/SmoothWeightedProgressReporter.js
// SmoothWeightedProgressReporter
// ──────────────────────────────────────────────────────────────
// Расширение WeightedProgressReporter, которое добавляет
// «сердцебиение» — бар медленно растёт ВНУТРИ долгого шага,
// чтобы пользователь видел непрерывное движение.
//
//   ┌ tick   ─ период отправки «микро-апдейтов»       (мс)
//   ├ stepMs ─ ожидаемая длительность «среднего» шага (мс)
//   └ reserve─ доля веса, оставляемая до finish()     (0…1)
//
// Автор: 2025-04-24
// ──────────────────────────────────────────────────────────────

import WeightedProgressReporter from './WeightedProgressReporter.js';

class SmoothWeightedProgressReporter extends WeightedProgressReporter {
  /**
   * @param {function|WeightedProgressReporter} consumer – callback({percent,text}) или внешний репортёр
   * @param {object} [options]
   * @param {number} [options.tick=400]    – частота «сердцебиения», мс
   * @param {number} [options.stepMs=8000] – «средняя» длительность шага, мс
   * @param {number} [options.reserve=0.1] – доля веса, сохраняемая до finish()
   * @param {string[]} [options.categories]– проксируется в родительский конструктор
   */
  constructor(consumer = console.log, options = {}) {
    super(consumer, options);
    this._tick    = options.tick    ?? 400;
    this._stepMs  = options.stepMs  ?? 8000;
    this._reserve = options.reserve ?? 0.10;

    /** @type {Map<string,{t0:number,timerId:NodeJS.Timeout}>} */
    this._timers = new Map();

    // Вес по умолчанию
    this._weights = options.weights ?? {};
  }

  setWeights(weights) {
    // здесь можно добавить валидацию или просто присвоить
    this._weights = weights;
  }

  /*───────────────────────────────────────────────────────────*/
  /*                   Переопределяем API                      */
  /*───────────────────────────────────────────────────────────*/

  /** Начало шага: запускаем «ползунок» */
  start(stepKey, text = '') {
    super.start(stepKey, text);

    if (stepKey === 'run') return;             // финальный псевдо-шаг не анимируем

    const weight = this._weights[stepKey] || 0;
    if (weight === 0) return;                  // шаг не влияет на % — нечего подкручивать

    // если уже был таймер (двойной start), останавливаем
    if (this._timers.has(stepKey)) {
      clearInterval(this._timers.get(stepKey).timerId);
      this._timers.delete(stepKey);
    }

    const t0 = Date.now();
    const targetWeight = weight * (1 - this._reserve);   // сколько «съедаем» до finish
    const baseCompleted = this._completedWeight;         // отправная точка

    const timerId = setInterval(() => {
      const elapsed = Date.now() - t0;
      const k = Math.min(1, elapsed / this._stepMs);    // 0…1
      const add = targetWeight * k;
      const newCompleted = baseCompleted + add;

      if (newCompleted > this._completedWeight) {
        this._completedWeight = newCompleted;
        this._push();                                 // пушим наружу
      }
      if (k >= 1) {
        clearInterval(timerId);
        this._timers.delete(stepKey);
      }
    }, this._tick);

    this._timers.set(stepKey, { t0, timerId });
  }

  /** Конец шага: добираем оставшийся вес и глушим таймер */
  finish(stepKey) {
    if (this._timers.has(stepKey)) {
      clearInterval(this._timers.get(stepKey).timerId);
      this._timers.delete(stepKey);
    }
    super.finish(stepKey);
  }
}

export default SmoothWeightedProgressReporter;
